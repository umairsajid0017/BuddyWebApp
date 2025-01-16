import { ApiResponse } from "../types";

interface Category {
  id: number;
  title: string;
  image: string;
  status: number;
  created_at: string | null;
  updated_at: string;
}

export interface CategoryResponse {
  error: boolean;
  message: string;
  records: Category[];
}

export type { Category };
