import apiClient from './apiClient';

export const documentApi = {
  getDocuments: async (params = {}) => {
    return await apiClient.get('/api/admin/documents', { params });
  },

  getDocumentById: async (id) => {
    return await apiClient.get(`/api/admin/documents/${id}`);
  },

  createDocument: async (formData, onUploadProgress) => {
    return await apiClient.post('/api/admin/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
    });
  },

  updateDocument: async (id, data) => {
    return await apiClient.patch(`/api/admin/documents/${id}`, data);
  },

  deleteDocument: async (id) => {
    return await apiClient.delete(`/api/admin/documents/${id}`);
  },

  publishDocument: async (id) => {
    return await apiClient.patch(`/api/admin/documents/${id}/publish`);
  },

  archiveDocument: async (id) => {
    return await apiClient.patch(`/api/admin/documents/${id}/archive`);
  },

  replaceDocumentFile: async (id, formData, onUploadProgress) => {
    return await apiClient.post(`/api/admin/documents/${id}/replace-file`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
    });
  },
};

export default documentApi;

