import { z } from "zod";

export const startSemesterSchema = z
  .object({
    semesterData: z
      .object({
        name: z.string().optional(),
        startDate: z.union([z.string(), z.date()]).optional(),
        endDate: z.union([z.string(), z.date()]).optional(),
        addDropDeadline: z.union([z.string(), z.date()]).optional(),
      })
      .passthrough()
      .optional()
      .default({}),
    semesters: z
      .array(
        z.union([
          z.string(),
          z
            .object({
              templateId: z.string().optional(),
              _id: z.string().optional(),
              id: z.string().optional(),
              subjects: z.array(z.string()).optional(),
            })
            .passthrough(),
        ])
      )
      .optional()
      .default([]),
    majors: z
      .array(
        z
          .object({
            majorId: z.string(),
            allSemesters: z.boolean().optional(),
            semesters: z.array(z.any()).optional(),
          })
          .passthrough()
      )
      .optional()
      .default([]),
  })
  .refine(
    (data) =>
      (Array.isArray(data.semesters) && data.semesters.length > 0) ||
      (Array.isArray(data.majors) && data.majors.length > 0),
    {
      message: "يرجى تحديد التخصصات أو الفصول الدراسية المراد إطلاقها",
      path: ["majors"],
    }
  );

export type StartSemesterInput = z.infer<typeof startSemesterSchema>;

export const createSemesterTemplateSchema = z.object({
  name: z.string().min(2, "Template name must be at least 2 characters").optional(),
  major: z.string().min(1, "Major ID is required"),
  index: z.coerce.number().int().min(1, "يجب أن يبدأ ترتيب الفصل الدراسي من 1 على الأقل").optional(),
  subjects: z.array(z.string()).optional(),
});

export type CreateSemesterTemplateInput = z.infer<typeof createSemesterTemplateSchema>;

export const updateSemesterTemplateSchema = z.object({
  name: z.string().min(2).optional(),
  index: z.coerce.number().int().min(1, "يجب أن يبدأ ترتيب الفصل الدراسي من 1 على الأقل").optional(),
  active: z.boolean().optional(),
  subjects: z.array(z.string()).optional(),
});

export type UpdateSemesterTemplateInput = z.infer<typeof updateSemesterTemplateSchema>;
