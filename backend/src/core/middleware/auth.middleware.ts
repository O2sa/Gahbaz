import { Request, Response, NextFunction } from "express";
import { UnauthenticatedError } from "../errors/customErrors.js";
import { verifyJWT } from "../utils/token.utils.js";
import User from "../../models/User.js";

// In-memory timestamp cache to throttle lastActivity DB writes (max once per 10 minutes per user)
const activityThrottle = new Map<string, number>();

export const authenticateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let token = req.cookies?.token;

  if (!token && req.headers?.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new UnauthenticatedError("Authentication invalid");
  }

  try {
    const decoded: any = verifyJWT(token);
    req.user = {
      userId: decoded.userId || decoded.id,
      id: decoded.userId || decoded.id,
      email: decoded.email,
      role: decoded.role,
      universityId: decoded.universityId,
      isDemoUser: decoded.isDemoUser || false,
    };

    // Asynchronously throttle activity logging without blocking the request
    const now = Date.now();
    const userId = decoded.userId || decoded.id;
    if (userId) {
      const lastLogged = activityThrottle.get(userId) || 0;
      if (now - lastLogged > 10 * 60 * 1000) {
        activityThrottle.set(userId, now);
        if (activityThrottle.size > 10000) activityThrottle.clear();
        User.updateOne({ _id: userId }, { lastActivity: new Date(now) }).catch(() => {});
      }
    }

    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid");
  }
};
