import { z } from "zod";
import { userNameSchema } from "../../core/validators/user.validator.js";

export const createAdminSchema = z
  .object({
    name: userNameSchema.optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters").optional(),
    permissions: z.enum(["r", "rw", "rd", "rwd"]).default("rw"),
  })
  .refine((data) => Boolean(data.name || (data.firstName && data.lastName)), {
    message: "الاسم مطلوب",
    path: ["name"],
  });

export const updateAdminSchema = z.object({
  name: userNameSchema.optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  permissions: z.enum(["r", "rw", "rd", "rwd"]).optional(),
});
