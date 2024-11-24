export interface Booking {
  id: number;
  bid_id: string;
  customer_id: number;
  worker_id: number;
  service_id: number;
  images: string[] | null;
  audio: string | null;
  description: string;
  price: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  canceled_by: number | null;
  created_at: string;
  updated_at: string;
  date: string;
  worker: {
    id: number;
    name: string;
    email: string;
    phone: string;
    image: string;
  };
  service: {
    id: number;
    name: string;
    tagline: string;
    image: string;
    description: string;
    price: string;
    address: string;
  };
}

export interface BookingsResponse {
  data: Booking[];
  status: boolean;
  message: string;
}

export interface CreateBookingData {
  service_id: number;
  description?: string;
  budget: number;
  images?: File[];
  videos?: File[];
  audio?: File;
}

export interface CreateBookingResponse {
  status: boolean;
  message: string;
  data?: {
    booking_id: string;
  };
}
