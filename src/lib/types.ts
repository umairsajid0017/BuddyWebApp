export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  loginType?: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  phone: string;
  otp?: string; 
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface VerifyOtpData {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  status: boolean;
  message: string;
  user?: User;
}

export interface VerifyOtpError {
  status: boolean;
  message: string;
  errors?: {
    [key: string]: string[];
  };
}