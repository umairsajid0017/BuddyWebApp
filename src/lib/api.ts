import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import { type User, type LoginCredentials, type RegisterData } from './types';
import { env } from "@/env";

const api: AxiosInstance = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

export const register = (userData: RegisterData): Promise<AxiosResponse<{ user: User }>> =>
  api.post('/register', userData, );

export const login = (credentials: LoginCredentials): Promise<AxiosResponse<{ user: User }>> =>
  api.post('/login', credentials);

export const logout = (): Promise<AxiosResponse<void>> =>
  api.post('/logout');

export const getUser = (): Promise<AxiosResponse<User>> =>
  api.get('/user');
