import jwt, { SignOptions } from "jsonwebtoken";
import env from "../../config/env.js";

export const createJWT = (payload: object | string): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_LIFETIME,
  } as SignOptions);
};

export const verifyJWT = <T = any>(token: string): T => {
  return jwt.verify(token, env.JWT_SECRET) as T;
};
