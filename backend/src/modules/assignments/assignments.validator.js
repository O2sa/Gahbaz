import { z } from "zod";

export const createAssignmentSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(200),
  description: z.string().optional(),
  dueDate: z.string().datetime().or(z.string().min(10)),
  maxScore: z.coerce.number().min(1).default(100).optional(),
  fileUrl: z.string().optional(),
});

export const updateAssignmentSchema = z.object({
  title: z.string().min(2).max(200).optional(),
  description: z.string().optional(),
  dueDate: z.string().datetime().or(z.string().min(10)).optional(),
  maxScore: z.coerce.number().min(1).optional(),
  fileUrl: z.string().optional(),
});

export const submitAssignmentSchema = z.object({
  fileUrl: z.string().min(1, "File URL is required"),
  notes: z.string().optional(),
});

export const gradeSubmissionSchema = z.object({
  grade: z.coerce.number().min(0, "Grade cannot be negative"),
  feedback: z.string().optional(),
});
