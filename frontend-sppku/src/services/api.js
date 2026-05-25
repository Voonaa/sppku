import axios from 'axios';

/**
 * Axios custom instance untuk integrasi dengan REST API Backend Laravel 12.
 * Menggunakan port 8000 (port standar dari php artisan serve) agar sinkron secara luring.
 */
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor untuk memasukkan X-Id-Petugas secara otomatis pada setiap request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['X-Id-Petugas'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
