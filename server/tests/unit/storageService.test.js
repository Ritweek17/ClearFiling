import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isCloudinaryReady,
  uploadFile,
  deleteFile,
  uploadPDF,
  deletePDF,
  setCustomStorageDriver,
  resetStorageDriver,
} from '../../services/storageService.js';
import { getFormatSpec } from '../../utils/fileFormats.js';

const withEnv = async (overrides, fn) => {
  const prev = {};
  for (const key of Object.keys(overrides)) {
    prev[key] = process.env[key];
    if (overrides[key] === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = overrides[key];
    }
  }
  try {
    return await fn();
  } finally {
    for (const key of Object.keys(overrides)) {
      if (prev[key] === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = prev[key];
      }
    }
  }
};

test('StorageService: isCloudinaryReady returns false for placeholder or pending credentials', async () => {
  await withEnv(
    {
      CLOUDINARY_CLOUD_NAME: 'placeholder_cloud_name',
      CLOUDINARY_API_KEY: 'pending_client_setup',
      CLOUDINARY_API_SECRET: 'pending_client_setup',
    },
    async () => {
      assert.equal(isCloudinaryReady(), false);
    }
  );

  await withEnv(
    {
      CLOUDINARY_CLOUD_NAME: 'pending_client_setup',
      CLOUDINARY_API_KEY: '123456',
      CLOUDINARY_API_SECRET: 'secret',
    },
    async () => {
      assert.equal(isCloudinaryReady(), false);
    }
  );
});

test('StorageService: uploadPDF falls back to mock driver in non-production when unconfigured', async () => {
  await withEnv(
    {
      NODE_ENV: 'test',
      CLOUDINARY_CLOUD_NAME: 'pending_client_setup',
      CLOUDINARY_API_KEY: 'pending_client_setup',
      CLOUDINARY_API_SECRET: 'pending_client_setup',
    },
    async () => {
      const dummyBuffer = Buffer.from('%PDF-1.4 mock content');
      const result = await uploadPDF({
        buffer: dummyBuffer,
        originalName: 'test_document.pdf',
      });

      assert.ok(result.publicId.includes('clearfiling/documents'));
      assert.ok(result.url.startsWith('https://res.cloudinary.com/'));
      assert.ok(result.url.includes('/image/upload/'));
      assert.equal(result.originalName, 'test_document.pdf');
      assert.equal(result.format, 'pdf');
      assert.equal(result.extension, 'pdf');
      assert.equal(result.resourceType, 'image');
      assert.equal(result.mimeType, 'application/pdf');
      assert.equal(result.bytes, dummyBuffer.length);
      assert.equal(result._isMock, true);
    }
  );
});

test('StorageService: routes image/PDF to resourceType "image" and office/text/zip to "raw"', async () => {
  await withEnv(
    {
      NODE_ENV: 'test',
      CLOUDINARY_CLOUD_NAME: 'pending_client_setup',
      CLOUDINARY_API_KEY: 'pending_client_setup',
      CLOUDINARY_API_SECRET: 'pending_client_setup',
    },
    async () => {
      const pdfRes = await uploadFile({
        buffer: Buffer.from('%PDF-1.4 mock'),
        originalName: 'guide.pdf',
        fileMeta: getFormatSpec('pdf'),
      });
      assert.equal(pdfRes.resourceType, 'image');

      const pngRes = await uploadFile({
        buffer: Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
        originalName: 'stamp.png',
        fileMeta: getFormatSpec('png'),
      });
      assert.equal(pngRes.resourceType, 'image');
      assert.equal(pngRes.extension, 'png');
      assert.ok(pngRes.url.includes('/image/upload/'));

      const docxRes = await uploadFile({
        buffer: Buffer.from('PK\x03\x04mock'),
        originalName: 'contract.docx',
        fileMeta: getFormatSpec('docx'),
      });
      assert.equal(docxRes.resourceType, 'raw');
      assert.equal(docxRes.extension, 'docx');
      assert.ok(docxRes.publicId.endsWith('.docx'));
      assert.ok(docxRes.url.includes('/raw/upload/'));
    }
  );
});

test('StorageService: deletePDF returns ok in non-production mock mode and forwards resourceType', async () => {
  await withEnv(
    {
      NODE_ENV: 'test',
      CLOUDINARY_CLOUD_NAME: 'pending_client_setup',
      CLOUDINARY_API_KEY: 'pending_client_setup',
      CLOUDINARY_API_SECRET: 'pending_client_setup',
    },
    async () => {
      const res = await deletePDF('clearfiling/documents/mock_doc_123', 'image');
      assert.equal(res.result, 'ok');
      assert.equal(res.resourceType, 'image');
    }
  );
});

test('StorageService: FAILS CLOSED in production when Cloudinary is unconfigured', async () => {
  resetStorageDriver();
  await withEnv(
    {
      NODE_ENV: 'production',
      CLOUDINARY_CLOUD_NAME: 'pending_client_setup',
      CLOUDINARY_API_KEY: 'pending_client_setup',
      CLOUDINARY_API_SECRET: 'pending_client_setup',
    },
    async () => {
      await assert.rejects(
        async () => {
          await uploadFile({
            buffer: Buffer.from('%PDF-1.4 content'),
            originalName: 'prod.pdf',
            fileMeta: getFormatSpec('pdf'),
          });
        },
        /Production uploads fail closed/i
      );

      await assert.rejects(
        async () => {
          await deleteFile('clearfiling/documents/doc_1', 'image');
        },
        /Production asset deletion fails closed/i
      );
    }
  );
});

test('StorageService: custom driver injection forwards resourceType and resets cleanly', async () => {
  let deletedArgs = null;
  setCustomStorageDriver({
    upload: async ({ extension, resourceType }) => ({
      publicId: `custom-id.${extension}`,
      url: `https://custom.url/${resourceType}/custom-id.${extension}`,
      bytes: 10,
      format: extension,
      extension,
      originalName: `a.${extension}`,
      mimeType: 'application/zip',
      resourceType,
    }),
    delete: async (publicId, resourceType) => {
      deletedArgs = { publicId, resourceType };
      return { result: 'custom_deleted' };
    },
  });

  const res = await uploadFile({
    buffer: Buffer.from('PK\x03\x04'),
    originalName: 'a.zip',
    fileMeta: getFormatSpec('zip'),
  });
  assert.equal(res.publicId, 'custom-id.zip');
  assert.equal(res.resourceType, 'raw');

  const delRes = await deleteFile('custom-id.zip', 'raw');
  assert.equal(delRes.result, 'custom_deleted');
  assert.deepEqual(deletedArgs, { publicId: 'custom-id.zip', resourceType: 'raw' });

  resetStorageDriver();
});
