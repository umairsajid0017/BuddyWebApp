import { CategoryService, Service } from "@/types/service-types";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { http } from "@/apis/httpMethods";
import { Endpoints } from "@/apis/endpoints";

interface ServicesByCategoryResponse {
  records: Service[];
}

export const useServicesByCategory = (categoryId: string): UseQueryResult<Service[], Error> => {
  console.log("useServicesByCategory hook called with categoryId:", categoryId);
  
  return useQuery<Service[], Error>({
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
