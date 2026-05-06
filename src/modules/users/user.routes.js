'use strict';

const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const { authenticate, adminOnly } = require('../../middlewares/auth.middleware');

/**
 * @route   GET /api/v1/users/profile
 * @desc    Get current user's profile
 * @access  Private
 */
router.get('/profile', authenticate, userController.getUserProfile);

/**
 * @route   PUT /api/v1/users/profile
 * @desc    Update current user's profile
 * @access  Private
 */
router.put('/profile', authenticate, userController.updateProfile);

/**
 * @route   GET /api/v1/users/:id
 * @desc    Get any user's public profile by ID
 * @access  Private
 */
router.get('/:id', authenticate, userController.getUserProfile);

/**
 * @route   GET /api/v1/users
 * @desc    Get all users (admin only)
 * @access  Private (Admin)
 */
router.get('/', authenticate, adminOnly, userController.getAllUsers);

module.exports = router;
