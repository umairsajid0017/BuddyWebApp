

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

