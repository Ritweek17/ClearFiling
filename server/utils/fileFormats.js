import path from 'path';

/**
 * Centralized registry of supported document formats, validation rules,
 * Cloudinary resource types, and public viewing/download capabilities.
 *
 * Explicitly excludes video, audio, executables, HTML, and SVG.
 */

const OLE2_MAGIC = Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]);
const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const ZIP_LOCAL_HEADER = Buffer.from([0x50, 0x4b, 0x03, 0x04]);
const ZIP_EMPTY_ARCHIVE = Buffer.from([0x50, 0x4b, 0x05, 0x06]);

/**
 * Verify PDF magic bytes (%PDF) within the initial 1024 bytes.
 */
export const verifyPdfBuffer = (buffer) => {
  if (!Buffer.isBuffer(buffer) || buffer.length < 5) {
    return false;
  }
  if (buffer.subarray(0, 4).toString('ascii') === '%PDF') {
    return true;
  }
  const searchWindow = buffer.subarray(0, Math.min(buffer.length, 1024)).toString('ascii');
  return searchWindow.includes('%PDF');
};

/**
 * Verify JPEG magic bytes (FF D8 FF).
 */
const verifyJpegBuffer = (buffer) =>
  Buffer.isBuffer(buffer) &&
  buffer.length >= 3 &&
  buffer[0] === 0xff &&
  buffer[1] === 0xd8 &&
  buffer[2] === 0xff;

/**
 * Verify PNG magic bytes (89 50 4E 47 0D 0A 1A 0A).
 */
const verifyPngBuffer = (buffer) =>
  Buffer.isBuffer(buffer) &&
  buffer.length >= 8 &&
  buffer.subarray(0, 8).equals(PNG_MAGIC);

/**
 * Verify WEBP magic bytes (RIFF....WEBP).
 */
const verifyWebpBuffer = (buffer) =>
  Buffer.isBuffer(buffer) &&
  buffer.length >= 12 &&
  buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
  buffer.subarray(8, 12).toString('ascii') === 'WEBP';

/**
 * Verify legacy Microsoft Office OLE2 Compound Binary File signature (DOC, XLS, PPT).
 */
const verifyOle2Buffer = (buffer) =>
  Buffer.isBuffer(buffer) &&
  buffer.length >= 8 &&
  buffer.subarray(0, 8).equals(OLE2_MAGIC);

/**
 * Extract entry filenames from ZIP local file headers / central directory records
 * without external dependencies so OOXML types can be verified strictly.
 */
const extractZipEntryNames = (buffer) => {
  const names = [];
  let offset = 0;

  // Scan Local File Headers (PK\x03\x04)
  while (offset + 30 <= buffer.length) {
    if (
      buffer[offset] === 0x50 &&
      buffer[offset + 1] === 0x4b &&
      buffer[offset + 2] === 0x03 &&
      buffer[offset + 3] === 0x04
    ) {
      const nameLen = buffer.readUInt16LE(offset + 26);
      const extraLen = buffer.readUInt16LE(offset + 28);
      const compSize = buffer.readUInt32LE(offset + 18);
      const nameStart = offset + 30;
      const nameEnd = nameStart + nameLen;
      if (nameEnd <= buffer.length) {
        names.push(buffer.subarray(nameStart, nameEnd).toString('utf8'));
      }
      const nextOffset = nameEnd + extraLen + compSize;
      offset = nextOffset > offset ? nextOffset : offset + 4;
    } else {
      break;
    }
  }

  // Also scan Central Directory Headers (PK\x01\x02) in case data descriptors were used (compSize=0)
  for (let i = 0; i + 46 <= buffer.length; i += 1) {
    if (
      buffer[i] === 0x50 &&
      buffer[i + 1] === 0x4b &&
      buffer[i + 2] === 0x01 &&
      buffer[i + 3] === 0x02
    ) {
      const nameLen = buffer.readUInt16LE(i + 28);
      const nameStart = i + 46;
      const nameEnd = nameStart + nameLen;
      if (nameEnd <= buffer.length) {
        names.push(buffer.subarray(nameStart, nameEnd).toString('utf8'));
      }
    }
  }

  return names;
};

/**
 * Verify standard ZIP archive magic bytes (rejecting non-ZIP binaries).
 */
const verifyZipBuffer = (buffer) => {
  if (!Buffer.isBuffer(buffer) || buffer.length < 4) {
    return false;
  }
  const head = buffer.subarray(0, 4);
  return head.equals(ZIP_LOCAL_HEADER) || head.equals(ZIP_EMPTY_ARCHIVE);
};

/**
 * Verify OOXML Office container (DOCX, XLSX, PPTX) by ZIP signature + internal directory structure.
 */
const verifyOoxmlBuffer = (requiredPrefix) => (buffer) => {
  if (!Buffer.isBuffer(buffer) || buffer.length < 30) {
    return false;
  }
  if (!buffer.subarray(0, 4).equals(ZIP_LOCAL_HEADER)) {
    return false;
  }

  const entries = extractZipEntryNames(buffer);
  const hasContentTypes = entries.some((name) => name === '[Content_Types].xml');
  const hasTargetFolder = entries.some((name) => name.startsWith(requiredPrefix));
  return hasContentTypes && hasTargetFolder;
};

const DISALLOWED_TEXT_SIGNATURES = [
  '%PDF',
  'MZ',
  '\x7fELF',
  'PK\x03\x04',
  'Rar!',
  '7z\xbc\xaf',
  'GIF8',
  'ID3',
];

/**
 * Verify plain UTF-8 text files (TXT, CSV).
 * Rejects null bytes, binary control characters, non-UTF-8 payloads,
 * binary magic headers, and disguised HTML/SVG/script documents.
 */
const verifyTextBuffer = (buffer) => {
  if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
    return false;
  }

  // Reject binary control bytes and null bytes
  let controlCount = 0;
  for (let i = 0; i < buffer.length; i += 1) {
    const byte = buffer[i];
    if (byte === 0x00) {
      return false;
    }
    // Allow tab (0x09), LF (0x0A), CR (0x0D), printable ASCII, and UTF-8 multibyte (>= 0x80)
    if (byte < 0x20 && byte !== 0x09 && byte !== 0x0a && byte !== 0x0d) {
      controlCount += 1;
    }
  }
  if (controlCount > 0) {
    return false;
  }

  let decoded;
  try {
    decoded = new TextDecoder('utf-8', { fatal: true }).decode(buffer);
  } catch {
    return false;
  }

  const stripped = decoded.replace(/^\uFEFF/, '');
  if (!stripped.trim()) {
    return false;
  }

  const startAscii = buffer.subarray(0, Math.min(buffer.length, 16)).toString('latin1');
  if (DISALLOWED_TEXT_SIGNATURES.some((sig) => startAscii.startsWith(sig))) {
    return false;
  }

  // Block disguised HTML/SVG/active markup (including XML-prolog SVG)
  const headLower = stripped.slice(0, 2048).toLowerCase();
  if (
    headLower.includes('<!doctype html') ||
    headLower.includes('<html') ||
    headLower.includes('<svg') ||
    headLower.includes('<script')
  ) {
    return false;
  }

  return true;
};

/**
 * Authoritative registry keyed by lowercase extension (without leading dot).
 */
export const SUPPORTED_FILE_FORMATS = {
  pdf: {
    extension: 'pdf',
    label: 'PDF',
    category: 'document',
    resourceType: 'image',
    canonicalMime: 'application/pdf',
    allowedMimes: ['application/pdf', 'application/x-pdf'],
    previewSupported: true,
    deliveryMode: 'inline',
    validateSignature: verifyPdfBuffer,
  },
  doc: {
    extension: 'doc',
    label: 'DOC',
    category: 'document',
    resourceType: 'raw',
    canonicalMime: 'application/msword',
    allowedMimes: ['application/msword', 'application/octet-stream'],
    previewSupported: false,
    deliveryMode: 'download',
    validateSignature: verifyOle2Buffer,
  },
  docx: {
    extension: 'docx',
    label: 'DOCX',
    category: 'document',
    resourceType: 'raw',
    canonicalMime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    allowedMimes: [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/zip',
      'application/octet-stream',
    ],
    previewSupported: false,
    deliveryMode: 'download',
    validateSignature: verifyOoxmlBuffer('word/'),
  },
  txt: {
    extension: 'txt',
    label: 'TXT',
    category: 'document',
    resourceType: 'raw',
    canonicalMime: 'text/plain',
    allowedMimes: ['text/plain'],
    previewSupported: false,
    deliveryMode: 'download',
    validateSignature: verifyTextBuffer,
  },
  xls: {
    extension: 'xls',
    label: 'XLS',
    category: 'spreadsheet',
    resourceType: 'raw',
    canonicalMime: 'application/vnd.ms-excel',
    allowedMimes: ['application/vnd.ms-excel', 'application/octet-stream'],
    previewSupported: false,
    deliveryMode: 'download',
    validateSignature: verifyOle2Buffer,
  },
  xlsx: {
    extension: 'xlsx',
    label: 'XLSX',
    category: 'spreadsheet',
    resourceType: 'raw',
    canonicalMime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    allowedMimes: [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/zip',
      'application/octet-stream',
    ],
    previewSupported: false,
    deliveryMode: 'download',
    validateSignature: verifyOoxmlBuffer('xl/'),
  },
  csv: {
    extension: 'csv',
    label: 'CSV',
    category: 'spreadsheet',
    resourceType: 'raw',
    canonicalMime: 'text/csv',
    allowedMimes: ['text/csv', 'application/csv', 'application/vnd.ms-excel', 'text/plain'],
    previewSupported: false,
    deliveryMode: 'download',
    validateSignature: verifyTextBuffer,
  },
  ppt: {
    extension: 'ppt',
    label: 'PPT',
    category: 'presentation',
    resourceType: 'raw',
    canonicalMime: 'application/vnd.ms-powerpoint',
    allowedMimes: ['application/vnd.ms-powerpoint', 'application/octet-stream'],
    previewSupported: false,
    deliveryMode: 'download',
    validateSignature: verifyOle2Buffer,
  },
  pptx: {
    extension: 'pptx',
    label: 'PPTX',
    category: 'presentation',
    resourceType: 'raw',
    canonicalMime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    allowedMimes: [
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/zip',
      'application/octet-stream',
    ],
    previewSupported: false,
    deliveryMode: 'download',
    validateSignature: verifyOoxmlBuffer('ppt/'),
  },
  jpg: {
    extension: 'jpg',
    label: 'JPG',
    category: 'image',
    resourceType: 'image',
    canonicalMime: 'image/jpeg',
    allowedMimes: ['image/jpeg', 'image/pjpeg'],
    previewSupported: true,
    deliveryMode: 'inline',
    validateSignature: verifyJpegBuffer,
  },
  jpeg: {
    extension: 'jpeg',
    label: 'JPEG',
    category: 'image',
    resourceType: 'image',
    canonicalMime: 'image/jpeg',
    allowedMimes: ['image/jpeg', 'image/pjpeg'],
    previewSupported: true,
    deliveryMode: 'inline',
    validateSignature: verifyJpegBuffer,
  },
  png: {
    extension: 'png',
    label: 'PNG',
    category: 'image',
    resourceType: 'image',
    canonicalMime: 'image/png',
    allowedMimes: ['image/png'],
    previewSupported: true,
    deliveryMode: 'inline',
    validateSignature: verifyPngBuffer,
  },
  webp: {
    extension: 'webp',
    label: 'WEBP',
    category: 'image',
    resourceType: 'image',
    canonicalMime: 'image/webp',
    allowedMimes: ['image/webp'],
    previewSupported: true,
    deliveryMode: 'inline',
    validateSignature: verifyWebpBuffer,
  },
  zip: {
    extension: 'zip',
    label: 'ZIP',
    category: 'archive',
    resourceType: 'raw',
    canonicalMime: 'application/zip',
    allowedMimes: [
      'application/zip',
      'application/x-zip-compressed',
      'multipart/x-zip',
      'application/octet-stream',
    ],
    previewSupported: false,
    deliveryMode: 'download',
    validateSignature: verifyZipBuffer,
  },
};

export const ALLOWED_EXTENSIONS = Object.freeze(Object.keys(SUPPORTED_FILE_FORMATS));

/**
 * Extract normalized lowercase extension (without dot) from a filename.
 */
export const extractExtension = (filename = '') => {
  const base = path.basename(String(filename || '').trim());
  if (!base || base.startsWith('.') && base.indexOf('.', 1) === -1) {
    return '';
  }
  const ext = path.extname(base).slice(1).toLowerCase();
  return ext;
};

/**
 * Normalize a client-supplied MIME header (strip parameters like "; charset=utf-8").
 */
export const normalizeMimeType = (mime = '') =>
  String(mime || '').split(';')[0].trim().toLowerCase();

/**
 * Look up format metadata by extension (or filename).
 */
export const getFormatSpec = (extOrFilename = '') => {
  const cleaned = String(extOrFilename || '').trim().toLowerCase().replace(/^\./, '');
  if (SUPPORTED_FILE_FORMATS[cleaned]) {
    return SUPPORTED_FILE_FORMATS[cleaned];
  }
  const ext = extractExtension(cleaned);
  return ext ? SUPPORTED_FILE_FORMATS[ext] || null : null;
};

/**
 * Stage 1 check: validate filename extension and client-provided MIME type against the registry.
 */
export const validateFileHeaderMetadata = ({ originalname = '', mimetype = '' }) => {
  const ext = extractExtension(originalname);
  const spec = ext ? SUPPORTED_FILE_FORMATS[ext] : null;
  if (!spec) {
    return {
      valid: false,
      reason: `Unsupported file extension${ext ? ` ".${ext}"` : ''}. Allowed formats: ${ALLOWED_EXTENSIONS.map((e) => `.${e}`).join(', ')}.`,
    };
  }

  const normalizedMime = normalizeMimeType(mimetype);
  if (!normalizedMime || !spec.allowedMimes.includes(normalizedMime)) {
    return {
      valid: false,
      reason: `MIME type "${normalizedMime || 'unknown'}" is not valid for .${spec.extension} files.`,
    };
  }

  return { valid: true, spec };
};

/**
 * Stage 2 check: validate non-empty buffer and strict file signature/structure matching the claimed extension.
 */
export const validateUploadedFileBuffer = ({ originalname = '', mimetype = '', buffer }) => {
  const headerCheck = validateFileHeaderMetadata({ originalname, mimetype });
  if (!headerCheck.valid) {
    return headerCheck;
  }

  if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
    return {
      valid: false,
      reason: 'Uploaded file is empty (0 bytes). Please upload a valid non-empty file.',
    };
  }

  const { spec } = headerCheck;
  if (!spec.validateSignature(buffer)) {
    return {
      valid: false,
      reason: `File validation failed: The uploaded file content does not match a valid ${spec.label} (.${spec.extension}) file.`,
    };
  }

  return { valid: true, spec };
};

/**
 * Enrich public-facing file metadata with preview/download capabilities without altering stored fields.
 */
export const enrichPublicFileMetadata = (file = {}) => {
  if (!file) return file;
  const ext = (file.extension || file.format || extractExtension(file.originalName) || 'pdf').toLowerCase();
  const spec = SUPPORTED_FILE_FORMATS[ext];

  return {
    ...file,
    extension: ext,
    format: (file.format || ext).toLowerCase(),
    resourceType: file.resourceType || spec?.resourceType || 'raw',
    previewSupported: spec ? spec.previewSupported : ext === 'pdf',
    deliveryMode: spec ? spec.deliveryMode : ext === 'pdf' ? 'inline' : 'download',
  };
};

/**
 * Build a force-download Cloudinary URL when the asset is stored under resource_type: 'image'.
 * Raw assets do not support transformation flags like fl_attachment in the URL path.
 */
export const buildDownloadUrl = (file = {}) => {
  const url = file?.url;
  if (!url) return null;

  const ext = (file.extension || file.format || extractExtension(file.originalName) || '').toLowerCase();
  const resourceType = file.resourceType || SUPPORTED_FILE_FORMATS[ext]?.resourceType;

  if (resourceType === 'image' && url.includes('/image/upload/') && !url.includes('/fl_attachment')) {
    return url.replace('/image/upload/', '/image/upload/fl_attachment/');
  }

  return url;
};

export default {
  SUPPORTED_FILE_FORMATS,
  ALLOWED_EXTENSIONS,
  verifyPdfBuffer,
  extractExtension,
  normalizeMimeType,
  getFormatSpec,
  validateFileHeaderMetadata,
  validateUploadedFileBuffer,
  enrichPublicFileMetadata,
  buildDownloadUrl,
};
