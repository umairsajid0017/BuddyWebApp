import { z } from 'zod';
import type { User, LoginCredentials, RegisterData } from './types';

// Regex pattern for validating phone numbers in +92 format
const phoneRegex = /^(\+92)[0-9]{10}$/;

export const userSchema = z.object({
  id: z.number(),
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(phoneRegex, 'Phone number must be in +92 format'),
}) satisfies z.ZodType<User>;

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  loginType: z.string(),
}) satisfies z.ZodType<LoginCredentials>;

export const registerSchema = loginSchema.extend({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  phone: z.string().regex(phoneRegex, 'Phone number must be in +92 format'),
  otp: z.string().optional(),
}) satisfies z.ZodType<RegisterData>;

// Inferred types from the schemas
export type UserSchema = z.infer<typeof userSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
