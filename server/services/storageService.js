import { v2 as cloudinary } from 'cloudinary';
import crypto from 'crypto';
import { getFormatSpec } from '../utils/fileFormats.js';

const PLACEHOLDER_MARKERS = ['placeholder', 'pending_client_setup', 'your_'];

const isValidCredential = (value) => {
  if (!value || typeof value !== 'string') return false;
  const trimmed = value.trim().toLowerCase();
  if (!trimmed) return false;
  return !PLACEHOLDER_MARKERS.some((marker) => trimmed.includes(marker));
};

/**
 * Configure Cloudinary instance from backend environment variables.
 * Rejects empty or placeholder/pending credentials.
 */
export const configureCloudinary = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (isValidCredential(cloudName) && isValidCredential(apiKey) && isValidCredential(apiSecret)) {
    cloudinary.config({
      cloud_name: cloudName.trim(),
      api_key: apiKey.trim(),
      api_secret: apiSecret.trim(),
      secure: true,
    });
    return true;
  }
  return false;
};

// Internal active mock driver for unit/integration test harnesses
let customDriver = null;

export const setCustomStorageDriver = (driver) => {
  customDriver = driver;
};

export const resetStorageDriver = () => {
  customDriver = null;
};

/**
 * Check whether a real client-owned Cloudinary account is configured.
 */
export const isCloudinaryReady = () => {
  return configureCloudinary();
};

const isProductionEnvironment = () => process.env.NODE_ENV === 'production';

/**
 * Upload a validated file buffer to Cloudinary storage (or test mock driver in non-production).
 * Fails closed in production if Cloudinary credentials are not configured.
 *
 * @param {Object} params
 * @param {Buffer} params.buffer - Validated file buffer from Multer
 * @param {string} params.originalName - Original uploaded filename
 * @param {Object} [params.fileMeta] - Verified format specification from fileFormats registry
 * @param {string} [params.folder] - Target folder in Cloudinary
 * @returns {Promise<{publicId: string, url: string, bytes: number, format: string, extension: string, originalName: string, mimeType: string, resourceType: string}>}
 */
export const uploadFile = async ({ buffer, originalName, fileMeta, folder }) => {
  const spec = fileMeta || getFormatSpec(originalName) || getFormatSpec('pdf');
  const extension = spec.extension;
  const resourceType = spec.resourceType; // 'image' for pdf/jpg/jpeg/png/webp; 'raw' for office/txt/csv/zip
  const mimeType = spec.canonicalMime;

  if (customDriver?.upload) {
    const customResult = await customDriver.upload({
      buffer,
      originalName,
      fileMeta: spec,
      folder,
      extension,
      resourceType,
      mimeType,
    });
    return {
      ...customResult,
      extension: customResult.extension || customResult.format || extension,
      format: customResult.format || extension,
      resourceType: customResult.resourceType || resourceType,
      mimeType: customResult.mimeType || mimeType,
    };
  }

  const isLive = configureCloudinary();
  const targetFolder = folder || process.env.CLOUDINARY_DOCUMENTS_FOLDER || 'clearfiling/documents';

  if (isLive) {
    const baseId = `doc_${Date.now()}_${crypto.randomBytes(6).toString('hex')}`;
    const uploadOptions =
      resourceType === 'image'
        ? {
            folder: targetFolder,
            resource_type: 'image',
            format: extension,
            public_id: baseId,
            access_mode: 'public',
          }
        : {
            folder: targetFolder,
            resource_type: 'raw',
            // Include extension in raw public_id so Cloudinary preserves filename extension on delivery
            public_id: `${baseId}.${extension}`,
            access_mode: 'public',
          };

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
        if (error) {
          return reject(new Error(`Cloudinary upload failed: ${error.message}`));
        }
        resolve({
          publicId: result.public_id,
          url: result.secure_url,
          bytes: result.bytes || buffer.length,
          format: extension,
          extension,
          originalName,
          mimeType,
          resourceType,
        });
      });
      uploadStream.end(buffer);
    });
  }

  // Production must fail closed when Cloudinary is not configured
  if (isProductionEnvironment()) {
    throw new Error(
      'Cloudinary storage is not configured. Production uploads fail closed until valid Cloudinary credentials are provisioned.'
    );
  }

  // Non-production fallback mock provider (development / tests only)
  const mockBase = `${targetFolder}/doc_mock_${Date.now()}_${crypto.randomBytes(6).toString('hex')}`;
  const mockPublicId = resourceType === 'raw' ? `${mockBase}.${extension}` : mockBase;
  const mockUrlSuffix = resourceType === 'image' ? `.${extension}` : '';

  return {
    publicId: mockPublicId,
    url: `https://res.cloudinary.com/clearfiling-pending-setup/${resourceType}/upload/v1/${mockPublicId}${mockUrlSuffix}`,
    bytes: buffer.length,
    format: extension,
    extension,
    originalName,
    mimeType,
    resourceType,
    _isMock: true,
  };
};

/**
 * Delete an asset from Cloudinary storage using its tracked resourceType ('image' or 'raw').
 * Fails closed in production if Cloudinary credentials are not configured.
 *
 * @param {string} publicId - Cloudinary public ID of the asset
 * @param {string} [resourceType='raw'] - Cloudinary resource_type ('image' or 'raw')
 * @returns {Promise<{result: string}>}
 */
export const deleteFile = async (publicId, resourceType = 'raw') => {
  if (!publicId) return { result: 'not_found' };

  const resolvedResourceType = ['image', 'raw'].includes(resourceType) ? resourceType : 'raw';

  if (customDriver?.delete) {
    return await customDriver.delete(publicId, resolvedResourceType);
  }

  const isLive = configureCloudinary();
  if (isLive) {
    try {
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: resolvedResourceType,
      });
      return result;
    } catch (err) {
      console.error(
        `[StorageService Error] Failed to delete Cloudinary ${resolvedResourceType} asset "${publicId}":`,
        err.message
      );
      throw err;
    }
  }

  if (isProductionEnvironment()) {
    throw new Error(
      'Cloudinary storage is not configured. Production asset deletion fails closed until valid Cloudinary credentials are provisioned.'
    );
  }

  // Non-production mock deletion response
  return { result: 'ok', publicId, resourceType: resolvedResourceType };
};

// Backward-compatible aliases
export const uploadPDF = uploadFile;
export const deletePDF = deleteFile;

export default {
  configureCloudinary,
  isCloudinaryReady,
  setCustomStorageDriver,
  resetStorageDriver,
  uploadFile,
  deleteFile,
  uploadPDF,
  deletePDF,
};
