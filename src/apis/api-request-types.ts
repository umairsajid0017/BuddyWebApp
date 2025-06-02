import { RoleType } from "@/constants/constantValues";
import { Category } from "@/types/category-types";
import { MediaFiles } from "@/types/general-types";

export interface LoginCredentials {
  email: string;
  password?: string | null;
  login_type?: string;
  role?: string;
}


export interface RegisterData extends LoginCredentials {
  name: string;
  phone: string;
  otp?: string;
}
export interface VerifyOtpData {
  email: string;
  otp: string;
}

export interface SearchParams {
  name?: string;
  keyword?: string;
  category_id?: number;
  price_from?: number;
  price_to?: number;
}

export interface CancelBidRequest {
  bid_id: number;
  bid_canceled_reason: string;
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

export interface ResetPasswordData {
  email: string;
  password: string;
  otp: string;
}

export interface SendOtpData {
  email: string;
  role: RoleType.CUSTOMER;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  phone: string;
  otp?: string;
}

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface CreateBidData {
  category_id: string;
  expected_price: string;
  description?: string;
  images?: File[];
  audio?: File;
  address: string;
}

export interface CreateBookingData {
  worker_id: string;
  service_id: string;
  description?: string;
  images?: File[];
  audio?: File;
  booking_date: string;
  address: string;
}

export interface CreateBidRequest {
  customer_id: number;
  service_id: string;
  description?: string;
  price: string;
  images?: File[];
  audio?: File;
}

export interface AddToWalletData {
  amount: string;
  payment_method_id: string;
  comment: string;
  order_total_amount: number;
  action: string;
}

export interface CnicVerificationRequest {
  cnic_front: File;
  cnic_back: File;
}

export interface LivePhotoVerificationRequest {
  live_photo: File;
}

export interface PassportVerificationRequest {
  passport_photo: File;
}
export interface BidResponseRequest {
  bid_id: number;
}

export interface BidFormData {
  category: Category | null;
  description: string;
  budget: number;
  mediaFiles?: MediaFiles;
  address: string;
}

export interface AddReviewData {
  service_id: string;
  rating: string;
  comment: string;
}

