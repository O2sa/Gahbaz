import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "test" ? 5 : (Number(process.env.AUTH_RATE_LIMIT_MAX) || 100),
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: {
        code: "TOO_MANY_REQUESTS",
        message: "Too many authentication attempts, please try again in 15 minutes",
      },
    });
  },
});
