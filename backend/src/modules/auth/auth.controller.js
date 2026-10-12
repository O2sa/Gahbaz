import { registerUser, loginUser, getCurrentUserService } from "./auth.service.js";
import { sendSuccess, sendCreated } from "../../core/utils/response.utils.js";

export const register = async (req, res) => {
  const result = await registerUser(req.body);
  sendCreated(res, { user: result.user, token: result.token });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const { token, user, role } = await loginUser(email, password);

  const oneDay = 1000 * 60 * 60 * 24;
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  sendSuccess(res, { user, role, token });
};

export const logout = (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  sendSuccess(res, { message: "User logged out successfully" });
};

export const getMe = async (req, res) => {
  const user = await getCurrentUserService(req.user.userId);
  sendSuccess(res, user);
};
