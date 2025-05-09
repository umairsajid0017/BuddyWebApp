import { User } from "./general-types";

import { Service } from "./service-types";

export interface Bookmark {
  id: number;
  user_id: number;
  service_id: string;
  status: number;
  updated_at: string;
  created_at: string;
  service: Service;
  user: User;
}
