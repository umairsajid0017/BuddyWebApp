import { type Category } from "./types/category-types";
import { type ServiceRating } from "./types/service-types";

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
  login_type: string;
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
  is_online: string;
  otp_verify: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  login_type?: string;
  role?: string;
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
  error: boolean;
  message: string;
  // user?: User;
  // remaining_attempts: number;
}

export interface VerifyOtpError {
  status: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

export interface Service {
  id: number;
  service_name: string;
  description: string;
  fixed_price: string;
  image: string;
  images: ServiceImage[];
  category_id: number;
  long: number | null;
  lat: number | null;
  user_id: number;
  created_at: string | null;
  updated_at: string | null;
  user: User;
  category: Category;
  ratings: ServiceRating[];
}

interface ServiceRecords {
  id: number;
  service_name: string;
  description: string;
  fixed_price: string;
  image: string;
  images: string;
  category_id: number;
  long: number | null;
  lat: number | null;
  user_id: number;
  created_at: string | null;
  updated_at: string | null;
  user: User;
  category: Category;
  ratings: ServiceRating[];
}
export interface ServicesResponse extends ApiResponse<Service[]> {
  records: ServiceRecords[];
  message?: string;
  status: boolean;
}

export interface ServiceImage {
  id: string;
  name: string;
}

export interface ServiceDetailType {
  id: number;
  name: string;
  tagline: string;
  image: string;
  images: ServiceImage[];
  description: string;
  fixed_price: string;
  address: string;
  category_id: number;
  long: string | null;
  lat: string | null;
  user_id: number;
  created_at: string;
  updated_at: string;
  added_by: string | null;
  user: User;
  category: Category;
}

export interface ServiceResponse {
  error: boolean;
  message: string;
  records: ServiceDetailType;
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

export type InboxItem = Partial<Record<keyof InboxItemInterface, unknown>>;

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
}

export interface ChangePasswordResponse {
  status: boolean;
  message: string;
}

export interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  dob: string | null;
  country: string | null;
  gender: string | null;
  address: string | null;
  civil_id_number: string | null;
}

export interface RegisterResponse {
  error: boolean;
  message: string | Record<string, string[]>;
  records?: {
    name: string;
    email: string;
    phone: string;
    role: string;
    updated_at: string;
    created_at: string;
    id: number;
  };
}

export interface CheckCredentialsResponse {
  error: boolean;
  message: string;
  records: {
    email: boolean;
    phone: boolean;
  };
}

export interface ResetPasswordOtpResponse {
  error: boolean;
  message: string;
}

export interface ResetPasswordResponse {
  error: boolean;
  message: string;
}

export interface ResetPasswordData {
  email: string;
  password: string;
  otp: string;
}

export interface SendOtpResponse {
  error: boolean;
  message: string;
  records?: {
    otp: string;
    otp_expires_at: string;
    next_retry_at?: string;
    remaining_attempts: number;
  };
}

export interface SendOtpData {
  email: string;
  role: "customer";
  // type: "register" | "reset" | "verify";
}

export interface SearchCategory {
  id: number;
  title: string;
  image: string;
}

export interface SearchProfile {
  // Add profile fields when available
  id: number;
  [key: string]: any;
}

export interface SearchService {
  id: number;
  name: string;
  images: {
    id: number;
    name: string;
  }[];
  description: string;
  fixed_price: string;
  hourly_price: string;
  address: string;
  category_id: number;
  user_id: number;
  price_mode: "fixed" | "hourly";
}

export interface SearchServiceResponse {
  service_id: number;
  category_id: number;
  service_name: string;
  image: string | null;
  price: string | null;
  user_id: number;
  user_name: string;
  lat: number | null;
  long: number | null;
  address: string | null;
  average_rating: number;
  is_favorite: number;
  total_reviews: number;
  tag_line: string;
}

export interface SearchResponse {
  error: boolean;
  message: string;
  records: {
    categories: {
      id: number;
      title: string;
      image: string;
    }[];
    profiles: {
      id: number;
      name: string;
      email: string;
      phone: string | null;
      image: string | null;
      country: string | null;
      role: string;
      dob: string | null;
      gender: string | null;
      address: string | null;
      registration_number: string | null;
      tax_number: string | null;
    }[];
    services: {
      id: number;
      name: string;
      images: {
        id: number;
        name: string;
      }[];
      description: string;
      fixed_price: string;
      hourly_price: string;
      address: string | null;
      category_id: number;
      user_id: number;
      price_mode: "fixed" | "hourly";
    }[];
  };
}

export interface CategoryService {
  service_id: number;
  service_name: string;
  images: {
    id: number;
    name: string;
  }[];
  description: string;
  fixed_price: string;
  hourly_price: string;
  address: string;
  category_id: number;
  user_id: number;
  average_rating: number | null;
  is_favorite: number;
  total_reviews: number;
}

export interface CategoryServiceResponse {
  error: boolean;
  message: string;
  records: CategoryService[];
}
