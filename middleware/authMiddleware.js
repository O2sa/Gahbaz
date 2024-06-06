import {
  UnauthenticatedError,
  UnauthorizedError,
  BadRequestError,
} from "../errors/customErrors.js";
import User from "../models/User.js";
import { verifyJWT } from "../utils/tokenUtils.js";

export const authenticateUser = async (req, res, next) => {
  const { token } = req.cookies;
  // console.log(req.cookies)
  if (!token) throw new UnauthenticatedError("authentication invalid");

  try {
    const { userId, role, universityId } = verifyJWT(token);
    // const testUser = userId === "64b2c07ccac2efc972ab0eca";
    req.user = await User.findById(userId).select("-password")

    // req.user = user;
    // console.log(req.user)
    next();
  } catch (error) {
    throw new UnauthenticatedError("authentication invalid");
  }
};

export const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedError("Unauthorized to access this route");
    }
    next();
  };
};


export const checkForTestUser = (req, res, next) => {
  if (req.user.testUser) throw new BadRequestError("Demo User. Read Only!");
  next();
};
