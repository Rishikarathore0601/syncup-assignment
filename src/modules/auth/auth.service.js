'use strict';

const jwt = require('jsonwebtoken');
const User = require('../users/user.model');
const env = require('../../config/env');
const logger = require('../../utils/logger');

/**
 * Generate JWT access + refresh tokens
 */
const generateTokens = (payload) => {
  const accessToken = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });

  const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  });

  return { accessToken, refreshToken };
};

/**
 * Register a new user
 */
const register = async ({ name, email, password, role }) => {
  // Check if email already taken
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    const error = new Error('Email is already registered');
    error.statusCode = 409;
    throw error;
  }

  const user = await User.create({ name, email, password, role });

  const tokenPayload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };

  const tokens = generateTokens(tokenPayload);

  logger.info(`New user registered: ${user.email} [${user.role}]`);

  return {
    user: user.toPublicJSON(),
    ...tokens,
  };
};

/**
 * Login with email and password
 */
const login = async ({ email, password }) => {
  // Explicitly select password (it's hidden by default)
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  if (!user.isActive) {
    const error = new Error('Account is deactivated. Please contact support.');
    error.statusCode = 403;
    throw error;
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  const tokenPayload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };

  const tokens = generateTokens(tokenPayload);

  logger.info(`User logged in: ${user.email}`);

  return {
    user: user.toPublicJSON(),
    ...tokens,
  };
};

/**
 * Refresh access token using refresh token
 */
const refreshToken = async (token) => {
  try {
    const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      const error = new Error('User not found or inactive');
      error.statusCode = 401;
      throw error;
    }

    const tokenPayload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    const tokens = generateTokens(tokenPayload);
    return tokens;
  } catch (error) {
    if (error.statusCode) throw error;
    const err = new Error('Invalid or expired refresh token');
    err.statusCode = 401;
    throw err;
  }
};

/**
 * Get current authenticated user profile
 */
const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  return user.toPublicJSON();
};

module.exports = { register, login, refreshToken, getMe };
