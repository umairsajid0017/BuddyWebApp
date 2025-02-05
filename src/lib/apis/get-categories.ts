'use client'
import { useQuery, UseQueryOptions } from "react-query";
import { Category, CategoryResponse } from "../types/category-types";
import { CategoryService, CategoryServiceResponse } from "../types";
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

export const useCategory = (categoryId: string) => {
  return useQuery<Category, Error>(
    ["category", categoryId],
    async () => {
      const response = await api.get<CategoryResponse>("/getAllCategories");
      const category = response.data.records.find(cat => cat.id === Number(categoryId));
      if (!category) throw new Error("Category not found");
      return category;
    },
    {
      enabled: Boolean(categoryId),
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
    }
  );
};

export const getServicesByCategory = async (categoryId: string) => {
  console.log("API call: Getting services for category:", categoryId);
  try {
    const response = await api.get<CategoryServiceResponse>(`/servicesAgainstCategory`, {
      params: { category_id: categoryId }
    });
    console.log("API response:", response.data);
    return response.data.records;
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
};
