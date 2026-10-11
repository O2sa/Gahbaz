import { UnauthorizedError, BadRequestError } from "../errors/customErrors.js";

export const requireRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      throw new UnauthorizedError("Unauthorized access to this route");
    }
    next();
  };
};

export const enforceDemoReadOnly = (req, res, next) => {
  if (req.user?.isDemoUser && ["POST", "PATCH", "PUT", "DELETE"].includes(req.method)) {
    throw new BadRequestError("Demo User. Read Only!");
  }
  next();
};
