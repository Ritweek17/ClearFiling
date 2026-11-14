import apiClient from './apiClient';

export const categoryApi = {
  getCategories: async (params = {}) => {
    return await apiClient.get('/api/admin/categories', { params });
  },

  createCategory: async (data) => {
    return await apiClient.post('/api/admin/categories', data);
  },

  updateCategory: async (id, data) => {
    return await apiClient.patch(`/api/admin/categories/${id}`, data);
  },

  deleteCategory: async (id) => {
    return await apiClient.delete(`/api/admin/categories/${id}`);
  },
};

export default categoryApi;

