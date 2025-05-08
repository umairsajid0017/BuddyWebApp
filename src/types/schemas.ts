import { z } from "zod";
import { User } from "@/types/general-types"


const phoneRegex = /^(\+968)[0-9]{8}$/;

export const userSchema = z.object({
  id: z.number(),
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(phoneRegex, "Phone number must be in +968 format"),
  email_verified_at: z.string().nullable(),
  image: z.string().nullable(),
  dob: z.string().nullable(),
  country: z.string().nullable(),
  gender: z.string().nullable(),
  address: z.string().nullable(),
  login_type: z.string(),
  otp: z.string(),
  otp_expires_at: z.string(),
  long: z.number().nullable(),
  lat: z.number().nullable(),
  civil_id_number: z.string().nullable(),
  company_id: z.number().nullable(),
  attachments: z.string().nullable(),
  role: z.string().nullable(),
  status: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
  is_online: z.string(),
  otp_verify: z.string(),
}) satisfies z.ZodType<User>;
