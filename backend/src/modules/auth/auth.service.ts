import User from "../../models/User.js";
import University from "../../models/University.js";
import { hashPassword, comparePassword } from "../../core/utils/password.utils.js";
import { createJWT } from "../../core/utils/token.utils.js";
import {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} from "../../core/errors/customErrors.js";
import { RegisterInput } from "./auth.validator.js";

export const registerUser = async (data: RegisterInput) => {
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) {
    throw new BadRequestError("Email already registered");
  }

  const hashedPassword = await hashPassword(data.password);
  let universityId = data.university;

  if (!universityId) {
    let defaultUniv = await University.findOne();
    if (!defaultUniv) {
      defaultUniv = await University.create({ name: "Default University" });
    }
    universityId = defaultUniv._id.toString();
  }

  // Prevent privilege escalation: public registration always creates regular student
  const sanitizedData = {
    ...data,
    role: "student",
    password: hashedPassword,
    university: universityId,
  };

  const user = await User.create(sanitizedData);
  const token = createJWT({
    userId: user._id.toString(),
    email: user.email,
    role: "student",
    universityId: universityId.toString(),
  });

  return { user, token };
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

  const role = user.role || "student";
  const isDemoUser = ["student@test.com", "teacher@tech.com", "admin@test.com"].includes(user.email);

  const token = createJWT({
    userId: user._id.toString(),
    email: user.email,
    role,
    universityId: user.university?.toString(),
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
