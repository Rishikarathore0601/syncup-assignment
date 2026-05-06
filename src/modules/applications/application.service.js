'use strict';

const Application = require('./application.model');
const Job = require('../jobs/job.model');
const aiService = require('../ai/ai.service');
const { APPLICATION_STATUS, JOB_STATUS } = require('../../utils/constants');
const logger = require('../../utils/logger');

/**
 * Apply to a job
 */
const applyToJob = async ({ jobId, applicantId, resumeUrl, coverLetter }, io) => {
  // Check job exists and is active
  const job = await Job.findById(jobId);
  if (!job) {
    const error = new Error('Job not found');
    error.statusCode = 404;
    throw error;
  }

  if (job.status !== JOB_STATUS.ACTIVE) {
    const error = new Error('This job is no longer accepting applications');
    error.statusCode = 400;
    throw error;
  }

  // Prevent applicant from applying to their own job (if recruiter)
  if (job.postedBy.toString() === applicantId.toString()) {
    const error = new Error('You cannot apply to your own job posting');
    error.statusCode = 400;
    throw error;
  }

  // Check for duplicate application (also enforced by DB unique index)
  const existing = await Application.findOne({ job: jobId, applicant: applicantId });
  if (existing) {
    const error = new Error('You have already applied to this job');
    error.statusCode = 409;
    throw error;
  }

  // Run AI match scoring
  const matchResult = await aiService.matchResumeToJob(resumeUrl, job);

  // Create application
  const application = await Application.create({
    job: jobId,
    applicant: applicantId,
    resumeUrl,
    coverLetter,
    matchScore: matchResult.score,
    matchedSkills: matchResult.matchedSkills,
  });

  // Increment job application count atomically
  await Job.findByIdAndUpdate(jobId, { $inc: { applicationCount: 1 } });

  // Emit real-time event
  if (io) {
    io.emit('job_applied', {
      jobId,
      applicantId,
      applicationId: application._id,
      matchScore: matchResult.score,
    });
    logger.debug(`Socket event emitted: job_applied [applicationId: ${application._id}]`);
  }

  const populated = await application.populate([
    { path: 'job', select: 'title company location' },
    { path: 'applicant', select: 'name email' },
  ]);

  logger.info(`Application submitted: user ${applicantId} -> job ${jobId} (score: ${matchResult.score})`);
  return populated;
};

/**
 * Get all applications for a specific job (recruiter view)
 */
const getApplicationsByJob = async (jobId, recruiterId, query) => {
  // Verify job ownership
  const job = await Job.findOne({ _id: jobId, postedBy: recruiterId });
  if (!job) {
    const error = new Error('Job not found or you are not authorized');
    error.statusCode = 404;
    throw error;
  }

  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(query.limit, 10) || 10, 100);
  const skip = (page - 1) * limit;

  const filter = { job: jobId };
  if (query.status) filter.status = query.status;

  const [applications, total] = await Promise.all([
    Application.find(filter)
      .sort({ matchScore: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('applicant', 'name email profile.skills profile.resumeUrl')
      .lean(),
    Application.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);
  return {
    applications,
    pagination: { page, limit, total, totalPages, hasNextPage: page < totalPages, hasPrevPage: page > 1 },
  };
};

/**
 * Get all applications submitted by the current user
 */
const getMyApplications = async (applicantId, query) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(query.limit, 10) || 10, 100);
  const skip = (page - 1) * limit;

  const filter = { applicant: applicantId };
  if (query.status) filter.status = query.status;

  const [applications, total] = await Promise.all([
    Application.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('job', 'title company location status type')
      .lean(),
    Application.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);
  return {
    applications,
    pagination: { page, limit, total, totalPages, hasNextPage: page < totalPages, hasPrevPage: page > 1 },
  };
};

/**
 * Update application status (recruiter only)
 */
const updateApplicationStatus = async (applicationId, recruiterId, status, io) => {
  // Find application and verify recruiter owns the job
  const application = await Application.findById(applicationId).populate('job');

  if (!application) {
    const error = new Error('Application not found');
    error.statusCode = 404;
    throw error;
  }

  if (application.job.postedBy.toString() !== recruiterId.toString()) {
    const error = new Error('You are not authorized to update this application');
    error.statusCode = 403;
    throw error;
  }

  application.status = status;
  application.reviewedAt = new Date();
  application.reviewedBy = recruiterId;
  await application.save();

  if (io) {
    io.emit('application_status_updated', {
      applicationId,
      status,
      jobId: application.job._id,
    });
  }

  return application;
};

module.exports = {
  applyToJob,
  getApplicationsByJob,
  getMyApplications,
  updateApplicationStatus,
};
