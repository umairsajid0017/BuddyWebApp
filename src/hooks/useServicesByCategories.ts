import { useQuery } from "react-query";
import { CategoryService } from "@/lib/types";
import { getServicesByCategory } from "@/lib/apis/get-categories";

export const useServicesByCategory = (categoryId: string) => {
  console.log("useServicesByCategory hook called with categoryId:", categoryId);
  
  return useQuery<CategoryService[], Error>(
    ['services', categoryId],
    () => getServicesByCategory(categoryId),
    {
      enabled: Boolean(categoryId),
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      refetchOnWindowFocus: false,
      retry: 1,
      onError: (error) => {
        console.error('Failed to fetch services:', error);
      }
    }
  );
};
