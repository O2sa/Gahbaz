import User from "../../../models/User.js";
import { comparePassword, hashPassword } from "../../core/utils/password.utils.js";
import {
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
} from "../../core/errors/customErrors.js";

export const getCurrentUserProfile = async (userId) => {
  const user = await User.findById(userId).select("-password").populate("university");
  if (!user) throw new NotFoundError("User not found");
  return user;
};

export const getUserById = async (targetId, requester) => {
  const user = await User.findById(targetId).select("-password");
  if (!user) throw new NotFoundError("User not found");
  if (user.__t === "Student") await user.populate("major");
  return user;
};

export const updateUserProfile = async (targetUserId, requesterId, updateData, isRequesterAdmin = false) => {
  if (targetUserId !== requesterId && !isRequesterAdmin) {
    throw new UnauthorizedError("Unauthorized to modify this profile");
  }

  // Whitelist safe fields
  const safeUpdates = {};
  if (updateData.firstName) safeUpdates.firstName = updateData.firstName;
  if (updateData.lastName) safeUpdates.lastName = updateData.lastName;
  if (updateData.phone) safeUpdates.phone = updateData.phone;
  if (updateData.avatar) safeUpdates.avatar = updateData.avatar;

  const updatedUser = await User.findByIdAndUpdate(targetUserId, safeUpdates, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!updatedUser) throw new NotFoundError("User not found");
  return updatedUser;
};

export const changeUserPassword = async (userId, { oldPassword, password }) => {
  const user = await User.findById(userId);
  if (!user) throw new NotFoundError("User not found");

  const isMatch = await comparePassword(oldPassword, user.password);
  if (!isMatch) throw new BadRequestError("Invalid credentials");

  const hashedPassword = await hashPassword(password);
  await User.findByIdAndUpdate(userId, { password: hashedPassword });
  return { success: true };
};

export const getAllUsersForChat = async (requesterId, searchQuery) => {
  const filter = { _id: { $ne: requesterId } };
  if (searchQuery) {
    filter.$or = [
      { firstName: { $regex: searchQuery, $options: "i" } },
      { lastName: { $regex: searchQuery, $options: "i" } },
      { email: { $regex: searchQuery, $options: "i" } },
    ];
  }
  return User.find(filter).select("-password");
};
