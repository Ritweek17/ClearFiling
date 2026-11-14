import test, { before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import Document from '../../models/Document.js';
import DocumentCategory from '../../models/DocumentCategory.js';
import AdminUser from '../../models/AdminUser.js';
import { startTestDb, stopTestDb, clearTestDb } from '../helpers/testDb.js';

let testCategory;
let testAdmin;

before(async () => {
  await startTestDb();
});

after(async () => {
  await stopTestDb();
});

beforeEach(async () => {
  await clearTestDb();

  testCategory = await DocumentCategory.create({
    name: 'GST Filings',
    slug: 'gst-filings',
  });

  const hash = await AdminUser.hashPassword('Pass12345!');
  testAdmin = await AdminUser.create({
    name: 'Admin Uploader',
    email: 'uploader@clearfiling.co.in',
    passwordHash: hash,
  });
});

test('Document Model: creates draft document with valid fields and auto-slug', async () => {
  const doc = await Document.create({
    title: 'GSTR-1 Filing Manual 2026',
    description: 'Step-by-step instructions for filing GSTR-1',
    category: testCategory._id,
    uploadedBy: testAdmin._id,
    file: {
      publicId: 'clearfiling/documents/gstr1_manual',
      url: 'https://res.cloudinary.com/test/raw/upload/gstr1.pdf',
      bytes: 204800,
      format: 'pdf',
      originalName: 'gstr1_manual.pdf',
      mimeType: 'application/pdf',
    },
  });

  assert.equal(doc.title, 'GSTR-1 Filing Manual 2026');
  assert.equal(doc.slug, 'gstr-1-filing-manual-2026');
  assert.equal(doc.status, 'draft');
  assert.equal(doc.publishedAt, null);
  assert.equal(doc.viewCount, 0);
  assert.equal(doc.downloadCount, 0);
  assert.equal(doc.file.extension, 'pdf');
  assert.equal(doc.file.resourceType, 'raw'); // Legacy raw URL preserved
});

test('Document Model: stores multi-format metadata (extension, resourceType, mimeType) and rejects unsupported extension', async () => {
  const xlsxDoc = await Document.create({
    title: 'GST Reconciliation Sheet',
    category: testCategory._id,
    uploadedBy: testAdmin._id,
    file: {
      publicId: 'clearfiling/documents/recon.xlsx',
      url: 'https://res.cloudinary.com/test/raw/upload/recon.xlsx',
      bytes: 4096,
      format: 'xlsx',
      extension: 'xlsx',
      originalName: 'recon.xlsx',
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      resourceType: 'raw',
    },
  });

  assert.equal(xlsxDoc.file.extension, 'xlsx');
  assert.equal(xlsxDoc.file.resourceType, 'raw');

  const pngDoc = await Document.create({
    title: 'Signed Stamp Preview',
    category: testCategory._id,
    uploadedBy: testAdmin._id,
    file: {
      publicId: 'clearfiling/documents/stamp',
      url: 'https://res.cloudinary.com/test/image/upload/stamp.png',
      bytes: 2048,
      originalName: 'stamp.png',
    },
  });

  assert.equal(pngDoc.file.extension, 'png');
  assert.equal(pngDoc.file.resourceType, 'image');
  assert.equal(pngDoc.file.mimeType, 'image/png');

  await assert.rejects(
    async () => {
      await Document.create({
        title: 'Unsupported Video',
        category: testCategory._id,
        uploadedBy: testAdmin._id,
        file: {
          publicId: 'vid1',
          url: 'https://res.cloudinary.com/test/video/upload/clip.mp4',
          bytes: 5000,
          extension: 'mp4',
          originalName: 'clip.mp4',
          mimeType: 'video/mp4',
          resourceType: 'raw',
        },
      });
    },
    { name: 'ValidationError' }
  );
});

test('Document Model: automatically sets publishedAt when status is published', async () => {
  const doc = await Document.create({
    title: 'Annual Compliance Checklist',
    category: testCategory._id,
    uploadedBy: testAdmin._id,
    status: 'published',
    file: {
      publicId: 'clearfiling/documents/checklist',
      url: 'https://res.cloudinary.com/test/raw/upload/checklist.pdf',
      bytes: 102400,
      format: 'pdf',
      originalName: 'checklist.pdf',
      mimeType: 'application/pdf',
    },
  });

  assert.equal(doc.status, 'published');
  assert.ok(doc.publishedAt instanceof Date);
});

test('Document Model: rejects invalid status enum', async () => {
  await assert.rejects(
    async () => {
      await Document.create({
        title: 'Invalid Status Doc',
        category: testCategory._id,
        uploadedBy: testAdmin._id,
        status: 'unapproved', // Invalid enum
        file: {
          publicId: 'id',
          url: 'url',
          bytes: 10,
          originalName: 'file.pdf',
        },
      });
    },
    {
      name: 'ValidationError',
    }
  );
});

test('Document Model: enforces unique slug index', async () => {
  await Document.create({
    title: 'Duplicate Slug Doc',
    slug: 'unique-doc-slug',
    category: testCategory._id,
    uploadedBy: testAdmin._id,
    file: {
      publicId: 'id1',
      url: 'url1',
      bytes: 100,
      originalName: 'doc1.pdf',
    },
  });

  await assert.rejects(
    async () => {
      await Document.create({
        title: 'Duplicate Slug Doc 2',
        slug: 'unique-doc-slug',
        category: testCategory._id,
        uploadedBy: testAdmin._id,
        file: {
          publicId: 'id2',
          url: 'url2',
          bytes: 100,
          originalName: 'doc2.pdf',
        },
      });
    },
    (err) => {
      assert.equal(err.code, 11000);
      return true;
    }
  );
});

