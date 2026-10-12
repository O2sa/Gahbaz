import { z } from "zod";

export const startSemesterSchema = z.object({
  semesterData: z.object({
    endDate: z.string(),
  }),
  semesters: z.array(z.string()),
});

export const createSemesterTemplateSchema = z.object({
  name: z.string().min(2, "Template name must be at least 2 characters"),
  major: z.string().min(1, "Major ID is required"),
  index: z.coerce.number().int().min(0).optional(),
});

export const updateSemesterTemplateSchema = z.object({
  name: z.string().min(2).optional(),
  index: z.coerce.number().int().min(0).optional(),
  active: z.boolean().optional(),
});
