import { Request, Response } from "express";
import {
  getCurrentUserProfile,
  getUserById,
  updateUserProfile,
  changeUserPassword,
  listUsersService,
  deleteUserService,
} from "./users.service.js";
import {
  sendSuccess,
  sendPaginated,
  sendNoContent,
} from "../../core/utils/response.utils.js";
import { UnauthorizedError } from "../../core/errors/customErrors.js";

export const listUsers = async (req: Request, res: Response): Promise<void> => {
  const result = await listUsersService({
    search: req.query.search as string,
    role: req.query.role as string,
    page: req.query.page as string,
    limit: req.query.limit as string,
    universityId: req.user!.universityId,
  });
  sendPaginated(res, result.users, result.meta);
};

export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  const currentUserId = req.user!.userId;
  const user = await getCurrentUserProfile(currentUserId);
  res.status(200).json({
    success: true,
    data: user,
    user,
  });
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
  const user = await getUserById(req.params.id as string, req.user);
  sendSuccess(res, user);
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const currentUserId = req.user!.userId;
  const targetUserId = (req.params.id as string) || currentUserId;
  const isRequesterAdmin = req.user!.role === "admin" || req.user!.role === "super-admin";
  const updatedUser = await updateUserProfile(
    targetUserId,
    currentUserId,
    req.body,
    isRequesterAdmin
  );
  sendSuccess(res, updatedUser);
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const currentUserId = req.user!.userId;
  const isRequesterAdmin = req.user!.role === "admin" || req.user!.role === "super-admin";
  await deleteUserService(req.params.id as string, currentUserId, isRequesterAdmin);
  sendNoContent(res);
};

export const changePassword = async (req: Request, res: Response): Promise<void> => {
  const currentUserId = req.user!.userId;
  const targetUserId = (req.params.id as string) || currentUserId;

  // Enforce Self Only for password change across all roles per Capability Matrix
  if (targetUserId !== currentUserId) {
    throw new UnauthorizedError("Forbidden: You can only change your own password");
  }

  await changeUserPassword(currentUserId, req.body);
  res.cookie("token", "logout", { httpOnly: true, expires: new Date(Date.now()) });
  sendSuccess(res, { message: "Password changed successfully" });
};
