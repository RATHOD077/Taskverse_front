// src/api/api.js
import axios from 'axios';

const BASE_URL = 'https://taskverse-back.onrender.com/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request Interceptor: attach token to every request ───────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor: ONLY redirect on explicit token errors ────────────
// We do NOT auto-logout on every 401 — only when the backend explicitly says
// the token is invalid or expired (not for business logic 401s).
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || '';

    // Only force logout if backend explicitly says token is bad
    const isTokenError =
      status === 401 &&
      (
        message.toLowerCase().includes('expired') ||
        message.toLowerCase().includes('invalid token') ||
        message.toLowerCase().includes('no token')
      );

    if (isTokenError) {
      const isAdminPage = window.location.pathname.startsWith('/admin');
      localStorage.removeItem('token');
      localStorage.removeItem('admin');
      localStorage.removeItem('user');
      window.location.href = isAdminPage ? '/admin' : '/login';
    }

    return Promise.reject(error);
  }
);

export default api;


