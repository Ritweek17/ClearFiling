import test, { before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import http from 'http';
import app from '../../app.js';
import AdminUser from '../../models/AdminUser.js';
import DocumentCategory from '../../models/DocumentCategory.js';
import Document from '../../models/Document.js';
import { startTestDb, stopTestDb, clearTestDb } from '../helpers/testDb.js';

let server;
let baseUrl;
let adminUser;
let catTax;
let catLegal;

before(async () => {
  process.env.NODE_ENV = 'test';
  process.env.CLIENT_ORIGIN = 'https://www.clearfiling.co.in';

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
  adminUser = await AdminUser.create({
    name: 'Content Admin',
    email: 'content@clearfiling.co.in',
    passwordHash: hash,
  });

  catTax = await DocumentCategory.create({
    name: 'Tax Compliance',
    slug: 'tax-compliance',
    isActive: true,
  });

  catLegal = await DocumentCategory.create({
    name: 'Legal Notices',
    slug: 'legal-notices',
    isActive: true,
  });

  // 1. Published doc in catTax
  await Document.create({
    title: 'Income Tax Return Guide 2026',
    slug: 'income-tax-return-guide-2026',
    description: 'Guide for filing ITR-1 and ITR-2 online',
    category: catTax._id,
    uploadedBy: adminUser._id,
    status: 'published',
    publishedAt: new Date(),
    file: {
      publicId: 'pid1',
      url: 'https://res.cloudinary.com/test/raw/upload/itr_guide.pdf',
      bytes: 1024,
      originalName: 'itr_guide.pdf',
    },
  });

  // 2. Draft doc in catTax (Must NOT be exposed)
  await Document.create({
    title: 'Internal Audit Checklist Draft',
    slug: 'internal-audit-checklist-draft',
    description: 'Work in progress checklist',
    category: catTax._id,
    uploadedBy: adminUser._id,
    status: 'draft',
    file: {
      publicId: 'pid2',
      url: 'https://res.cloudinary.com/test/raw/upload/draft.pdf',
      bytes: 2048,
      originalName: 'draft.pdf',
    },
  });

  // 3. Archived doc in catLegal (Must NOT be exposed)
  await Document.create({
    title: 'Outdated Notice Template 2022',
    slug: 'outdated-notice-template-2022',
    description: 'Archived notice template',
    category: catLegal._id,
    uploadedBy: adminUser._id,
    status: 'archived',
    file: {
      publicId: 'pid3',
      url: 'https://res.cloudinary.com/test/raw/upload/archived.pdf',
      bytes: 512,
      originalName: 'archived.pdf',
    },
  });

  // 4. Published doc in catLegal
  await Document.create({
    title: 'Trademark Registration FAQ',
    slug: 'trademark-registration-faq',
    description: 'Frequently asked questions on trademark protection',
    category: catLegal._id,
    uploadedBy: adminUser._id,
    status: 'published',
    publishedAt: new Date(),
    file: {
      publicId: 'pid4',
      url: 'https://res.cloudinary.com/test/raw/upload/trademark_faq.pdf',
      bytes: 4096,
      originalName: 'trademark_faq.pdf',
    },
  });
});

test('Public Document API: GET /api/public/documents returns ONLY published documents', async () => {
  const res = await fetch(`${baseUrl}/api/public/documents`);
  assert.equal(res.status, 200);

  const data = await res.json();
  assert.equal(data.success, true);
  assert.equal(data.documents.length, 2, 'Only the 2 published documents should be returned');

  // Verify none of the draft or archived documents are present
  const titles = data.documents.map((d) => d.title);
  assert.ok(titles.includes('Income Tax Return Guide 2026'));
  assert.ok(titles.includes('Trademark Registration FAQ'));
  assert.ok(!titles.includes('Internal Audit Checklist Draft'));
  assert.ok(!titles.includes('Outdated Notice Template 2022'));

  // Verify internal administrative properties (uploadedBy, publicId) are not leaked
  for (const doc of data.documents) {
    assert.equal(doc.uploadedBy, undefined);
    assert.equal(doc.file.publicId, undefined);
  }
});

test('Public Document API: filters published documents by category slug', async () => {
  const res = await fetch(`${baseUrl}/api/public/documents?category=tax-compliance`);
  assert.equal(res.status, 200);

  const data = await res.json();
  assert.equal(data.documents.length, 1);
  assert.equal(data.documents[0].title, 'Income Tax Return Guide 2026');
});

test('Public Document API: searches published documents by query term', async () => {
  const res = await fetch(`${baseUrl}/api/public/documents?q=trademark`);
  assert.equal(res.status, 200);

  const data = await res.json();
  assert.equal(data.documents.length, 1);
  assert.equal(data.documents[0].title, 'Trademark Registration FAQ');
});

test('Public Document API: GET /api/public/documents/:slug retrieves detail and increments viewCount', async () => {
  const res = await fetch(`${baseUrl}/api/public/documents/income-tax-return-guide-2026`);
  assert.equal(res.status, 200);

  const data = await res.json();
  assert.equal(data.success, true);
  assert.equal(data.document.title, 'Income Tax Return Guide 2026');
  assert.equal(data.document.viewCount, 1, 'viewCount must be incremented by 1');

  // Second view
  const res2 = await fetch(`${baseUrl}/api/public/documents/income-tax-return-guide-2026`);
  const data2 = await res2.json();
  assert.equal(data2.document.viewCount, 2);
});

test('Public Document API: GET /api/public/documents/:slug returns 404 for draft or archived documents', async () => {
  // Attempt to access draft
  const resDraft = await fetch(`${baseUrl}/api/public/documents/internal-audit-checklist-draft`);
  assert.equal(resDraft.status, 404);

  // Attempt to access archived
  const resArchived = await fetch(`${baseUrl}/api/public/documents/outdated-notice-template-2022`);
  assert.equal(resArchived.status, 404);
});

test('Public Document API: GET /api/public/documents/:slug/download increments downloadCount and redirects', async () => {
  const res = await fetch(`${baseUrl}/api/public/documents/trademark-registration-faq/download`, {
    redirect: 'manual', // Do not follow redirect
  });

  assert.equal(res.status, 302);
  const location = res.headers.get('location');
  assert.equal(location, 'https://res.cloudinary.com/test/raw/upload/trademark_faq.pdf');

  // Verify DB downloadCount incremented
  const doc = await Document.findOne({ slug: 'trademark-registration-faq' });
  assert.equal(doc.downloadCount, 1);
});

test('Public Category API: GET /api/public/categories returns active categories', async () => {
  // Add an inactive category
  await DocumentCategory.create({
    name: 'Inactive Old Category',
    slug: 'inactive-old',
    isActive: false,
  });

  const res = await fetch(`${baseUrl}/api/public/categories`);
  assert.equal(res.status, 200);

  const data = await res.json();
  assert.equal(data.categories.length, 2);
  const slugs = data.categories.map((c) => c.slug);
  assert.ok(!slugs.includes('inactive-old'));
});

test('Public Document API: exposes previewSupported/deliveryMode per format and applies fl_attachment to image-backed downloads', async () => {
  await Document.create({
    title: 'GST PDF Handbook',
    slug: 'gst-pdf-handbook',
    category: catTax._id,
    uploadedBy: adminUser._id,
    status: 'published',
    publishedAt: new Date(),
    file: {
      publicId: 'clearfiling/documents/handbook',
      url: 'https://res.cloudinary.com/test/image/upload/v1/clearfiling/documents/handbook.pdf',
      bytes: 4096,
      format: 'pdf',
      extension: 'pdf',
      originalName: 'handbook.pdf',
      mimeType: 'application/pdf',
      resourceType: 'image',
    },
  });

  await Document.create({
    title: 'Compliance ZIP Pack',
    slug: 'compliance-zip-pack',
    category: catTax._id,
    uploadedBy: adminUser._id,
    status: 'published',
    publishedAt: new Date(),
    file: {
      publicId: 'clearfiling/documents/pack.zip',
      url: 'https://res.cloudinary.com/test/raw/upload/v1/clearfiling/documents/pack.zip',
      bytes: 8192,
      format: 'zip',
      extension: 'zip',
      originalName: 'pack.zip',
      mimeType: 'application/zip',
      resourceType: 'raw',
    },
  });

  const pdfRes = await fetch(`${baseUrl}/api/public/documents/gst-pdf-handbook`);
  assert.equal(pdfRes.status, 200);
  const pdfData = await pdfRes.json();
  assert.equal(pdfData.document.file.extension, 'pdf');
  assert.equal(pdfData.document.file.previewSupported, true);
  assert.equal(pdfData.document.file.deliveryMode, 'inline');
  assert.equal(pdfData.document.file.publicId, undefined);

  const zipRes = await fetch(`${baseUrl}/api/public/documents/compliance-zip-pack`);
  assert.equal(zipRes.status, 200);
  const zipData = await zipRes.json();
  assert.equal(zipData.document.file.extension, 'zip');
  assert.equal(zipData.document.file.previewSupported, false);
  assert.equal(zipData.document.file.deliveryMode, 'download');

  const pdfDownloadRes = await fetch(`${baseUrl}/api/public/documents/gst-pdf-handbook/download`, {
    redirect: 'manual',
  });
  assert.equal(pdfDownloadRes.status, 302);
  assert.equal(
    pdfDownloadRes.headers.get('location'),
    'https://res.cloudinary.com/test/image/upload/fl_attachment/v1/clearfiling/documents/handbook.pdf'
  );

  const zipDownloadRes = await fetch(`${baseUrl}/api/public/documents/compliance-zip-pack/download`, {
    redirect: 'manual',
  });
  assert.equal(zipDownloadRes.status, 302);
  assert.equal(
    zipDownloadRes.headers.get('location'),
    'https://res.cloudinary.com/test/raw/upload/v1/clearfiling/documents/pack.zip'
  );
});

test('Phase A Security: Public API hides published documents in inactive categories and hardens search q', async () => {
  const inactiveCategory = await DocumentCategory.create({
    name: 'Deprecated Rulings',
    slug: 'deprecated-rulings',
    isActive: false,
  });

  await Document.create([
    {
      title: 'Visible Active [Guide]',
      slug: 'visible-active-guide',
      category: catTax._id,
      status: 'published',
      publishedAt: new Date(),
      uploadedBy: adminUser._id,
      file: {
        url: 'https://res.cloudinary.com/test/image/upload/v1/clearfiling/documents/active.pdf',
        publicId: 'clearfiling/documents/active.pdf',
        originalName: 'active.pdf',
        bytes: 1024,
        extension: 'pdf',
        mimeType: 'application/pdf',
        resourceType: 'image',
      },
    },
    {
      title: 'Hidden Inactive Category Doc',
      slug: 'hidden-inactive-category-doc',
      category: inactiveCategory._id,
      status: 'published',
      publishedAt: new Date(),
      uploadedBy: adminUser._id,
      file: {
        url: 'https://res.cloudinary.com/test/image/upload/v1/clearfiling/documents/hidden.pdf',
        publicId: 'clearfiling/documents/hidden.pdf',
        originalName: 'hidden.pdf',
        bytes: 1024,
        extension: 'pdf',
        mimeType: 'application/pdf',
        resourceType: 'image',
      },
    },
  ]);

  // Listing excludes inactive-category document
  const listRes = await fetch(`${baseUrl}/api/public/documents`);
  assert.equal(listRes.status, 200);
  const listData = await listRes.json();
  assert.ok(listData.documents.some((d) => d.slug === 'visible-active-guide'));
  assert.equal(
    listData.documents.some((d) => d.slug === 'hidden-inactive-category-doc'),
    false
  );

  // Filtering directly by inactive category returns empty list
  const catFilterRes = await fetch(
    `${baseUrl}/api/public/documents?category=${inactiveCategory._id}`
  );
  assert.equal(catFilterRes.status, 200);
  const catFilterData = await catFilterRes.json();
  assert.equal(catFilterData.documents.length, 0);

  // Direct slug & download return 404 for inactive category
  const detailRes = await fetch(`${baseUrl}/api/public/documents/hidden-inactive-category-doc`);
  assert.equal(detailRes.status, 404);

  const dlRes = await fetch(`${baseUrl}/api/public/documents/hidden-inactive-category-doc/download`, {
    redirect: 'manual',
  });
  assert.equal(dlRes.status, 404);

  // Regex metacharacters match literally without 500 error
  const metaRes = await fetch(`${baseUrl}/api/public/documents?q=${encodeURIComponent('[Guide]')}`);
  assert.equal(metaRes.status, 200);
  const metaData = await metaRes.json();
  assert.equal(metaData.documents.length, 1);

  // Query >100 characters returns 400
  const longRes = await fetch(`${baseUrl}/api/public/documents?q=${'x'.repeat(101)}`);
  assert.equal(longRes.status, 400);
});

test('Phase A Security: Public browse and download endpoints enforce 429 rate limiting', async () => {
  await Document.create({
    title: 'Rate Limit Check PDF',
    slug: 'rate-limit-check-pdf',
    category: catTax._id,
    status: 'published',
    publishedAt: new Date(),
    uploadedBy: adminUser._id,
    file: {
      url: 'https://res.cloudinary.com/test/image/upload/v1/clearfiling/documents/rl.pdf',
      publicId: 'clearfiling/documents/rl.pdf',
      originalName: 'rl.pdf',
      bytes: 1024,
      extension: 'pdf',
      mimeType: 'application/pdf',
      resourceType: 'image',
    },
  });

  let browseStatus = 200;
  for (let i = 0; i < 6; i++) {
    const res = await fetch(`${baseUrl}/api/public/documents`, {
      headers: { 'x-test-rate-limit': 'true' },
    });
    browseStatus = res.status;
  }
  assert.equal(browseStatus, 429);

  let downloadStatus = 302;
  for (let i = 0; i < 6; i++) {
    const res = await fetch(`${baseUrl}/api/public/documents/rate-limit-check-pdf/download`, {
      redirect: 'manual',
      headers: { 'x-test-rate-limit': 'true' },
    });
    downloadStatus = res.status;
  }
  assert.equal(downloadStatus, 429);
});

