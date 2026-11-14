import ActivityLog from '../models/ActivityLog.js';

const SENSITIVE_KEYS = new Set([
  'password',
  'passwordhash',
  'token',
  'jwt',
  'cookie',
  'cookies',
  'secret',
  'authorization',
  'apikey',
]);

/**
 * Recursively sanitize metadata object to eliminate sensitive information.
 */
export const sanitizeMetadata = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeMetadata);

  const clean = {};
  for (const [key, val] of Object.entries(obj)) {
    if (SENSITIVE_KEYS.has(key.toLowerCase())) {
      clean[key] = '[REDACTED]';
    } else if (val && typeof val === 'object') {
      clean[key] = sanitizeMetadata(val);
    } else {
      clean[key] = val;
    }
  }
  return clean;
};

/**
 * Log administrative activity securely.
 * 
 * @param {Object} params
 * @param {import('express').Request} [params.req] - Express request object for IP and User-Agent
 * @param {import('mongoose').Types.ObjectId|string} params.adminId - ID of administrator performing the action
 * @param {string} params.action - Action constant
 * @param {'document'|'category'|'admin'|'system'} params.entityType - Target entity type
 * @param {import('mongoose').Types.ObjectId|string} params.entityId - ID of entity affected
 * @param {Object} [params.metadata] - Non-sensitive context details
 */
export const logActivity = async ({
  req,
  adminId,
  action,
  entityType,
  entityId,
  metadata = {},
}) => {
  try {
    let ipAddress = '';
    let userAgent = '';

    if (req) {
      ipAddress =
        req.ip ||
        req.headers['x-forwarded-for']?.toString().split(',')[0].trim() ||
        req.socket?.remoteAddress ||
        '';
      userAgent = req.headers['user-agent'] || '';
    }

    const cleanMeta = sanitizeMetadata(metadata);

    return await ActivityLog.create({
      admin: adminId,
      action,
      entityType,
      entityId: String(entityId),
      metadata: cleanMeta,
      ipAddress,
      userAgent,
    });
  } catch (err) {
    console.error(`[ActivityLogger Error] Failed to record activity "${action}":`, err.message);
    // Do not throw to avoid failing the primary business operation
    return null;
  }
};

export default { logActivity, sanitizeMetadata };

