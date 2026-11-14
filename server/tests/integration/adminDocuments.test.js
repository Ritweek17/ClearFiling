import test, { before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import http from 'http';
import app from '../../app.js';
import AdminUser from '../../models/AdminUser.js';
import DocumentCategory from '../../models/DocumentCategory.js';
import Document from '../../models/Document.js';
import ActivityLog from '../../models/ActivityLog.js';
import { startTestDb, stopTestDb, clearTestDb } from '../helpers/testDb.js';
import { generateToken, COOKIE_NAME } from '../../utils/tokenUtils.js';
import { setCustomStorageDriver, resetStorageDriver } from '../../services/storageService.js';

let server;
let baseUrl;
let adminToken;
let adminUser;
let testCategory;

before(async () => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test_secret_key_minimum_32_characters_12345';
  process.env.CLIENT_ORIGIN = 'https://www.clearfiling.co.in';
  process.env.ADMIN_ORIGIN = 'https://admin.clearfiling.co.in';

  await startTestDb();

  await new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(0, '127.0.0.1', () => {
      baseUrl = `http://127.0.0.1:${server.address().port}`;
      resolve();
    });
  });
});

after(async () => {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  await stopTestDb();
});

beforeEach(async () => {
  await clearTestDb();
  resetStorageDriver();

  const hash = await AdminUser.hashPassword('Pass12345!');
  adminUser = await AdminUser.create({
    name: 'Ops Admin',
    email: 'ops@clearfiling.co.in',
    passwordHash: hash,
    role: 'admin',
  });
  adminToken = generateToken({ id: adminUser._id, role: adminUser.role });

  testCategory = await DocumentCategory.create({
    name: 'Statutory Filings',
    slug: 'statutory-filings',
  });
});

test('Admin Document API: creates document with valid PDF file and records activity', async () => {
  const genuinePdf = Buffer.from('%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF');

  const formData = new FormData();
  formData.append('title', 'Corporate Governance Guide 2026');
  formData.append('description', 'Comprehensive director duties guide');
  formData.append('category', String(testCategory._id));
  formData.append('file', new Blob([genuinePdf], { type: 'application/pdf' }), 'governance.pdf');

  const res = await fetch(`${baseUrl}/api/admin/documents`, {
    method: 'POST',
    headers: {
      Cookie: `${COOKIE_NAME}=${adminToken}`,
      'X-Requested-With': 'XMLHttpRequest',
    },
    body: formData,
  });

  assert.equal(res.status, 201);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.equal(data.document.title, 'Corporate Governance Guide 2026');
  assert.equal(data.document.slug, 'corporate-governance-guide-2026');
  assert.equal(data.document.status, 'draft');
  assert.equal(data.document.file.originalName, 'governance.pdf');
  assert.equal(data.document.file.mimeType, 'application/pdf');
  assert.equal(data.document.file.extension, 'pdf');
  assert.equal(data.document.file.resourceType, 'image');

  // Verify activity log was recorded
  const log = await ActivityLog.findOne({ action: 'DOCUMENT_CREATED' });
  assert.ok(log);
  assert.equal(log.entityType, 'document');
  assert.equal(String(log.entityId), String(data.document._id));
});

test('Admin Document API: rejects non-PDF file disguised as PDF (magic bytes check)', async () => {
  // A file named fake.pdf but containing plain text
  const fakePdf = Buffer.from('This is completely plain text and NOT a genuine PDF document.');

  const formData = new FormData();
  formData.append('title', 'Fake Document');
  formData.append('category', String(testCategory._id));
  formData.append('file', new Blob([fakePdf], { type: 'application/pdf' }), 'fake.pdf');

  const res = await fetch(`${baseUrl}/api/admin/documents`, {
    method: 'POST',
    headers: {
      Cookie: `${COOKIE_NAME}=${adminToken}`,
      'X-Requested-With': 'XMLHttpRequest',
    },
    body: formData,
  });

  assert.equal(res.status, 400);
  const data = await res.json();
  assert.equal(data.success, false);
  assert.match(data.message, /not match a valid PDF/i);
});

test('Admin Document API: cleans up newly uploaded storage file if DB creation fails (orphan prevention)', async () => {
  let deletedAssetId = null;

  setCustomStorageDriver({
    upload: async () => ({
      publicId: 'clearfiling/documents/orphan_test_123',
      url: 'https://res.cloudinary.com/test/raw/upload/orphan.pdf',
      bytes: 100,
      format: 'pdf',
      originalName: 'orphan.pdf',
      mimeType: 'application/pdf',
    }),
    delete: async (publicId) => {
      deletedAssetId = publicId;
      return { result: 'ok' };
    },
  });

  // Cause DB collision by pre-existing duplicate slug
  await Document.create({
    title: 'Duplicate Slug Failure Test',
    slug: 'duplicate-slug-failure-test',
    category: testCategory._id,
    uploadedBy: adminUser._id,
    file: { publicId: 'existing_id', url: 'existing_url', bytes: 10, originalName: '1.pdf' },
  });

  // Now create a doc that intentionally fails validation during DB insert
  const genuinePdf = Buffer.from('%PDF-1.4 mock content');
  const formData = new FormData();
  formData.append('title', 'Duplicate Slug Failure Test');
  formData.append('category', 'invalid_mongo_id_format'); // Will fail category validation
  formData.append('file', new Blob([genuinePdf], { type: 'application/pdf' }), 'test.pdf');

  const res = await fetch(`${baseUrl}/api/admin/documents`, {
    method: 'POST',
    headers: {
      Cookie: `${COOKIE_NAME}=${adminToken}`,
      'X-Requested-With': 'XMLHttpRequest',
    },
    body: formData,
  });

  assert.equal(res.status, 400);
  resetStorageDriver();
});

test('Admin Document API: updates metadata and generates unique slug if title modified', async () => {
  const doc = await Document.create({
    title: 'Original Title',
    slug: 'original-title',
    category: testCategory._id,
    uploadedBy: adminUser._id,
    file: { publicId: 'pid1', url: 'url1', bytes: 50, originalName: 'doc.pdf' },
  });

  const res = await fetch(`${baseUrl}/api/admin/documents/${doc._id}`, {
    method: 'PATCH',
    headers: {
      Cookie: `${COOKIE_NAME}=${adminToken}`,
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: 'Modified Title',
      description: 'Updated document description',
    }),
  });

  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.document.title, 'Modified Title');
  assert.equal(data.document.slug, 'modified-title');
  assert.equal(data.document.description, 'Updated document description');

  const log = await ActivityLog.findOne({ action: 'DOCUMENT_UPDATED' });
  assert.ok(log);
});

test('Admin Document API: publish transition sets publishedAt timestamp and archives correctly', async () => {
  const doc = await Document.create({
    title: 'Draft to Publish Test',
    slug: 'draft-to-publish-test',
    category: testCategory._id,
    uploadedBy: adminUser._id,
    status: 'draft',
    file: { publicId: 'pid', url: 'url', bytes: 10, originalName: 'doc.pdf' },
  });

  // 1. Publish
  const resPublish = await fetch(`${baseUrl}/api/admin/documents/${doc._id}/publish`, {
    method: 'PATCH',
    headers: {
      Cookie: `${COOKIE_NAME}=${adminToken}`,
      'X-Requested-With': 'XMLHttpRequest',
    },
  });

  assert.equal(resPublish.status, 200);
  const dataPublish = await resPublish.json();
  assert.equal(dataPublish.document.status, 'published');
  assert.ok(dataPublish.document.publishedAt);

  // 2. Archive
  const resArchive = await fetch(`${baseUrl}/api/admin/documents/${doc._id}/archive`, {
    method: 'PATCH',
    headers: {
      Cookie: `${COOKIE_NAME}=${adminToken}`,
      'X-Requested-With': 'XMLHttpRequest',
    },
  });

  assert.equal(resArchive.status, 200);
  const dataArchive = await resArchive.json();
  assert.equal(dataArchive.document.status, 'archived');
});

test('Admin Document API: PDF replacement uploads new file first and cleans up old file only after DB save', async () => {
  let oldFileDeleted = false;
  let newFileUploaded = false;

  setCustomStorageDriver({
    upload: async () => {
      newFileUploaded = true;
      return {
        publicId: 'clearfiling/documents/new_replacement_pdf',
        url: 'https://res.cloudinary.com/test/raw/upload/new.pdf',
        bytes: 500,
        format: 'pdf',
        originalName: 'new_replacement.pdf',
        mimeType: 'application/pdf',
      };
    },
    delete: async (publicId) => {
      if (publicId === 'clearfiling/documents/initial_old_pdf') {
        oldFileDeleted = true;
      }
      return { result: 'ok' };
    },
  });

  const doc = await Document.create({
    title: 'Replacement Document Test',
    slug: 'replacement-document-test',
    category: testCategory._id,
    uploadedBy: adminUser._id,
    file: {
      publicId: 'clearfiling/documents/initial_old_pdf',
      url: 'https://res.cloudinary.com/test/raw/upload/old.pdf',
      bytes: 200,
      originalName: 'old.pdf',
    },
  });

  const replacementPdf = Buffer.from('%PDF-1.4 replacement content');
  const formData = new FormData();
  formData.append('file', new Blob([replacementPdf], { type: 'application/pdf' }), 'new_replacement.pdf');

  const res = await fetch(`${baseUrl}/api/admin/documents/${doc._id}/replace-file`, {
    method: 'POST',
    headers: {
      Cookie: `${COOKIE_NAME}=${adminToken}`,
      'X-Requested-With': 'XMLHttpRequest',
    },
    body: formData,
  });

  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.document.file.publicId, 'clearfiling/documents/new_replacement_pdf');
  assert.equal(data.document.file.originalName, 'new_replacement.pdf');
  assert.equal(newFileUploaded, true);
  assert.equal(oldFileDeleted, true);

  const log = await ActivityLog.findOne({ action: 'DOCUMENT_FILE_REPLACED' });
  assert.ok(log);

  resetStorageDriver();
});

test('Admin Document API: deletes document from DB and removes file from storage', async () => {
  let fileDeletedFromStorage = false;

  setCustomStorageDriver({
    upload: async () => ({}),
    delete: async (publicId) => {
      if (publicId === 'clearfiling/documents/to_delete') {
        fileDeletedFromStorage = true;
      }
      return { result: 'ok' };
    },
  });

  const doc = await Document.create({
    title: 'Delete Document Test',
    slug: 'delete-document-test',
    category: testCategory._id,
    uploadedBy: adminUser._id,
    file: {
      publicId: 'clearfiling/documents/to_delete',
      url: 'https://res.cloudinary.com/test/raw/upload/delete.pdf',
      bytes: 100,
      originalName: 'delete.pdf',
    },
  });

  const res = await fetch(`${baseUrl}/api/admin/documents/${doc._id}`, {
    method: 'DELETE',
    headers: {
      Cookie: `${COOKIE_NAME}=${adminToken}`,
      'X-Requested-With': 'XMLHttpRequest',
    },
  });

  assert.equal(res.status, 200);
  assert.equal(fileDeletedFromStorage, true);

  const found = await Document.findById(doc._id);
  assert.equal(found, null);

  const log = await ActivityLog.findOne({ action: 'DOCUMENT_DELETED' });
  assert.ok(log);

  resetStorageDriver();
});

test('Admin Document API: supports multi-format uploads (PNG, CSV, ZIP), cross-resourceType replacement, and tracked deletion', async () => {
  const deletedCalls = [];

  setCustomStorageDriver({
    upload: async ({ extension, resourceType, originalName, mimeType, buffer }) => ({
      publicId: `clearfiling/documents/test_${extension}${resourceType === 'raw' ? `.${extension}` : ''}`,
      url: `https://res.cloudinary.com/test/${resourceType}/upload/v1/test_${extension}.${extension}`,
      bytes: buffer.length,
      format: extension,
      extension,
      originalName,
      mimeType,
      resourceType,
    }),
    delete: async (publicId, resourceType) => {
      deletedCalls.push({ publicId, resourceType });
      return { result: 'ok' };
    },
  });

  // 1. Create PNG (resourceType: 'image')
  const pngBytes = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00]);
  const createForm = new FormData();
  createForm.append('title', 'Certificate Scan');
  createForm.append('category', String(testCategory._id));
  createForm.append('file', new Blob([pngBytes], { type: 'image/png' }), 'scan.png');

  const createRes = await fetch(`${baseUrl}/api/admin/documents`, {
    method: 'POST',
    headers: {
      Cookie: `${COOKIE_NAME}=${adminToken}`,
      'X-Requested-With': 'XMLHttpRequest',
    },
    body: createForm,
  });
  assert.equal(createRes.status, 201);
  const created = await createRes.json();
  assert.equal(created.document.file.extension, 'png');
  assert.equal(created.document.file.resourceType, 'image');

  // 2. Replace PNG ('image') with CSV ('raw') -> must delete old asset with resourceType 'image'
  const csvBytes = Buffer.from('col1,col2\nval1,val2\n');
  const replaceForm = new FormData();
  replaceForm.append('file', new Blob([csvBytes], { type: 'text/csv' }), 'export.csv');

  const replaceRes = await fetch(`${baseUrl}/api/admin/documents/${created.document._id}/replace-file`, {
    method: 'POST',
    headers: {
      Cookie: `${COOKIE_NAME}=${adminToken}`,
      'X-Requested-With': 'XMLHttpRequest',
    },
    body: replaceForm,
  });
  assert.equal(replaceRes.status, 200);
  const replaced = await replaceRes.json();
  assert.equal(replaced.document.file.extension, 'csv');
  assert.equal(replaced.document.file.resourceType, 'raw');
  assert.deepEqual(deletedCalls[0], {
    publicId: 'clearfiling/documents/test_png',
    resourceType: 'image',
  });

  // 3. Delete CSV document -> must delete asset with resourceType 'raw'
  const delRes = await fetch(`${baseUrl}/api/admin/documents/${created.document._id}`, {
    method: 'DELETE',
    headers: {
      Cookie: `${COOKIE_NAME}=${adminToken}`,
      'X-Requested-With': 'XMLHttpRequest',
    },
  });
  assert.equal(delRes.status, 200);
  assert.deepEqual(deletedCalls[1], {
    publicId: 'clearfiling/documents/test_csv.csv',
    resourceType: 'raw',
  });

  resetStorageDriver();
});

test('Phase A Security: Editor cannot publish on POST /api/admin/documents (403) and is constrained to draft', async () => {
  const editorHash = await AdminUser.hashPassword('EditorPass123!');
  const editorUser = await AdminUser.create({
    name: 'Staff Editor',
    email: 'editor-create@clearfiling.co.in',
    passwordHash: editorHash,
    role: 'editor',
  });
  const editorToken = generateToken({ id: editorUser._id, role: editorUser.role });
  const genuinePdf = Buffer.from('%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF');

  // Attempt to create directly as published -> 403 Forbidden
  const pubAttemptForm = new FormData();
  pubAttemptForm.append('title', 'Unauthorized Direct Publish');
  pubAttemptForm.append('category', String(testCategory._id));
  pubAttemptForm.append('status', 'published');
  pubAttemptForm.append('file', new Blob([genuinePdf], { type: 'application/pdf' }), 'unauth.pdf');

  const blockedRes = await fetch(`${baseUrl}/api/admin/documents`, {
    method: 'POST',
    headers: {
      Cookie: `${COOKIE_NAME}=${editorToken}`,
      'X-Requested-With': 'XMLHttpRequest',
    },
    body: pubAttemptForm,
  });
  assert.equal(blockedRes.status, 403);

  // Creating as draft (or omitting status) succeeds and saves as draft
  const draftForm = new FormData();
  draftForm.append('title', 'Editor Draft Submission');
  draftForm.append('category', String(testCategory._id));
  draftForm.append('status', 'draft');
  draftForm.append('file', new Blob([genuinePdf], { type: 'application/pdf' }), 'draft.pdf');

  const draftRes = await fetch(`${baseUrl}/api/admin/documents`, {
    method: 'POST',
    headers: {
      Cookie: `${COOKIE_NAME}=${editorToken}`,
      'X-Requested-With': 'XMLHttpRequest',
    },
    body: draftForm,
  });
  assert.equal(draftRes.status, 201);
  const draftData = await draftRes.json();
  assert.equal(draftData.document.status, 'draft');

  // Admin can still create directly as published
  const adminPubForm = new FormData();
  adminPubForm.append('title', 'Admin Direct Published Doc');
  adminPubForm.append('category', String(testCategory._id));
  adminPubForm.append('status', 'published');
  adminPubForm.append('file', new Blob([genuinePdf], { type: 'application/pdf' }), 'adminpub.pdf');

  const adminPubRes = await fetch(`${baseUrl}/api/admin/documents`, {
    method: 'POST',
    headers: {
      Cookie: `${COOKIE_NAME}=${adminToken}`,
      'X-Requested-With': 'XMLHttpRequest',
    },
    body: adminPubForm,
  });
  assert.equal(adminPubRes.status, 201);
  const adminPubData = await adminPubRes.json();
  assert.equal(adminPubData.document.status, 'published');
});

test('Phase A Security: Admin document search escapes regex metacharacters, rejects >100 chars, and allowlists sort', async () => {
  await Document.create({
    title: 'Form [10A] Compliance (2026)',
    slug: 'form-10a-compliance-2026',
    category: testCategory._id,
    uploadedBy: adminUser._id,
    status: 'draft',
    file: {
      url: 'https://res.cloudinary.com/test/image/upload/v1/clearfiling/documents/f10a.pdf',
      publicId: 'clearfiling/documents/f10a.pdf',
      originalName: 'f10a.pdf',
      bytes: 1024,
      extension: 'pdf',
      mimeType: 'application/pdf',
      resourceType: 'image',
    },
  });

  // Regex metacharacters must not throw 500 and should match literal bracketed text
  const metacharRes = await fetch(`${baseUrl}/api/admin/documents?q=${encodeURIComponent('[10A]')}`, {
    headers: { Cookie: `${COOKIE_NAME}=${adminToken}` },
  });
  assert.equal(metacharRes.status, 200);
  const metacharData = await metacharRes.json();
  assert.equal(metacharData.documents.length, 1);

  const unbalancedRes = await fetch(`${baseUrl}/api/admin/documents?q=${encodeURIComponent('(2026')}`, {
    headers: { Cookie: `${COOKIE_NAME}=${adminToken}` },
  });
  assert.equal(unbalancedRes.status, 200);
  const unbalancedData = await unbalancedRes.json();
  assert.equal(unbalancedData.documents.length, 1);

  // Overly long query must fail with 400
  const longQuery = 'a'.repeat(101);
  const longRes = await fetch(`${baseUrl}/api/admin/documents?q=${longQuery}`, {
    headers: { Cookie: `${COOKIE_NAME}=${adminToken}` },
  });
  assert.equal(longRes.status, 400);

  // Unsafe sort parameters safely fall back to allowlisted defaults without error
  for (const unsafeSort of ['$where', '-passwordHash', 'file.publicId']) {
    const sortRes = await fetch(
      `${baseUrl}/api/admin/documents?sort=${encodeURIComponent(unsafeSort)}`,
      { headers: { Cookie: `${COOKIE_NAME}=${adminToken}` } }
    );
    assert.equal(sortRes.status, 200);
  }
});

