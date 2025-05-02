export interface SpecialOffer {
  id: number;
  service_id: number | null;
  title: string;
  description: string;
  image: string;
  discount_percentage: string;
  start_date: string;
  end_date: string;
  status: number;
  created_at: string;
  updated_at: string;
}

