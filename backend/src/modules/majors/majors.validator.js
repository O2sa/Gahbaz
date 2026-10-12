import { z } from "zod";

export const createMajorSchema = z.object({
  name: z.string().min(2, "Major name must be at least 2 characters"),
  college: z.string().optional(),
  collage: z.string().optional(),
}).refine((data) => data.college || data.collage, {
  message: "College ID is required",
});

export const updateMajorSchema = z.object({
  name: z.string().min(2).optional(),
  college: z.string().optional(),
  collage: z.string().optional(),
});
