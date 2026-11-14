import test from 'node:test';
import assert from 'node:assert/strict';
import { PassThrough } from 'stream';
import {
  verifyPdfMagicBytes,
  getMaxFileSize,
  requireDocumentUpload,
} from '../../middleware/uploadMiddleware.js';
import {
  SUPPORTED_FILE_FORMATS,
  validateUploadedFileBuffer,
  enrichPublicFileMetadata,
  buildDownloadUrl,
} from '../../utils/fileFormats.js';

/**
 * Helper: build a minimal valid ZIP container with stored entries so OOXML and ZIP tests
 * exercise real local file headers (PK\x03\x04) and central directory entries (PK\x01\x02).
 */
const buildMinimalZip = (entries) => {
  const localChunks = [];
  const centralChunks = [];
  let offset = 0;

  for (const { name, content = '' } of entries) {
    const nameBuf = Buffer.from(name, 'utf8');
    const dataBuf = Buffer.from(content, 'utf8');

    const local = Buffer.alloc(30 + nameBuf.length + dataBuf.length);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt32LE(dataBuf.length, 18);
    local.writeUInt32LE(dataBuf.length, 22);
    local.writeUInt16LE(nameBuf.length, 26);
    nameBuf.copy(local, 30);
    dataBuf.copy(local, 30 + nameBuf.length);
    localChunks.push(local);

    const central = Buffer.alloc(46 + nameBuf.length);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt32LE(dataBuf.length, 20);
    central.writeUInt32LE(dataBuf.length, 24);
    central.writeUInt16LE(nameBuf.length, 28);
    central.writeUInt32LE(offset, 42);
    nameBuf.copy(central, 46);
    centralChunks.push(central);

    offset += local.length;
  }

  const centralDir = Buffer.concat(centralChunks);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(entries.length, 8);
  eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(centralDir.length, 12);
  eocd.writeUInt32LE(offset, 16);

  return Buffer.concat([...localChunks, centralDir, eocd]);
};

const OLE2_SAMPLE = Buffer.concat([
  Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]),
  Buffer.from('legacy-office-payload'),
]);

const VALID_SAMPLES = {
  pdf: {
    filename: 'filing.pdf',
    mime: 'application/pdf',
    buffer: Buffer.from('%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF'),
  },
  doc: {
    filename: 'agreement.doc',
    mime: 'application/msword',
    buffer: OLE2_SAMPLE,
  },
  docx: {
    filename: 'agreement.docx',
    mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    buffer: buildMinimalZip([
      { name: '[Content_Types].xml', content: '<Types/>' },
      { name: 'word/document.xml', content: '<w:document/>' },
    ]),
  },
  txt: {
    filename: 'notes.txt',
    mime: 'text/plain',
    buffer: Buffer.from('ClearFiling compliance checklist notes.\nLine 2.'),
  },
  xls: {
    filename: 'ledger.xls',
    mime: 'application/vnd.ms-excel',
    buffer: OLE2_SAMPLE,
  },
  xlsx: {
    filename: 'ledger.xlsx',
    mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    buffer: buildMinimalZip([
      { name: '[Content_Types].xml', content: '<Types/>' },
      { name: 'xl/workbook.xml', content: '<workbook/>' },
    ]),
  },
  csv: {
    filename: 'filings.csv',
    mime: 'text/csv',
    buffer: Buffer.from('id,company,status\n1,ClearFiling LLP,active\n'),
  },
  ppt: {
    filename: 'deck.ppt',
    mime: 'application/vnd.ms-powerpoint',
    buffer: OLE2_SAMPLE,
  },
  pptx: {
    filename: 'deck.pptx',
    mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    buffer: buildMinimalZip([
      { name: '[Content_Types].xml', content: '<Types/>' },
      { name: 'ppt/presentation.xml', content: '<p:presentation/>' },
    ]),
  },
  jpg: {
    filename: 'scan.jpg',
    mime: 'image/jpeg',
    buffer: Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46]),
  },
  jpeg: {
    filename: 'scan.jpeg',
    mime: 'image/jpeg',
    buffer: Buffer.from([0xff, 0xd8, 0xff, 0xe1, 0x00, 0x10]),
  },
  png: {
    filename: 'certificate.png',
    mime: 'image/png',
    buffer: Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00]),
  },
  webp: {
    filename: 'receipt.webp',
    mime: 'image/webp',
    buffer: Buffer.concat([
      Buffer.from('RIFF'),
      Buffer.from([0x24, 0x00, 0x00, 0x00]),
      Buffer.from('WEBP'),
      Buffer.from('VP8 '),
    ]),
  },
  zip: {
    filename: 'bundle.zip',
    mime: 'application/zip',
    buffer: buildMinimalZip([{ name: 'readme.txt', content: 'hello' }]),
  },
};

test('PDF Validation: verifyPdfMagicBytes validates genuine PDF header (%PDF)', () => {
  assert.equal(verifyPdfMagicBytes(VALID_SAMPLES.pdf.buffer), true);
});

test('PDF Validation: verifyPdfMagicBytes validates PDF with preamble header', () => {
  const paddedBuffer = Buffer.from('\uFEFF\n%PDF-1.7\n1 0 obj\nendobj\n%%EOF');
  assert.equal(verifyPdfMagicBytes(paddedBuffer), true);
});

test('PDF Validation: verifyPdfMagicBytes rejects non-PDF files', () => {
  assert.equal(verifyPdfMagicBytes(Buffer.from('Hello world this is a text file')), false);
  assert.equal(verifyPdfMagicBytes(Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10])), false);
  assert.equal(verifyPdfMagicBytes(Buffer.from('MZ\x90\x00\x03\x00\x00\x00')), false);
  assert.equal(verifyPdfMagicBytes(Buffer.from('')), false);
  assert.equal(verifyPdfMagicBytes(Buffer.from('%PDF')), false);
});

test('PDF Validation: getMaxFileSize defaults to 10MB', () => {
  const original = process.env.MAX_FILE_SIZE_MB;
  delete process.env.MAX_FILE_SIZE_MB;

  assert.equal(getMaxFileSize(), 10 * 1024 * 1024);

  process.env.MAX_FILE_SIZE_MB = '25';
  assert.equal(getMaxFileSize(), 25 * 1024 * 1024);

  if (original === undefined) {
    delete process.env.MAX_FILE_SIZE_MB;
  } else {
    process.env.MAX_FILE_SIZE_MB = original;
  }
});

test('Multi-Format Validation: accepts all 14 supported formats with genuine signatures', () => {
  for (const [ext, sample] of Object.entries(VALID_SAMPLES)) {
    const result = validateUploadedFileBuffer({
      originalname: sample.filename,
      mimetype: sample.mime,
      buffer: sample.buffer,
    });
    assert.equal(result.valid, true, `Expected .${ext} to validate, got: ${result.reason}`);
    assert.equal(result.spec.extension, ext);
  }
});

test('Multi-Format Validation: maps Cloudinary resourceType and browser preview capability accurately', () => {
  for (const ext of ['pdf', 'jpg', 'jpeg', 'png', 'webp']) {
    assert.equal(SUPPORTED_FILE_FORMATS[ext].resourceType, 'image');
    assert.equal(SUPPORTED_FILE_FORMATS[ext].previewSupported, true);
  }
  for (const ext of ['doc', 'docx', 'txt', 'xls', 'xlsx', 'csv', 'ppt', 'pptx', 'zip']) {
    assert.equal(SUPPORTED_FILE_FORMATS[ext].resourceType, 'raw');
    assert.equal(SUPPORTED_FILE_FORMATS[ext].previewSupported, false);
  }
});

test('Multi-Format Validation: rejects video, audio, HTML, SVG, and executable formats', () => {
  const blockedCases = [
    { originalname: 'promo.mp4', mimetype: 'video/mp4', buffer: Buffer.from('00000018ftypmp42') },
    { originalname: 'voice.mp3', mimetype: 'audio/mpeg', buffer: Buffer.from('ID3\x03\x00') },
    { originalname: 'page.html', mimetype: 'text/html', buffer: Buffer.from('<html><body>hi</body></html>') },
    { originalname: 'logo.svg', mimetype: 'image/svg+xml', buffer: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"></svg>') },
    { originalname: 'payload.exe', mimetype: 'application/x-msdownload', buffer: Buffer.from('MZ\x90\x00') },
  ];

  for (const item of blockedCases) {
    const result = validateUploadedFileBuffer(item);
    assert.equal(result.valid, false, `Expected ${item.originalname} to be rejected`);
  }
});

test('Multi-Format Validation: blocks signature spoofing and disguised active markup', () => {
  // Plain ZIP renamed to .docx must fail OOXML structural check
  const zipAsDocx = validateUploadedFileBuffer({
    originalname: 'fake.docx',
    mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    buffer: VALID_SAMPLES.zip.buffer,
  });
  assert.equal(zipAsDocx.valid, false);

  // DOCX renamed to XLSX must fail OOXML folder check
  const docxAsXlsx = validateUploadedFileBuffer({
    originalname: 'wrong.xlsx',
    mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    buffer: VALID_SAMPLES.docx.buffer,
  });
  assert.equal(docxAsXlsx.valid, false);

  // PNG bytes disguised as JPG
  const pngAsJpg = validateUploadedFileBuffer({
    originalname: 'fake.jpg',
    mimetype: 'image/jpeg',
    buffer: VALID_SAMPLES.png.buffer,
  });
  assert.equal(pngAsJpg.valid, false);

  // Executable disguised as DOC
  const exeAsDoc = validateUploadedFileBuffer({
    originalname: 'malware.doc',
    mimetype: 'application/msword',
    buffer: Buffer.from('MZ\x90\x00\x03\x00\x00\x00'),
  });
  assert.equal(exeAsDoc.valid, false);

  // HTML/script disguised as TXT or CSV
  const htmlAsTxt = validateUploadedFileBuffer({
    originalname: 'notes.txt',
    mimetype: 'text/plain',
    buffer: Buffer.from('<!DOCTYPE html><html><script>alert(1)</script></html>'),
  });
  assert.equal(htmlAsTxt.valid, false);

  // XML-prolog SVG disguised as TXT
  const svgAsTxt = validateUploadedFileBuffer({
    originalname: 'notes.txt',
    mimetype: 'text/plain',
    buffer: Buffer.from('<?xml version="1.0"?><svg onload="alert(1)"></svg>'),
  });
  assert.equal(svgAsTxt.valid, false);

  // Binary null bytes disguised as CSV
  const binaryAsCsv = validateUploadedFileBuffer({
    originalname: 'data.csv',
    mimetype: 'text/csv',
    buffer: Buffer.from([0x41, 0x2c, 0x00, 0x42]),
  });
  assert.equal(binaryAsCsv.valid, false);

  // Empty 0-byte buffer
  const emptyPdf = validateUploadedFileBuffer({
    originalname: 'empty.pdf',
    mimetype: 'application/pdf',
    buffer: Buffer.alloc(0),
  });
  assert.equal(emptyPdf.valid, false);
});

test('Public File Metadata Helper: computes preview flags and download URLs accurately', () => {
  const enrichedPdf = enrichPublicFileMetadata({
    originalName: 'guide.pdf',
    extension: 'pdf',
    resourceType: 'image',
    url: 'https://res.cloudinary.com/demo/image/upload/v1/clearfiling/documents/doc_1.pdf',
    bytes: 1024,
  });
  assert.equal(enrichedPdf.previewSupported, true);
  assert.equal(enrichedPdf.deliveryMode, 'inline');
  assert.equal(
    buildDownloadUrl(enrichedPdf),
    'https://res.cloudinary.com/demo/image/upload/fl_attachment/v1/clearfiling/documents/doc_1.pdf'
  );

  const enrichedDocx = enrichPublicFileMetadata({
    originalName: 'template.docx',
    extension: 'docx',
    resourceType: 'raw',
    url: 'https://res.cloudinary.com/demo/raw/upload/v1/clearfiling/documents/doc_2.docx',
    bytes: 2048,
  });
  assert.equal(enrichedDocx.previewSupported, false);
  assert.equal(enrichedDocx.deliveryMode, 'download');
  assert.equal(
    buildDownloadUrl(enrichedDocx),
    'https://res.cloudinary.com/demo/raw/upload/v1/clearfiling/documents/doc_2.docx'
  );
});

const runMiddlewareWithMultipart = async (middleware, { filename, mime, buffer }) => {
  const boundary = '----ClearFilingTestBoundary12345';
  const headerPart = Buffer.from(
    `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="file"; filename="${filename}"\r\n` +
      `Content-Type: ${mime}\r\n\r\n`
  );
  const footerPart = Buffer.from(`\r\n--${boundary}--\r\n`);
  const payload = Buffer.concat([headerPart, buffer, footerPart]);

  const req = new PassThrough();
  req.headers = {
    'content-type': `multipart/form-data; boundary=${boundary}`,
    'content-length': String(payload.length),
  };
  req.method = 'POST';

  return await new Promise((resolve) => {
    let statusCode = 200;
    let jsonBody = null;
    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(body) {
        jsonBody = body;
        resolve({ status: statusCode, body: jsonBody, nextCalled: false, req });
      },
    };

    middleware(req, res, (err) => {
      resolve({ status: err ? 500 : 200, body: jsonBody, nextCalled: !err, err, req });
    });

    req.end(payload);
  });
};

test('Upload Middleware: enforces size limits, MIME/extension checks, and attaches fileMeta', async () => {
  const originalLimit = process.env.MAX_FILE_SIZE_MB;
  process.env.MAX_FILE_SIZE_MB = '1'; // 1MB limit for quick test

  try {
    const middleware = requireDocumentUpload('file', true);

    // 1. Valid PNG upload attaches req.file and req.fileMeta
    const ok = await runMiddlewareWithMultipart(middleware, {
      filename: 'badge.png',
      mime: 'image/png',
      buffer: VALID_SAMPLES.png.buffer,
    });
    assert.equal(ok.nextCalled, true);
    assert.equal(ok.req.fileMeta.extension, 'png');
    assert.equal(ok.req.fileMeta.resourceType, 'image');

    // 2. Unsupported video upload returns clean 400 error message (not "Unknown error")
    const vid = await runMiddlewareWithMultipart(middleware, {
      filename: 'clip.mp4',
      mime: 'video/mp4',
      buffer: Buffer.from('00000018ftypmp42'),
    });
    assert.equal(vid.nextCalled, false);
    assert.equal(vid.status, 400);
    assert.match(vid.body.message, /Unsupported file extension/i);

    // 3. Oversized file (>1MB) returns 400 limit message
    const bigPdf = Buffer.concat([Buffer.from('%PDF-1.4\n'), Buffer.alloc(1024 * 1024 + 128, 'A')]);
    const big = await runMiddlewareWithMultipart(middleware, {
      filename: 'huge.pdf',
      mime: 'application/pdf',
      buffer: bigPdf,
    });
    assert.equal(big.nextCalled, false);
    assert.equal(big.status, 400);
    assert.match(big.body.message, /exceeds the allowed limit of 1MB/i);
  } finally {
    if (originalLimit === undefined) {
      delete process.env.MAX_FILE_SIZE_MB;
    } else {
      process.env.MAX_FILE_SIZE_MB = originalLimit;
    }
  }
});
