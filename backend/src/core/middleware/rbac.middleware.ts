import { Request, Response, NextFunction, RequestHandler } from "express";
import { UnauthorizedError, BadRequestError } from "../errors/customErrors.js";

export const requireRoles = (...allowedRoles: string[]): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      throw new UnauthorizedError("Unauthorized access to this route");
    }
    next();
  };
};

export const enforceDemoReadOnly: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.isDemoUser && ["POST", "PATCH", "PUT", "DELETE"].includes(req.method)) {
    throw new BadRequestError("Demo User. Read Only!");
  }
  next();
};
