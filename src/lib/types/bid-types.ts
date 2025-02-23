export interface CreateBidRequest {
  customer_id: number;
  service_id: string;
  description?: string;
  price: string;
  images?: File[];
  audio?: File;
}

export interface BidResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    customer_id: number;
    service_id: string;
    description: string;
    price: string;
    status: string;
    images: string;
    audio: string | null;
    created_at: string;
    updated_at: string;
  };
}

export interface BidImage {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  title: string;
  image: string;
  status: number;
  created_at: string | null;
  updated_at: string;
}

export interface Bid {
  id: number;
  customer_id: number;
  category_id: number;
  description: string;
  expected_price: string;
  status: number;
  address: string;
  images: BidImage[];
  audio: string | null;
  bid_canceled_reason: string | null;
  expiration_time: number;
  created_at: string;
  updated_at: string;
  canceled_time: string | null;
  deleted_at: string | null;
  category: Category;
}

export interface BidsResponse {
  error: boolean;
  message: string;
  records: Bid[];
}
