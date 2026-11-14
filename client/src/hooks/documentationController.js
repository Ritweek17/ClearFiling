import {
  fetchPublicCategories,
  fetchPublicDocuments,
  fetchPublicDocumentBySlug,
  downloadPublicDocument,
  normalizePublicApiError,
} from '../services/publicApi.js';
import { getDocumentActionBehavior } from '../utils/documentFileUtils.js';

export const DEFAULT_PAGE_LIMIT = 6;
export const SEARCH_DEBOUNCE_MS = 300;

export const INITIAL_DOCUMENTATION_STATE = Object.freeze({
  categories: [],
  categoriesLoading: true,
  categoriesError: null,
  activeCategory: 'all',
  searchQuery: '',
  debouncedQuery: '',
  page: 1,
  documents: [],
  pagination: {
    total: 0,
    page: 1,
    limit: DEFAULT_PAGE_LIMIT,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  },
  documentsLoading: true,
  isLoadingPage: false,
  documentsError: null,
  downloadingId: null,
  downloadErrors: {},
  previewingId: null,
  previewErrors: {},
});

/**
 * Determine concise visitor-friendly empty state reason when documents array is empty.
 */
export const getDocumentationEmptyReason = ({ documents, debouncedQuery, activeCategory }) => {
  if (Array.isArray(documents) && documents.length > 0) return null;
  if (typeof debouncedQuery === 'string' && debouncedQuery.trim().length > 0) {
    return 'no-search-results';
  }
  if (activeCategory && activeCategory !== 'all') {
    return 'empty-category';
  }
  return 'no-documents';
};

export const getDocumentKey = (doc = {}, fallback = '') =>
  String(doc?._id || doc?.id || doc?.slug || fallback);

/**
 * Framework-agnostic async state & request orchestrator for the Public Documentation section.
 * Prevents duplicate concurrent requests and discards stale responses from rapid search/filter changes.
 */
export const createDocumentationController = ({
  onStateChange = () => {},
  api = {
    fetchPublicCategories,
    fetchPublicDocuments,
    fetchPublicDocumentBySlug,
    downloadPublicDocument,
  },
  baseUrl,
  isProduction,
  limit = DEFAULT_PAGE_LIMIT,
} = {}) => {
  let state = {
    ...INITIAL_DOCUMENTATION_STATE,
    pagination: { ...INITIAL_DOCUMENTATION_STATE.pagination, limit },
    downloadErrors: {},
    previewErrors: {},
  };

  let categoriesLoadedOnce = false;
  let categoriesInFlight = false;
  let categoriesAbortController = null;

  let docsRequestSeq = 0;
  let activeDocsKey = null;
  let docsAbortController = null;
  let destroyed = false;

  const setState = (updater) => {
    if (destroyed) return state;
    const patch = typeof updater === 'function' ? updater(state) : updater;
    state = { ...state, ...patch };
    onStateChange(state);
    return state;
  };

  const getState = () => state;

  const loadCategories = async ({ force = false } = {}) => {
    if (!force && (categoriesLoadedOnce || categoriesInFlight)) {
      return state.categories;
    }

    if (categoriesAbortController) {
      categoriesAbortController.abort();
    }
    categoriesAbortController = new AbortController();
    categoriesInFlight = true;

    setState({ categoriesLoading: true, categoriesError: null });

    try {
      const data = await api.fetchPublicCategories({
        signal: categoriesAbortController.signal,
        baseUrl,
        isProduction,
      });
      categoriesLoadedOnce = true;
      setState({
        categories: Array.isArray(data.categories) ? data.categories : [],
        categoriesLoading: false,
        categoriesError: null,
      });
      return state.categories;
    } catch (error) {
      if (error?.name === 'AbortError') return state.categories;
      const safeMsg = normalizePublicApiError(error, 'Unable to load categories.');
      setState({
        categoriesLoading: false,
        categoriesError: safeMsg,
      });
      return state.categories;
    } finally {
      categoriesInFlight = false;
    }
  };

  const loadDocuments = async ({
    page = state.page,
    category = state.activeCategory,
    q = state.debouncedQuery,
    force = false,
  } = {}) => {
    const normalizedPage = Math.max(1, Number(page) || 1);
    const normalizedCategory = category || 'all';
    const normalizedQuery = typeof q === 'string' ? q.trim() : '';
    const requestKey = `${normalizedCategory}::${normalizedQuery}::${normalizedPage}::${limit}`;

    if (!force && activeDocsKey === requestKey && docsAbortController) {
      return state;
    }

    if (docsAbortController) {
      docsAbortController.abort();
    }
    docsAbortController = new AbortController();
    activeDocsKey = requestKey;
    const requestSeq = ++docsRequestSeq;

    const hasExistingDocs = state.documents.length > 0;
    const isPageChange = normalizedPage > 1 || (hasExistingDocs && !force);

    setState({
      documentsLoading: !isPageChange,
      isLoadingPage: isPageChange,
      documentsError: null,
    });

    try {
      const data = await api.fetchPublicDocuments({
        page: normalizedPage,
        limit,
        category: normalizedCategory === 'all' ? '' : normalizedCategory,
        q: normalizedQuery,
        signal: docsAbortController.signal,
        baseUrl,
        isProduction,
      });

      // Stale response guard: discard if a newer request has started
      if (requestSeq !== docsRequestSeq || destroyed) {
        return state;
      }

      setState({
        documents: Array.isArray(data.documents) ? data.documents : [],
        pagination: data.pagination || {
          ...INITIAL_DOCUMENTATION_STATE.pagination,
          page: normalizedPage,
          limit,
        },
        documentsLoading: false,
        isLoadingPage: false,
        documentsError: null,
      });
      return state;
    } catch (error) {
      if (error?.name === 'AbortError' || requestSeq !== docsRequestSeq || destroyed) {
        return state;
      }

      const safeMsg = normalizePublicApiError(
        error,
        'Unable to load documents right now. Please try again.'
      );
      setState({
        documentsLoading: false,
        isLoadingPage: false,
        documentsError: safeMsg,
      });
      return state;
    } finally {
      if (requestSeq === docsRequestSeq) {
        activeDocsKey = null;
      }
    }
  };

  const setActiveCategory = (categorySlug = 'all') => {
    const nextCategory = categorySlug || 'all';
    if (nextCategory === state.activeCategory && state.page === 1) return;
    setState({
      activeCategory: nextCategory,
      page: 1,
    });
  };

  const setSearchQuery = (nextQuery = '') => {
    setState({ searchQuery: nextQuery });
  };

  const commitSearchQuery = (nextQuery = state.searchQuery) => {
    const normalized = typeof nextQuery === 'string' ? nextQuery.trim() : '';
    if (normalized === state.debouncedQuery && state.page === 1) return false;
    setState({
      debouncedQuery: normalized,
      page: 1,
    });
    return true;
  };

  const setPage = (nextPage) => {
    const targetPage = Math.max(1, Number(nextPage) || 1);
    if (targetPage === state.page) return;
    setState({ page: targetPage });
  };

  const clearCardError = (docKey) => {
    const nextPreview = { ...state.previewErrors };
    const nextDownload = { ...state.downloadErrors };
    delete nextPreview[docKey];
    delete nextDownload[docKey];
    setState({ previewErrors: nextPreview, downloadErrors: nextDownload });
  };

  /**
   * Preview handler for PDF/image formats.
   * Validates target URL safely and verifies/tracks view availability via backend slug endpoint.
   */
  const previewDocument = async (doc, { openWindow } = {}) => {
    const docKey = getDocumentKey(doc);
    const { previewSupported, viewUrl } = getDocumentActionBehavior(doc, {
      apiBaseUrl: baseUrl,
      isProduction,
    });

    if (!previewSupported || !viewUrl) {
      setState({
        previewErrors: {
          ...state.previewErrors,
          [docKey]: 'Preview is unavailable for this file format.',
        },
      });
      return { ok: false };
    }

    const nextPreviewErrors = { ...state.previewErrors };
    delete nextPreviewErrors[docKey];
    setState({ previewingId: docKey, previewErrors: nextPreviewErrors });

    try {
      let resolvedUrl = viewUrl;

      if (doc?.slug && api.fetchPublicDocumentBySlug) {
        const detail = await api.fetchPublicDocumentBySlug(doc.slug, { baseUrl, isProduction });
        resolvedUrl = detail?.viewUrl || viewUrl;
      }

      if (typeof openWindow === 'function') {
        const opened = openWindow(resolvedUrl);
        if (opened === false) {
          throw Object.assign(new Error('Preview popup was blocked. Please allow popups or download the file.'), {
            isUserSafe: true,
          });
        }
      }

      setState({ previewingId: null });
      return { ok: true, url: resolvedUrl };
    } catch (error) {
      const safeMsg = normalizePublicApiError(
        error,
        'Unable to preview this document right now. Please try downloading instead.'
      );
      setState({
        previewingId: null,
        previewErrors: {
          ...state.previewErrors,
          [docKey]: safeMsg,
        },
      });
      return { ok: false, error: safeMsg };
    }
  };

  /**
   * Download handler via backend GET /api/public/documents/:slug/download.
   * Handles raw and image resource types uniformly with visitor-safe error recovery.
   */
  const downloadDocument = async (doc, { saveBlob } = {}) => {
    const docKey = getDocumentKey(doc);
    const nextDownloadErrors = { ...state.downloadErrors };
    delete nextDownloadErrors[docKey];
    setState({ downloadingId: docKey, downloadErrors: nextDownloadErrors });

    try {
      const result = await api.downloadPublicDocument(doc, { baseUrl, isProduction });
      if (typeof saveBlob === 'function') {
        saveBlob(result.blob, result.filename, result.endpoint);
      }
      setState({ downloadingId: null });
      return { ok: true, filename: result.filename, endpoint: result.endpoint };
    } catch (error) {
      const safeMsg = normalizePublicApiError(
        error,
        'Unable to download this document right now. Please try again.'
      );
      setState({
        downloadingId: null,
        downloadErrors: {
          ...state.downloadErrors,
          [docKey]: safeMsg,
        },
      });
      return { ok: false, error: safeMsg };
    }
  };

  const retryAll = async () => {
    await Promise.all([
      state.categoriesError ? loadCategories({ force: true }) : Promise.resolve(),
      loadDocuments({ force: true }),
    ]);
  };

  const destroy = () => {
    destroyed = true;
    if (categoriesAbortController) categoriesAbortController.abort();
    if (docsAbortController) docsAbortController.abort();
  };

  return {
    getState,
    loadCategories,
    loadDocuments,
    setActiveCategory,
    setSearchQuery,
    commitSearchQuery,
    setPage,
    clearCardError,
    previewDocument,
    downloadDocument,
    retryAll,
    destroy,
  };
};

