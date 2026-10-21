import { describe, it, expect, vi } from "vitest";
import {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  ValidationError,
  ConflictError,
} from "../../src/core/errors/customErrors.js";
import errorHandlerMiddleware from "../../src/core/middleware/error.middleware.js";
import {
  sendSuccess,
  sendCreated,
  sendNoContent,
  sendPaginated,
} from "../../src/core/utils/response.utils.js";

describe("Custom Errors & Error Middleware", () => {
  it("should create correct error hierarchy, codes, and status codes", () => {
    const err = new NotFoundError("User not found");
    expect(err.statusCode).toBe(404);
    expect(err.code).toBe("NOT_FOUND");
    expect(err.isOperational).toBe(true);
    expect(err.message).toBe("User not found");

    const valErr = new ValidationError([{ field: "email", message: "Invalid email" }]);
    expect(valErr.statusCode).toBe(422);
    expect(valErr.code).toBe("VALIDATION_ERROR");

    const conflictErr = new ConflictError("Email already in use");
    expect(conflictErr.statusCode).toBe(409);
    expect(conflictErr.code).toBe("CONFLICT");
  });

  it("should format operational errors correctly with standard error envelope", () => {
    const err = new BadRequestError("Invalid parameter");
    const req = {};
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    const next = vi.fn();

    errorHandlerMiddleware(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: "BAD_REQUEST",
        message: "Invalid parameter",
      },
    });
  });

  it("should format validation errors with field details", () => {
    const details = [{ field: "name", message: "Name is required" }];
    const err = new ValidationError(details, "Validation error");
    const req = {};
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    errorHandlerMiddleware(err, req, res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Validation error",
        details,
      },
    });
  });

  it("should handle Mongoose duplicate key errors (11000) as 409 CONFLICT", () => {
    const mongoErr = {
      code: 11000,
      keyValue: { email: "test@example.com" },
    };
    const req = {};
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    errorHandlerMiddleware(mongoErr, req, res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: "CONFLICT",
        message: "email already exists",
      },
    });
  });
});

describe("Standard Response Utilities", () => {
  it("should send standard success envelope with data", () => {
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    sendSuccess(res, { id: 1, name: "Alice" });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: { id: 1, name: "Alice" },
    });
  });

  it("should send 201 Created envelope", () => {
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    sendCreated(res, { id: 2, name: "Bob" });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: { id: 2, name: "Bob" },
    });
  });

  it("should send 204 No Content", () => {
    const res = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };
    sendNoContent(res);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  it("should send paginated response with meta object", () => {
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    const items = [{ id: 1 }, { id: 2 }];
    const meta = { page: 1, limit: 10, total: 2, totalPages: 1 };
    sendPaginated(res, items, meta);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: items,
      meta,
    });
  });
});
