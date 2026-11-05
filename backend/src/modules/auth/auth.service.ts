import mongoose from "mongoose";
import crypto from "crypto";
import User from "../../models/User.js";
import University from "../../models/University.js";
import env from "../../config/env.js";
import { hashPassword, comparePassword } from "../../core/utils/password.utils.js";
import { createJWT } from "../../core/utils/token.utils.js";
import {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
  ForbiddenError,
} from "../../core/errors/customErrors.js";
import { RegisterInput } from "./auth.validator.js";

export const registerUser = async (data: RegisterInput) => {
  if (!env.ENABLE_REGISTRATION) {
    throw new ForbiddenError("التسجيل مغلق حالياً من قِبل إدارة النظام / Registration is currently disabled");
  }

  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) {
    throw new BadRequestError("Email already registered");
  }

  const hashedPassword = await hashPassword(data.password);

  // Generate dedicated placeholder University with needsSetup flag
  const tempCode = `U${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
  const university = await University.create({
    name: "جامعة جديدة قيد الإعداد",
    code: tempCode,
    active: true,
    needsSetup: true,
  });

  const name =
    (data as any).name ||
    `${(data as any).firstName || ""} ${(data as any).lastName || ""}`.trim() ||
    "مسؤول النظام";

  const sanitizedData = {
    ...data,
    name,
    role: "admin",
    kind: "Admin",
    password: hashedPassword,
    university: university._id,
  };

  const user = await User.create(sanitizedData);
  university.admin = user._id as any;
  await university.save();

  const token = createJWT({
    userId: String((user as any)._id),
    email: user.email,
    role: "admin",
    universityId: String(university._id),
  });

  return { user, token, needsOnboarding: true, university };
};

export const loginUser = async (email: string, password?: string) => {
  if (!password) {
    throw new UnauthenticatedError("Invalid credentials");
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new UnauthenticatedError("Invalid credentials");
  }

  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    throw new UnauthenticatedError("Invalid credentials");
  }

  // Check if university is suspended (applies to non-super-admins)
  if (user.role !== "super-admin" && user.university) {
    if (mongoose.Types.ObjectId.isValid(String(user.university))) {
      const university = await University.findById(user.university).select("active name");
      if (university && !university.active) {
        throw new UnauthenticatedError(
          "Your institutional university account has been suspended. Please contact platform administration."
        );
      }
    }
  }

  const role = user.role || "student";
  const isDemoUser = ["student@test.com", "teacher@tech.com", "admin@test.com"].includes(user.email);

  const token = createJWT({
    userId: String((user as any)._id),
    email: user.email,
    role,
    universityId: user.university ? String(user.university) : undefined,
    isDemoUser,
  });

  const userObj = user.toObject ? user.toObject() : { ...user };
  delete (userObj as any).password;

  return { token, user: userObj, role };
};

export const getCurrentUserService = async (userId: string) => {
  const user = await User.findById(userId).populate("university");
  if (!user) {
    throw new NotFoundError("User not found");
  }
  return user;
};
