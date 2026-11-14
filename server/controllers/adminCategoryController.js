import DocumentCategory from '../models/DocumentCategory.js';
import Document from '../models/Document.js';
import { generateUniqueSlug } from '../utils/slugify.js';
import { logActivity } from '../services/activityLogger.js';

/**
 * List all categories with associated document counts.
 */
export const getCategories = async (req, res, next) => {
  try {
    const match = {};
    if (req.query.active === 'true' || req.query.isActive === 'true') {
      match.isActive = true;
    }

    const pipeline = [];
    if (Object.keys(match).length > 0) {
      pipeline.push({ $match: match });
    }

    pipeline.push(
      {
        $lookup: {
          from: 'documents',
          localField: '_id',
          foreignField: 'category',
          as: 'documents',
        },
      },
      {
        $project: {
          name: 1,
          slug: 1,
          description: 1,
          displayOrder: 1,
          isActive: 1,
          createdAt: 1,
          updatedAt: 1,
          documentCount: { $size: '$documents' },
        },
      },
      {
        $sort: { displayOrder: 1, name: 1 },
      }
    );

    const categories = await DocumentCategory.aggregate(pipeline);

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new document category.
 */
export const createCategory = async (req, res, next) => {
  try {
    const { name, description, displayOrder, isActive } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required.',
      });
    }

    const slug = await generateUniqueSlug(DocumentCategory, name);

    const category = await DocumentCategory.create({
      name: name.trim(),
      slug,
      description: description ? description.trim() : '',
      displayOrder: typeof displayOrder === 'number' ? displayOrder : 0,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    await logActivity({
      req,
      adminId: req.admin._id,
      action: 'CATEGORY_CREATED',
      entityType: 'category',
      entityId: category._id,
      metadata: { name: category.name, slug: category.slug },
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully.',
      category,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing document category.
 */
export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, displayOrder, isActive, slug } = req.body;

    const category = await DocumentCategory.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.',
      });
    }

    const updates = {};
    if (name && name.trim() && name.trim() !== category.name) {
      updates.name = name.trim();
      // If slug is not explicitly supplied, generate a new unique slug from name
      if (!slug) {
        updates.slug = await generateUniqueSlug(DocumentCategory, name, category._id);
      }
    }

    if (slug && slug.trim() && slug.trim() !== category.slug) {
      updates.slug = await generateUniqueSlug(DocumentCategory, slug, category._id);
    }

    if (description !== undefined) {
      updates.description = description.trim();
    }

    if (displayOrder !== undefined) {
      updates.displayOrder = Number(displayOrder);
    }

    if (isActive !== undefined) {
      updates.isActive = Boolean(isActive);
    }

    const updatedCategory = await DocumentCategory.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    await logActivity({
      req,
      adminId: req.admin._id,
      action: 'CATEGORY_UPDATED',
      entityType: 'category',
      entityId: updatedCategory._id,
      metadata: { updates },
    });

    res.status(200).json({
      success: true,
      message: 'Category updated successfully.',
      category: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a document category safely.
 * Strictly prevents deletion if the category contains documents.
 */
export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await DocumentCategory.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.',
      });
    }

    // Safety rule: Count associated documents
    const docCount = await Document.countDocuments({ category: id });
    if (docCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category "${category.name}" because it contains ${docCount} document(s). Reassign or delete these documents first.`,
        documentCount: docCount,
      });
    }

    await DocumentCategory.findByIdAndDelete(id);

    await logActivity({
      req,
      adminId: req.admin._id,
      action: 'CATEGORY_DELETED',
      entityType: 'category',
      entityId: id,
      metadata: { name: category.name, slug: category.slug },
    });

    res.status(200).json({
      success: true,
      message: `Category "${category.name}" deleted successfully.`,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};

