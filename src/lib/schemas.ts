import { z } from "zod";
import type { User, LoginCredentials, RegisterData } from "./types";
import { LoginType } from "@/utils/constants";

// Regex pattern for validating phone numbers in +92 format
const phoneRegex = /^(\+92)[0-9]{10}$/;

export const userSchema = z.object({
  id: z.number(),
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(phoneRegex, "Phone number must be in +92 format"),
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
}) satisfies z.ZodType<User>;

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, { message: "Password is required" }),
  login_type: z.literal(LoginType.MANUAL),
  role: z.string(),
}) satisfies z.ZodType<LoginCredentials>;

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  phone: z.string().regex(phoneRegex, "Phone number must be in +92 format"),
  otp: z.string().optional(),
}) satisfies z.ZodType<RegisterData>;

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  dob: z.string().nullable(),
  country: z.string().nullable(),
  gender: z.string().nullable(),
  address: z.string().nullable(),
  civil_id_number: z.string().nullable(),
});

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const imageSchema = z.object({
  image: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported.",
    )
    .optional(),
});

// Inferred types from the schemas
export type UserSchema = z.infer<typeof userSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
