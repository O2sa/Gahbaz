import { z } from "zod";

export const createStudentSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  major: z.string().min(1, "Major ID is required"),
  phone: z.union([z.number(), z.string()]).optional(),
});

export const updateStudentSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  major: z.string().optional(),
  phone: z.union([z.number(), z.string()]).optional(),
  comingSemester: z.number().optional(),
});
