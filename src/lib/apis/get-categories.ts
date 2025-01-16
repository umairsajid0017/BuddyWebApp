import { useQuery, UseQueryOptions } from "react-query";
import { Category, CategoryResponse } from "../types/category-types";
import { AxiosError } from "axios";
import { api } from "../api";

export const useCategories = (
  options?: UseQueryOptions<Category[], AxiosError>,
) => {
  return useQuery<Category[], AxiosError>(
    ["categories"],
    async () => {
      const response = await api.get<CategoryResponse>("/getAllCategories");
      return response.data.records;
    },
    options,
  );
};
