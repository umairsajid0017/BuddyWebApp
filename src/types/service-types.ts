import { Category } from "./category-types";
import { User, ImageType } from "./general-types";
import { Booking } from "./booking-types";

export interface ServiceRating {
  id: number;
  rating: number;
  comment: string;
  service_id: number;
  given_to: number;
  rated_by: number;
  created_at: string;
  updated_at: null;
  total_likes: number;
}

export interface Review {
  id: number;
  customer_Id: number;
  worker_Id: number;
  booking_Id: number;
  service_id: number;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  is_reported: number;
  report_reason_id: number | null;
  booking: Booking;
  customer: User;
  worker: User;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  fixed_price: string;
  image: string;
  images: ImageType[];
  category_id: number;
  long: number | null;
  lat: number | null;
  user_id: number;
  created_at: string | null;
  updated_at: string | null;
  user: User;
  category: Category;
  ratings: ServiceRating[];
  hourly_price: string;
  address: string;
  price_mode: "fixed" | "hourly";
  tagline: string;
  added_by: string | null;
}

export interface CategoryService {
  service_id: number;
  service_name: string;
  images: ImageType[];
  description: string;
  fixed_price: string;
  hourly_price: string;
  address: string;
  category_id: number;
  user_id: number;
  average_rating: number | null;
  is_favorite: number;
  total_reviews: number;
  tag_line: string;
}