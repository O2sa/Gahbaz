import { StatusCodes } from "http-status-codes";
import User from "../models/User.js";
import { comparePassword, hashPassword } from "../utils/passwordUtils.js";
import { UnauthenticatedError } from "../errors/customErrors.js";

export const getCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user._id }).select("-password");

  res.status(StatusCodes.OK).json(user);
};

export const getUser = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user.__t === "Student") await user.populate("major");
  res.status(StatusCodes.OK).json(user);
};

export const updateUser = async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(StatusCodes.OK).json(updateUser);
};



export const changePss = async (req, res) => {
  const user = await User.findById(req.user._id);
console.log(req.body)
console.log(user)
  const isValidUser =
    user &&
    (await comparePassword(req.body.oldPassword, user.password)) &&
    req.body.password !== req.body.confirmPassword;
  if (!isValidUser) throw new Error("invalid credentials");

  const hashedPassword = await hashPassword(req.body.password);

  await User.findByIdAndUpdate(user._id, { password: hashedPassword });
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  
  res.status(StatusCodes.OK).json(updateUser);
};
