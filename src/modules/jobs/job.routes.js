'use strict';

const express = require('express');
const router = express.Router();
const jobController = require('./job.controller');
const { createJobValidation, updateJobValidation, jobQueryValidation } = require('./job.validator');
const { validate } = require('../../middlewares/validation.middleware');
const { authenticate, recruiterOnly } = require('../../middlewares/auth.middleware');

/**
 * @route   GET /api/v1/jobs
 * @desc    Get all active jobs with pagination, search, and filter
 * @access  Public
 * @query   page, limit, search, skills, location, type, experienceLevel
 */
router.get('/', jobQueryValidation, validate, jobController.getAllJobs);

/**
 * @route   GET /api/v1/jobs/:id
 * @desc    Get a single job by ID
 * @access  Public
 */
router.get('/:id', jobController.getJobById);

/**
 * @route   POST /api/v1/jobs
 * @desc    Create a new job posting
 * @access  Private (Recruiter/Admin only)
 */
router.post(
  '/',
  authenticate,
  recruiterOnly,
  createJobValidation,
  validate,
  jobController.createJob
);

/**
 * @route   PUT /api/v1/jobs/:id
 * @desc    Update a job posting (owner only)
 * @access  Private (Recruiter/Admin only)
 */
router.put(
  '/:id',
  authenticate,
  recruiterOnly,
  updateJobValidation,
  validate,
  jobController.updateJob
);

/**
 * @route   DELETE /api/v1/jobs/:id
 * @desc    Delete a job posting (owner only)
 * @access  Private (Recruiter/Admin only)
 */
router.delete('/:id', authenticate, recruiterOnly, jobController.deleteJob);

module.exports = router;
