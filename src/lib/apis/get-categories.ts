import { useQuery, UseQueryOptions } from "react-query";
import { CategoryResponse } from "../types/services-types";
import { AxiosError } from "axios";
import { api } from "../api";

export const useCategories = (
  options?: UseQueryOptions<CategoryResponse, AxiosError>,
) => {
  return useQuery<CategoryResponse, AxiosError>(
    ["categories"],
    async () => {
      const response = await api.get<CategoryResponse>("/getCategories");
      return response.data;
    },
    options,
  );
};
