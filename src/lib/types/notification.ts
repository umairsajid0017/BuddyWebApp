export interface Notification {
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
