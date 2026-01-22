import { Request, Response, NextFunction } from "express";

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Default to 500 if no status code
  const statusCode = (err as any).statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Log error for debugging (in production, use proper logging service)
  if (process.env.NODE_ENV === "development") {
    console.error("Error:", {
      message: err.message,
      stack: err.stack,
      statusCode,
      path: req.path,
      method: req.method,
    });
  } else {
    console.error("Error:", {
      message: err.message,
      statusCode,
      path: req.path,
      method: req.method,
    });
  }

  // Don't expose stack traces in production
  const response: any = {
    success: false,
    message,
    statusCode,
  };

  // Include error details only in development
  if (process.env.NODE_ENV === "development") {
    response.error = err.message;
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

// Async error handler wrapper
export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};