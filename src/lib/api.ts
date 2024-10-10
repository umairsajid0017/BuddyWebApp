import axios, { AxiosError, AxiosResponse, type AxiosInstance } from 'axios';
import { type User, type LoginCredentials, type RegisterData, VerifyOtpResponse, VerifyOtpError, VerifyOtpData, Service, ServicesResponse } from './types';
import { useMutation, UseMutationResult, useQuery, UseQueryOptions } from 'react-query';
import useAuthStore from '@/store/authStore';

export const api: AxiosInstance = axios.create({
  baseURL: '/api',
  withCredentials: true,
});
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});
export const useRegister = () =>
  useMutation((userData: RegisterData) => 
    api.post<{ status: boolean; message: string; data?: { user: User } }>('/register', userData)
    .then(response => {
      if (response.data.status === false) {
        throw new Error(response.data.message);
      }
      return response.data.data;
    })
  );

  export const useLogin = () =>
    useMutation((credentials: LoginCredentials) => 
      api.post<{ 
        status: boolean; 
        token: string; 
        user: User;
        message?: string
      }>('/login', credentials)
      .then(response => {
        if (response.data.status === false) {
          throw new Error(response.data.message || "Login failed");
        }
        return response.data;
      })
    );
export const useLogout = () =>
  useMutation(() => api.post<void>('/logout'));

export const useUser = () =>
  useQuery(['user'], () => api.get<User>('/user'));

export const useVerifyOtp = () => {
  return useMutation<VerifyOtpResponse, AxiosError<VerifyOtpError>, VerifyOtpData>(
    (data) => api.post('/verify-otp', data),
    {
      onSuccess: (data) => {
        console.log('OTP verified successfully:', data);
      },
      onError: (error) => {
        if (error.response) {
          console.error('OTP verification failed:', error.response.data);
        } else {
          console.error('OTP verification failed:', error.message);
        }
      },
    }
  );
};


export const useServices = (options?: UseQueryOptions<ServicesResponse, AxiosError>) => {
  return useQuery<ServicesResponse, AxiosError>(
    ['services'],
    async () => {
      const response = await api.get<ServicesResponse>('/services');
      return response.data;
    },
    options
  );
};

export const useService = (id: number, options?: UseQueryOptions<Service, AxiosError>) => {
  return useQuery<Service, AxiosError>(
    ['service', id],
    async () => {
      const response = await api.get<Service>(`/services/${id}`);
      return response.data;
    },
    options
  );
};

export const useCreateService = (): UseMutationResult<AxiosResponse<Service>, AxiosError, Partial<Service>> => {
  return useMutation((newService: Partial<Service>) => api.post<Service>('/services', newService));
};

export const useUpdateService = (): UseMutationResult<AxiosResponse<Service>, AxiosError, { id: number; updates: Partial<Service> }> => {
  return useMutation(({ id, updates }: { id: number; updates: Partial<Service> }) => 
    api.put<Service>(`/services/${id}`, updates)
  );
};

export const useDeleteService = (): UseMutationResult<AxiosResponse<void>, AxiosError, number> => {
  return useMutation((id: number) => api.delete(`/services/${id}`));
};