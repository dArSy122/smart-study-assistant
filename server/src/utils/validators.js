import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().trim().email('Invalid email address').max(160),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100),
  languagePreference: z.enum(['BG', 'EN']).default('BG')
});

export const loginSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

export const createTopicSchema = z.object({
  title: z.string().trim().min(3).max(160),
  originalText: z.string().optional().nullable(),
  ocrText: z.string().optional().nullable(),
  finalText: z.string().optional().nullable(),
  language: z.enum(['BG', 'EN']).default('BG'),
  folderId: z.coerce.number().int().positive().optional().nullable()
});

export const updateTopicSchema = z.object({
  title: z.string().trim().min(3).max(160).optional(),
  originalText: z.string().optional().nullable(),
  ocrText: z.string().optional().nullable(),
  finalText: z.string().optional().nullable(),
  language: z.enum(['BG', 'EN']).optional(),
  status: z.enum(['DRAFT', 'GENERATED', 'ARCHIVED']).optional(),
  folderId: z.coerce.number().int().positive().optional().nullable()
});

export const topicIdSchema = z.object({
  id: z.coerce.number().int('Topic id must be an integer').positive('Topic id must be positive')
});

export const createFolderSchema = z.object({
  name: z.string().trim().min(2, 'Folder name must be at least 2 characters').max(100),
  description: z.string().trim().max(500).optional().nullable(),
  color: z.string().trim().max(40).optional().nullable()
});

export const updateFolderSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  description: z.string().trim().max(500).optional().nullable(),
  color: z.string().trim().max(40).optional().nullable()
});

export const folderIdSchema = z.object({
  id: z.coerce.number().int('Folder id must be an integer').positive('Folder id must be positive')
});

export const submitQuizAttemptSchema = z.object({
  answers: z.array(
    z.object({
      questionIndex: z.coerce.number().int().min(0),
      selectedAnswerIndex: z.coerce.number().int().min(0).max(3)
    })
  ).min(1, 'At least one answer is required')
});