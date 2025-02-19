export interface BookingsResponse {
  error: boolean;
  message: string;
  records: Booking[];
}

export interface Booking {
  id: number;
  booking_number: number;
  booking_date: string;
  bid_id: number | null;
  customer_id: number;
  worker_id: number;
  worker_linked_time: string | null;
  service_id: number;
  status: number;
  address: string;
  canceled_reason: string | null;
  canceled_by: string | null;
  images: Image[];
  before_images: Image[];
  after_images: Image[] | null;
  audio: string | null;
  description: string;
  price: string;
  is_feedback: number;
  completed_time: string | null;
  canceled_time: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  customer: Customer;
  worker: Worker;
  service: Service;
}

export interface Image {
  id: number;
  name: string;
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

export interface Service {
  id: number;
  name: string;
  images: Image[];
  description: string;
  fixed_price: string;
  hourly_price: string;
  address: string;
  category_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  added_by: string | null;
  price_mode: string;
  category: Category;
}

export interface Category {
  id: number;
  title: string;
  image: string;
  status: number;
  created_at: string | null;
  updated_at: string;
}


export interface CreateBookingData {
  worker_id: string;
  description?: string;
  images?: File[];
  audio?: File;
  booking_date: string;
  address: string;

}
export interface CreateBidData {
  category_id: string;
  expected_price: string;
  description?: string;
  images?: File[];
  audio?: File;
  address: string;
}


export interface CreateBookingResponse {
  error: boolean;
  message: string;
  data?: {
    id: string;
  };
}

export interface CreateBidResponse {
  error: boolean;
  message: string;
  records: {
    id: number;
    customer_id: number;
    category_id: string;
    description: string;
    expected_price: string;
    status: number;
    images: string[];
    audio: string | null;
    address: string;
    expiration_time: string;
    updated_at: string;
    created_at: string;
  };
}
