import { z } from "zod";

export const createAdminSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  permissions: z.enum(["r", "rw", "rd", "rwd"]).default("r"),
});

export const updateAdminSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  permissions: z.enum(["r", "rw", "rd", "rwd"]).optional(),
});
