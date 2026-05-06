'use strict';

const { body } = require('express-validator');
const { USER_ROLES, VALIDATION } = require('../../utils/constants');

const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: VALIDATION.NAME_MAX_LENGTH }).withMessage(`Name must not exceed ${VALIDATION.NAME_MAX_LENGTH} chars`),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: VALIDATION.PASSWORD_MIN_LENGTH })
    .withMessage(`Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`)
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),

  body('role')
    .optional()
    .isIn(Object.values(USER_ROLES))
    .withMessage(`Role must be one of: ${Object.values(USER_ROLES).join(', ')}`),
];

const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required'),
];

module.exports = { registerValidation, loginValidation };
