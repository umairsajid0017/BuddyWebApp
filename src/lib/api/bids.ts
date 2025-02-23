import { api } from "../api";
import { useQuery, useMutation, UseQueryOptions } from "react-query";
import { AxiosError } from "axios";
import {
  BidsResponse,
  CancelBidRequest,
  CancelBidResponse,
} from "../types/bid-types";

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

// Cancel a bid
export const useCancelBid = () => {
  return useMutation<CancelBidResponse, AxiosError, CancelBidRequest>(
    async ({ bid_id, bid_canceled_reason }) => {
      const response = await api.post<CancelBidResponse>(
        "/canceledBidCustomer",
        {
          bid_id,
          bid_canceled_reason,
        },
      );
      return response.data;
    },
  );
};
