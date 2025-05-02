import { Customer, ImageType, MediaFiles, User, Worker } from "./general-types";
import { Service } from "./service-types";


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
  images: ImageType[];
  before_images: ImageType[];
  after_images: ImageType[] | null;
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









export interface BookingFormData {
  service: Service | null;
  date?: Date;
  time?: string;
  description: string;
  budget: number;
  mediaFiles?: MediaFiles;

}