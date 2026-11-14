import React, { useState } from 'react';
import { Edit2, Trash2, Folder, AlertCircle } from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import ConfirmModal from '../common/ConfirmModal';
import EmptyState from '../common/EmptyState';

export const CategoryTable = ({
  categories = [],
  onEdit,
  onDelete,
  isLoading = false,
}) => {
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    try {
      setIsDeleting(true);
      await onDelete(categoryToDelete._id);
      setCategoryToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isLoading && categories.length === 0) {
    return (
      <EmptyState
        icon={Folder}
        title="No categories configured"
        description="Create your first document category to organize uploaded PDFs."
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
                <th className="py-3 px-4">Category Name</th>
                <th className="py-3 px-4">Slug</th>
                <th className="py-3 px-4">Documents</th>
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {categories.map((cat) => {
                const hasDocs = (cat.documentCount || 0) > 0;

                return (
                  <tr key={cat._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-900">{cat.name}</div>
                      {cat.description && (
                        <div className="text-xs text-slate-500 truncate max-w-xs">
                          {cat.description}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-600">
                      {cat.slug}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          hasDocs
                            ? 'bg-brand-50 text-brand-700 font-semibold'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {cat.documentCount || 0} document{cat.documentCount === 1 ? '' : 's'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 text-xs">
                      {cat.displayOrder ?? 0}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge status={cat.isActive ? 'active' : 'inactive'} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={Edit2}
                          onClick={() => onEdit(cat)}
                          className="text-slate-600 hover:text-brand-600"
                          aria-label={`Edit ${cat.name}`}
                        >
                          <span className="sr-only">Edit</span>
                        </Button>

                        {/* If category has documents, disable deletion with tooltip */}
                        {hasDocs ? (
                          <div className="relative group inline-block">
                            <button
                              type="button"
                              disabled
                              className="p-1.5 text-slate-300 cursor-not-allowed rounded"
                              aria-label="Cannot delete category containing documents"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <div className="absolute right-0 bottom-full mb-1 hidden group-hover:block z-10 w-48 p-2 bg-slate-900 text-white text-[11px] rounded shadow-lg">
                              Cannot delete category with {cat.documentCount} active document(s). Reassign or delete documents first.
                            </div>
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={Trash2}
                            onClick={() => setCategoryToDelete(cat)}
                            className="text-slate-600 hover:text-rose-600"
                            aria-label={`Delete ${cat.name}`}
                          >
                            <span className="sr-only">Delete</span>
                          </Button>
                        )}
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
      {categoryToDelete && (
        <ConfirmModal
          isOpen={Boolean(categoryToDelete)}
          onClose={() => setCategoryToDelete(null)}
          onConfirm={handleConfirmDelete}
          isLoading={isDeleting}
          title={`Delete Category "${categoryToDelete.name}"`}
          message="Are you sure you want to delete this category? This action cannot be undone."
          confirmText="Delete Category"
          confirmVariant="danger"
          type="danger"
        />
      )}
    </>
  );
};

export default CategoryTable;

