import { api } from "../api";
import { useQuery, useMutation, UseQueryOptions } from "react-query";
import { AxiosError } from "axios";
import {
  BidsResponse,
  CancelBidRequest,
  CancelBidResponse,
  BidResponse,
  BidStatus,
} from "../types/bid-types";

// Get all bids for the customer
export const useCustomerBids = (
  options?: UseQueryOptions<BidsResponse, AxiosError>,
) => {
  return useQuery<BidsResponse, AxiosError>(
    ["customerBids"],
    async () => {
      // Default to OPEN status (1) if not specified
      const response = await api.get<BidsResponse>("/showPlaceBidsCustomers", {
        params: {
          bid_status: BidStatus.OPEN // Default to showing open bids
        }
      });
      return response.data;
    },
    options,
  );
};

// Get customer bids with specific status
export const useCustomerBidsByStatus = (
  status: BidStatus,
  options?: UseQueryOptions<BidsResponse, AxiosError>,
) => {
  return useQuery<BidsResponse, AxiosError>(
    ["customerBids", status],
    async () => {
      const response = await api.get<BidsResponse>("/showPlaceBidsCustomers", {
        params: {
          bid_status: status
        }
      });
      return response.data;
    },
    {
      ...options,
      enabled: status !== undefined && (options?.enabled ?? true),
    }
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

// Get bid responses/offers for a specific bid
export const useBidResponses = (
  bid_id: number | null,
  options?: UseQueryOptions<BidResponse, AxiosError>
) => {
  return useQuery<BidResponse, AxiosError>(
    ["bidResponses", bid_id],
    async () => {
      if (!bid_id) {
        throw new Error("Bid ID is required");
      }
      const response = await api.get<BidResponse>("/showBidResponseCustomer", {
        params: { bid_id }
      });
      return response.data;
    },
    {
      ...options,
      enabled: !!bid_id && (options?.enabled ?? true),
    }
  );
};
