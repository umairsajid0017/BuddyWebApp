
export interface CnicVerificationRecord {
  id: number;
  user_id: number;
  verification_status: "Pending" | "Approved" | "Rejected";
  cnic_front: string;
  cnic_back: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}




export interface VerificationStatus {
  hasData: boolean;
  status: "pending" | "approved" | "rejected" | null;
}

