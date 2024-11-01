import { ApiResponse } from "../types";

interface Category {
  id: number;
  title: string;
  image: string;
  status: number;
  created_at: string | null;
  updated_at: string;
}

interface CategoryResponse extends ApiResponse<Category[]> {
  data: Category[];
  message?: string;
  success: boolean;
}
export type { Category, CategoryResponse };
