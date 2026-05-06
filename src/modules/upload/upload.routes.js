'use strict';

const express = require('express');
const router = express.Router();
const { uploadResume, uploadResumeController } = require('./upload.controller');
const { authenticate } = require('../../middlewares/auth.middleware');

/**
 * @route   POST /api/v1/upload/resume
 * @desc    Upload resume to AWS S3
 * @access  Private
 * @body    multipart/form-data: resume (file)
 */
router.post('/resume', authenticate, uploadResume, uploadResumeController);

module.exports = router;
