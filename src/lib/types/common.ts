import { Service } from "../types";
import { Category } from "./category-types";

export interface MediaFiles {
  images?: File[];
  videos?: File[];
  audio?: File;
}

export interface BookingFormData {
  service: Service | null;
  date?: Date;
  time?: string;
  description: string;
  budget: number;
  mediaFiles?: MediaFiles;

}


export interface BidFormData {
  category: Category | null;
  description: string;
  budget: number;
  mediaFiles?: MediaFiles;
  address: string;
}
