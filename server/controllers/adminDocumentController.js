import mongoose from 'mongoose';
import Document from '../models/Document.js';
import DocumentCategory from '../models/DocumentCategory.js';
import { generateUniqueSlug } from '../utils/slugify.js';
import { uploadFile, deleteFile } from '../services/storageService.js';
import { logActivity } from '../services/activityLogger.js';
import {
  parseSearchQuery,
  parseAllowedSort,
  ADMIN_DOCUMENT_SORT_FIELDS,
} from '../utils/queryUtils.js';

/**
 * List documents with pagination, filters, and text search.
 */
export const getDocuments = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const skip = (page - 1) * limit;

    const query = {};

    // Filter by category
    if (req.query.category) {
      if (mongoose.Types.ObjectId.isValid(req.query.category)) {
        query.category = req.query.category;
      }
    }

    // Filter by status
    if (req.query.status && ['draft', 'published', 'archived'].includes(req.query.status)) {
      query.status = req.query.status;
    }

    // Search by title and description (regex-escaped & length-bounded)
    const search = parseSearchQuery(req.query.q);
    if (!search.valid) {
      return res.status(400).json({
        success: false,
        message: search.message,
      });
    }
    if (search.regexPattern) {
      query.$or = [
        { title: { $regex: search.regexPattern, $options: 'i' } },
        { description: { $regex: search.regexPattern, $options: 'i' } },
      ];
    }

    const safeSort = parseAllowedSort(req.query.sort, ADMIN_DOCUMENT_SORT_FIELDS, { createdAt: -1 });

    const [total, documents] = await Promise.all([
      Document.countDocuments(query),
      Document.find(query)
        .populate('category', 'name slug')
        .populate('uploadedBy', 'name email role')
        .sort(safeSort)
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    res.status(200).json({
      success: true,
      documents,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single document by ID.
 */
export const getDocumentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const document = await Document.findById(id)
      .populate('category', 'name slug')
      .populate('uploadedBy', 'name email role');

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found.',
      });
    }

    res.status(200).json({
      success: true,
      document,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new document with PDF upload.
 * Enforces orphan file cleanup if DB insertion fails.
 */
export const createDocument = async (req, res, next) => {
  let uploadedFile = null;

  try {
    const { title, description, category, status } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Document title is required.',
      });
    }

    if (!category || !mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({
        success: false,
        message: 'A valid category ID is required.',
      });
    }

    const categoryExists = await DocumentCategory.findById(category);
    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: 'Selected category does not exist.',
      });
    }

    const isPublisher = ['super_admin', 'admin'].includes(req.admin?.role);
    if (!isPublisher && status !== undefined && status !== '' && status !== 'draft') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. Editors can only create documents in draft status.',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'A valid document file is required.',
      });
    }

    const slug = await generateUniqueSlug(Document, title);

    // 1. Upload to storage service
    uploadedFile = await uploadFile({
      buffer: req.file.buffer,
      originalName: req.file.originalname,
      fileMeta: req.fileMeta,
    });

    // 2. Persist in database (editors strictly locked to draft)
    const documentStatus =
      isPublisher && ['draft', 'published'].includes(status) ? status : 'draft';

    const document = await Document.create({
      title: title.trim(),
      slug,
      description: description ? description.trim() : '',
      category,
      file: uploadedFile,
      status: documentStatus,
      uploadedBy: req.admin._id,
      publishedAt: documentStatus === 'published' ? new Date() : null,
    });

    await logActivity({
      req,
      adminId: req.admin._id,
      action: 'DOCUMENT_CREATED',
      entityType: 'document',
      entityId: document._id,
      metadata: {
        title: document.title,
        slug: document.slug,
        status: document.status,
        filename: document.file.originalName,
        extension: document.file.extension,
        resourceType: document.file.resourceType,
        bytes: document.file.bytes,
      },
    });

    const populated = await Document.findById(document._id)
      .populate('category', 'name slug')
      .populate('uploadedBy', 'name email role');

    res.status(201).json({
      success: true,
      message: 'Document created successfully.',
      document: populated,
    });
  } catch (error) {
    // Failure handling: delete orphan uploaded file if DB insertion failed
    if (uploadedFile?.publicId) {
      await deleteFile(uploadedFile.publicId, uploadedFile.resourceType).catch(() => {});
    }
    next(error);
  }
};

/**
 * Update document metadata (title, description, category).
 */
export const updateDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, category } = req.body;

    const document = await Document.findById(id);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found.',
      });
    }

    const updates = {};

    if (title && title.trim() && title.trim() !== document.title) {
      updates.title = title.trim();
      updates.slug = await generateUniqueSlug(Document, title, document._id);
    }

    if (description !== undefined) {
      updates.description = description.trim();
    }

    if (category && category !== String(document.category)) {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid category ID.',
        });
      }
      const categoryExists = await DocumentCategory.findById(category);
      if (!categoryExists) {
        return res.status(404).json({
          success: false,
          message: 'Specified category does not exist.',
        });
      }
      updates.category = category;
    }

    const updated = await Document.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    )
      .populate('category', 'name slug')
      .populate('uploadedBy', 'name email role');

    await logActivity({
      req,
      adminId: req.admin._id,
      action: 'DOCUMENT_UPDATED',
      entityType: 'document',
      entityId: updated._id,
      metadata: { updates },
    });

    res.status(200).json({
      success: true,
      message: 'Document updated successfully.',
      document: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a document and its associated PDF from Cloudinary.
 */
export const deleteDocument = async (req, res, next) => {
  try {
    const { id } = req.params;

    const document = await Document.findById(id);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found.',
      });
    }

    const filePublicId = document.file?.publicId;
    const fileResourceType = document.file?.resourceType || 'raw';

    await Document.findByIdAndDelete(id);

    // Delete file from storage using tracked resourceType
    if (filePublicId) {
      try {
        await deleteFile(filePublicId, fileResourceType);
      } catch (err) {
        console.error(`[Cleanup Warning] Could not remove Cloudinary asset "${filePublicId}":`, err.message);
      }
    }

    await logActivity({
      req,
      adminId: req.admin._id,
      action: 'DOCUMENT_DELETED',
      entityType: 'document',
      entityId: id,
      metadata: {
        title: document.title,
        slug: document.slug,
        filePublicId,
        fileResourceType,
      },
    });

    res.status(200).json({
      success: true,
      message: `Document "${document.title}" deleted successfully.`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Publish a draft or archived document.
 */
export const publishDocument = async (req, res, next) => {
  try {
    const { id } = req.params;

    const document = await Document.findById(id);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found.',
      });
    }

    document.status = 'published';
    document.publishedAt = new Date();
    await document.save();

    await logActivity({
      req,
      adminId: req.admin._id,
      action: 'DOCUMENT_PUBLISHED',
      entityType: 'document',
      entityId: document._id,
      metadata: { title: document.title, publishedAt: document.publishedAt },
    });

    const populated = await Document.findById(document._id)
      .populate('category', 'name slug')
      .populate('uploadedBy', 'name email role');

    res.status(200).json({
      success: true,
      message: 'Document published successfully.',
      document: populated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Archive a published or draft document.
 */
export const archiveDocument = async (req, res, next) => {
  try {
    const { id } = req.params;

    const document = await Document.findById(id);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found.',
      });
    }

    document.status = 'archived';
    await document.save();

    await logActivity({
      req,
      adminId: req.admin._id,
      action: 'DOCUMENT_ARCHIVED',
      entityType: 'document',
      entityId: document._id,
      metadata: { title: document.title },
    });

    const populated = await Document.findById(document._id)
      .populate('category', 'name slug')
      .populate('uploadedBy', 'name email role');

    res.status(200).json({
      success: true,
      message: 'Document archived successfully.',
      document: populated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Replace existing document PDF file.
 * Safety flow: Upload new file first -> Update DB -> Delete old file only on success.
 */
export const replaceDocumentFile = async (req, res, next) => {
  let newUploadedFile = null;

  try {
    const { id } = req.params;

    const document = await Document.findById(id);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found.',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'A replacement document file is required.',
      });
    }

    const oldPublicId = document.file?.publicId;
    const oldResourceType = document.file?.resourceType || 'raw';

    // 1. Upload the new file FIRST
    newUploadedFile = await uploadFile({
      buffer: req.file.buffer,
      originalName: req.file.originalname,
      fileMeta: req.fileMeta,
    });

    // 2. Update database document with new file metadata
    document.file = newUploadedFile;
    await document.save();

    // 3. Clean up the old file only after successful DB update
    if (
      oldPublicId &&
      (oldPublicId !== newUploadedFile.publicId || oldResourceType !== newUploadedFile.resourceType)
    ) {
      try {
        await deleteFile(oldPublicId, oldResourceType);
      } catch (cleanupErr) {
        // Log failure for administrative review without failing user request
        console.warn(`[Cleanup Warning] Failed to delete previous file "${oldPublicId}":`, cleanupErr.message);
      }
    }

    await logActivity({
      req,
      adminId: req.admin._id,
      action: 'DOCUMENT_FILE_REPLACED',
      entityType: 'document',
      entityId: document._id,
      metadata: {
        title: document.title,
        previousPublicId: oldPublicId,
        previousResourceType: oldResourceType,
        newPublicId: newUploadedFile.publicId,
        newResourceType: newUploadedFile.resourceType,
        filename: newUploadedFile.originalName,
        extension: newUploadedFile.extension,
      },
    });

    const populated = await Document.findById(document._id)
      .populate('category', 'name slug')
      .populate('uploadedBy', 'name email role');

    res.status(200).json({
      success: true,
      message: 'Document file replaced successfully.',
      document: populated,
    });
  } catch (error) {
    // If DB update failed, delete the newly uploaded file to avoid orphans
    if (newUploadedFile?.publicId) {
      await deleteFile(newUploadedFile.publicId, newUploadedFile.resourceType).catch(() => {});
    }
    next(error);
  }
};

export default {
  getDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
  publishDocument,
  archiveDocument,
  replaceDocumentFile,
};

