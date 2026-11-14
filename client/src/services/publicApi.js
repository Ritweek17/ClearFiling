import { sanitizeDocumentUrl } from '../utils/documentFileUtils.js';

const LOCALHOST_HOSTNAMES = new Set(['localhost', '127.0.0.1', '[::1]']);
const MAX_PUBLIC_QUERY_LENGTH = 100;

/**
 * Resolve and validate the public API base URL.
 * Production builds require an explicit HTTPS URL and never fall back to localhost.
 */
export const resolvePublicApiBaseUrl = ({ baseUrl, isProduction } = {}) => {
  const prodMode =
    typeof isProduction === 'boolean' ? isProduction : Boolean(import.meta.env?.PROD);

  const envUrl = import.meta.env?.PROD
    ? (import.meta.env.VITE_API_BASE_URL || '').trim()
    : (
        import.meta.env?.VITE_API_BASE_URL ||
        (typeof process !== 'undefined' ? process.env?.VITE_API_BASE_URL : '') ||
        'http://localhost:5001'
      ).trim();

  const candidate = (typeof baseUrl === 'string' ? baseUrl.trim() : envUrl).replace(/\/+$/, '');

  if (!candidate) {
    throw new Error('Document service is not configured. Please check back later.');
  }

  let parsed;
  try {
    parsed = new URL(candidate);
  } catch {
    throw new Error('Document service configuration is invalid.');
  }

  if (prodMode) {
    if (parsed.protocol !== 'https:' || LOCALHOST_HOSTNAMES.has(parsed.hostname)) {
      throw new Error('Document service must use HTTPS in production.');
    }
  } else if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error('Document service URL protocol is unsupported.');
  }

  return candidate;
};

/**
 * Convert raw API / network errors into concise visitor-safe messages without stack traces.
 */
export const normalizePublicApiError = (error, fallback = 'Unable to load documents right now. Please try again.') => {
  if (!error) return fallback;
  if (error.name === 'AbortError') return null;

  const status = error.status;
  if (status === 400) return 'Please check your search term and try again.';
  if (status === 404) return 'The requested document is unavailable.';
  if (status === 429) return 'Too many requests right now. Please wait a moment and try again.';
  if (status === 503) return 'Document service is temporarily unavailable. Please try again shortly.';
  if (status >= 500) return 'Document service is experiencing a temporary issue. Please try again shortly.';

  if (error.isUserSafe && error.message) {
    return error.message;
  }

  return fallback;
};

const createSafeError = (message, status) => {
  const err = new Error(message);
  err.status = status;
  err.isUserSafe = true;
  return err;
};

const parseJsonSafely = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

/**
 * Fetch active public categories from GET /api/public/categories.
 */
export const fetchPublicCategories = async ({ signal, baseUrl, fetchImpl = fetch, isProduction } = {}) => {
  const apiBase = resolvePublicApiBaseUrl({ baseUrl, isProduction });
  const response = await fetchImpl(`${apiBase}/api/public/categories`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal,
  });

  const payload = await parseJsonSafely(response);
  if (!response.ok || payload?.success === false) {
    throw createSafeError(
      normalizePublicApiError({ status: response.status }, 'Unable to load document categories.'),
      response.status
    );
  }

  return {
    categories: Array.isArray(payload?.categories) ? payload.categories : [],
  };
};

/**
 * Fetch paginated published public documents from GET /api/public/documents.
 */
export const fetchPublicDocuments = async ({
  page = 1,
  limit = 6,
  category = '',
  q = '',
  signal,
  baseUrl,
  fetchImpl = fetch,
  isProduction,
} = {}) => {
  const apiBase = resolvePublicApiBaseUrl({ baseUrl, isProduction });
  const params = new URLSearchParams();
  params.set('page', String(Math.max(1, Number(page) || 1)));
  params.set('limit', String(Math.min(50, Math.max(1, Number(limit) || 6))));

  const trimmedCategory = typeof category === 'string' ? category.trim() : '';
  if (trimmedCategory && trimmedCategory !== 'all') {
    params.set('category', trimmedCategory);
  }

  const trimmedQuery = typeof q === 'string' ? q.trim().slice(0, MAX_PUBLIC_QUERY_LENGTH) : '';
  if (trimmedQuery) {
    params.set('q', trimmedQuery);
  }

  const response = await fetchImpl(`${apiBase}/api/public/documents?${params.toString()}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal,
  });

  const payload = await parseJsonSafely(response);
  if (!response.ok || payload?.success === false) {
    throw createSafeError(
      normalizePublicApiError({ status: response.status }, 'Unable to load documents right now.'),
      response.status
    );
  }

  const pagination = payload?.pagination || {};
  return {
    documents: Array.isArray(payload?.documents) ? payload.documents : [],
    pagination: {
      total: Number(pagination.total) || 0,
      page: Number(pagination.page) || 1,
      limit: Number(pagination.limit) || limit,
      totalPages: Math.max(1, Number(pagination.totalPages) || 1),
      hasNextPage: Boolean(pagination.hasNextPage),
      hasPrevPage: Boolean(pagination.hasPrevPage),
    },
  };
};

/**
 * Fetch single published document detail via GET /api/public/documents/:slug (also increments viewCount).
 */
export const fetchPublicDocumentBySlug = async (
  slug,
  { signal, baseUrl, fetchImpl = fetch, isProduction } = {}
) => {
  if (!slug || typeof slug !== 'string') {
    throw createSafeError('Document preview is unavailable.', 400);
  }

  const apiBase = resolvePublicApiBaseUrl({ baseUrl, isProduction });
  const response = await fetchImpl(
    `${apiBase}/api/public/documents/${encodeURIComponent(slug.trim())}`,
    {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal,
    }
  );

  const payload = await parseJsonSafely(response);
  if (!response.ok || payload?.success === false || !payload?.document) {
    throw createSafeError(
      normalizePublicApiError({ status: response.status }, 'Unable to preview this document right now.'),
      response.status
    );
  }

  const safeUrl = sanitizeDocumentUrl(payload.document?.file?.url, { isProduction });
  if (!safeUrl) {
    throw createSafeError('This document link is unavailable or unsafe to open.', 400);
  }

  return {
    document: payload.document,
    viewUrl: safeUrl,
  };
};

/**
 * Build validated backend download endpoint URL for a document slug.
 */
export const getPublicDocumentDownloadEndpoint = (slug, { baseUrl, isProduction } = {}) => {
  if (!slug || typeof slug !== 'string' || !slug.trim()) return null;
  const apiBase = resolvePublicApiBaseUrl({ baseUrl, isProduction });
  const endpoint = `${apiBase}/api/public/documents/${encodeURIComponent(slug.trim())}/download`;
  return sanitizeDocumentUrl(endpoint, { isProduction });
};

/**
 * Download document through the backend GET /api/public/documents/:slug/download endpoint
 * so downloadCount increments and raw/image assets resolve cleanly without exposing backend internals.
 */
export const downloadPublicDocument = async (
  doc,
  { signal, baseUrl, fetchImpl = fetch, isProduction } = {}
) => {
  const endpoint = doc?.slug
    ? getPublicDocumentDownloadEndpoint(doc.slug, { baseUrl, isProduction })
    : sanitizeDocumentUrl(doc?.downloadUrl, { isProduction });

  if (!endpoint) {
    throw createSafeError('Download link is unavailable for this document.', 400);
  }

  const response = await fetchImpl(endpoint, {
    method: 'GET',
    signal,
  });

  if (!response.ok) {
    throw createSafeError(
      response.status === 404
        ? 'This document is no longer available for download.'
        : 'Download failed. Please try again.',
      response.status
    );
  }

  const blob = await response.blob();
  const ext = doc?.file?.extension || doc?.file?.format || '';
  const fallbackName = ext ? `${doc?.slug || 'document'}.${ext}` : doc?.slug || 'document';
  const filename = doc?.file?.originalName || fallbackName;

  return {
    blob,
    filename,
    endpoint,
  };
};

export default {
  resolvePublicApiBaseUrl,
  normalizePublicApiError,
  fetchPublicCategories,
  fetchPublicDocuments,
  fetchPublicDocumentBySlug,
  getPublicDocumentDownloadEndpoint,
  downloadPublicDocument,
};

