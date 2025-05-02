


export interface SearchCategory {
  id: number;
  title: string;
  image: string;
}



export interface Category {
  id: number;
  title: string;
  image: string;
  status: number;
  created_at: string | null;
  updated_at: string;
}