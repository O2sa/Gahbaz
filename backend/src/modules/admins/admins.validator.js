import { z } from "zod";

export const createAdminSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters").optional(),
    lastName: z.string().min(2, "Last name must be at least 2 characters").optional(),
    name: z.string().optional(),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters").optional(),
    permissions: z.enum(["r", "rw", "rd", "rwd"]).default("rw"),
  })
  .refine((data) => Boolean(data.name?.trim() || (data.firstName && data.lastName)), {
    message: "Name or both first and last name are required",
  });

export const updateAdminSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  name: z.string().optional(),
  permissions: z.enum(["r", "rw", "rd", "rwd"]).optional(),
});
