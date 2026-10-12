import { z } from "zod";

export const createCollegeSchema = z.object({
  name: z.string().min(2, "College name must be at least 2 characters"),
  numberOfSemesters: z.coerce.number().int().min(1).max(20).default(8),
});

export const updateCollegeSchema = z.object({
  name: z.string().min(2).optional(),
  numberOfSemesters: z.coerce.number().int().min(1).max(20).optional(),
});
