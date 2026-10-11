import bcrypt from "bcryptjs";
import crypto from "node:crypto";

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password, hashedPassword) => {
  if (!password || !hashedPassword) return false;
  return bcrypt.compare(password, hashedPassword);
};

export const generateSecurePassword = (bytes = 12) => {
  return crypto.randomBytes(bytes).toString("base64url");
};
