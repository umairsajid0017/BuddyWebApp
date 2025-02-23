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

export enum BidStatus {
  OPEN = 1,
  CLOSED = 2,
  CANCELED = 3,
  PENDING = 4,
  CONFIRMED = 5,
  STARTED = 6,
  COMPLETED = 7,
  CANCELED_BY_WORKER = 8,
  CANCELED_BY_CUSTOMER = 9,
  DECLINED = 10,
  WORKER_IS_ON_HIS_WAY = 11,
  WORKER_IS_ON_YOUR_DOORSTEP = 12,
  WORKER_HAS_STARTED_THE_WORK = 13,
  TIMEOUT_CANCELED = 14,
  NOT_STARTED = 15,
}

export interface CancelBidRequest {
  bid_id: number;
  bid_canceled_reason: string;
}

export interface CancelBidResponse {
  error: boolean;
  message: string;
}
