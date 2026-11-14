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

let server;
let baseUrl;
let superAdminToken;
let editorToken;
let superAdminUser;

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

  const hash = await AdminUser.hashPassword('Pass12345!');

  superAdminUser = await AdminUser.create({
    name: 'Super Admin',
    email: 'super@clearfiling.co.in',
    passwordHash: hash,
    role: 'super_admin',
  });
  superAdminToken = generateToken({ id: superAdminUser._id, role: superAdminUser.role });

  const editorUser = await AdminUser.create({
    name: 'Editor User',
    email: 'editor@clearfiling.co.in',
    passwordHash: hash,
    role: 'editor',
  });
  editorToken = generateToken({ id: editorUser._id, role: editorUser.role });
});

test('Admin Category API: rejects unauthenticated requests', async () => {
  const res = await fetch(`${baseUrl}/api/admin/categories`);
  assert.equal(res.status, 401);
});

test('Admin Category API: RBAC blocks editor from mutating categories', async () => {
  const res = await fetch(`${baseUrl}/api/admin/categories`, {
    method: 'POST',
    headers: {
      Cookie: `${COOKIE_NAME}=${editorToken}`,
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: 'Disallowed Category' }),
  });

  assert.equal(res.status, 403);
});

test('Admin Category API: creates category, generates unique slug, and logs activity', async () => {
  const res = await fetch(`${baseUrl}/api/admin/categories`, {
    method: 'POST',
    headers: {
      Cookie: `${COOKIE_NAME}=${superAdminToken}`,
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'GST Compliance & Filings',
      description: 'Everything about GST returns and audits',
      displayOrder: 1,
    }),
  });

  assert.equal(res.status, 201);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.equal(data.category.name, 'GST Compliance & Filings');
  assert.equal(data.category.slug, 'gst-compliance-filings');
  assert.equal(data.category.displayOrder, 1);

  // Verify activity log was recorded
  const log = await ActivityLog.findOne({ action: 'CATEGORY_CREATED' });
  assert.ok(log);
  assert.equal(log.entityType, 'category');
  assert.equal(String(log.entityId), String(data.category._id));
});

test('Admin Category API: lists categories with accurate documentCount', async () => {
  const cat1 = await DocumentCategory.create({ name: 'Cat One', slug: 'cat-one' });
  const cat2 = await DocumentCategory.create({ name: 'Cat Two', slug: 'cat-two' });

  // Attach 2 docs to cat1
  await Document.create({
    title: 'Doc 1',
    slug: 'doc-1',
    category: cat1._id,
    uploadedBy: superAdminUser._id,
    file: { publicId: 'p1', url: 'u1', bytes: 10, originalName: '1.pdf' },
  });
  await Document.create({
    title: 'Doc 2',
    slug: 'doc-2',
    category: cat1._id,
    uploadedBy: superAdminUser._id,
    file: { publicId: 'p2', url: 'u2', bytes: 10, originalName: '2.pdf' },
  });

  const res = await fetch(`${baseUrl}/api/admin/categories`, {
    headers: { Cookie: `${COOKIE_NAME}=${superAdminToken}` },
  });

  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.equal(data.categories.length, 2);

  const foundCat1 = data.categories.find((c) => c.slug === 'cat-one');
  const foundCat2 = data.categories.find((c) => c.slug === 'cat-two');
  assert.equal(foundCat1.documentCount, 2);
  assert.equal(foundCat2.documentCount, 0);
});

test('Admin Category API: updates category fields and generates slug if name changes', async () => {
  const cat = await DocumentCategory.create({ name: 'Old Title', slug: 'old-title' });

  const res = await fetch(`${baseUrl}/api/admin/categories/${cat._id}`, {
    method: 'PATCH',
    headers: {
      Cookie: `${COOKIE_NAME}=${superAdminToken}`,
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: 'Updated Title', displayOrder: 5 }),
  });

  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.category.name, 'Updated Title');
  assert.equal(data.category.slug, 'updated-title');
  assert.equal(data.category.displayOrder, 5);

  const log = await ActivityLog.findOne({ action: 'CATEGORY_UPDATED' });
  assert.ok(log);
});

test('Admin Category API: PREVENTS deletion if category contains documents', async () => {
  const cat = await DocumentCategory.create({ name: 'Protected Cat', slug: 'protected-cat' });

  await Document.create({
    title: 'Associated Document',
    slug: 'associated-doc',
    category: cat._id,
    uploadedBy: superAdminUser._id,
    file: { publicId: 'pid', url: 'url', bytes: 10, originalName: 'doc.pdf' },
  });

  const res = await fetch(`${baseUrl}/api/admin/categories/${cat._id}`, {
    method: 'DELETE',
    headers: {
      Cookie: `${COOKIE_NAME}=${superAdminToken}`,
      'X-Requested-With': 'XMLHttpRequest',
    },
  });

  assert.equal(res.status, 400);
  const data = await res.json();
  assert.equal(data.success, false);
  assert.match(data.message, /Cannot delete category/i);

  // Category must still exist
  const stillExists = await DocumentCategory.findById(cat._id);
  assert.ok(stillExists);
});

test('Admin Category API: deletes category successfully when it contains 0 documents', async () => {
  const cat = await DocumentCategory.create({ name: 'Empty Cat', slug: 'empty-cat' });

  const res = await fetch(`${baseUrl}/api/admin/categories/${cat._id}`, {
    method: 'DELETE',
    headers: {
      Cookie: `${COOKIE_NAME}=${superAdminToken}`,
      'X-Requested-With': 'XMLHttpRequest',
    },
  });

  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);

  const deleted = await DocumentCategory.findById(cat._id);
  assert.equal(deleted, null);

  const log = await ActivityLog.findOne({ action: 'CATEGORY_DELETED' });
  assert.ok(log);
});

