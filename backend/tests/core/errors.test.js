import { describe, it, expect, vi } from "vitest";
import {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  ValidationError,
} from "../../src/core/errors/customErrors.js";
import errorHandlerMiddleware from "../../src/core/middleware/error.middleware.js";

describe("Custom Errors & Middleware", () => {
  it("should create correct error hierarchy and status codes", () => {
    const err = new NotFoundError("User not found");
    expect(err.statusCode).toBe(404);
    expect(err.isOperational).toBe(true);
    expect(err.message).toBe("User not found");
  });

  it("should format operational errors correctly in middleware", () => {
    const err = new BadRequestError("Invalid parameter");
    const req = {};
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    const next = vi.fn();

    errorHandlerMiddleware(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        msg: "Invalid parameter",
      })
    );
  });
});
