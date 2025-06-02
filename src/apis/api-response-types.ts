import { Offer } from '@/types/bid-types';

import { Booking } from "@/types/booking-types";
import { AvailabilityDetail, User } from "../types/general-types";
import { CategoryService, Service } from "../types/service-types";
import { Bid } from "@/types/bid-types";
import { FAQ } from "@/types/faq-types";
import { Category } from "@/types/category-types";
import { Transaction } from "@/types/wallet-types";
import { SpecialOffer } from "@/types/special-offers-types";
import {
  CnicVerificationRecord,
  VerificationStatus,
} from "@/types/verification-types";
import { Bookmark } from '@/types/bookmark-types';
import { Notification } from '@/types/notification-types';

export interface GeneralResponse {
  error: boolean;
  message: string;
  records?: any;
}

export interface UserResponse {
  error: boolean;
  message: string;
  records: User;
}

export interface RegisterResponse {
  error: boolean;
  message: string | Record<string, string[]>;
  records?: User;
}

export interface LoginResponse {
  error: boolean;
  token: string;
  records: User;
  message?: string;
  error_code?: string;
}

export interface CheckCredentialsResponse {
  error: boolean;
  message: string;
  records: {
    email: boolean;
    phone: boolean;
  };
}

export interface SendOtpResponse {
  error: boolean;
  message: string;
  your_otp?: number;
  records?: {
    otp: number;
    otp_expires_at: string;
    next_retry_at?: string;
    remaining_attempts: number;
  };
}

export interface VerifyOtpResponse {
  error: boolean;
  message: string;
}
export interface UserDetailResponse {
  error: boolean;
  message: string;
  records: User;
}

export interface ServicesResponse {
  error: boolean;
  message: string;
  records: Service[];
}

export interface CategoryServicesResponse {
  records: Service[];
  error: boolean;
  message: string;
}

export interface CancelBidResponse {
  error: boolean;
  message: string;
}

export interface BookingsResponse {
  error: boolean;
  message: string;
  records: Booking[];
}

export interface BidResponse {
  error: boolean;
  message: string;
  records: Bid;
}

export interface BidsResponse {
  error: boolean;
  message: string;
  records: Bid[];
}

export interface CreateBookingResponse {
  error: boolean;
  message: string;
  records: Booking;
}

export interface UserDetailResponse {
  error: boolean;
  message: string;
  records: User;
}

export interface FAQResponse {
  error: boolean;
  message: string;
  records: FAQ[];
}

export interface CategoriesResponse{
  error: boolean;
  message: string;
  records: Category[];
}

export interface CategoryResponse{
  error: boolean;
  message: string;
  records: Category;
}

export interface SearchResponse {
  error: boolean;
  message: string;
  records: {
    categories: Category[];
    services: Service[];
    profiles: User[];
  };
}

export interface OfferResponse {
  error: boolean;
  message: string;
  records: Offer[];
}

export interface ServiceResponse {
  error: boolean;
  message: string;
  records: Service;
}

export interface SpecialOffersResponse {
  error: boolean;
  message: string;
  records: SpecialOffer[];
}

export interface CnicVerificationResponse {
  error: boolean;
  message: string;
  records: CnicVerificationRecord;
}

export interface LivePhotoVerificationResponse {
  error: boolean;
  message: string;
  records?: CnicVerificationRecord;
}

export interface PassportVerificationResponse {
  error: boolean;
  message: string;
  records?: CnicVerificationRecord;
}

export interface VerificationCheckResponse {
  error: boolean;
  message: string;
  role: string;
  userVerified: boolean;
  cnicInfo: VerificationStatus;
  livePhotoRecord: VerificationStatus;
  passportPhotoRecord: VerificationStatus;
}

export interface TransactionResponse {
  error: boolean;
  message: string;
  records: Transaction[];
}

export interface WalletCreditResponse {
  error: boolean;
  message: string;
  amount: string;
}

export interface PaymentGatewayResponse {
  error: boolean;
  message: string;
  pay_url: string;
}


export interface OfferResponse {
  error: boolean;
  message: string;
  records: Offer[];
}

export interface CategoryServiceResponse {
  error: boolean;
  message: string;
  records: CategoryService[];
}

export interface AvailabilityResponse {
  records: {
    availability_details: AvailabilityDetail[];
  };
}

export interface BookmarkResponse {
  error: boolean;
  message: string;
  records: Bookmark[];
}

export interface DeductAmountResponse {
  error: boolean;
  message: string;
  deduct_amount: string;
  wallet_amount: string;
  user_id: number;
}

export interface ShowNotificationsResponse {
  error: boolean;
  message: string;
  records: Notification[];
}

export interface MarkAsCancelledResponse {
  error: boolean;
  message: string;
  records?: any;
}

export interface AddReviewResponse {
  error: boolean;
  message: string;
  records?: any;
}


