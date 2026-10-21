import { AppError } from "./appError.js";

export class BadRequestError extends AppError {
  constructor(message = "Bad request", code = "BAD_REQUEST") {
    super(message, 400, code);
  }
}

export class ValidationError extends AppError {
  constructor(errors, message = "Validation failed") {
    super(message, 422, "VALIDATION_ERROR");
    this.errors = errors;
    this.details = errors;
  }
}

export class UnauthenticatedError extends AppError {
  constructor(message = "Authentication invalid") {
    super(message, 401, "UNAUTHENTICATED");
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized access") {
    super(message, 403, "FORBIDDEN");
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Access forbidden") {
    super(message, 403, "FORBIDDEN");
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404, "NOT_FOUND");
  }
}

export class ConflictError extends AppError {
  constructor(message = "Resource conflict") {
    super(message, 409, "CONFLICT");
  }
}
