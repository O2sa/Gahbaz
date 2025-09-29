import {
  UnauthenticatedError,
  UnauthorizedError,
  BadRequestError,
} from "../errors/customErrors.js";
import User from "../models/User.js";
import { verifyJWT } from "../utils/tokenUtils.js";
import url from "url";
export const authenticateUser = async (req, res, next) => {
  // const paths = req.originalUrl.split("/");
  // console.log(paths)

  // if (paths.includes("auth")) next();

  const { token } = req.cookies;

  if (!token) throw new UnauthenticatedError("authentication invalid");

  try {
    const { userId, role } = verifyJWT(token);
    // const testUser = userId === "64b2c07ccac2efc972ab0eca";
    const user = await User.findByIdAndUpdate(
      userId,
      { lastActivity: new Date() },
      { new: true }
    ).select("-password");
    if (!user) throw new UnauthenticatedError("authentication invalid");
    
    req.user = user;
    // authorizePermissions(req);
    // req.user = user;
    // console.log(req.user)
    next();
  } catch (error) {
    throw new UnauthenticatedError("authentication invalid");
  }
};

export const authorizePermissions = (req, res, next) => {
  const user = req.user;
  const testUsersEmail = [
    "student@test.com",
    "teacher@tech.com",
    "admin@test.com",
  ];
  const deniedMethods = ["DELETE", "PATCH", "POST"];

  const method = req.method;
  const paths = req.originalUrl.split("/");
  const deniedPaths = [
    "collages",
    "majors",
    "subjects",
    "semester-templates",
    "semesters",
  ];

  console.log(req.user);
  console.log(method);
  if (testUsersEmail.includes(user.email) && deniedMethods.includes(method))
    throw new BadRequestError("Demo User. Read Only!");

  switch (req.user.__t) {
    case "Admin": {
      if (req.user.role === "super-admin") {
        break;
      }
      if (req.user.role === "admin") {
        if (method === "POST" || method === "PATCH") {
          if (!user.permissions.split("").includes("w")) {
            throw new UnauthorizedError("authentication invalid");
          }
          break;
        }
        if (method === "DELETE") {
          if (!user.permissions.split("").includes("d")) {
            throw new UnauthorizedError("authentication invalid");
          }
          break;
        }
      }

      break;
    }
    case "Teacher": {
      if (hasAnyElement(deniedPaths, paths)) {
        throw new UnauthorizedError("authentication invalid");
      }
      break;
    }
    case "Student": {
      if (hasAnyElement(deniedPaths, paths)) {
        throw new UnauthorizedError("authentication invalid");
      }
      break;
    }
  }

  next();
};

export const checkForTestUser = (req, res, next) => {
  if (req.user.testUser) throw new BadRequestError("Demo User. Read Only!");
  next();
};

function hasAnyElement(arr1, arr2) {
  // Use some() to check if at least one element passes the test
  return arr1.some((element) => arr2.includes(element));
}
