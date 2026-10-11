import { registerUser, loginUser } from "./auth.service.js";

export const register = async (req, res) => {
  const result = await registerUser(req.body);
  res.status(201).json({ msg: "User registered successfully", user: result.user });
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

  res.status(200).json({ msg: "user logged in", role });
};

export const logout = (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(200).json({ msg: "user logged out!" });
};
