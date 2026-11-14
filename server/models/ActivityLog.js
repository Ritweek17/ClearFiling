import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminUser',
      required: [true, 'Admin reference is required for activity logging.'],
      index: true,
    },
    action: {
      type: String,
      required: [true, 'Action type is required.'],
      enum: [
        'DOCUMENT_CREATED',
        'DOCUMENT_UPDATED',
        'DOCUMENT_PUBLISHED',
        'DOCUMENT_ARCHIVED',
        'DOCUMENT_DELETED',
        'DOCUMENT_FILE_REPLACED',
        'CATEGORY_CREATED',
        'CATEGORY_UPDATED',
        'CATEGORY_DELETED',
        'ADMIN_LOGIN',
        'ADMIN_LOGOUT',
      ],
      index: true,
    },
    entityType: {
      type: String,
      required: [true, 'Entity type is required.'],
      enum: ['document', 'category', 'admin', 'system'],
      index: true,
    },
    entityId: {
      type: String,
      required: [true, 'Entity ID is required.'],
      index: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
      default: '',
    },
    userAgent: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Logs are immutable once created
  }
);

// Compound indexes for administrative auditing
activityLogSchema.index({ createdAt: -1, action: 1 });
activityLogSchema.index({ entityType: 1, entityId: 1, createdAt: -1 });

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

export default ActivityLog;

