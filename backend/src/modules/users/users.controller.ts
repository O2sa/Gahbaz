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
  sendSuccess(res, user);
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
  const user = await getUserById(req.params.id, req.user);
  sendSuccess(res, user);
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const currentUserId = req.user!.userId;
  const isRequesterAdmin = req.user!.role === "admin" || req.user!.role === "super-admin";
  const updatedUser = await updateUserProfile(
    req.params.id,
    currentUserId,
    req.body,
    isRequesterAdmin
  );
  sendSuccess(res, updatedUser);
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const currentUserId = req.user!.userId;
  const isRequesterAdmin = req.user!.role === "admin" || req.user!.role === "super-admin";
  await deleteUserService(req.params.id, currentUserId, isRequesterAdmin);
  sendNoContent(res);
};

export const changePassword = async (req: Request, res: Response): Promise<void> => {
  const currentUserId = req.user!.userId;
  await changeUserPassword(currentUserId, req.body);
  res.cookie("token", "logout", { httpOnly: true, expires: new Date(Date.now()) });
  sendSuccess(res, { message: "Password changed successfully" });
};
