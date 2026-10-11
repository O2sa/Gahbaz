import { AppError } from "../errors/appError.js";

const errorHandlerMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong, please try again later";
  let errors = err.errors;

  // Handle Mongoose CastError (bad ObjectId)
  if (err.name === "CastError") {
    statusCode = 404;
    message = `No resource found with id: ${err.value}`;
  }

  // Handle Mongoose duplicate key error (code 11000)
  if (err.code && err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `${field} already exists`;
  }

  // Handle Mongoose Validation Error
  if (err.name === "ValidationError" && !err.isOperational) {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
  }

  const responsePayload = {
    success: false,
    msg: message,
    message,
  };

  if (errors) {
    responsePayload.errors = errors;
  }

  if (process.env.NODE_ENV === "development" && statusCode === 500) {
    responsePayload.stack = err.stack;
  }

  res.status(statusCode).json(responsePayload);
};

export default errorHandlerMiddleware;
