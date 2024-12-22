import axios, {
  type AxiosError,
  type AxiosResponse,
  type AxiosInstance,
} from "axios";
import {
  type User,
  type LoginCredentials,
  type RegisterData,
  type VerifyOtpResponse,
  type VerifyOtpError,
  type VerifyOtpData,
  type Service,
  type ServicesResponse,
  ServiceResponse,
  type ChangePasswordData,
  type ChangePasswordResponse,
} from "./types";
import {
  useMutation,
  type UseMutationResult,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from "react-query";
import useAuthStore from "@/store/authStore";
import { deleteCookie } from "./cookies";
import { CategoryServicesResponse } from "./types/service-types";

interface ServerResponse {
  status: boolean;
  message: string;
  errors?: Record<string, string[]>;
  data?: { user: User };
}

class ServerError extends Error {
  errors?: Record<string, string[]>;

  constructor(message: string, errors?: Record<string, string[]>) {
    super(message);
    this.name = "ServerError";
    this.errors = errors;
  }
}

export const api: AxiosInstance = axios.create({
  baseURL: "/api",
  withCredentials: true,
});
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//The useRegister hook is a custom hook that uses the useMutation hook from react-query to register a new user.
//It sends a POST request to the /register endpoint with the user's data and returns the response data.
export const useRegister = () =>
  useMutation((userData: RegisterData) =>
    api.post<ServerResponse>("/register", userData).then((response) => {
      if (response.data.status === false) {
        throw new ServerError(response.data.message, response.data.errors);
      }
      return response.data.data;
    }),
  );

//The useLogin hook is a custom hook that uses the useMutation hook from react-query to log in a user.
//It sends a POST request to the /login endpoint with the user's credentials and returns the response data.
export const useLogin = () =>
  useMutation((credentials: LoginCredentials) =>
    api
      .post<{
        error: boolean;
        token: string;
        records: User;
        message?: string;
      }>("/login", credentials)
      .then((response) => {
        if (response.data.error) {
          throw new Error(response.data.message ?? "Login failed");
        }
        return response.data;
      }),
  );

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async () => {
      try {
        // Clear all auth-related state
        useAuthStore.getState().setUser(null);
        useAuthStore.getState().setToken(null);
        useAuthStore.getState().setError(null);

        // Clear all React Query cache
        queryClient.clear();

        // Clear any auth-related items from localStorage
        localStorage.removeItem("auth-storage");

        //Delete Cookie
        try {
          const cookieRes = await deleteCookie("token");
          console.log("Cookie deleted:", cookieRes);
        } catch (error) {
          console.log("Error deleting cookie:", error);
        }
        return { success: true };
      } catch (error) {
        console.error("Logout error:", error);
        throw error;
      }
    },
    {
      retry: false,
      onSettled: () => {
        // Ensure state is cleared regardless of success/failure
        useAuthStore.getState().setUser(null);
        useAuthStore.getState().setToken(null);
      },
    },
  );
};

//The useUser hook is a custom hook that uses the useQuery hook from react-query to fetch the current user data.
//At the current moment this hook is useless for our code
export const useUser = () => useQuery(["user"], () => api.get<User>("/user"));

//The useVerifyOtp hook is a custom hook that uses the useMutation hook from react-query to verify an OTP code.
//It sends a POST request to the /verify-otp endpoint with the OTP code and returns the response data.
//It takes and email and an OTP that was sent to the user and returns the response data.
export const useVerifyOtp = () => {
  return useMutation<
    VerifyOtpResponse,
    AxiosError<VerifyOtpError>,
    VerifyOtpData
  >((data) => api.post("/verify-otp", data), {
    onSuccess: (data) => {
      console.log("OTP verified successfully:", data);
    },
    onError: (error) => {
      if (error.response) {
        console.error("OTP verification failed:", error.response.data);
      } else {
        console.error("OTP verification failed:", error.message);
      }
    },
  });
};

// To use the useServices hook in your components, you can import it like this:
// import { useServices } from '@/lib/api'
// const { data: services, isLoading, isError } = useServices()
// This will fetch the services from the API and return the data, loading state, and error state.
export const useServices = (
  options?: UseQueryOptions<Service[], AxiosError>,
) => {
  return useQuery<Service[], AxiosError>(
    ["services"],
    async () => {
      const response = await api.get<ServicesResponse>("/getServices");
      console.log("Services Response in the API", response);
      return response.data.records;
    },
    options,
  );
};

//The useService hook is a custom hook that uses the useQuery hook from react-query to fetch a single service by its ID.
//It takes the service ID as an argument and returns the service data.
export const useService = (
  id: number,
  options?: UseQueryOptions<ServiceResponse, AxiosError>,
) => {
  return useQuery<ServiceResponse, AxiosError>(
    ["service", id],
    async () => {
      //const formData = new FormData();
      // formData.append("service_id", id.toString());
      const response = await api.get<ServiceResponse>(`/getServiceDetail`, {
        params: {
          service_id: id,
        },
      });
      return response.data;
    },
    options,
  );
};

//The useCreateService hook is a custom hook that uses the useMutation hook from react-query to create a new service.
//At the current moment this hook is useless for our code
export const useCreateService = (): UseMutationResult<
  AxiosResponse<Service>,
  AxiosError,
  Partial<Service>
> => {
  return useMutation((newService: Partial<Service>) =>
    api.post<Service>("/getServices", newService),
  );
};

//The useUpdateService hook is a custom hook that uses the useMutation hook from react-query to update an existing service.
//At the current moment this hook is useless for our code
export const useUpdateService = (): UseMutationResult<
  AxiosResponse<Service>,
  AxiosError,
  { id: number; updates: Partial<Service> }
> => {
  return useMutation(
    ({ id, updates }: { id: number; updates: Partial<Service> }) =>
      api.put<Service>(`/getServices/${id}`, updates),
  );
};

export const useDeleteService = (): UseMutationResult<
  AxiosResponse<void>,
  AxiosError,
  number
> => {
  return useMutation((id: number) => api.delete(`/getServices/${id}`));
};

// Add this new hook for fetching services by category
export const useServicesByCategory = (
  categoryId: string,
  options?: UseQueryOptions<CategoryServicesResponse, AxiosError>,
) => {
  return useQuery<CategoryServicesResponse, AxiosError>(
    ["services", "category", categoryId],
    async () => {
      const response = await api.get<CategoryServicesResponse>(
        "/servicesAgainstCategory",
        {
          params: { category_id: categoryId },
        },
      );
      return response.data;
    },
    options,
  );
};

export const useChangePassword = () => {
  const user = useAuthStore.getState().user;

  return useMutation<ChangePasswordResponse, AxiosError, ChangePasswordData>(
    async (passwordData: ChangePasswordData) => {
      if (!user?.id) throw new Error("User not found");

      const response = await api.put<ChangePasswordResponse>(
        `/users/${user.id}/change-password`,
        passwordData,
      );

      if (!response.data.status) {
        throw new Error(response.data.message);
      }

      return response.data;
    },
  );
};
