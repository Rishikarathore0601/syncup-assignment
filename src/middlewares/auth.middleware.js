'use strict';

const jwt = require('jsonwebtoken');
const env = require('../config/env');
const ResponseHandler = require('../utils/responseHandler');
const { USER_ROLES } = require('../utils/constants');
const logger = require('../utils/logger');

/**
 * Verify JWT token and attach user to request
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ResponseHandler.unauthorized(res, 'Access token is required');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return ResponseHandler.unauthorized(res, 'Invalid token format');
    }

    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    logger.warn(`Authentication failed: ${error.message}`);

    if (error.name === 'TokenExpiredError') {
      return ResponseHandler.unauthorized(res, 'Token has expired');
    }
    if (error.name === 'JsonWebTokenError') {
      return ResponseHandler.unauthorized(res, 'Invalid token');
    }

    return ResponseHandler.unauthorized(res, 'Authentication failed');
  }
};

/**
 * Role-based authorization middleware factory
 * @param {...string} roles - Allowed roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return ResponseHandler.unauthorized(res, 'Authentication required');
    }

    if (!roles.includes(req.user.role)) {
      return ResponseHandler.forbidden(
        res,
        `Access denied. Required role(s): ${roles.join(', ')}`
      );
    }

    next();
  };
};

/**
 * Recruiter-only middleware
 */
const recruiterOnly = authorize(USER_ROLES.RECRUITER, USER_ROLES.ADMIN);

/**
 * Admin-only middleware
 */
const adminOnly = authorize(USER_ROLES.ADMIN);

module.exports = { authenticate, authorize, recruiterOnly, adminOnly };
