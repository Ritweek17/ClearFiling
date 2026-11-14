import { isCloudinaryReady } from '../services/storageService.js';

const PLACEHOLDER_REGEX = /(placeholder|pending_client_setup|replace_with|replace_before|your_super_secret|<username>|<password>)/i;

/**
 * Validate required environment variables for production startup.
 * Fails closed without exposing secret values.
 */
export const validateProductionEnvironment = () => {
  if (process.env.NODE_ENV !== 'production') {
    return { valid: true, errors: [] };
  }

  const errors = [];

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri || !mongoUri.trim() || PLACEHOLDER_REGEX.test(mongoUri)) {
    errors.push('MONGODB_URI is missing or uses a placeholder value.');
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (
    !jwtSecret ||
    !jwtSecret.trim() ||
    PLACEHOLDER_REGEX.test(jwtSecret) ||
    jwtSecret.trim().length < 32
  ) {
    errors.push('JWT_SECRET must be set to a strong non-placeholder secret of at least 32 characters.');
  }

  const clientOrigin = process.env.CLIENT_ORIGIN;
  if (!clientOrigin || !clientOrigin.trim() || /localhost|127\.0\.0\.1/i.test(clientOrigin)) {
    errors.push('CLIENT_ORIGIN must be configured with HTTPS production origin(s) and no localhost.');
  }

  const adminOrigin = process.env.ADMIN_ORIGIN;
  if (!adminOrigin || !adminOrigin.trim() || /localhost|127\.0\.0\.1/i.test(adminOrigin)) {
    errors.push('ADMIN_ORIGIN must be configured with HTTPS production origin(s) and no localhost.');
  }

  if (!isCloudinaryReady()) {
    errors.push('CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET must be configured.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export default { validateProductionEnvironment };

