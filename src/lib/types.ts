export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  phone: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}