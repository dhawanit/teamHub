// src/services/authService.js
import { jwtDecode } from 'jwt-decode';

const TOKEN_KEY = 'token';

const authService = {
  getToken: () => localStorage.getItem(TOKEN_KEY),

  saveToken: (token) => localStorage.setItem(TOKEN_KEY, token),

  clearToken: () => localStorage.removeItem(TOKEN_KEY),

  isTokenExpired: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return true;

    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;
      return decoded.exp < now;
    } catch {
      return true;
    }
  },

  getUserId: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;

    try {
      return jwtDecode(token).userId;
    } catch {
      return null;
    }
  },
};

export default authService;
