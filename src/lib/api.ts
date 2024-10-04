import axios, { type AxiosInstance } from 'axios';
import { type User, type LoginCredentials, type RegisterData } from './types';
import { useMutation, useQuery } from 'react-query';

const api: AxiosInstance = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

export const useRegister = () =>
  useMutation((userData: RegisterData) => api.post<{ user: User }>('/register', userData));

export const useLogin = () =>
  useMutation((credentials: LoginCredentials) => api.post<{ user: User }>('/login', credentials));

export const useLogout = () =>
  useMutation(() => api.post<void>('/logout'));

export const useUser = () =>
  useQuery(['user'], () => api.get<User>('/user'));