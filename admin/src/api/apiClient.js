import axios from 'axios';

const API_BASE_URL = import.meta.env?.PROD
  ? (import.meta.env.VITE_API_BASE_URL || '').trim()
  : (
      import.meta.env?.VITE_API_BASE_URL ||
      (typeof process !== 'undefined' ? process.env?.VITE_API_BASE_URL : '') ||
      'http://localhost:5001'
    ).trim();

if (import.meta.env?.PROD && !API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL must be configured for production admin builds.');
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Send and receive HttpOnly session cookies
  headers: {
    'X-Requested-With': 'XMLHttpRequest', // Anti-CSRF verification header
  },
});

// Intercept requests to ensure CSRF header is always attached for state changes
apiClient.interceptors.request.use(
  (config) => {
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses for consistent error formatting and session handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorData = error.response?.data;
    const message =
      errorData?.message ||
      (errorData?.errors ? errorData.errors.join(', ') : null) ||
      error.message ||
      'An unexpected network error occurred.';

    const normalizedError = new Error(message);
    normalizedError.status = error.response?.status;
    normalizedError.data = errorData;

    return Promise.reject(normalizedError);
  }
);

export default apiClient;
