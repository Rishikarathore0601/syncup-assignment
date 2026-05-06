'use strict';

const express = require('express');
const router = express.Router();
const applicationController = require('./application.controller');
const { applyToJobValidation, updateStatusValidation } = require('./application.validator');
const { validate } = require('../../middlewares/validation.middleware');
const { authenticate, recruiterOnly } = require('../../middlewares/auth.middleware');

/**
 * @route   POST /api/v1/applications
 * @desc    Apply to a job
 * @access  Private (Job Seekers)
 */
router.post(
  '/',
  authenticate,
  applyToJobValidation,
  validate,
  applicationController.applyToJob
);

/**
 * @route   GET /api/v1/applications/my
 * @desc    Get all applications submitted by the current user
 * @access  Private
 */
router.get('/my', authenticate, applicationController.getMyApplications);

/**
 * @route   GET /api/v1/applications/job/:jobId
 * @desc    Get all applications for a specific job (recruiter only)
 * @access  Private (Recruiter/Admin)
 */
router.get(
  '/job/:jobId',
  authenticate,
  recruiterOnly,
  applicationController.getApplicationsByJob
);

/**
 * @route   PATCH /api/v1/applications/:id/status
 * @desc    Update application status (shortlist, reject, hire)
 * @access  Private (Recruiter/Admin)
 */
router.patch(
  '/:id/status',
  authenticate,
  recruiterOnly,
  updateStatusValidation,
  validate,
  applicationController.updateApplicationStatus
);

module.exports = router;
