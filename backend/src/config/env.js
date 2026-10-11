import { z } from "zod";
import * as dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  MONGO_URL: z.string().min(1, "MONGO_URL is required"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  JWT_LIFETIME: z.string().default("1d"),
  EMAIL_USER: z.string().default(""),
  EMAIL_PASS: z.string().default(""),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export const validateEnv = (envObj = process.env) => {
  return envSchema.parse(envObj);
};

export const env = validateEnv();
export default env;
