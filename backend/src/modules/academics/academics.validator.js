import { z } from "zod";

export const createCollageSchema = z.object({
  name: z.string().min(2, "Collage name must be at least 2 characters"),
  numberOfSemesters: z.coerce.number().int().min(1).max(20),
});

export const updateCollageSchema = z.object({
  name: z.string().min(2).optional(),
  numberOfSemesters: z.coerce.number().int().min(1).max(20).optional(),
});

export const createMajorSchema = z.object({
  name: z.string().min(2, "Major name must be at least 2 characters"),
  collage: z.string().min(1, "Collage ID is required"),
});

export const updateMajorSchema = z.object({
  name: z.string().min(2).optional(),
  collage: z.string().optional(),
});

export const createSubjectSchema = z.object({
  name: z.string().min(2, "Subject name must be at least 2 characters"),
  collage: z.string().optional(),
  subtitle: z.string().optional(),
  category: z.string().optional(),
});

export const createStudentSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  major: z.string().min(1, "Major ID is required"),
  phone: z.union([z.number(), z.string()]).optional(),
});

export const createTeacherSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  title: z.string().optional(),
  phone: z.union([z.number(), z.string()]).optional(),
});

export const createAdminSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  permissions: z.enum(["r", "rw", "rd", "rwd"]).default("r"),
});

export const createSectionSchema = z.object({
  name: z.string().min(2),
  course: z.string().min(1),
});

export const createLessonSchema = z.object({
  name: z.string().min(2),
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

export const startSemesterSchema = z.object({
  semesterData: z.object({
    endDate: z.string(),
  }),
  semesters: z.array(z.string()),
});
