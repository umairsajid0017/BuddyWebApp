import { useQuery } from "react-query";
import { api } from "../api";
import type { FAQResponse } from "../types/faq-types";

export const useFAQs = () => {
  return useQuery<FAQResponse>(["faqs"], async () => {
    const response = await api.get<FAQResponse>("/showFAQ");
    return response.data;
  });
};
