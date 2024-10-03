import { z } from 'zod';
import type { User, LoginCredentials, RegisterData } from './types';

export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
}) satisfies z.ZodType<User>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
}) satisfies z.ZodType<LoginCredentials>;

export const registerSchema = loginSchema.extend({
  name: z.string().min(2),
}) satisfies z.ZodType<RegisterData>;

// Inferred types from the schemas
export type UserSchema = z.infer<typeof userSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;