import mongoose from 'mongoose';
import Document from '../models/Document.js';
import DocumentCategory from '../models/DocumentCategory.js';
import { enrichPublicFileMetadata, buildDownloadUrl } from '../utils/fileFormats.js';
import { parseSearchQuery } from '../utils/queryUtils.js';

/**
 * Public document listing:
 * Strictly exposes published documents only.
 * Supports category filtering, search, and pagination.
 */
export const getPublicDocuments = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 12));
    const skip = (page - 1) * limit;

    // Search query validation (regex-escaped & length-bounded)
    const search = parseSearchQuery(req.query.q);
    if (!search.valid) {
      return res.status(400).json({
        success: false,
        message: search.message,
      });
    }

    // MANDATORY: Published status only + active categories only
    const activeCategories = await DocumentCategory.find({ isActive: true })
      .select('_id slug')
      .lean();
    const activeCategoryIds = activeCategories.map((c) => c._id);

    const query = {
      status: 'published',
      category: { $in: activeCategoryIds },
    };

    // Filter by Category (supports active category slug or ObjectId)
    if (req.query.category) {
      const categoryParam = String(req.query.category).trim();
      if (mongoose.Types.ObjectId.isValid(categoryParam)) {
        const isActiveId = activeCategories.some((c) => String(c._id) === categoryParam);
        if (!isActiveId) {
          return res.status(200).json({
            success: true,
            documents: [],
            pagination: { total: 0, page, limit, totalPages: 0, hasNextPage: false, hasPrevPage: false },
          });
        }
        query.category = categoryParam;
      } else {
        const foundCategory = activeCategories.find((c) => c.slug === categoryParam);
        if (foundCategory) {
          query.category = foundCategory._id;
        } else {
          // If category slug does not exist or is inactive, return empty list
          return res.status(200).json({
            success: true,
            documents: [],
            pagination: { total: 0, page, limit, totalPages: 0, hasNextPage: false, hasPrevPage: false },
          });
        }
      }
    }

    if (search.regexPattern) {
      query.$or = [
        { title: { $regex: search.regexPattern, $options: 'i' } },
        { description: { $regex: search.regexPattern, $options: 'i' } },
      ];
    }

    const [total, rawDocuments] = await Promise.all([
      Document.countDocuments(query),
      Document.find(query)
        .populate('category', 'name slug')
        .select('title slug description category file.originalName file.bytes file.format file.extension file.mimeType file.resourceType file.url publishedAt viewCount downloadCount')
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    const documents = rawDocuments.map((doc) => ({
      ...doc,
      file: enrichPublicFileMetadata(doc.file),
    }));

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
 * Public single document detail:
 * Increments viewCount and returns sanitized metadata.
 */
export const getPublicDocumentBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const activeCategoryIds = await DocumentCategory.find({ isActive: true }).distinct('_id');

    // Atomically increment viewCount and retrieve document (only if category is active)
    const document = await Document.findOneAndUpdate(
      { slug, status: 'published', category: { $in: activeCategoryIds } },
      { $inc: { viewCount: 1 } },
      { new: true }
    )
      .populate('category', 'name slug')
      .select('title slug description category file.originalName file.bytes file.format file.extension file.mimeType file.resourceType file.url publishedAt viewCount downloadCount')
      .lean();

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found or is not currently published.',
      });
    }

    res.status(200).json({
      success: true,
      document: {
        ...document,
        file: enrichPublicFileMetadata(document.file),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Public document download:
 * Safely increments downloadCount and redirects to the file URL.
 */
export const downloadPublicDocument = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const activeCategoryIds = await DocumentCategory.find({ isActive: true }).distinct('_id');

    const document = await Document.findOneAndUpdate(
      { slug, status: 'published', category: { $in: activeCategoryIds } },
      { $inc: { downloadCount: 1 } },
      { new: true }
    ).select('file.url file.originalName file.extension file.format file.resourceType');

    if (!document || !document.file?.url) {
      return res.status(404).json({
        success: false,
        message: 'Document not found or is not currently available for download.',
      });
    }

    const downloadUrl = buildDownloadUrl(document.file);
    res.redirect(downloadUrl);
  } catch (error) {
    next(error);
  }
};

/**
 * Public category listing for client navigation and filters.
 */
export const getPublicCategories = async (req, res, next) => {
  try {
    const categories = await DocumentCategory.find({ isActive: true })
      .select('name slug description displayOrder')
      .sort({ displayOrder: 1, name: 1 })
      .lean();

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getPublicDocuments,
  getPublicDocumentBySlug,
  downloadPublicDocument,
  getPublicCategories,
};

