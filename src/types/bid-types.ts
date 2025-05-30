import { Category } from "./category-types";
import { ImageType, MediaFiles, Worker } from "./general-types";
import { Service } from "./service-types";
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
  service: Service | null;
}

export interface Offer {
 
  bid: Bid;
  bid_id: number;
  created_at: string;
  deleted_at: string | null;
  id: number;
  is_bid: number;
  is_repeat: number;
  proposed_price: string;
  status: number;
  updated_at: string;
  worker: Worker;
  worker_id: number;
}

