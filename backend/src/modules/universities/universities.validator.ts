import { z } from "zod";

export const createUniversitySchema = z.object({
  name: z.string().trim().min(3, "University name must be at least 3 characters").max(100),
  code: z.string().trim().min(2, "University code must be at least 2 characters").max(10).toUpperCase(),
  adminName: z.string().trim().min(3, "Admin name must be at least 3 characters").max(70),
  adminEmail: z.string().trim().email("Please provide a valid email address").toLowerCase(),
});

export const updateUniversitySchema = z.object({
  name: z.string().trim().min(3).max(100).optional(),
  code: z.string().trim().min(2).max(10).toUpperCase().optional(),
  active: z.boolean().optional(),
});

export const universityQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  search: z.string().trim().optional(),
  active: z.enum(["true", "false"]).optional(),
});

export type CreateUniversityInput = z.infer<typeof createUniversitySchema>;
export type UpdateUniversityInput = z.infer<typeof updateUniversitySchema>;
export type UniversityQueryInput = z.infer<typeof universityQuerySchema>;
