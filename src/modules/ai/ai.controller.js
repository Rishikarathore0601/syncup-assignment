'use strict';

const Job = require('../jobs/job.model');
const aiService = require('./ai.service');
const User = require('../users/user.model');
const ResponseHandler = require('../../utils/responseHandler');

/**
 * Match current user's skills against all active jobs and rank them
 */
const getMatchedJobs = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return ResponseHandler.notFound(res, 'User not found');

    const userSkills = user.profile && user.profile.skills ? user.profile.skills : [];

    if (!userSkills.length) {
      return ResponseHandler.badRequest(
        res,
        'Please add skills to your profile to get job recommendations'
      );
    }

    const jobs = await Job.find({ status: 'active' }).lean();
    const ranked = await aiService.rankJobsForUser(userSkills, jobs);

    return ResponseHandler.success(res, 'Job matches computed successfully', {
      userSkills,
      totalJobs: ranked.length,
      jobs: ranked.slice(0, 20), // Return top 20
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Score a specific resume text against a specific job
 */
const scoreResumeAgainstJob = async (req, res, next) => {
  try {
    const { resumeText, jobId } = req.body;

    const job = await Job.findById(jobId);
    if (!job) return ResponseHandler.notFound(res, 'Job not found');

    const result = await aiService.matchResumeToJob(resumeText, job);

    return ResponseHandler.success(res, 'Resume scored successfully', {
      jobId,
      jobTitle: job.title,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMatchedJobs, scoreResumeAgainstJob };
