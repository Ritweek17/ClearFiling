import mongoose from 'mongoose';
import { slugify } from '../utils/slugify.js';
import { ALLOWED_EXTENSIONS, extractExtension, getFormatSpec } from '../utils/fileFormats.js';

const fileMetadataSchema = new mongoose.Schema(
  {
    publicId: {
      type: String,
      required: [true, 'Storage publicId is required.'],
      trim: true,
    },
    url: {
      type: String,
      required: [true, 'File URL is required.'],
      trim: true,
    },
    bytes: {
      type: Number,
      required: [true, 'File size in bytes is required.'],
      min: [0, 'File size cannot be negative.'],
    },
    format: {
      type: String,
      trim: true,
      lowercase: true,
    },
    extension: {
      type: String,
      required: [true, 'File extension is required.'],
      trim: true,
      lowercase: true,
      enum: {
        values: ALLOWED_EXTENSIONS,
        message: 'Unsupported file extension.',
      },
    },
    originalName: {
      type: String,
      required: [true, 'Original filename is required.'],
      trim: true,
    },
    mimeType: {
      type: String,
      required: [true, 'File MIME type is required.'],
      trim: true,
      lowercase: true,
    },
    resourceType: {
      type: String,
      required: [true, 'Storage resource type is required.'],
      enum: {
        values: ['image', 'raw'],
        message: 'Resource type must be either image or raw.',
      },
    },
  },
  { _id: false }
);

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Document title is required.'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters.'],
    },
    slug: {
      type: String,
      required: [true, 'Document slug is required.'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters.'],
      default: '',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DocumentCategory',
      required: [true, 'Document category is required.'],
      index: true,
    },
    file: {
      type: fileMetadataSchema,
      required: [true, 'File metadata is required.'],
    },
    status: {
      type: String,
      enum: {
        values: ['draft', 'published', 'archived'],
        message: 'Status must be either draft, published, or archived.',
      },
      default: 'draft',
      index: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminUser',
      required: [true, 'Uploader Admin ID is required.'],
      index: true,
    },
    publishedAt: {
      type: Date,
      default: null,
      index: true,
    },
    viewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    downloadCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate slug and normalize file metadata before validation
documentSchema.pre('validate', function (next) {
  if (this.title && !this.slug) {
    this.slug = slugify(this.title);
  } else if (this.slug) {
    this.slug = slugify(this.slug);
  }

  if (this.file) {
    if (!this.file.extension) {
      const inferred = extractExtension(this.file.originalName) || this.file.format;
      if (inferred) {
        this.file.extension = inferred.toLowerCase();
      }
    }
    if (!this.file.format && this.file.extension) {
      this.file.format = this.file.extension;
    }
    const spec = this.file.extension ? getFormatSpec(this.file.extension) : null;
    if (!this.file.mimeType && spec) {
      this.file.mimeType = spec.canonicalMime;
    }
    if (!this.file.resourceType) {
      if (this.file.url && this.file.url.includes('/raw/upload/')) {
        this.file.resourceType = 'raw';
      } else {
        this.file.resourceType = spec?.resourceType || 'raw';
      }
    }
  }

  // Set publishedAt timestamp if status transitions to published
  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  next();
});

// Compound indexes for public queries and administrative filtering
documentSchema.index({ status: 1, category: 1, createdAt: -1 });
documentSchema.index({ status: 1, publishedAt: -1 });

// Full-text search index on title and description
documentSchema.index(
  { title: 'text', description: 'text' },
  { weights: { title: 10, description: 3 }, name: 'document_text_search' }
);

const Document = mongoose.model('Document', documentSchema);

export default Document;

