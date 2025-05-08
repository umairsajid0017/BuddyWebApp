import axios from 'axios';
import { logApiError } from '@/helpers/errorLogger';

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
  localStorage.setItem('token', token || '');
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log(token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    logApiError(error);
    return Promise.reject(error);
  }
);

// Add response interceptors for detailed error logging
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    logApiError(error);
    return Promise.reject(error);
  }
);

export default api; 