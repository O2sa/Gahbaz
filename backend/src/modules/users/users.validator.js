import { z } from "zod";
import { userNameSchema } from "../../core/validators/user.validator.js";

export const updateUserSchema = z.object({
  name: userNameSchema.optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.union([z.number(), z.string()]).optional(),
  avatar: z.string().optional(),
});

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Old password is required"),
    password: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
