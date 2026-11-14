import React, { useState, useRef } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { Upload, FileText, X, AlertTriangle } from 'lucide-react';
import {
  FILE_INPUT_ACCEPT,
  FORMAT_GROUPS,
  MAX_FILE_SIZE_MB,
  formatBytes,
  getFileExtension,
  validateClientFile,
} from '../../utils/fileFormats';

export const ReplaceFileModal = ({
  isOpen,
  onClose,
  onSubmit,
  document = null,
  isLoading = false,
}) => {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

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

    if (!selectedFile) {
      setError('Please choose a replacement file.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      await onSubmit(document._id, formData, (progressEvent) => {
        if (progressEvent.total) {
          const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(pct);
        }
      });

      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      onClose();
    } catch (err) {
      setError(err.message || 'File replacement failed.');
    }
  };

  if (!document) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Replace Document File"
      description={`Update the attached file for "${document.title}".`}
      maxWidth="max-w-lg"
      showClose={!isLoading}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

        {/* Current File Information */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Current Document File
          </p>
          <div className="flex items-center gap-2.5">
            <FileText className="w-4 h-4 text-slate-500 flex-shrink-0" />
            <span className="text-sm font-medium text-slate-800 truncate">
              {document.file?.originalName}
            </span>
            {(document.file?.extension || document.file?.format) && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-slate-200 text-slate-700">
                {document.file.extension || document.file.format}
              </span>
            )}
            <span className="text-xs text-slate-500">
              ({formatBytes(document.file?.bytes)})
            </span>
          </div>
        </div>

        {/* Safety Notice */}
        <div className="flex items-start gap-2.5 p-3 bg-blue-50/60 border border-blue-100 rounded-lg text-xs text-blue-800">
          <AlertTriangle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Safe Replacement:</strong> The new file is uploaded and verified first.
            The previous asset is deleted from Cloudinary using its tracked resource type only after the database update succeeds.
          </p>
        </div>

        {/* New File Picker */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Replacement File <span className="text-rose-500">*</span>
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
              <Upload className="w-7 h-7 mx-auto text-slate-400 mb-1.5" />
              <p className="text-sm font-medium text-slate-700">
                Click or drag & drop replacement file
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Max {MAX_FILE_SIZE_MB}MB • {FORMAT_GROUPS.map((g) => g.items).join(', ')}
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-brand-100 text-brand-700 flex items-center justify-center text-[10px] font-bold uppercase">
                  {getFileExtension(selectedFile.name) || <FileText className="w-4 h-4" />}
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
                aria-label="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Progress bar */}
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                <span>Replacing file in repository...</span>
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

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            type="submit"
            isLoading={isLoading}
            disabled={!selectedFile}
          >
            Confirm & Replace File
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ReplaceFileModal;
