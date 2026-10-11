import { UnauthenticatedError } from "../errors/customErrors.js";
import { verifyJWT } from "../utils/token.utils.js";

// In-memory timestamp cache to throttle lastActivity DB writes (max once per 10 minutes per user)
const activityThrottle = new Map();

export const authenticateUser = async (req, res, next) => {
  let token = req.cookies?.token;

  if (!token && req.headers?.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new UnauthenticatedError("Authentication invalid");
  }

  try {
    const decoded = verifyJWT(token);
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      universityId: decoded.universityId,
      isDemoUser: decoded.isDemoUser || false,
    };

    // Asynchronously throttle activity logging without blocking the request
    const now = Date.now();
    const lastLogged = activityThrottle.get(decoded.userId) || 0;
    if (now - lastLogged > 10 * 60 * 1000) {
      activityThrottle.set(decoded.userId, now);
      if (activityThrottle.size > 10000) activityThrottle.clear();
    }

    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid");
  }
};
