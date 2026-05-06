'use strict';

const express = require('express');
const router = express.Router();
const aiController = require('./ai.controller');
const { authenticate } = require('../../middlewares/auth.middleware');
const { body } = require('express-validator');
const { validate } = require('../../middlewares/validation.middleware');

/**
 * @route   GET /api/v1/ai/match-jobs
 * @desc    Get jobs ranked by match with current user's skills
 * @access  Private
 */
router.get('/match-jobs', authenticate, aiController.getMatchedJobs);

/**
 * @route   POST /api/v1/ai/score-resume
 * @desc    Score a resume text against a specific job
 * @access  Private
 * @body    { resumeText: string, jobId: string }
 */
router.post(
  '/score-resume',
  authenticate,
  [
    body('resumeText').notEmpty().withMessage('Resume text is required'),
    body('jobId').notEmpty().isMongoId().withMessage('Valid job ID is required'),
  ],
  validate,
  aiController.scoreResumeAgainstJob
);

module.exports = router;
