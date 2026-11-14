import multer from 'multer';
import {
  verifyPdfBuffer,
  validateFileHeaderMetadata,
  validateUploadedFileBuffer,
  ALLOWED_EXTENSIONS,
} from '../utils/fileFormats.js';

// Default maximum file size: 10MB
const DEFAULT_MAX_SIZE_MB = 10;

export const getMaxFileSize = () => {
  const mb = parseInt(process.env.MAX_FILE_SIZE_MB, 10);
  return (isNaN(mb) || mb <= 0 ? DEFAULT_MAX_SIZE_MB : mb) * 1024 * 1024;
};

// Multer memory storage configuration
const storage = multer.memoryStorage();

// Stage 1: Preliminary filter checking extension and client-provided MIME type
const fileFilter = (req, file, cb) => {
  const check = validateFileHeaderMetadata({
    originalname: file?.originalname,
    mimetype: file?.mimetype,
  });

  if (!check.valid) {
    const err = new Error(check.reason);
    err.code = 'INVALID_FILE_TYPE';
    return cb(err, false);
  }

  cb(null, true);
};

/**
 * Stage 2 compatibility export for existing PDF magic byte tests.
 */
export const verifyPdfMagicBytes = verifyPdfBuffer;

/**
 * Middleware factory for single document upload with strict extension,
 * MIME type, size, and buffer-signature validation.
 *
 * @param {string} [fieldName='file'] - Multipart form field name
 * @param {boolean} [required=true] - Whether a file must be present in the request
 */
export const requireDocumentUpload = (fieldName = 'file', required = true) => {
  return (req, res, next) => {
    const maxBytes = getMaxFileSize();
    const upload = multer({
      storage,
      limits: {
        fileSize: maxBytes,
        files: 1,
      },
      fileFilter,
    });
    const multerSingle = upload.single(fieldName);

    multerSingle(req, res, (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          const limitMb = Math.round(maxBytes / (1024 * 1024));
          return res.status(400).json({
            success: false,
            message: `File size exceeds the allowed limit of ${limitMb}MB.`,
          });
        }
        return res.status(400).json({
          success: false,
          message: err.message || err.field || 'File upload error.',
        });
      }

      if (required && !req.file) {
        return res.status(400).json({
          success: false,
          message: `Please attach a supported file (${ALLOWED_EXTENSIONS.map((e) => `.${e}`).join(', ')}) in the "${fieldName}" field.`,
        });
      }

      if (req.file) {
        // Stage 2: Strict magic-byte / structural signature verification
        const result = validateUploadedFileBuffer({
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          buffer: req.file.buffer,
        });

        if (!result.valid) {
          return res.status(400).json({
            success: false,
            message: result.reason,
          });
        }

        // Attach verified format specification for downstream controller & storage service
        req.fileMeta = result.spec;
      }

      next();
    });
  };
};

// Preserved alias for existing routes/tests
export const requirePdfUpload = requireDocumentUpload;

export default {
  requireDocumentUpload,
  requirePdfUpload,
  verifyPdfMagicBytes,
  getMaxFileSize,
};
