import { AppError } from "./appError.js";

export interface ValidationErrorItem {
  field?: string;
  message: string;
  [key: string]: any;
}

export class BadRequestError extends AppError {
  constructor(message: string = "Bad request", code: string = "BAD_REQUEST") {
    super(message, 400, code);
  }
}

export class ValidationError extends AppError {
  errors?: any;
  details?: any;

  constructor(errors: any, message: string = "Validation failed") {
    super(message, 422, "VALIDATION_ERROR");
    this.errors = errors;
    this.details = errors;
  }
}

export class UnauthenticatedError extends AppError {
  constructor(message: string = "Authentication invalid") {
    super(message, 401, "UNAUTHENTICATED");
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized access") {
    super(message, 403, "FORBIDDEN");
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Access forbidden") {
    super(message, 403, "FORBIDDEN");
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, 404, "NOT_FOUND");
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Resource conflict") {
    super(message, 409, "CONFLICT");
  }
}
