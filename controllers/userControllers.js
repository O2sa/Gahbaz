import { StatusCodes } from "http-status-codes";
import User from "../models/User.js";
import { hashPassword } from "../utils/passwordUtils.js";
import { UnauthenticatedError } from "../errors/customErrors.js";

export const getCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  const userWithoutPassword = user.toJSON();
  res.status(StatusCodes.OK).json(userWithoutPassword);
};

export const getUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  res.status(StatusCodes.OK).json(user);
};

export const updateUser = async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(StatusCodes.OK).json(updateUser);
};
export const changePss = async (req, res) => {
  const user = await User.findOne({ email: req.params.id });

  const isValidUser =
    user &&
    (await comparePassword(req.body.oldPassword, user.password)) &&
    req.body.password !== req.body.confirmPassword;
  if (!isValidUser) throw new UnauthenticatedError("invalid credentials");

  const hashedPassword = await hashPassword(req.body.password);

  await User.findByIdAndUpdate(user._id, { password: hashedPassword });
  res.status(StatusCodes.OK).json(updateUser);
};
