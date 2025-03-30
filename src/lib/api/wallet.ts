import { api } from "../api";
import { useQuery, useMutation, UseQueryOptions } from "react-query";
import { AxiosError } from "axios";

// Wallet balance response type
export interface WalletCreditResponse {
  error: boolean;
  message: string;
  amount: string;
}

// Payment gateway response type
export interface PaymentGatewayResponse {
  error: boolean;
  message: string;
  pay_url: string;
}

// Payment request data type
export interface AddToWalletData {
  amount: string;
  payment_method_id: string;
  comment: string;
  order_total_amount: string;
  action: string;
}

// Transaction type
export interface Transaction {
  id: number;
  payment_method_id: number;
  transaction_number: string;
  user_id: number;
  booking_id: number | null;
  amount: string;
  comment: string;
  last_updated_at: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// Transaction response type
export interface TransactionResponse {
  error: boolean;
  message: string;
  records: Transaction[];
}

// Get wallet balance
export const useWalletCredit = (
  options?: UseQueryOptions<WalletCreditResponse, AxiosError>
) => {
  return useQuery<WalletCreditResponse, AxiosError>(
    ["walletCredit"],
    async () => {
      const response = await api.get<WalletCreditResponse>("/showWalletCredit");
      return response.data;
    },
    options
  );
};

// Get customer transactions
export const useCustomerTransactions = (
  options?: UseQueryOptions<TransactionResponse, AxiosError>
) => {
  return useQuery<TransactionResponse, AxiosError>(
    ["customerTransactions"],
    async () => {
      const response = await api.get<TransactionResponse>("/showCustomerTransaction");
      return response.data;
    },
    options
  );
};

// Initialize payment gateway for adding money to wallet
export const useInitPaymentGateway = () => {
  return useMutation<PaymentGatewayResponse, AxiosError, AddToWalletData>(
    async (paymentData) => {
      const formData = new FormData();
      
      // Append payment data to FormData
      formData.append("amount", paymentData.amount);
      formData.append("payment_method_id", paymentData.payment_method_id);
      formData.append("comment", paymentData.comment);
      formData.append("order_total_amount", paymentData.order_total_amount);
      formData.append("action", paymentData.action);
      
      const response = await api.post<PaymentGatewayResponse>(
        "/initPaymentGateway",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      return response.data;
    }
  );
}; 