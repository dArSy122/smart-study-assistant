import { z } from 'zod';

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters long')
    .max(80, 'Name must be maximum 80 characters long'),

  email: z
    .string()
    .trim()
    .email('Invalid email address')
    .max(120, 'Email must be maximum 120 characters long'),

  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .max(100, 'Password must be maximum 100 characters long'),

  languagePreference: z
    .enum(['BG', 'EN'])
    .optional()
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Invalid email address'),

  password: z
    .string()
    .min(1, 'Password is required')
});