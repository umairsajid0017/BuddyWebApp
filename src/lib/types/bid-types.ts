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
