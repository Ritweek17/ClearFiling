import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw, FolderKanban } from 'lucide-react';
import categoryApi from '../api/categoryApi';
import CategoryTable from '../components/categories/CategoryTable';
import CategoryFormModal from '../components/categories/CategoryFormModal';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import { TableSkeleton } from '../components/common/LoadingSkeleton';

export const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await categoryApi.getCategories();
      if (res?.success) {
        setCategories(res.categories || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateOrUpdate = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingCategory) {
        await categoryApi.updateCategory(editingCategory._id, formData);
        setSuccessMessage(`Category "${formData.name}" updated successfully.`);
      } else {
        await categoryApi.createCategory(formData);
        setSuccessMessage(`Category "${formData.name}" created successfully.`);
      }
      fetchCategories();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await categoryApi.deleteCategory(id);
      setSuccessMessage('Category deleted successfully.');
      fetchCategories();
    } catch (err) {
      setError(err.message || 'Failed to delete category.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Document Categories
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Group related tax, compliance, and legal forms into distinct catalog categories.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            icon={RefreshCw}
            onClick={fetchCategories}
            isLoading={loading}
          >
            Refresh
          </Button>

          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={() => {
              setEditingCategory(null);
              setIsModalOpen(true);
            }}
          >
            New Category
          </Button>
        </div>
      </div>

      {/* Notifications */}
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {successMessage && (
        <Alert
          type="success"
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}

      {/* Table or Loading State */}
      {loading ? (
        <TableSkeleton rows={6} cols={6} />
      ) : (
        <CategoryTable
          categories={categories}
          onEdit={(cat) => {
            setEditingCategory(cat);
            setIsModalOpen(true);
          }}
          onDelete={handleDelete}
        />
      )}

      {/* Create / Edit Modal */}
      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCategory(null);
        }}
        onSubmit={handleCreateOrUpdate}
        category={editingCategory}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default CategoriesPage;

