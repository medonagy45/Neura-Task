"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchAsync = exports.errorHandler = exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
const errorHandler = (err, req, res, next) => {
    // Default to 500 if no status code
    const statusCode = err.statusCode || 500;
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
    }
    else {
        console.error("Error:", {
            message: err.message,
            statusCode,
            path: req.path,
            method: req.method,
        });
    }
    // Don't expose stack traces in production
    const response = {
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
exports.errorHandler = errorHandler;
// Async error handler wrapper
const catchAsync = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.catchAsync = catchAsync;
