import bcrypt from "bcryptjs";
import crypto from "node:crypto";

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (
  password?: string | null,
  hashedPassword?: string | null
): Promise<boolean> => {
  if (!password || !hashedPassword) return false;
  return bcrypt.compare(password, hashedPassword);
};

export const generateSecurePassword = (bytes: number = 12): string => {
  return crypto.randomBytes(bytes).toString("base64url");
};
