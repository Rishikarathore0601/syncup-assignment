'use strict';

const User = require('./user.model');
const logger = require('../../utils/logger');

/**
 * Get user profile by ID
 */
const getUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  return user.toPublicJSON();
};

/**
 * Update authenticated user's profile
 */
const updateProfile = async (userId, updates) => {
  const allowedFields = ['name', 'profile', 'company'];

  const sanitized = {};
  for (const key of allowedFields) {
    if (updates[key] !== undefined) {
      sanitized[key] = updates[key];
    }
  }

  // Normalize skills to lowercase
  if (sanitized.profile && sanitized.profile.skills) {
    sanitized.profile.skills = sanitized.profile.skills.map((s) =>
      s.toLowerCase().trim()
    );
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: sanitized },
    { new: true, runValidators: true }
  );

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  logger.info(`Profile updated for user: ${userId}`);
  return user.toPublicJSON();
};

/**
 * Update resume URL on user profile
 */
const updateResumeUrl = async (userId, resumeUrl) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: { 'profile.resumeUrl': resumeUrl } },
    { new: true }
  );

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return user.toPublicJSON();
};

/**
 * Get all users (admin only) with pagination
 */
const getAllUsers = async (query) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(query.limit, 10) || 10, 100);
  const skip = (page - 1) * limit;

  const filter = {};
  if (query.role) filter.role = query.role;
  if (query.isActive !== undefined) filter.isActive = query.isActive === 'true';

  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    User.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);
  return {
    users,
    pagination: { page, limit, total, totalPages, hasNextPage: page < totalPages, hasPrevPage: page > 1 },
  };
};

module.exports = { getUserById, updateProfile, updateResumeUrl, getAllUsers };
