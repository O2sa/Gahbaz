import { AppError } from "../errors/appError.js";

const errorHandlerMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let code = err.code || "INTERNAL_SERVER_ERROR";
  let message = err.message || "Something went wrong, please try again later";
  let details = err.details || err.errors || null;

  // Handle Mongoose CastError (bad ObjectId)
  if (err.name === "CastError") {
    statusCode = 400;
    code = "BAD_REQUEST";
    message = `Invalid ID format for resource: ${err.value}`;
  }

  // Handle Mongoose duplicate key error (code 11000)
  if (err.code && err.code === 11000) {
    statusCode = 409;
    code = "CONFLICT";
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `${field} already exists`;
  }

  // Handle Mongoose Validation Error (if unhandled)
  if (err.name === "ValidationError" && !err.isOperational) {
    statusCode = 422;
    code = "VALIDATION_ERROR";
    message = "Database validation failed";
    details = Object.values(err.errors || {}).map((item) => ({
      field: item.path,
      message: item.message,
    }));
  }

  const errorPayload = {
    code,
    message,
  };

  if (details) {
    errorPayload.details = details;
  }

  if (process.env.NODE_ENV === "development" && statusCode === 500) {
    errorPayload.stack = err.stack;
  }

  return res.status(statusCode).json({
    success: false,
    error: errorPayload,
  });
};

export default errorHandlerMiddleware;
