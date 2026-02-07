// src/lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true, // ✅ WICHTIG für Cookies
});

// Automatischer Redirect bei 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('Nicht authentifiziert');
      // Optional: window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;