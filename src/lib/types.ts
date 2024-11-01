import { Category } from "./types/category-types";

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  email_verified_at: string | null;
  image: string | null;
  dob: string | null;
  country: string | null;
  gender: string | null;
  address: string | null;
  loginType: string;
  otp: string;
  otp_expires_at: string;
  long: number | null;
  lat: number | null;
  civil_id_number: string | null;
  company_id: number | null;
  attachments: string | null;
  role: string | null;
  status: number;
  created_at: string;
  updated_at: string;
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
  errors?: Record<string, string[]>;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  category_id: number;
  long: number | null;
  lat: number | null;
  user_id: number;
  created_at: string | null;
  updated_at: string | null;
  user: User;
  category: Category;
  ratings: unknown[];
}

export interface ServicesResponse extends ApiResponse<Service[]> {
  data: Service[];
  message?: string;
  success: boolean;
}
export interface ServiceResponse extends ApiResponse<Service> {
  data: Service;
  message?: string;
  success: boolean;
}
interface InboxItemInterface {
  id: string;
  senderName: string;
  senderAvatar: string;
  title: string;
  description?: string;
  date: string;
  read: boolean;
}

export interface SearchServicesResponse {
  service_id: number;
  service_name: string;
  image: string;
  price: string;
  user_name: string;
  address: string;
  average_rating: number;
  is_favorite: number;
  total_reviews: number;
  tag_line: string;
}

export type InboxItem = Partial<Record<keyof InboxItemInterface, any>>;
