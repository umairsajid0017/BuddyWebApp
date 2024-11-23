import { useServices } from "@/lib/api";
import { Service } from "@/lib/types";

export const useServicesByCategory = (categoryId: string) => {
  const { data: servicesResponse, isLoading, error } = useServices();

  const filteredServices = servicesResponse?.data?.filter(
    (service: Service) => service.category_id === parseInt(categoryId),
  );

  return {
    services: filteredServices || [],
    isLoading,
    error,
  };
};
