import { Service } from "../types";

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
