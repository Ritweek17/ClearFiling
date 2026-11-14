import { useEffect, useRef, useState, useCallback } from 'react';
import {
  createDocumentationController,
  DEFAULT_PAGE_LIMIT,
  SEARCH_DEBOUNCE_MS,
  getDocumentationEmptyReason,
} from './documentationController';
import { resolvePublicApiBaseUrl } from '../services/publicApi';

const saveDownloadedBlob = (blob, filename) => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  const objectUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = filename || 'document';
  link.rel = 'noopener noreferrer';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => {
    window.URL.revokeObjectURL(objectUrl);
  }, 1000);
};

export const usePublicDocumentation = () => {
  const controllerRef = useRef(null);
  const resolvedBaseUrlRef = useRef('');

  if (!resolvedBaseUrlRef.current) {
    try {
      resolvedBaseUrlRef.current = resolvePublicApiBaseUrl();
    } catch {
      resolvedBaseUrlRef.current = '';
    }
  }

  const [state, setState] = useState(() => {
    if (!controllerRef.current) {
      controllerRef.current = createDocumentationController({
        baseUrl: resolvedBaseUrlRef.current || undefined,
        limit: DEFAULT_PAGE_LIMIT,
      });
    }
    return controllerRef.current.getState();
  });

  // Subscribe controller updates cleanly & abort on unmount
  useEffect(() => {
    const controller = createDocumentationController({
      baseUrl: resolvedBaseUrlRef.current || undefined,
      limit: DEFAULT_PAGE_LIMIT,
      onStateChange: (nextState) => setState(nextState),
    });
    controllerRef.current = controller;
    setState(controller.getState());

    controller.loadCategories();
    controller.loadDocuments({ page: 1, category: 'all', q: '' });

    return () => {
      controller.destroy();
    };
  }, []);

  // Debounce search input before triggering backend query
  useEffect(() => {
    const timer = window.setTimeout(() => {
      controllerRef.current?.commitSearchQuery(state.searchQuery);
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [state.searchQuery]);

  // Fetch documents whenever activeCategory, debouncedQuery, or page changes
  const isFirstFilterEffectRef = useRef(true);
  useEffect(() => {
    if (isFirstFilterEffectRef.current) {
      isFirstFilterEffectRef.current = false;
      return;
    }
    controllerRef.current?.loadDocuments({
      page: state.page,
      category: state.activeCategory,
      q: state.debouncedQuery,
    });
  }, [state.activeCategory, state.debouncedQuery, state.page]);

  const handleCategoryChange = useCallback((slug) => {
    controllerRef.current?.setActiveCategory(slug);
  }, []);

  const handleSearchChange = useCallback((value) => {
    controllerRef.current?.setSearchQuery(value);
  }, []);

  const handleClearSearch = useCallback(() => {
    controllerRef.current?.setSearchQuery('');
    controllerRef.current?.commitSearchQuery('');
  }, []);

  const handlePageChange = useCallback((nextPage) => {
    controllerRef.current?.setPage(nextPage);
  }, []);

  const handleRetry = useCallback(() => {
    controllerRef.current?.retryAll();
  }, []);

  const handleClearCardError = useCallback((docKey) => {
    controllerRef.current?.clearCardError(docKey);
  }, []);

  const handlePreview = useCallback((doc) => {
    // Open blank window synchronously on user click only after validating URL to avoid popup blocking,
    // or verify via controller and navigate safely with noopener,noreferrer.
    return controllerRef.current?.previewDocument(doc, {
      openWindow: (url) => {
        const win = window.open(url, '_blank', 'noopener,noreferrer');
        return Boolean(win);
      },
    });
  }, []);

  const handleDownload = useCallback((doc) => {
    return controllerRef.current?.downloadDocument(doc, {
      saveBlob: saveDownloadedBlob,
    });
  }, []);

  return {
    ...state,
    apiBaseUrl: resolvedBaseUrlRef.current,
    emptyReason: getDocumentationEmptyReason(state),
    setActiveCategory: handleCategoryChange,
    setSearchQuery: handleSearchChange,
    clearSearch: handleClearSearch,
    setPage: handlePageChange,
    retry: handleRetry,
    clearCardError: handleClearCardError,
    previewDocument: handlePreview,
    downloadDocument: handleDownload,
  };
};

export default usePublicDocumentation;

