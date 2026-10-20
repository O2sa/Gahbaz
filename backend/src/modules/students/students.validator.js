import { z } from "zod";
import { userNameSchema } from "../../core/validators/user.validator.js";

export const createStudentSchema = z
  .object({
    name: userNameSchema.optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email("Invalid email format"),
    major: z.string().optional().nullable(),
    studentId: z.string().optional(),
    phone: z.union([z.number(), z.string()]).optional(),
    password: z.string().min(6, "Password must be at least 6 characters").optional(),
  })
  .refine(
    (data) => {
      if (data.name) return true;
      return Boolean(data.firstName && data.lastName);
    },
    {
      message: "الاسم مطلوب",
      path: ["name"],
    }
  );

export const updateStudentSchema = z.object({
  name: userNameSchema.optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  major: z.string().optional().nullable(),
  studentId: z.string().optional(),
  phone: z.union([z.number(), z.string()]).optional(),
  comingSemester: z.number().optional(),
});

