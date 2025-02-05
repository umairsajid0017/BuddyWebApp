import useAuthStore from "@/store/authStore";
import axios, { AxiosError, AxiosInstance } from "axios";
import { UseQueryOptions, useQuery } from "react-query";
import { SearchResponse } from "@/lib/types";

// Types
interface SearchParams {
  keyword?: string;
  category_id?: number;
  price_from?: number;
  price_to?: number;
}

// Error response type
interface ApiError {
  message: string;
  status: number;
}

// Export the api instance for reuse
export const api: AxiosInstance = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

// Add request interceptor for authentication
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      const store = useAuthStore.getState();
      store.setUser(null);
      store.setToken(null);
      store.setError("Session expired. Please log in again.");
    }
    return Promise.reject(error);
  },
);

// Utility function to build query string from parameters
const buildQueryString = (params: SearchParams): string => {
  const queryParams = new URLSearchParams();

  if (params.keyword) queryParams.append("keyword", params.keyword);
  if (params.category_id)
    queryParams.append("category_id", params.category_id.toString());
  if (params.price_from)
    queryParams.append("price_from", params.price_from.toString());
  if (params.price_to)
    queryParams.append("price_to", params.price_to.toString());

  const queryString = queryParams.toString();
  return queryString ? `?${queryString}` : "";
};

// React Query hook for search with authentication
export const useSearchServices = (
  searchParams: SearchParams,
  options?: UseQueryOptions<SearchResponse, AxiosError<ApiError>>,
) => {
  return useQuery<SearchResponse, AxiosError<ApiError>>(
    ["services", "search", searchParams],
    async () => {
      try {
        const queryString = buildQueryString(searchParams);
        const response = await api.get<SearchResponse>(
          `/searchAll${queryString}`,
        );
        return response.data;

      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          throw new Error("Please log in to search services");
        }
        throw error;
      }
    },
    {
      enabled:
        Object.values(searchParams).some((param) => param !== undefined) &&
        Boolean(useAuthStore.getState().token),
      ...options,
      retry: (failureCount, error) => {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          return false;
        }
        return failureCount < 3;
      },
    },
  );
};
