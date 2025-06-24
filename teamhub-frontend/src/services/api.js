import axios from 'axios';
import authService from './authService'; // Ensure this file handles token storage/expiration
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔐 Add Authorization header to each request if token exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token && !authService.isTokenExpired(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ❌ Handle token expiration or unauthorized access globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      toast.error('Session expired. Please login again.');
      localStorage.removeItem('token');
      window.location.href = '/login'; // redirect to login
    }

    return Promise.reject(error);
  }
);

export default api;
