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

export const createTopicSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Title must be at least 3 characters long')
    .max(160, 'Title must be maximum 160 characters long'),

  originalText: z
    .string()
    .trim()
    .optional()
    .nullable(),

  ocrText: z
    .string()
    .trim()
    .optional()
    .nullable(),

  finalText: z
    .string()
    .trim()
    .optional()
    .nullable(),

  language: z
    .enum(['BG', 'EN'])
    .default('BG')
});

export const updateTopicSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Title must be at least 3 characters long')
    .max(160, 'Title must be maximum 160 characters long')
    .optional(),

  originalText: z
    .string()
    .trim()
    .optional()
    .nullable(),

  ocrText: z
    .string()
    .trim()
    .optional()
    .nullable(),

  finalText: z
    .string()
    .trim()
    .optional()
    .nullable(),

  language: z
    .enum(['BG', 'EN'])
    .optional(),

  status: z
    .enum(['DRAFT', 'GENERATED', 'ARCHIVED'])
    .optional()
});

export const topicIdSchema = z.object({
  id: z.coerce
    .number()
    .int('Topic id must be an integer')
    .positive('Topic id must be positive')
});