import { z } from "zod";

export const createTeacherSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  title: z.string().optional(),
  phone: z.union([z.number(), z.string()]).optional(),
});

export const updateTeacherSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  title: z.string().optional(),
  phone: z.union([z.number(), z.string()]).optional(),
});
