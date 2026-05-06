'use strict';

const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const { registerValidation, loginValidation } = require('./auth.validator');
const { validate } = require('../../middlewares/validation.middleware');
const { authenticate } = require('../../middlewares/auth.middleware');

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', registerValidation, validate, authController.register);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user and return tokens
 * @access  Public
 */
router.post('/login', loginValidation, validate, authController.login);

/**
 * @route   POST /api/v1/auth/refresh-token
 * @desc    Refresh access token using refresh token
 * @access  Public
 */
router.post('/refresh-token', authController.refreshToken);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current authenticated user
 * @access  Private
 */
router.get('/me', authenticate, authController.getMe);

module.exports = router;
