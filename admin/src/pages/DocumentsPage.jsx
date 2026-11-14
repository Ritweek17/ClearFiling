import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Search,
  Filter,
  RefreshCw,
  FileText,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import documentApi from '../api/documentApi';
import categoryApi from '../api/categoryApi';
import DocumentTable from '../components/documents/DocumentTable';
import DocumentFormModal from '../components/documents/DocumentFormModal';
import ReplaceFileModal from '../components/documents/ReplaceFileModal';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import { TableSkeleton } from '../components/common/LoadingSkeleton';

export const DocumentsPage = () => {
  const [documents, setDocuments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [isReplacingFile, setIsReplacingFile] = useState(false);
  const [replacingDoc, setReplacingDoc] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch categories for filtering and form selection
  const fetchCategories = async () => {
    try {
      const res = await categoryApi.getCategories();
      if (res?.success) {
        setCategories(res.categories || []);
      }
    } catch (err) {
      console.warn('Failed to fetch categories:', err.message);
    }
  };

  const fetchDocuments = useCallback(
    async (pageToLoad = 1) => {
      try {
        setLoading(true);
        setError(null);

        const params = {
          page: pageToLoad,
          limit: pagination.limit,
        };

        if (searchQuery.trim()) params.q = searchQuery.trim();
        if (selectedCategory) params.category = selectedCategory;
        if (selectedStatus) params.status = selectedStatus;

        const res = await documentApi.getDocuments(params);

        if (res?.success) {
          setDocuments(res.documents || []);
          if (res.pagination) {
            setPagination(res.pagination);
          }
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch documents.');
      } finally {
        setLoading(false);
      }
    },
    [pagination.limit, searchQuery, selectedCategory, selectedStatus]
  );

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchDocuments(1);
  }, [selectedCategory, selectedStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDocuments(1);
  };

  const handleCreateDocument = async (formData, onProgress) => {
    setActionLoading(true);
    try {
      const res = await documentApi.createDocument(formData, onProgress);
      setSuccessMessage('Document uploaded and saved successfully.');
      fetchDocuments(1);
      return res;
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateDocument = async (updateData) => {
    if (!editingDoc) return;
    setActionLoading(true);
    try {
      const res = await documentApi.updateDocument(editingDoc._id, updateData);
      setSuccessMessage('Document metadata updated successfully.');
      fetchDocuments(pagination.page);
      return res;
    } finally {
      setActionLoading(false);
    }
  };

  const handleReplaceFile = async (docId, formData, onProgress) => {
    setActionLoading(true);
    try {
      const res = await documentApi.replaceDocumentFile(docId, formData, onProgress);
      setSuccessMessage('Document file replaced successfully.');
      fetchDocuments(pagination.page);
      return res;
    } finally {
      setActionLoading(false);
    }
  };

  const handlePublish = async (id) => {
    try {
      await documentApi.publishDocument(id);
      setSuccessMessage('Document published successfully. It is now live on the public website.');
      fetchDocuments(pagination.page);
    } catch (err) {
      setError(err.message || 'Failed to publish document.');
    }
  };

  const handleArchive = async (id) => {
    try {
      await documentApi.archiveDocument(id);
      setSuccessMessage('Document archived. It has been hidden from the public website.');
      fetchDocuments(pagination.page);
    } catch (err) {
      setError(err.message || 'Failed to archive document.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await documentApi.deleteDocument(id);
      setSuccessMessage('Document deleted and file permanently purged from storage.');
      fetchDocuments(pagination.page);
    } catch (err) {
      setError(err.message || 'Failed to delete document.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Document Repository
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Upload, publish, archive, and manage regulatory filings and forms.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={() => {
            fetchCategories();
            setEditingDoc(null);
            setIsFormOpen(true);
          }}
        >
          Upload Document
        </Button>
      </div>

      {/* Notification Banners */}
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {successMessage && (
        <Alert
          type="success"
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="w-full md:w-80 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents by title or description..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </form>

        {/* Dropdown Filters */}
        <div className="w-full md:w-auto flex flex-wrap items-center gap-2.5">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs font-medium border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-xs font-medium border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
            <option value="archived">Archived</option>
          </select>

          {/* Reset Filters / Refresh */}
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('');
              setSelectedStatus('');
              fetchDocuments(1);
            }}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            title="Reset Filters and Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Table or Loading Skeleton */}
      {loading ? (
        <TableSkeleton rows={8} cols={7} />
      ) : (
        <DocumentTable
          documents={documents}
          onEdit={(doc) => {
            fetchCategories();
            setEditingDoc(doc);
            setIsFormOpen(true);
          }}
          onReplaceFile={(doc) => {
            setReplacingDoc(doc);
            setIsReplacingFile(true);
          }}
          onPublish={handlePublish}
          onArchive={handleArchive}
          onDelete={handleDelete}
        />
      )}

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-2 pt-2 text-xs text-slate-500">
          <div>
            Showing Page <strong className="text-slate-800">{pagination.page}</strong> of{' '}
            <strong className="text-slate-800">{pagination.totalPages}</strong> ({pagination.total} total documents)
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              icon={ChevronLeft}
              disabled={!pagination.hasPrevPage || loading}
              onClick={() => fetchDocuments(pagination.page - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasNextPage || loading}
              onClick={() => fetchDocuments(pagination.page + 1)}
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Document Form Modal (Create or Edit Metadata) */}
      <DocumentFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingDoc(null);
        }}
        onSubmit={editingDoc ? handleUpdateDocument : handleCreateDocument}
        categories={categories}
        onRefreshCategories={fetchCategories}
        document={editingDoc}
        isLoading={actionLoading}
      />

      {/* Replace File Modal */}
      <ReplaceFileModal
        isOpen={isReplacingFile}
        onClose={() => {
          setIsReplacingFile(false);
          setReplacingDoc(null);
        }}
        onSubmit={handleReplaceFile}
        document={replacingDoc}
        isLoading={actionLoading}
      />
    </div>
  );
};

export default DocumentsPage;

