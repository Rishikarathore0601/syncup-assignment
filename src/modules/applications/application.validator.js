'use strict';

const { body } = require('express-validator');
const { APPLICATION_STATUS } = require('../../utils/constants');

const applyToJobValidation = [
  body('jobId')
    .notEmpty().withMessage('Job ID is required')
    .isMongoId().withMessage('Invalid job ID format'),

  body('resumeUrl')
    .notEmpty().withMessage('Resume URL is required')
    .isURL().withMessage('Resume URL must be a valid URL'),

  body('coverLetter')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Cover letter cannot exceed 2000 characters'),
];

const updateStatusValidation = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(Object.values(APPLICATION_STATUS))
    .withMessage(`Status must be one of: ${Object.values(APPLICATION_STATUS).join(', ')}`),
];

module.exports = { applyToJobValidation, updateStatusValidation };
