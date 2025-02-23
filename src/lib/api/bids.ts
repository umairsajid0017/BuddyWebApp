import { api } from "../api";
import { useQuery, UseQueryOptions } from "react-query";
import { AxiosError } from "axios";
import { BidsResponse } from "../types/bid-types";

// Get all bids for the customer
export const useCustomerBids = (
  options?: UseQueryOptions<BidsResponse, AxiosError>,
) => {
  return useQuery<BidsResponse, AxiosError>(
    ["customerBids"],
    async () => {
      const response = await api.get<BidsResponse>("/showPlaceBidsCustomers");
      return response.data;
    },
    options,
  );
};
