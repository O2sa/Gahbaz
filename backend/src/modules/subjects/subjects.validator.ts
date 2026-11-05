import { z } from "zod";

export const createSubjectSchema = z.object({
  name: z.string().min(2, "Subject name must be at least 2 characters"),
  college: z.string().optional(),
  collage: z.string().optional(),
  subtitle: z.string().optional(),
  category: z.string().optional(),
  code: z.string().optional(),
  creditHours: z.number().optional(),
  credits: z.number().optional(),
  teachers: z.array(z.string()).optional(),
  prerequisites: z.array(z.string()).optional(),
});

export type CreateSubjectInput = z.infer<typeof createSubjectSchema>;

export const updateSubjectSchema = z.object({
  name: z.string().min(2).optional(),
  college: z.string().optional(),
  collage: z.string().optional(),
  subtitle: z.string().optional(),
  category: z.string().optional(),
  code: z.string().optional(),
  creditHours: z.number().optional(),
  credits: z.number().optional(),
  teachers: z.array(z.string()).optional(),
  prerequisites: z.array(z.string()).optional(),
});

export type UpdateSubjectInput = z.infer<typeof updateSubjectSchema>;
