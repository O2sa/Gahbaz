import User from "../../models/User.js";
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
  if (user.__t === "Student" || user.role === "student") {
    await user.populate("major");
  }
  return user;
};

export const listUsersService = async ({ search, role, page = 1, limit = 20, universityId }) => {
  const query = {};
  if (universityId) query.university = universityId;
  if (role) query.role = role;
  if (search) {
    const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    query.$or = [
      { firstName: { $regex: escaped, $options: "i" } },
      { lastName: { $regex: escaped, $options: "i" } },
      { email: { $regex: escaped, $options: "i" } },
    ];
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (pageNum - 1) * limitNum;

  const [users, total] = await Promise.all([
    User.find(query).select("-password").skip(skip).limit(limitNum).sort({ createdAt: -1 }),
    User.countDocuments(query),
  ]);

  return {
    users,
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
    },
  };
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

export const deleteUserService = async (userId, requesterId, isRequesterAdmin) => {
  if (userId !== requesterId && !isRequesterAdmin) {
    throw new UnauthorizedError("Unauthorized to delete this user");
  }
  const deleted = await User.findByIdAndDelete(userId);
  if (!deleted) throw new NotFoundError("User not found");
  return true;
};

export const changeUserPassword = async (userId, { oldPassword, password }) => {
  const user = await User.findById(userId).select("+password");
  if (!user) throw new NotFoundError("User not found");

  const isMatch = await comparePassword(oldPassword, user.password);
  if (!isMatch) throw new BadRequestError("Invalid credentials");

  const hashedPassword = await hashPassword(password);
  await User.findByIdAndUpdate(userId, { password: hashedPassword });
  return { success: true };
};
