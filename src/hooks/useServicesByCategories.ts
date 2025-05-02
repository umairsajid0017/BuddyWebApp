import { CategoryService } from "@/types/service-types";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { http } from "@/apis/httpMethods";
import { Endpoints } from "@/apis/endpoints";

interface ServicesByCategoryResponse {
  records: CategoryService[];
}

export const useServicesByCategory = (categoryId: string): UseQueryResult<CategoryService[], Error> => {
  console.log("useServicesByCategory hook called with categoryId:", categoryId);
  
  return useQuery<CategoryService[], Error>({
    queryKey: ["services", categoryId],
    queryFn: async () => {
      const { data } = await http.get<ServicesByCategoryResponse>(Endpoints.SERVICES_AGAINST_CATEGORY, {
        category_id: categoryId,
      });
      return data.records;
    },
    enabled: !!categoryId,
  });
};
