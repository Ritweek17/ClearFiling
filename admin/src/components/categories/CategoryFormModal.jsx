import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Alert from '../common/Alert';

export const CategoryFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  category = null, // null for create, object for edit
  isLoading = false,
}) => {
  const isEdit = Boolean(category?._id);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    displayOrder: 0,
    isActive: true,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        slug: category.slug || '',
        description: category.description || '',
        displayOrder: category.displayOrder ?? 0,
        isActive: category.isActive ?? true,
      });
    } else {
      setFormData({
        name: '',
        slug: '',
        description: '',
        displayOrder: 0,
        isActive: true,
      });
    }
    setError(null);
  }, [category, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError('Category name is required.');
      return;
    }

    try {
      await onSubmit({
        ...formData,
        name: formData.name.trim(),
        slug: formData.slug.trim() || undefined,
        description: formData.description.trim(),
        displayOrder: Number(formData.displayOrder) || 0,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save category.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Document Category' : 'Create New Category'}
      description="Organize repository documents into intuitive business categories."
      maxWidth="max-w-md"
      showClose={!isLoading}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

        <div>
          <label htmlFor="cat-name" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Category Name <span className="text-rose-500">*</span>
          </label>
          <input
            id="cat-name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. GST Compliance & Returns"
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label htmlFor="cat-slug" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            URL Slug <span className="text-slate-400 font-normal normal-case">(auto-generated if blank)</span>
          </label>
          <input
            id="cat-slug"
            name="slug"
            type="text"
            value={formData.slug}
            onChange={handleChange}
            placeholder="e.g. gst-compliance-returns"
            className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label htmlFor="cat-desc" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Description
          </label>
          <textarea
            id="cat-desc"
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            placeholder="Brief explanation of documents contained in this category..."
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-1">
          <div>
            <label htmlFor="cat-order" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Display Order
            </label>
            <input
              id="cat-order"
              name="displayOrder"
              type="number"
              value={formData.displayOrder}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center pt-6">
            <label className="relative flex items-center gap-2 cursor-pointer select-none">
              <input
                name="isActive"
                type="checkbox"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
              />
              <span className="text-sm font-medium text-slate-700">Active Status</span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" isLoading={isLoading}>
            {isEdit ? 'Save Changes' : 'Create Category'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CategoryFormModal;

