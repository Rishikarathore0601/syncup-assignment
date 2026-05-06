'use strict';

const { body, query } = require('express-validator');
const { JOB_TYPE, EXPERIENCE_LEVEL, JOB_STATUS, VALIDATION } = require('../../utils/constants');

const createJobValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Job title is required')
    .isLength({ max: VALIDATION.TITLE_MAX_LENGTH })
    .withMessage(`Title cannot exceed ${VALIDATION.TITLE_MAX_LENGTH} characters`),

  body('description')
    .trim()
    .notEmpty().withMessage('Job description is required')
    .isLength({ min: 50 }).withMessage('Description must be at least 50 characters')
    .isLength({ max: VALIDATION.DESCRIPTION_MAX_LENGTH })
    .withMessage(`Description cannot exceed ${VALIDATION.DESCRIPTION_MAX_LENGTH} characters`),

  body('company.name')
    .trim()
    .notEmpty().withMessage('Company name is required'),

  body('location')
    .trim()
    .notEmpty().withMessage('Job location is required'),

  body('type')
    .optional()
    .isIn(Object.values(JOB_TYPE))
    .withMessage(`Job type must be one of: ${Object.values(JOB_TYPE).join(', ')}`),

  body('experienceLevel')
    .optional()
    .isIn(Object.values(EXPERIENCE_LEVEL))
    .withMessage(`Experience level must be one of: ${Object.values(EXPERIENCE_LEVEL).join(', ')}`),

  body('skills')
    .isArray({ min: 1 }).withMessage('At least one skill is required')
    .custom((skills) => skills.length <= VALIDATION.SKILLS_MAX_COUNT)
    .withMessage(`Cannot exceed ${VALIDATION.SKILLS_MAX_COUNT} skills`),

  body('skills.*')
    .trim()
    .notEmpty().withMessage('Each skill must be a non-empty string'),

  body('salary.min')
    .optional()
    .isNumeric().withMessage('Salary min must be a number')
    .isFloat({ min: 0 }).withMessage('Salary min must be positive'),

  body('salary.max')
    .optional()
    .isNumeric().withMessage('Salary max must be a number')
    .isFloat({ min: 0 }).withMessage('Salary max must be positive'),

  body('deadline')
    .optional()
    .isISO8601().withMessage('Deadline must be a valid ISO 8601 date')
    .toDate(),
];

const updateJobValidation = [
  body('title')
    .optional()
    .trim()
    .notEmpty().withMessage('Title cannot be empty')
    .isLength({ max: VALIDATION.TITLE_MAX_LENGTH }),

  body('description')
    .optional()
    .trim()
    .isLength({ min: 50, max: VALIDATION.DESCRIPTION_MAX_LENGTH }),

  body('status')
    .optional()
    .isIn(Object.values(JOB_STATUS))
    .withMessage(`Status must be one of: ${Object.values(JOB_STATUS).join(', ')}`),

  body('skills')
    .optional()
    .isArray({ min: 1 }).withMessage('At least one skill required'),

  body('type')
    .optional()
    .isIn(Object.values(JOB_TYPE)),

  body('experienceLevel')
    .optional()
    .isIn(Object.values(EXPERIENCE_LEVEL)),
];

const jobQueryValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('type').optional().isIn(Object.values(JOB_TYPE)),
  query('experienceLevel').optional().isIn(Object.values(EXPERIENCE_LEVEL)),
];

module.exports = { createJobValidation, updateJobValidation, jobQueryValidation };
