import { z } from "zod";
import * as dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  MONGO_URL: z.string().default("mongodb://localhost:27017/gahbaz"),
  JWT_SECRET: z.string().default("default_dev_secret_key_gahbaz_12345"),
  JWT_LIFETIME: z.string().default("1d"),
  EMAIL_USER: z.string().default(""),
  CLIENT_URL: z.string().optional().default("http://localhost:5173"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  STORAGE_PROVIDER: z.enum(["local", "cloudinary", "s3", "wasabi"]).default("local"),
  UPLOAD_DIR: z.string().default("uploads"),
  PUBLIC_URL: z.string().default("http://localhost:5000"),
  CLOUDINARY_CLOUD_NAME: z.string().optional().default(""),
  CLOUDINARY_API_KEY: z.string().optional().default(""),
  CLOUDINARY_API_SECRET: z.string().optional().default(""),
  AWS_ACCESS_KEY_ID: z.string().optional().default(""),
  AWS_SECRET_ACCESS_KEY: z.string().optional().default(""),
  AWS_REGION: z.string().optional().default("us-east-1"),
  AWS_BUCKET_NAME: z.string().optional().default(""),
  WASABI_ACCESS_KEY_ID: z.string().optional().default(""),
  WASABI_SECRET_ACCESS_KEY: z.string().optional().default(""),
  WASABI_REGION: z.string().optional().default("us-east-1"),
  WASABI_BUCKET_NAME: z.string().optional().default(""),
  WASABI_ENDPOINT: z.string().optional().default("https://s3.wasabisys.com"),
});

export const validateEnv = (envObj = process.env) => {
  return envSchema.parse(envObj);
};

export const env = validateEnv();
export default env;
