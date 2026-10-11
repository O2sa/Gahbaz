import User from "../../../models/User.js";
import University from "../../../models/University.js";
import { hashPassword, comparePassword } from "../../core/utils/password.utils.js";
import { createJWT } from "../../core/utils/token.utils.js";
import {
  BadRequestError,
  UnauthenticatedError,
} from "../../core/errors/customErrors.js";

export const registerUser = async (data) => {
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
    universityId = defaultUniv._id;
  }

  // Prevent privilege escalation: public registration always creates regular student
  const sanitizedData = {
    ...data,
    role: "student",
    password: hashedPassword,
    university: universityId,
  };

  const user = await User.create(sanitizedData);
  return { user };
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid credentials");
  }

  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    throw new UnauthenticatedError("Invalid credentials");
  }

  const role = user.__t ? user.__t.toLowerCase() : user.role || "student";
  const isDemoUser = ["student@test.com", "teacher@tech.com", "admin@test.com"].includes(user.email);

  const token = createJWT({
    userId: user._id.toString(),
    email: user.email,
    role: user.role || role,
    universityId: user.university?.toString(),
    isDemoUser,
  });

  return { token, user, role: user.__t || user.role || "Student" };
};
