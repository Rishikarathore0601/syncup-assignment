'use strict';

const applicationService = require('./application.service');
const ResponseHandler = require('../../utils/responseHandler');

const applyToJob = async (req, res, next) => {
  try {
    const io = req.app.get('io');
    const { jobId, resumeUrl, coverLetter } = req.body;
    const application = await applicationService.applyToJob(
      { jobId, applicantId: req.user.id, resumeUrl, coverLetter },
      io
    );
    return ResponseHandler.created(res, 'Application submitted successfully', { application });
  } catch (error) {
    next(error);
  }
};

const getApplicationsByJob = async (req, res, next) => {
  try {
    const { applications, pagination } = await applicationService.getApplicationsByJob(
      req.params.jobId,
      req.user.id,
      req.query
    );
    return ResponseHandler.paginated(
      res,
      'Applications fetched successfully',
      applications,
      pagination
    );
  } catch (error) {
    next(error);
  }
};

const getMyApplications = async (req, res, next) => {
  try {
    const { applications, pagination } = await applicationService.getMyApplications(
      req.user.id,
      req.query
    );
    return ResponseHandler.paginated(
      res,
      'Your applications fetched successfully',
      applications,
      pagination
    );
  } catch (error) {
    next(error);
  }
};

const updateApplicationStatus = async (req, res, next) => {
  try {
    const io = req.app.get('io');
    const application = await applicationService.updateApplicationStatus(
      req.params.id,
      req.user.id,
      req.body.status,
      io
    );
    return ResponseHandler.success(res, 'Application status updated', { application });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  applyToJob,
  getApplicationsByJob,
  getMyApplications,
  updateApplicationStatus,
};
