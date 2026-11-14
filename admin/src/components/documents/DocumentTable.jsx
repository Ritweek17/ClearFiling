import React, { useState } from 'react';
import {
  FileText,
  Edit2,
  Trash2,
  Upload,
  CheckCircle,
  Archive,
  ExternalLink,
  Eye,
  Download,
  AlertTriangle,
} from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import ConfirmModal from '../common/ConfirmModal';
import EmptyState from '../common/EmptyState';
import { formatBytes } from '../../utils/fileFormats';

export const DocumentTable = ({
  documents = [],
  onEdit,
  onReplaceFile,
  onPublish,
  onArchive,
  onDelete,
  isLoading = false,
}) => {
  const [docToDelete, setDocToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [docToArchive, setDocToArchive] = useState(null);
  const [isArchiving, setIsArchiving] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleConfirmDelete = async () => {
    if (!docToDelete) return;
    try {
      setIsDeleting(true);
      await onDelete(docToDelete._id);
      setDocToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleConfirmArchive = async () => {
    if (!docToArchive) return;
    try {
      setIsArchiving(true);
      await onArchive(docToArchive._id);
      setDocToArchive(null);
    } finally {
      setIsArchiving(false);
    }
  };

  if (!isLoading && documents.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No documents found"
        description="Try adjusting your filters or search query, or upload a new document."
      />
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Document Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">File Details</th>
                <th className="py-3 px-4">Stats</th>
                <th className="py-3 px-4">Updated</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {documents.map((doc) => {
                const isPublished = doc.status === 'published';
                const isArchived = doc.status === 'archived';

                return (
                  <tr key={doc._id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Title & Slug */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-900 line-clamp-1">
                        {doc.title}
                      </div>
                      <div className="text-xs text-slate-400 font-mono line-clamp-1">
                        /{doc.slug}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 text-slate-700 text-xs">
                      <span className="inline-block px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-medium">
                        {doc.category?.name || 'Uncategorized'}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      <Badge status={doc.status} />
                    </td>

                    {/* File Info & Link */}
                    <td className="py-3.5 px-4 text-xs">
                      {doc.file?.url ? (
                        <div className="flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-slate-100 text-slate-700 border border-slate-200 flex-shrink-0">
                            {doc.file.extension || doc.file.format || 'FILE'}
                          </span>
                          <a
                            href={doc.file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-800 font-medium hover:underline max-w-[160px] truncate"
                            title={doc.file.originalName}
                          >
                            <span className="truncate">{doc.file.originalName}</span>
                            <span className="text-slate-400 font-normal flex-shrink-0">
                              ({formatBytes(doc.file.bytes)})
                            </span>
                          </a>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">No file</span>
                      )}
                    </td>

                    {/* Views & Downloads */}
                    <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                      <span title="Views" className="inline-flex items-center gap-1 mr-2.5">
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        {doc.viewCount || 0}
                      </span>
                      <span title="Downloads" className="inline-flex items-center gap-1">
                        <Download className="w-3.5 h-3.5 text-slate-400" />
                        {doc.downloadCount || 0}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                      {formatDate(doc.updatedAt)}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1 justify-end">
                        {/* Publish / Unpublish Action */}
                        {!isPublished && (
                          <button
                            type="button"
                            onClick={() => onPublish(doc._id)}
                            className="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded transition-colors"
                            title="Publish Document"
                            aria-label={`Publish ${doc.title}`}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}

                        {isPublished && (
                          <button
                            type="button"
                            onClick={() => setDocToArchive(doc)}
                            className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                            title="Archive Document"
                            aria-label={`Archive ${doc.title}`}
                          >
                            <Archive className="w-4 h-4" />
                          </button>
                        )}

                        {/* Replace File */}
                        <button
                          type="button"
                          onClick={() => onReplaceFile(doc)}
                          className="p-1.5 text-slate-600 hover:text-brand-600 hover:bg-brand-50 rounded transition-colors"
                          title="Replace File"
                          aria-label={`Replace file for ${doc.title}`}
                        >
                          <Upload className="w-4 h-4" />
                        </button>

                        {/* Edit Metadata */}
                        <button
                          type="button"
                          onClick={() => onEdit(doc)}
                          className="p-1.5 text-slate-600 hover:text-brand-600 hover:bg-brand-50 rounded transition-colors"
                          title="Edit Document"
                          aria-label={`Edit ${doc.title}`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => setDocToDelete(doc)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                          title="Delete Document"
                          aria-label={`Delete ${doc.title}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {docToDelete && (
        <ConfirmModal
          isOpen={Boolean(docToDelete)}
          onClose={() => setDocToDelete(null)}
          onConfirm={handleConfirmDelete}
          isLoading={isDeleting}
          title={`Delete "${docToDelete.title}"`}
          message="Are you sure you want to delete this document? The stored file asset will be permanently removed from Cloudinary and cannot be recovered."
          confirmText="Delete Document"
          confirmVariant="danger"
          type="danger"
        />
      )}

      {/* Archive Confirmation Modal */}
      {docToArchive && (
        <ConfirmModal
          isOpen={Boolean(docToArchive)}
          onClose={() => setDocToArchive(null)}
          onConfirm={handleConfirmArchive}
          isLoading={isArchiving}
          title={`Archive "${docToArchive.title}"`}
          message="Archiving will remove this document from the public website immediately while preserving historical records for administrators."
          confirmText="Archive Document"
          confirmVariant="secondary"
          type="warning"
        />
      )}
    </>
  );
};

export default DocumentTable;

