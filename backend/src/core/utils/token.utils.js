import jwt from "jsonwebtoken";
import env from "../../config/env.js";

export const createJWT = (payload) => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_LIFETIME,
  });
};

export const verifyJWT = (token) => {
  return jwt.verify(token, env.JWT_SECRET);
};
