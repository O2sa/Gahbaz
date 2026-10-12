import { z } from "zod";

export const createSectionSchema = z.object({
  name: z.string().min(2, "Section name must be at least 2 characters"),
  course: z.string().min(1, "Course ID is required"),
});

export const createLessonSchema = z.object({
  name: z.string().min(2, "Lesson name must be at least 2 characters"),
  video: z
    .object({
      url: z.string().optional(),
      duration: z.number().optional(),
    })
    .optional(),
  topic: z
    .object({
      data: z.string().optional(),
      readingTime: z.number().optional(),
    })
    .optional(),
});
