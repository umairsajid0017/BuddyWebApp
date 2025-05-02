import { AxiosInstance, AxiosResponse } from "axios";
import api from "./axios";

export const http = {
  get: async <T>(url: string, params?: Record<string, any>): Promise<AxiosResponse<T>> => {
    return api.get<T>(url, { params });
  },

  post: async <T>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> => {
    return api.post<T>(url, data, config);
  },

  put: async <T>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> => {
    return api.put<T>(url, data, config);
  },

  patch: async <T>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> => {
    return api.patch<T>(url, data, config);
  },

  delete: async <T>(url: string, params?: Record<string, any>): Promise<AxiosResponse<T>> => {
    return api.delete<T>(url, { params });
  }
}; 