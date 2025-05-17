export interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  is_read: number;
  booking_id: number | null;
  name: string | null;
  phone: string | null;
  image: string | null;
  receiver_id: number;
  sender_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}


export interface FirebaseNotification {
  id: string;
  title: string;
  body: string;
  read: boolean;
  timestamp:
    | {
        seconds: number;
        nanoseconds: number;
      }
    | number;
  link?: string;
  imageUrl?: string;
}
