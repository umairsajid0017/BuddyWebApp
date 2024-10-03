import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { User, LoginCredentials, RegisterData } from './types';

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export const register = (userData: RegisterData): Promise<AxiosResponse<{ user: User }>> =>
  api.post('/register', userData);

export const login = (credentials: LoginCredentials): Promise<AxiosResponse<{ user: User }>> =>
  api.post('/login', credentials);

export const logout = (): Promise<AxiosResponse<void>> =>
  api.post('/logout');

export const getUser = (): Promise<AxiosResponse<User>> =>
  api.get('/user');
