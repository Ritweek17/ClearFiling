import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { Upload, FileText, CheckCircle, AlertCircle, X, Plus, ExternalLink } from 'lucide-react';
import CategoryFormModal from '../categories/CategoryFormModal';
import categoryApi from '../../api/categoryApi';
import {
  FILE_INPUT_ACCEPT,
  FORMAT_GROUPS,
  MAX_FILE_SIZE_MB,
  formatBytes,
  getFileExtension,
  validateClientFile,
} from '../../utils/fileFormats';

export const DocumentFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  categories = [],
  onRefreshCategories,
  document = null, // null for create, object for edit
  isLoading = false,
}) => {
  const isEdit = Boolean(document?._id);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    status: 'draft',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isQuickCategoryOpen, setIsQuickCategoryOpen] = useState(false);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  // Active categories filter (memoized)
  const activeCategories = useMemo(() => {
    return (categories || []).filter((c) => {
      if (c.isActive === false) {
        // Allow inactive category only if this document was previously assigned to it
        return document && (document.category?._id === c._id || document.category === c._id);
      }
      return true;
    });
  }, [categories, document]);

  // Refresh categories whenever the modal opens
  useEffect(() => {
    if (isOpen && onRefreshCategories) {
      onRefreshCategories();
    }
  }, [isOpen]);

  useEffect(() => {
    if (document) {
      setFormData({
        title: document.title || '',
        description: document.description || '',
        category: document.category?._id || document.category || '',
        status: document.status || 'draft',
      });
      setSelectedFile(null);
    } else {
      setFormData((prev) => ({
        title: prev.title || '',
        description: prev.description || '',
        category: prev.category || activeCategories[0]?._id || '',
        status: prev.status || 'draft',
      }));
      setSelectedFile(null);
    }
    setUploadProgress(0);
    setError(null);
  }, [document, activeCategories, isOpen]);

  const handleQuickCreateCategory = async (catData) => {
    setIsCreatingCategory(true);
    try {
      const res = await categoryApi.createCategory(catData);
      if (res?.success && res.category) {
        if (onRefreshCategories) {
          await onRefreshCategories();
        }
        setFormData((prev) => ({ ...prev, category: res.category._id }));
      }
      setIsQuickCategoryOpen(false);
    } catch (err) {
      throw err;
    } finally {
      setIsCreatingCategory(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleValidateAndSetFile = (file) => {
    setError(null);
    if (!file) return;

    const validation = validateClientFile(file);
    if (!validation.valid) {
      setError(validation.error);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setSelectedFile(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    handleValidateAndSetFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleValidateAndSetFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError('Document title is required.');
      return;
    }

    if (!formData.category) {
      setError('Please select a category for this document.');
      return;
    }

    if (!isEdit && !selectedFile) {
      setError('Please select a supported document file to upload.');
      return;
    }

    try {
      if (isEdit) {
        // Edit metadata only
        await onSubmit({
          title: formData.title.trim(),
          description: formData.description.trim(),
          category: formData.category,
        });
      } else {
        // Create new document with multipart file upload
        const data = new FormData();
        data.append('title', formData.title.trim());
        data.append('description', formData.description.trim());
        data.append('category', formData.category);
        data.append('status', formData.status);
        data.append('file', selectedFile);

        await onSubmit(data, (progressEvent) => {
          if (progressEvent.total) {
            const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(pct);
          }
        });
      }

      onClose();
    } catch (err) {
      setError(err.message || 'Operation failed.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Document Metadata' : 'Upload New Document'}
      description={
        isEdit
          ? 'Update title, description, or category assignment.'
          : 'Upload a supported document, spreadsheet, presentation, image, or ZIP file and set its initial status.'
      }
      maxWidth="max-w-xl"
      showClose={!isLoading}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

        <div>
          <label htmlFor="doc-title" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Document Title <span className="text-rose-500">*</span>
          </label>
          <input
            id="doc-title"
            name="title"
            type="text"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Master Service Agreement Guide 2026"
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label htmlFor="doc-desc" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Description
          </label>
          <textarea
            id="doc-desc"
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            placeholder="Summary of document purpose and filing instructions..."
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="doc-category" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Category <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setIsQuickCategoryOpen(true)}
                className="text-[11px] font-medium text-brand-600 hover:text-brand-800 inline-flex items-center gap-0.5"
                title="Create a new category"
              >
                <Plus className="w-3 h-3" /> New
              </button>
            </div>

            {activeCategories.length === 0 ? (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs space-y-2">
                <div className="flex items-start gap-2 text-amber-800">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">No categories available</span>
                    <p className="text-amber-700 mt-0.5">
                      A category is required to catalog this document.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-1 border-t border-amber-200/60 text-xs">
                  <button
                    type="button"
                    onClick={() => setIsQuickCategoryOpen(true)}
                    className="inline-flex items-center gap-1 font-semibold text-brand-700 hover:text-brand-900 underline"
                  >
                    <Plus className="w-3 h-3" /> Create Category Now
                  </button>
                  <span className="text-amber-300">•</span>
                  <Link
                    to="/categories"
                    onClick={onClose}
                    className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900"
                  >
                    Categories Page <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ) : (
              <select
                id="doc-category"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              >
                <option value="">Select a category...</option>
                {activeCategories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} {c.isActive === false ? '(Inactive)' : ''}
                  </option>
                ))}
              </select>
            )}
          </div>

          {!isEdit && (
            <div>
              <label htmlFor="doc-status" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Initial Status
              </label>
              <select
                id="doc-status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              >
                <option value="draft">Save as Draft (Private)</option>
                <option value="published">Publish Immediately (Public)</option>
              </select>
            </div>
          )}
        </div>

        {/* File Picker (Only for Create Document) */}
        {!isEdit ? (
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Document File <span className="text-rose-500">*</span>
            </label>

            <input
              type="file"
              ref={fileInputRef}
              accept={FILE_INPUT_ACCEPT}
              onChange={handleFileChange}
              className="hidden"
            />

            {!selectedFile ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors ${
                  isDragging
                    ? 'border-brand-500 bg-brand-50/50'
                    : 'border-slate-300 hover:border-brand-400 hover:bg-slate-50'
                }`}
              >
                <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                <p className="text-sm font-medium text-slate-700">
                  Click to select or drag and drop a file here
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Maximum file size: {MAX_FILE_SIZE_MB}MB (video, audio, HTML, SVG & executables are blocked)
                </p>
                <div className="mt-2.5 flex flex-wrap justify-center gap-1.5 text-[11px] text-slate-500">
                  {FORMAT_GROUPS.map((group) => (
                    <span
                      key={group.label}
                      className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200"
                    >
                      <strong className="text-slate-700">{group.label}:</strong> {group.items}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded bg-brand-100 text-brand-700 flex items-center justify-center text-[10px] font-bold uppercase">
                    {getFileExtension(selectedFile.name) || <FileText className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 truncate max-w-xs">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-slate-500">{formatBytes(selectedFile.size)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="p-1 text-slate-400 hover:text-rose-600 rounded"
                  aria-label="Remove selected file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Upload Progress Bar */}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                  <span>Uploading to repository...</span>
                  <span className="font-semibold">{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-600 rounded-full transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          /* File metadata info banner for Edit */
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-brand-600" />
              <div>
                <p className="text-xs font-semibold text-slate-800">Current File:</p>
                <p className="text-xs text-slate-600 font-mono">
                  {document.file?.originalName} ({formatBytes(document.file?.bytes)})
                </p>
              </div>
            </div>
            <span className="text-[11px] text-slate-500 italic">
              Use "Replace File" in actions table to update file
            </span>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            type="submit"
            isLoading={isLoading}
            disabled={activeCategories.length === 0}
            title={activeCategories.length === 0 ? 'Create a category first to enable document upload' : undefined}
          >
            {isEdit ? 'Save Changes' : 'Upload Document'}
          </Button>
        </div>
      </form>

      {/* Quick Category Creation Modal */}
      <CategoryFormModal
        isOpen={isQuickCategoryOpen}
        onClose={() => setIsQuickCategoryOpen(false)}
        onSubmit={handleQuickCreateCategory}
        isLoading={isCreatingCategory}
      />
    </Modal>
  );
};

export default DocumentFormModal;

