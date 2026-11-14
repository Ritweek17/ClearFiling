import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  isSafeDocumentUrl,
  sanitizeDocumentUrl,
  getDocumentExtension,
  isBrowserPreviewSupported,
  formatDocumentSize,
  formatDocumentDate,
  getDocumentActionBehavior,
} from '../src/utils/documentFileUtils.js';
import {
  resolvePublicApiBaseUrl,
  normalizePublicApiError,
  fetchPublicCategories,
  fetchPublicDocuments,
  fetchPublicDocumentBySlug,
  getPublicDocumentDownloadEndpoint,
  downloadPublicDocument,
} from '../src/services/publicApi.js';
import {
  createDocumentationController,
  getDocumentationEmptyReason,
  getDocumentKey,
} from '../src/hooks/documentationController.js';

const API_BASE = 'https://api.clearfiling.co.in';

const makeApiDoc = (overrides = {}) => ({
  _id: overrides._id || 'doc-1',
  title: overrides.title || 'GST Registration Checklist',
  slug: overrides.slug || 'gst-registration-checklist',
  description: overrides.description || 'Complete checklist for GST filing.',
  category: overrides.category || { _id: 'cat-1', name: 'Tax & GST', slug: 'tax-gst' },
  file: {
    originalName: 'gst-checklist.pdf',
    bytes: 204800,
    format: 'pdf',
    extension: 'pdf',
    mimeType: 'application/pdf',
    resourceType: 'image',
    url: 'https://res.cloudinary.com/demo/image/upload/v1/clearfiling/gst-checklist.pdf',
    previewSupported: true,
    deliveryMode: 'inline',
    ...(overrides.file || {}),
  },
  publishedAt: overrides.publishedAt || '2026-11-10T10:00:00.000Z',
  viewCount: overrides.viewCount ?? 12,
  downloadCount: overrides.downloadCount ?? 5,
});

describe('documentFileUtils — multi-format behavior & URL security', () => {
  it('supports all 5 browser-previewable formats with backend download endpoint', () => {
    const previewFormats = ['pdf', 'jpg', 'jpeg', 'png', 'webp'];
    for (const ext of previewFormats) {
      const doc = makeApiDoc({
        slug: `sample-${ext}`,
        file: {
          originalName: `sample.${ext}`,
          extension: ext,
          format: ext,
          resourceType: 'image',
          url: `https://res.cloudinary.com/demo/image/upload/v1/sample.${ext}`,
          previewSupported: true,
        },
      });
      const behavior = getDocumentActionBehavior(doc, {
        apiBaseUrl: API_BASE,
        isProduction: true,
      });
      assert.equal(behavior.extension, ext);
      assert.equal(behavior.badgeLabel, ext.toUpperCase());
      assert.equal(behavior.previewSupported, true);
      assert.equal(behavior.viewUrl, doc.file.url);
      assert.equal(
        behavior.downloadUrl,
        `${API_BASE}/api/public/documents/sample-${ext}/download`
      );
    }
  });

  it('keeps all 9 non-previewable formats download-only via backend download endpoint', () => {
    const downloadOnlyFormats = ['doc', 'docx', 'txt', 'xls', 'xlsx', 'csv', 'ppt', 'pptx', 'zip'];
    for (const ext of downloadOnlyFormats) {
      const doc = makeApiDoc({
        slug: `archive-${ext}`,
        file: {
          originalName: `archive.${ext}`,
          extension: ext,
          format: ext,
          resourceType: 'raw',
          url: `https://res.cloudinary.com/demo/raw/upload/v1/archive.${ext}`,
          previewSupported: false,
          deliveryMode: 'attachment',
        },
      });
      const behavior = getDocumentActionBehavior(doc, {
        apiBaseUrl: API_BASE,
        isProduction: true,
      });
      assert.equal(behavior.extension, ext);
      assert.equal(behavior.badgeLabel, ext.toUpperCase());
      assert.equal(behavior.previewSupported, false);
      assert.equal(behavior.viewUrl, null);
      assert.equal(
        behavior.downloadUrl,
        `${API_BASE}/api/public/documents/archive-${ext}/download`
      );
    }
  });

  it('rejects XSS, protocol-relative, and insecure http URLs in production', () => {
    assert.equal(isSafeDocumentUrl('javascript:alert(1)'), false);
    assert.equal(isSafeDocumentUrl('data:text/html,<script>alert(1)</script>'), false);
    assert.equal(isSafeDocumentUrl('//evil.example.com/payload.pdf'), false);
    assert.equal(isSafeDocumentUrl('http://res.cloudinary.com/demo/a.pdf', { isProduction: true }), false);
    assert.equal(isSafeDocumentUrl('http://localhost:5001/api/public/documents/a/download', { isProduction: true }), false);
    assert.equal(isSafeDocumentUrl('http://localhost:5001/api/public/documents/a/download', { isProduction: false }), true);
    assert.equal(sanitizeDocumentUrl('  https://res.cloudinary.com/demo/a.pdf  ', { isProduction: true }), 'https://res.cloudinary.com/demo/a.pdf');

    const unsafeDoc = makeApiDoc({
      slug: '',
      file: {
        extension: 'pdf',
        format: 'pdf',
        previewSupported: true,
        url: 'javascript:alert(document.domain)',
      },
    });
    const behavior = getDocumentActionBehavior(unsafeDoc, { isProduction: true });
    assert.equal(behavior.viewUrl, null);
    assert.equal(behavior.downloadUrl, null);
  });

  it('formats sizes, extensions, and readable dates safely', () => {
    assert.equal(getDocumentExtension({ file: { originalName: 'Sheet.XLSX' } }), 'xlsx');
    assert.equal(isBrowserPreviewSupported({ file: { extension: 'webp' } }), true);
    assert.equal(isBrowserPreviewSupported({ file: { extension: 'zip' } }), false);
    assert.equal(formatDocumentSize(204800), '200 KB');
    assert.equal(formatDocumentDate('invalid-date'), 'Recent');
    assert.notEqual(formatDocumentDate('2026-11-10T10:00:00.000Z'), '2026-11-10T10:00:00.000Z');
  });
});

describe('publicApi — environment validation & HTTP contracts', () => {
  it('enforces explicit HTTPS in production with zero localhost fallback', () => {
    assert.equal(resolvePublicApiBaseUrl({ isProduction: false }), 'http://localhost:5001');
    assert.equal(
      resolvePublicApiBaseUrl({ baseUrl: 'https://api.clearfiling.co.in/', isProduction: true }),
      'https://api.clearfiling.co.in'
    );
    assert.throws(
      () => resolvePublicApiBaseUrl({ baseUrl: '', isProduction: true }),
      /not configured/
    );
    assert.throws(
      () => resolvePublicApiBaseUrl({ baseUrl: 'http://api.clearfiling.co.in', isProduction: true }),
      /HTTPS in production/
    );
    assert.throws(
      () => resolvePublicApiBaseUrl({ baseUrl: 'https://localhost:5001', isProduction: true }),
      /HTTPS in production/
    );
  });

  it('normalizes API errors into visitor-safe messages without exposing stack traces', () => {
    assert.equal(normalizePublicApiError({ name: 'AbortError' }), null);
    assert.equal(normalizePublicApiError({ status: 400 }), 'Please check your search term and try again.');
    assert.equal(normalizePublicApiError({ status: 404 }), 'The requested document is unavailable.');
    assert.match(normalizePublicApiError({ status: 503 }), /temporarily unavailable/);
    assert.equal(
      normalizePublicApiError(new Error('MongoServerError at /srv/secret/path:22')),
      'Unable to load documents right now. Please try again.'
    );
  });

  it('fetches categories, paginated/filtered documents, slug previews, and raw/image downloads', async () => {
    const calls = [];
    const mockFetch = async (url, opts) => {
      calls.push({ url, opts });

      if (url.endsWith('/api/public/categories')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            success: true,
            categories: [{ _id: 'c1', name: 'Tax & GST', slug: 'tax-gst' }],
          }),
        };
      }

      if (url.includes('/api/public/documents?')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            success: true,
            documents: [makeApiDoc()],
            pagination: {
              total: 8,
              page: 2,
              limit: 6,
              totalPages: 2,
              hasNextPage: false,
              hasPrevPage: true,
            },
          }),
        };
      }

      if (url.endsWith('/api/public/documents/gst-registration-checklist')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            success: true,
            document: makeApiDoc(),
          }),
        };
      }

      if (url.endsWith('/api/public/documents/gst-bundle-zip/download')) {
        return {
          ok: true,
          status: 200,
          blob: async () => new Blob(['zip-bytes'], { type: 'application/zip' }),
        };
      }

      throw new Error(`Unexpected URL: ${url}`);
    };

    const catRes = await fetchPublicCategories({
      baseUrl: API_BASE,
      isProduction: true,
      fetchImpl: mockFetch,
    });
    assert.equal(catRes.categories.length, 1);
    assert.equal(catRes.categories[0].slug, 'tax-gst');

    const docsRes = await fetchPublicDocuments({
      page: 2,
      limit: 6,
      category: 'tax-gst',
      q: '  gst filing  ',
      baseUrl: API_BASE,
      isProduction: true,
      fetchImpl: mockFetch,
    });
    assert.equal(docsRes.documents.length, 1);
    assert.equal(docsRes.pagination.totalPages, 2);
    assert.equal(docsRes.pagination.hasPrevPage, true);
    assert.equal(
      calls[1].url,
      `${API_BASE}/api/public/documents?page=2&limit=6&category=tax-gst&q=gst+filing`
    );

    const detailRes = await fetchPublicDocumentBySlug('gst-registration-checklist', {
      baseUrl: API_BASE,
      isProduction: true,
      fetchImpl: mockFetch,
    });
    assert.equal(detailRes.viewUrl, makeApiDoc().file.url);

    assert.equal(
      getPublicDocumentDownloadEndpoint('gst-bundle-zip', { baseUrl: API_BASE, isProduction: true }),
      `${API_BASE}/api/public/documents/gst-bundle-zip/download`
    );

    const downloadRes = await downloadPublicDocument(
      makeApiDoc({
        slug: 'gst-bundle-zip',
        file: {
          originalName: 'gst-bundle.zip',
          extension: 'zip',
          format: 'zip',
          resourceType: 'raw',
          previewSupported: false,
        },
      }),
      {
        baseUrl: API_BASE,
        isProduction: true,
        fetchImpl: mockFetch,
      }
    );
    assert.equal(downloadRes.filename, 'gst-bundle.zip');
    assert.equal(downloadRes.endpoint, `${API_BASE}/api/public/documents/gst-bundle-zip/download`);
    assert.equal(await downloadRes.blob.text(), 'zip-bytes');
  });
});

describe('createDocumentationController — state transitions, errors, and race safety', () => {
  it('loads categories once concurrently, supports filtering, search, pagination, and retry', async () => {
    let failDocsOnce = true;
    const requests = [];

    const controller = createDocumentationController({
      baseUrl: API_BASE,
      isProduction: true,
      api: {
        fetchPublicCategories: async () => {
          requests.push('categories');
          return {
            categories: [
              { _id: 'c1', name: 'Tax & GST', slug: 'tax-gst' },
              { _id: 'c2', name: 'Compliance', slug: 'compliance' },
            ],
          };
        },
        fetchPublicDocuments: async ({ page, category, q }) => {
          requests.push({ page, category, q });
          if (failDocsOnce) {
            failDocsOnce = false;
            const err = new Error('Gateway down');
            err.status = 503;
            throw err;
          }
          const docs =
            q === 'emptyquery' || category === 'compliance'
              ? []
              : [
                  makeApiDoc({ _id: `doc-p${page}`, slug: `doc-p${page}` }),
                  makeApiDoc({
                    _id: `zip-p${page}`,
                    slug: `zip-p${page}`,
                    file: {
                      originalName: 'kit.zip',
                      extension: 'zip',
                      format: 'zip',
                      resourceType: 'raw',
                      url: 'https://res.cloudinary.com/demo/raw/upload/v1/kit.zip',
                      previewSupported: false,
                    },
                  }),
                ];
          return {
            documents: docs,
            pagination: {
              total: 12,
              page,
              limit: 6,
              totalPages: 2,
              hasNextPage: page < 2,
              hasPrevPage: page > 1,
            },
          };
        },
        fetchPublicDocumentBySlug: async (slug) => ({
          document: makeApiDoc({ slug }),
          viewUrl: `https://res.cloudinary.com/demo/image/upload/v1/${slug}.pdf`,
        }),
        downloadPublicDocument: async (doc) => ({
          blob: new Blob(['ok']),
          filename: doc.file.originalName,
          endpoint: `${API_BASE}/api/public/documents/${doc.slug}/download`,
        }),
      },
    });

    // Duplicate concurrent category requests deduplicate cleanly
    await Promise.all([controller.loadCategories(), controller.loadCategories()]);
    assert.equal(requests.filter((r) => r === 'categories').length, 1);
    assert.equal(controller.getState().categories.length, 2);

    // Initial docs failure surfaces safe message, retryAll recovers cleanly
    await controller.loadDocuments();
    assert.match(controller.getState().documentsError, /temporarily unavailable/);
    await controller.retryAll();
    assert.equal(controller.getState().documentsError, null);
    assert.equal(controller.getState().documents.length, 2);

    // Pagination moves cleanly to page 2
    controller.setPage(2);
    await controller.loadDocuments();
    assert.equal(controller.getState().documents[0]._id, 'doc-p2');
    assert.equal(controller.getState().pagination.page, 2);

    // Category switch resets page to 1 and handles category empty state
    controller.setActiveCategory('compliance');
    assert.equal(controller.getState().page, 1);
    await controller.loadDocuments();
    assert.equal(
      getDocumentationEmptyReason(controller.getState()),
      'empty-category'
    );

    // Search switch resets page to 1 and handles no-search-results empty state
    controller.setActiveCategory('all');
    controller.setSearchQuery('emptyquery');
    controller.commitSearchQuery('emptyquery');
    assert.equal(controller.getState().page, 1);
    await controller.loadDocuments();
    assert.equal(
      getDocumentationEmptyReason(controller.getState()),
      'no-search-results'
    );

    // Completely empty catalog shows no-documents
    controller.setSearchQuery('');
    controller.commitSearchQuery('');
    assert.equal(
      getDocumentationEmptyReason({ documents: [], debouncedQuery: '', activeCategory: 'all' }),
      'no-documents'
    );
  });

  it('discards stale responses and aborts prior signal when rapid searches overlap', async () => {
    const resolvers = {};
    const abortedSignals = [];

    const controller = createDocumentationController({
      baseUrl: API_BASE,
      isProduction: true,
      api: {
        fetchPublicCategories: async () => ({ categories: [] }),
        fetchPublicDocuments: ({ q, signal }) =>
          new Promise((resolve) => {
            signal.addEventListener('abort', () => abortedSignals.push(q));
            resolvers[q] = resolve;
          }),
        fetchPublicDocumentBySlug: async () => ({}),
        downloadPublicDocument: async () => ({}),
      },
    });

    const p1 = controller.loadDocuments({ q: 'first', force: true });
    const p2 = controller.loadDocuments({ q: 'second', force: true });

    // Resolve newest search first
    resolvers.second({
      documents: [makeApiDoc({ _id: 'new-doc', title: 'Second Result' })],
      pagination: { total: 1, page: 1, limit: 6, totalPages: 1, hasNextPage: false, hasPrevPage: false },
    });
    await p2;

    // Resolve slow stale search afterward
    resolvers.first({
      documents: [makeApiDoc({ _id: 'stale-doc', title: 'Stale Result' })],
      pagination: { total: 1, page: 1, limit: 6, totalPages: 1, hasNextPage: false, hasPrevPage: false },
    });
    await p1;

    assert.deepEqual(abortedSignals, ['first']);
    assert.equal(controller.getState().documents.length, 1);
    assert.equal(controller.getState().documents[0]._id, 'new-doc');
  });

  it('handles preview & download success/failures per card cleanly', async () => {
    const docPdf = makeApiDoc({ _id: 'pdf-1', slug: 'pdf-1' });
    const docDocx = makeApiDoc({
      _id: 'docx-1',
      slug: 'docx-1',
      file: {
        originalName: 'agreement.docx',
        extension: 'docx',
        format: 'docx',
        resourceType: 'raw',
        url: 'https://res.cloudinary.com/demo/raw/upload/v1/agreement.docx',
        previewSupported: false,
      },
    });

    let failDownload = true;
    const saved = [];

    const controller = createDocumentationController({
      baseUrl: API_BASE,
      isProduction: true,
      api: {
        fetchPublicCategories: async () => ({ categories: [] }),
        fetchPublicDocuments: async () => ({ documents: [docPdf, docDocx] }),
        fetchPublicDocumentBySlug: async (slug) => ({
          document: makeApiDoc({ slug }),
          viewUrl: `https://res.cloudinary.com/demo/image/upload/v1/${slug}.pdf`,
        }),
        downloadPublicDocument: async (doc) => {
          if (failDownload) {
            failDownload = false;
            const err = new Error('Not found');
            err.status = 404;
            throw err;
          }
          return {
            blob: new Blob(['docx']),
            filename: doc.file.originalName,
            endpoint: `${API_BASE}/api/public/documents/${doc.slug}/download`,
          };
        },
      },
    });

    // Popup blocked on preview produces clean per-card error
    const blockedPreview = await controller.previewDocument(docPdf, { openWindow: () => false });
    assert.equal(blockedPreview.ok, false);
    assert.match(controller.getState().previewErrors[getDocumentKey(docPdf)], /popup was blocked/);

    // Clearing error removes it
    controller.clearCardError(getDocumentKey(docPdf));
    assert.equal(controller.getState().previewErrors[getDocumentKey(docPdf)], undefined);

    // Download-only format rejected for preview
    const docxPreview = await controller.previewDocument(docDocx);
    assert.equal(docxPreview.ok, false);
    assert.match(controller.getState().previewErrors[getDocumentKey(docDocx)], /unavailable for this file format/);

    // Download error -> retry -> success
    const failedDl = await controller.downloadDocument(docDocx);
    assert.equal(failedDl.ok, false);
    assert.equal(controller.getState().downloadErrors[getDocumentKey(docDocx)], 'The requested document is unavailable.');

    const okDl = await controller.downloadDocument(docDocx, {
      saveBlob: (blob, filename, endpoint) => saved.push({ size: blob.size, filename, endpoint }),
    });
    assert.equal(okDl.ok, true);
    assert.equal(controller.getState().downloadErrors[getDocumentKey(docDocx)], undefined);
    assert.equal(saved.length, 1);
    assert.equal(saved[0].filename, 'agreement.docx');
    assert.equal(saved[0].endpoint, `${API_BASE}/api/public/documents/docx-1/download`);
  });
});

