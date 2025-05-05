import axios from 'axios';
import { logApiError } from '@/helpers/errorLogger';

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
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