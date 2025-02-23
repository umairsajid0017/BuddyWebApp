import { useQuery } from "react-query";
import { api } from "../api";

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

interface SpecialOffersResponse {
  error: boolean;
  message: string;
  records: SpecialOffer[];
}

export const fetchSpecialOffers = async (): Promise<SpecialOffer[]> => {
  const response = await api.get<SpecialOffersResponse>(`/showSpecialOffers`);
  return response.data.records;
};

export const useSpecialOffers = () => {
  return useQuery({
    queryKey: ["specialOffers"],
    queryFn: fetchSpecialOffers,
  });
};
