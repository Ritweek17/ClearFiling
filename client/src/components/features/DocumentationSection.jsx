import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  FileText,
  FolderOpen,
  ArrowDownToLine,
  Clock,
  Eye,
  AlertCircle,
  RefreshCw,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import SectionContainer from '../ui/SectionContainer';
import SectionHeading from '../ui/SectionHeading';
import Card from '../ui/Card';
import MaxWidthContainer from '../ui/MaxWidthContainer';
import { getDocumentActionBehavior, formatDocumentDate } from '../../utils/documentFileUtils';
import { getDocumentKey } from '../../hooks/documentationController';
import { usePublicDocumentation } from '../../hooks/usePublicDocumentation';

/**
 * Reusable public DocumentCard preserving the approved card design and visual hierarchy.
 */
const DocumentCard = ({
  doc,
  index,
  apiBaseUrl,
  isDownloading,
  cardError,
  onPreview,
  onDownload,
  onClearError,
}) => {
  const { badgeLabel, sizeLabel, previewSupported, viewUrl, downloadUrl } =
    getDocumentActionBehavior(doc, { apiBaseUrl });
  const titleText = doc.title || doc.name;
  const categoryName = doc.category?.name;
  const metaParts = [categoryName, badgeLabel, sizeLabel].filter(Boolean);
  const dateLabel = formatDocumentDate(doc.publishedAt || doc.updatedAt);

  const handlePreviewClick = (e) => {
    if (!viewUrl) {
      e.preventDefault();
    }
    onPreview(doc);
  };

  const handleDownloadClick = (e) => {
    e.preventDefault();
    if (!isDownloading) {
      onDownload(doc);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index, 5) * 0.05 }}
    >
      <Card
        isHoverable
        className="bg-white border border-slate-200/60 rounded-2xl p-5 flex flex-col justify-between h-full hover:shadow-md transition-all duration-300 group"
      >
        <div className="space-y-3">
          <div className="w-10 h-10 rounded-xl bg-brand-primary/5 border border-brand-primary/10 flex items-center justify-center text-brand-primary flex-shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
              {metaParts.join(' • ')}
            </span>
            <h4 className="text-sm font-bold font-heading text-brand-secondary mt-0.5 group-hover:text-brand-primary transition-colors line-clamp-1">
              {titleText}
            </h4>
          </div>
          <p className="text-xs text-slate-500 font-sans leading-relaxed line-clamp-2">
            {doc.description || 'Public business resource and reference document.'}
          </p>
        </div>

        <div className="pt-4 mt-4 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {dateLabel}
            </span>
            <div className="flex items-center gap-1.5">
              {previewSupported && (
                <a
                  href={viewUrl || '#'}
                  target={viewUrl ? '_blank' : undefined}
                  rel={viewUrl ? 'noopener noreferrer' : undefined}
                  onClick={handlePreviewClick}
                  className="p-2 rounded-lg bg-slate-50 text-slate-500 hover:bg-brand-primary hover:text-white focus-visible:ring-2 focus-visible:ring-brand-primary transition-all outline-none"
                  title={`Preview ${titleText}`}
                  aria-label={`Preview ${titleText}`}
                >
                  <Eye className="w-4 h-4" />
                </a>
              )}
              <a
                href={downloadUrl || '#'}
                download={doc.file?.originalName || !previewSupported || undefined}
                onClick={handleDownloadClick}
                aria-disabled={isDownloading || !downloadUrl}
                className={`p-2 rounded-lg bg-slate-50 text-slate-500 hover:bg-brand-primary hover:text-white focus-visible:ring-2 focus-visible:ring-brand-primary transition-all outline-none ${
                  isDownloading ? 'opacity-60 pointer-events-none' : ''
                }`}
                title={`Download ${titleText}`}
                aria-label={`Download ${titleText}`}
              >
                {isDownloading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowDownToLine className="w-4 h-4" />
                )}
              </a>
            </div>
          </div>

          {cardError && (
            <div
              role="alert"
              className="flex items-center justify-between gap-2 text-[11px] text-rose-600 bg-rose-50/80 border border-rose-200/70 rounded-lg px-2.5 py-1.5"
            >
              <span>{cardError}</span>
              <button
                type="button"
                onClick={() => onClearError(getDocumentKey(doc))}
                className="font-semibold underline hover:text-rose-700 flex-shrink-0 outline-none"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

const DocumentationSection = () => {
  const {
    categories,
    categoriesError,
    activeCategory,
    searchQuery,
    page,
    documents,
    pagination,
    documentsLoading,
    isLoadingPage,
    documentsError,
    emptyReason,
    downloadingId,
    downloadErrors,
    previewErrors,
    apiBaseUrl,
    setActiveCategory,
    setSearchQuery,
    clearSearch,
    setPage,
    retry,
    clearCardError,
    previewDocument,
    downloadDocument,
  } = usePublicDocumentation();

  const renderEmptyCard = () => {
    let heading = 'Coming Soon';
    let body =
      'Public documents and business resources will be available here soon. Please check back later.';
    let actionLabel = null;
    let actionHandler = null;

    if (emptyReason === 'no-search-results') {
      heading = 'No Matching Documents';
      body = 'No published documents matched your search term. Try a different keyword or clear the filter.';
      actionLabel = 'Clear Search';
      actionHandler = clearSearch;
    } else if (emptyReason === 'empty-category') {
      heading = 'No Documents Available';
      body = 'There are no published documents in this category yet.';
      actionLabel = 'View All Documents';
      actionHandler = () => setActiveCategory('all');
    }

    return (
      <motion.div
        key={`empty-${emptyReason}`}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className="w-full flex justify-center"
      >
        <Card className="max-w-md w-full bg-slate-50/50 border border-slate-200/50 rounded-2xl p-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-primary/5 border border-brand-primary/10 flex items-center justify-center text-brand-primary mb-5 shadow-inner">
            <FolderOpen className="w-7 h-7 text-brand-primary" />
          </div>
          <h3 className="text-lg font-bold font-heading text-brand-secondary">{heading}</h3>
          <p className="text-xs text-slate-500 font-sans leading-relaxed mt-2.5 max-w-sm">
            {body}
          </p>
          {actionLabel && actionHandler && (
            <button
              type="button"
              onClick={actionHandler}
              className="mt-5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-brand-primary bg-brand-primary/5 hover:bg-brand-primary hover:text-white rounded-xl transition-all outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              {actionLabel}
            </button>
          )}
        </Card>
      </motion.div>
    );
  };

  return (
    <SectionContainer
      id="documentation"
      bgType="white"
      animate={false}
      className="py-20 md:py-28 bg-white border-t border-slate-100 relative overflow-hidden"
    >
      {/* Ambient background blur */}
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-radial-gradient from-brand-accent/3 via-transparent to-transparent blur-3xl pointer-events-none -z-10" />

      <MaxWidthContainer size="lg" className="space-y-12 px-4 md:px-8">
        {/* Section Header */}
        <SectionHeading
          badge="RESOURCES & DRAFTS"
          title="Documentation"
          description="Search and access important business documents, templates and public resources."
          align="center"
          className="mx-auto"
        />

        {/* Reusable Search Bar & Category Tab Controls Wrapper */}
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Search Bar */}
          <div className="relative flex items-center bg-slate-50 border border-slate-200/80 focus-within:border-brand-primary focus-within:ring-4 focus-within:ring-brand-primary/10 focus-within:bg-white rounded-2xl shadow-sm transition-all duration-300">
            <Search className="w-4 h-4 text-slate-400 ml-4 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search documents..."
              aria-label="Search documents"
              maxLength={100}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-slate-800 placeholder-slate-400 px-3.5 py-3.5 text-sm font-sans"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="mr-4 text-xs text-slate-400 hover:text-slate-600 font-semibold uppercase tracking-wider outline-none"
              >
                Clear
              </button>
            )}
          </div>

          {/* Dynamic Category Tabs Navigation */}
          <div
            role="tablist"
            aria-label="Document categories"
            className="flex flex-wrap border-b border-slate-100 justify-center gap-6"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeCategory === 'all'}
              onClick={() => setActiveCategory('all')}
              className={`pb-3.5 text-sm font-bold tracking-wide border-b-2 transition-all outline-none relative ${
                activeCategory === 'all'
                  ? 'border-brand-primary text-brand-primary font-extrabold'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              All Documents
            </button>

            {categories.map((cat) => (
              <button
                key={cat._id || cat.slug}
                type="button"
                role="tab"
                aria-selected={activeCategory === cat.slug}
                onClick={() => setActiveCategory(cat.slug)}
                className={`pb-3.5 text-sm font-bold tracking-wide border-b-2 transition-all outline-none relative ${
                  activeCategory === cat.slug
                    ? 'border-brand-primary text-brand-primary font-extrabold'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {categoriesError && !documentsError && (
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
              <span>{categoriesError}</span>
              <button
                type="button"
                onClick={retry}
                className="text-brand-primary font-semibold hover:underline outline-none"
              >
                Retry
              </button>
            </div>
          )}
        </div>

        {/* Tab Contents Grid */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {documentsLoading ? (
              <motion.div
                key="docs-loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                role="status"
                aria-live="polite"
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <span className="sr-only">Loading documents...</span>
                {[0, 1, 2, 3].map((idx) => (
                  <Card
                    key={idx}
                    className="bg-slate-50/70 border border-slate-200/60 rounded-2xl p-5 h-44 animate-pulse"
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-200/70 mb-4" />
                    <div className="h-2.5 w-24 bg-slate-200/70 rounded mb-2" />
                    <div className="h-4 w-3/4 bg-slate-200/80 rounded mb-2" />
                    <div className="h-3 w-full bg-slate-200/60 rounded" />
                  </Card>
                ))}
              </motion.div>
            ) : documentsError ? (
              <motion.div
                key="docs-error"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="w-full flex justify-center"
              >
                <Card
                  role="alert"
                  className="max-w-md w-full bg-slate-50/50 border border-slate-200/50 rounded-2xl p-8 flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200/70 flex items-center justify-center text-rose-500 mb-5 shadow-inner">
                    <AlertCircle className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold font-heading text-brand-secondary">
                    Unable to Load Documents
                  </h3>
                  <p className="text-xs text-slate-500 font-sans leading-relaxed mt-2.5 max-w-sm">
                    {documentsError}
                  </p>
                  <button
                    type="button"
                    onClick={retry}
                    className="mt-5 inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-brand-primary hover:bg-brand-primary/90 rounded-xl transition-all outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Retry
                  </button>
                </Card>
              </motion.div>
            ) : documents.length > 0 ? (
              <motion.div
                key={`${activeCategory}-page-${page}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                <div
                  className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-opacity duration-200 ${
                    isLoadingPage ? 'opacity-60 pointer-events-none' : ''
                  }`}
                >
                  {documents.map((doc, idx) => {
                    const key = getDocumentKey(doc, idx);
                    return (
                      <DocumentCard
                        key={key}
                        doc={doc}
                        index={idx}
                        apiBaseUrl={apiBaseUrl}
                        isDownloading={downloadingId === key}
                        cardError={previewErrors[key] || downloadErrors[key] || null}
                        onPreview={previewDocument}
                        onDownload={downloadDocument}
                        onClearError={clearCardError}
                      />
                    );
                  })}
                </div>

                {(pagination.totalPages > 1 || isLoadingPage) && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
                    <span className="text-xs text-slate-400 font-medium flex items-center gap-2">
                      {isLoadingPage && <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-primary" />}
                      {isLoadingPage
                        ? 'Loading page...'
                        : `Page ${pagination.page} of ${pagination.totalPages} (${pagination.total} documents)`}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={isLoadingPage || !pagination.hasPrevPage}
                        onClick={() => setPage(pagination.page - 1)}
                        className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-600 hover:border-brand-primary hover:text-brand-primary disabled:opacity-40 disabled:pointer-events-none transition-all outline-none"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        Previous
                      </button>
                      <button
                        type="button"
                        disabled={isLoadingPage || !pagination.hasNextPage}
                        onClick={() => setPage(pagination.page + 1)}
                        className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-600 hover:border-brand-primary hover:text-brand-primary disabled:opacity-40 disabled:pointer-events-none transition-all outline-none"
                      >
                        Next
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              renderEmptyCard()
            )}
          </AnimatePresence>
        </div>
      </MaxWidthContainer>
    </SectionContainer>
  );
};

export default DocumentationSection;
