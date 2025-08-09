import { StatusCodes } from "http-status-codes";
import User from "../models/User.js";
import { comparePassword, hashPassword } from "../utils/passwordUtils.js";
import { UnauthenticatedError } from "../errors/customErrors.js";
import { createJWT } from "../utils/tokenUtils.js";
import University from "../models/University.js";
import Admin from "../models/Admin.js";
import { body } from "express-validator";
import { logLogin } from "../utils/dataCollector.js";

export const register = async (req, res) => {
  const isFirstAccount = true;
  req.body.role = isFirstAccount ? "super-admin" : "user";

  console.log(req.body);
  const user = await Admin.create(req.body);

  const hashedPassword = await hashPassword(req.body.password);
  await User.findByIdAndUpdate(user._id, { password: hashedPassword });


  if (req.body.role == "super-admin") {
    const university = await University.create({ admin: user._id });
    await User.findByIdAndUpdate(user._id, { university: university._id });

  
  }

  res.status(StatusCodes.CREATED).json({ msg: "user created" });
};

export const login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  console.log("user", user);
  console.log("body", req.body);



  const isValidUser =
    user && (await comparePassword(req.body.password, user.password));

  if (!isValidUser) throw new UnauthenticatedError("invalid credentials");

  let jwt = {};
  if (user.role == "admin" || user.role == "super-admin") {
    const university = await University.findById(user.university);
    jwt = { universityId: university._id, role: user.role };
    console.log(jwt);
  }
  console.log(jwt);
  const token = createJWT({ userId: user._id, ...jwt });

  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
  });

  await logLogin(user._id);
  res.status(StatusCodes.OK).json({ msg: "user logged in", role: user.__t });
};

export const logout = (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out!" });
};



export const addAdmin = async (req, res) => {
  req.body.role = "admin";

  const hashedPassword = await hashPassword(req.body.password);
  req.body.password = hashedPassword;

  const user = await User.create(req.body);

  const university = await University.create({ admin: user._id });
  res.status(StatusCodes.CREATED).json({ msg: "admin created" });
};
