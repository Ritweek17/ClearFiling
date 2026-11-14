import apiClient from './apiClient';

export const authApi = {
  login: async ({ email, password }) => {
    return await apiClient.post('/api/admin/auth/login', { email, password });
  },

  logout: async () => {
    return await apiClient.post('/api/admin/auth/logout');
  },

  getMe: async () => {
    return await apiClient.get('/api/admin/auth/me');
  },
};

export default authApi;

