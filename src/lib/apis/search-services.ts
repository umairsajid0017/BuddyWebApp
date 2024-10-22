import useAuthStore from "@/store/authStore";
import axios, { AxiosError, AxiosInstance } from "axios";
import { UseQueryOptions, useQuery } from "react-query";
import { SearchServicesResponse as Service } from "@/lib/types";
// Types
interface SearchParams {
  name?: string;
  category_id?: number;
  price_from?: number;
  price_to?: number;
}

// API Response type
interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
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
      store.setError("Session expired. Please log in again."); // You might want to redirect to login page here
    }
    return Promise.reject(error);
  },
);

// Utility function to build query string from parameters
const buildQueryString = (params: SearchParams): string => {
  const queryParams = new URLSearchParams();

  if (params.name) queryParams.append("name", params.name);
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
  options?: UseQueryOptions<Service[], AxiosError<ApiError>>,
) => {
  return useQuery<Service[], AxiosError<ApiError>>(
    ["services", "search", searchParams],
    async () => {
      try {
        const queryString = buildQueryString(searchParams);
        const response = await api.get<ApiResponse<Service[]>>(
          `/getSearch${queryString}`,
        );
        return response.data.data; // Access the data property of the API response
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          // Handle unauthorized access
          throw new Error("Please log in to search services");
        }
        throw error;
      }
    },
    {
      // Only execute the query if at least one search parameter is provided
      enabled:
        Object.values(searchParams).some((param) => param !== undefined) &&
        Boolean(useAuthStore.getState().token), // Only run if authenticated
      ...options,
      retry: (failureCount, error) => {
        // Don't retry on 401 unauthorized
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          return false;
        }
        return failureCount < 3; // Retry other errors up to 3 times
      },
    },
  );
};

// Example usage:
/*
function ServiceSearchComponent() {
  const { data: services, isLoading, error, isError } = useSearchServices({
    name: "cleaning",
    price_from: 50,
    price_to: 200
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) {
    return <div>Error: {error?.response?.data?.message || error.message}</div>;
  }

  return (
    <div>
      {services?.map(service => (
        <div key={service.id}>{service.name}</div>
      ))}
    </div>
  );
}
*/
