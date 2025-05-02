import { Category } from "./category-types";
import { ImageType, MediaFiles } from "./general-types";

export interface Bid {
  id: number;
  customer_id: number;
  category_id: number;
  description: string;
  expected_price: string;
  status: number;
  address: string;
  images: ImageType[];
  audio: string | null;
  bid_canceled_reason: string | null;
  expiration_time: number;
  created_at: string;
  updated_at: string;
  canceled_time: string | null;
  deleted_at: string | null;
  category: Category;
}

export interface Offer {
  id: number;
  worker_id: number;
  worker_name: string;
  rating: number;
  description: string;
  price: number;
  created_at: string;
  updated_at: string;
}
