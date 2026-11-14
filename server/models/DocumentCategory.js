import mongoose from 'mongoose';
import { slugify } from '../utils/slugify.js';

const documentCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required.'],
      trim: true,
      maxlength: [100, 'Category name cannot exceed 100 characters.'],
    },
    slug: {
      type: String,
      required: [true, 'Category slug is required.'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters.'],
      default: '',
    },
    displayOrder: {
      type: Number,
      default: 0,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate slug before validation if not explicitly supplied
documentCategorySchema.pre('validate', function (next) {
  if (this.name && !this.slug) {
    this.slug = slugify(this.name);
  } else if (this.slug) {
    this.slug = slugify(this.slug);
  }
  next();
});

// Compound index for active category ordering
documentCategorySchema.index({ isActive: 1, displayOrder: 1, name: 1 });

const DocumentCategory = mongoose.model('DocumentCategory', documentCategorySchema);

export default DocumentCategory;

