const PREVIEWABLE_EXTENSIONS = new Set(['pdf', 'jpg', 'jpeg', 'png', 'webp']);
const LOCALHOST_HOSTNAMES = new Set(['localhost', '127.0.0.1', '[::1]']);

/**
 * Validate a document preview/download URL to prevent XSS/URL injection
 * (e.g. javascript:, data:, vbscript:, protocol-relative URLs) and enforce HTTPS in production.
 */
export const isSafeDocumentUrl = (rawUrl, { isProduction } = {}) => {
  if (!rawUrl || typeof rawUrl !== 'string') return false;
  const trimmed = rawUrl.trim();
  if (!trimmed || trimmed.startsWith('//')) return false;

  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch {
    return false;
  }

  const prodMode =
    typeof isProduction === 'boolean' ? isProduction : Boolean(import.meta.env?.PROD);

  if (parsed.protocol === 'https:') {
    return true;
  }

  if (!prodMode && parsed.protocol === 'http:' && LOCALHOST_HOSTNAMES.has(parsed.hostname)) {
    return true;
  }

  return false;
};

/**
 * Return trimmed URL if safe, otherwise null.
 */
export const sanitizeDocumentUrl = (rawUrl, options = {}) => {
  if (!isSafeDocumentUrl(rawUrl, options)) return null;
  return rawUrl.trim();
};

/**
 * Resolve normalized lowercase extension from either an API document object
 * or legacy static card shape.
 */
export const getDocumentExtension = (doc = {}) => {
  const explicit =
    doc?.file?.extension ||
    doc?.file?.format ||
    doc?.extension ||
    doc?.format;

  if (explicit && typeof explicit === 'string') {
    return explicit.trim().toLowerCase().replace(/^\./, '');
  }

  const filename = doc?.file?.originalName || doc?.fileName || doc?.name || '';
  const match = String(filename).trim().match(/\.([a-z0-9]+)$/i);
  return match ? match[1].toLowerCase() : '';
};

/**
 * Browser inline preview is supported ONLY for PDF and raster images (JPG, JPEG, PNG, WEBP).
 * Office documents, text/CSV, and ZIP archives must download directly.
 */
export const isBrowserPreviewSupported = (doc = {}) => {
  if (typeof doc?.file?.previewSupported === 'boolean') {
    return doc.file.previewSupported;
  }
  const ext = getDocumentExtension(doc);
  return PREVIEWABLE_EXTENSIONS.has(ext);
};

export const formatDocumentSize = (bytes) => {
  if (!bytes || typeof bytes !== 'number') return '';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.min(sizes.length - 1, Math.floor(Math.log(bytes) / Math.log(k)));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

/**
 * Format published/updated timestamp for public display without exposing raw ISO timestamps.
 */
export const formatDocumentDate = (dateValue) => {
  if (!dateValue) return 'Recent';
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return 'Recent';
  return parsed.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Determine validated public viewing and backend download endpoint URLs based on file type.
 * Never constructs Cloudinary download URLs manually when a backend slug/endpoint is present.
 */
export const getDocumentActionBehavior = (doc = {}, options = {}) => {
  const ext = getDocumentExtension(doc);
  const previewSupported = isBrowserPreviewSupported(doc);
  const fileUrl = doc?.file?.url || doc?.fileUrl || null;
  const viewUrl = previewSupported ? sanitizeDocumentUrl(fileUrl, options) : null;

  let rawDownloadUrl = null;
  if (doc?.slug && options.apiBaseUrl) {
    const cleanBase = String(options.apiBaseUrl).trim().replace(/\/+$/, '');
    rawDownloadUrl = `${cleanBase}/api/public/documents/${encodeURIComponent(doc.slug)}/download`;
  } else if (doc?.downloadUrl) {
    rawDownloadUrl = doc.downloadUrl;
  } else {
    rawDownloadUrl = fileUrl;
  }

  const downloadUrl = sanitizeDocumentUrl(rawDownloadUrl, options);

  return {
    extension: ext,
    badgeLabel: ext ? ext.toUpperCase() : 'FILE',
    sizeLabel: doc?.fileSize || formatDocumentSize(doc?.file?.bytes),
    previewSupported,
    viewUrl,
    downloadUrl,
  };
};
