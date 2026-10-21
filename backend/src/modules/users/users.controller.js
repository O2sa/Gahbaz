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

export const listUsers = async (req, res) => {
  const result = await listUsersService({
    search: req.query.search,
    role: req.query.role,
    page: req.query.page,
    limit: req.query.limit,
    universityId: req.user.universityId,
  });
  sendPaginated(res, result.users, result.meta);
};

export const getCurrentUser = async (req, res) => {
  const user = await getCurrentUserProfile(req.user.userId || req.user.id);
  sendSuccess(res, user);
};

export const getUser = async (req, res) => {
  const user = await getUserById(req.params.id, req.user);
  sendSuccess(res, user);
};

export const updateUser = async (req, res) => {
  const currentUserId = req.user.userId || req.user.id;
  const isRequesterAdmin = req.user.role === "admin" || req.user.role === "super-admin";
  const updatedUser = await updateUserProfile(
    req.params.id,
    currentUserId,
    req.body,
    isRequesterAdmin
  );
  sendSuccess(res, updatedUser);
};

export const deleteUser = async (req, res) => {
  const currentUserId = req.user.userId || req.user.id;
  const isRequesterAdmin = req.user.role === "admin" || req.user.role === "super-admin";
  await deleteUserService(req.params.id, currentUserId, isRequesterAdmin);
  sendNoContent(res);
};

export const changePassword = async (req, res) => {
  const currentUserId = req.user.userId || req.user.id;
  await changeUserPassword(currentUserId, req.body);
  res.cookie("token", "logout", { httpOnly: true, expires: new Date(Date.now()) });
  sendSuccess(res, { message: "Password changed successfully" });
};
