'use strict';

const logger = require('../utils/logger');

/**
 * Global error handling middleware
 * Must have 4 parameters for Express to treat it as an error handler
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || 'Internal Server Error';

  // Log the error
  logger.error(`[${req.method}] ${req.originalUrl} - ${statusCode} - ${message}`, {
    stack: err.stack,
    body: req.body,
    params: req.params,
    query: req.query,
    ip: req.ip,
  });

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
    return res.status(409).json({
      success: false,
      message,
    });
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
    return res.status(400).json({
      success: false,
      message,
    });
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Generic response
  return res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

/**
 * 404 Not Found handler
 */
const notFound = (req, res) => {
  return res.status(404).json({
    success: false,
    message: `Route not found: [${req.method}] ${req.originalUrl}`,
  });
};

module.exports = { errorHandler, notFound };
