import {
  getCurrentUserProfile,
  getUserById,
  updateUserProfile,
  changeUserPassword,
  getAllUsersForChat,
} from "./users.service.js";

export const getCurrentUser = async (req, res) => {
  const user = await getCurrentUserProfile(req.user.id);
  res.status(200).json(user);
};

export const getUser = async (req, res) => {
  const user = await getUserById(req.params.id, req.user);
  res.status(200).json(user);
};

export const updateUser = async (req, res) => {
  const updatedUser = await updateUserProfile(
    req.params.id,
    req.user.id,
    req.body,
    req.user.role === "admin" || req.user.role === "super-admin"
  );
  res.status(200).json(updatedUser);
};

export const changePassword = async (req, res) => {
  await changeUserPassword(req.user.id, req.body);
  res.cookie("token", "logout", { httpOnly: true, expires: new Date(Date.now()) });
  res.status(200).json({ msg: "Password changed successfully" });
};

// Legacy Chat Endpoints compatibility (/api/v1/au/*)
export const legacyGetAllUsers = async (req, res) => {
  const users = await getAllUsersForChat(req.user.id, req.query.search);
  res.status(200).json(users);
};

export const legacyRenameUser = async (req, res) => {
  const targetId = req.body.userId || req.user.id;
  const updated = await updateUserProfile(targetId, req.user.id, { firstName: req.body.newUsername });
  res.status(200).json({ status: true, updatedUser: updated });
};
