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

  constructor(errors: any, message: string = "Validation failed", code: string = "VALIDATION_ERROR") {
    super(message, 422, code);
    this.errors = errors;
    this.details = errors;
  }
}

export class UnauthenticatedError extends AppError {
  constructor(message: string = "Authentication invalid", code: string = "UNAUTHENTICATED") {
    super(message, 401, code);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized access", code: string = "FORBIDDEN") {
    super(message, 403, code);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Access forbidden", code: string = "FORBIDDEN") {
    super(message, 403, code);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found", code: string = "NOT_FOUND") {
    super(message, 404, code);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Resource conflict", code: string = "CONFLICT") {
    super(message, 409, code);
  }
}
