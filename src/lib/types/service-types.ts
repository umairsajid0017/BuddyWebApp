interface ServiceRating {
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
interface CategoryServicesResponse {
  data: {
    service_name: string;
    image: string;
    price: string;
    user_id: number;
    user_name: string;
    address: string;
    average_rating: string | null;
    is_favorite: number;
    total_reviews: number;
    tag_line: string;
  }[];
  status: boolean;
  message: string;
}
export type { ServiceRating, CategoryServicesResponse };
