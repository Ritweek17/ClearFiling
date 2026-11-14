export const MAX_FILE_SIZE_MB = 10;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const ALLOWED_FORMAT_MIMES = {
  pdf: ['application/pdf', 'application/x-pdf'],
  doc: ['application/msword', 'application/octet-stream'],
  docx: [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/zip',
    'application/octet-stream',
  ],
  txt: ['text/plain'],
  xls: ['application/vnd.ms-excel', 'application/octet-stream'],
  xlsx: [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/zip',
    'application/octet-stream',
  ],
  csv: ['text/csv', 'application/csv', 'application/vnd.ms-excel', 'text/plain'],
  ppt: ['application/vnd.ms-powerpoint', 'application/octet-stream'],
  pptx: [
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/zip',
    'application/octet-stream',
  ],
  jpg: ['image/jpeg', 'image/pjpeg'],
  jpeg: ['image/jpeg', 'image/pjpeg'],
  png: ['image/png'],
  webp: ['image/webp'],
  zip: [
    'application/zip',
    'application/x-zip-compressed',
    'multipart/x-zip',
    'application/octet-stream',
  ],
};

export const ACCEPTED_EXTENSIONS = Object.keys(ALLOWED_FORMAT_MIMES);

export const FILE_INPUT_ACCEPT = [
  ...ACCEPTED_EXTENSIONS.map((ext) => `.${ext}`),
  ...new Set(
    Object.values(ALLOWED_FORMAT_MIMES)
      .flat()
      .filter((m) => m !== 'application/octet-stream')
  ),
].join(',');

export const FORMAT_GROUPS = [
  { label: 'Documents', items: 'PDF, DOC, DOCX, TXT' },
  { label: 'Spreadsheets', items: 'XLS, XLSX, CSV' },
  { label: 'Presentations', items: 'PPT, PPTX' },
  { label: 'Images', items: 'JPG, JPEG, PNG, WEBP' },
  { label: 'Archives', items: 'ZIP' },
];

export const getFileExtension = (filename = '') => {
  const parts = String(filename).trim().split('.');
  return parts.length > 1 ? parts.pop().toLowerCase() : '';
};

export const validateClientFile = (file) => {
  if (!file) {
    return { valid: false, error: 'Please select a file.' };
  }

  const ext = getFileExtension(file.name);
  if (!ext || !ALLOWED_FORMAT_MIMES[ext]) {
    return {
      valid: false,
      error: `Unsupported file format${ext ? ` (.${ext})` : ''}. Accepted: ${ACCEPTED_EXTENSIONS.map((e) => e.toUpperCase()).join(', ')}.`,
    };
  }

  const mime = (file.type || '').split(';')[0].trim().toLowerCase();
  if (mime && !ALLOWED_FORMAT_MIMES[ext].includes(mime)) {
    return {
      valid: false,
      error: `Invalid MIME type (${mime}) for a .${ext.toUpperCase()} file.`,
    };
  }

  if (file.size === 0) {
    return {
      valid: false,
      error: 'The selected file is empty (0 bytes). Please choose a valid file.',
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size exceeds the ${MAX_FILE_SIZE_MB}MB limit. Please upload a smaller file.`,
    };
  }

  return { valid: true, extension: ext };
};

export const formatBytes = (bytes) => {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

