import { Booking } from "./booking-types";

export interface ImageType {
  id: number;
  name: string;
}

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




export interface ApiResponse<T> {
  data: T;
  message?: string;
}



export interface TaskCardProps {
  booking: Booking;
}



export interface VerifyOtpError {
  status: boolean;
  message: string;
  errors?: Record<string, string[]>;
}




export interface Location {
  latitude: string;
  longitude: string;
}












export interface SearchProfile {
  // Add profile fields when available
  id: number;
  [key: string]: any;
}




export interface Customer {
  id: number;
  login_type: string;
  is_online: number;
  otp_verify: string;
  name: string;
  email: string;
  phone: string;
  email_verified_at: string | null;
  image: string | null;
  dob: string | null;
  country: string | null;
  gender: string | null;
  address: string | null;
  location: string | null;
  location_updated_at: string | null;
  civil_id_number: string | null;
  company_id: number | null;
  role: string;
  category_id: number | null;
  status: number;
  remember_token: string;
  created_at: string;
  updated_at: string;
  registration_number: string | null;
  tax_number: string | null;
  is_verify: string;
}

export interface Worker {
  id: number;
  login_type: string;
  is_online: number;
  otp_verify: string;
  name: string;
  email: string;
  phone: string | null;
  email_verified_at: string | null;
  image: string | null;
  dob: string | null;
  country: string | null;
  gender: string | null;
  address: string | null;
  location: string | null;
  location_updated_at: string | null;
  civil_id_number: string | null;
  company_id: number | null;
  role: string;
  category_id: number | null;
  status: number;
  remember_token: string;
  created_at: string;
  updated_at: string;
  registration_number: string | null;
  tax_number: string | null;
  is_verify: string;
}




export interface MediaFiles {
  images?: File[];
  videos?: File[];
  audio?: File;
}



