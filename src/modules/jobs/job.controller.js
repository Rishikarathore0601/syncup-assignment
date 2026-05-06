'use strict';

const jobService = require('./job.service');
const ResponseHandler = require('../../utils/responseHandler');

const createJob = async (req, res, next) => {
  try {
    const io = req.app.get('io');
    const job = await jobService.createJob(req.body, req.user.id, io);
    return ResponseHandler.created(res, 'Job created successfully', { job });
  } catch (error) {
    next(error);
  }
};

const getAllJobs = async (req, res, next) => {
  try {
    const { jobs, pagination } = await jobService.getAllJobs(req.query);
    return ResponseHandler.paginated(res, 'Jobs fetched successfully', jobs, pagination);
  } catch (error) {
    next(error);
  }
};

const getJobById = async (req, res, next) => {
  try {
    const job = await jobService.getJobById(req.params.id);
    return ResponseHandler.success(res, 'Job fetched successfully', { job });
  } catch (error) {
    next(error);
  }
};

const updateJob = async (req, res, next) => {
  try {
    const io = req.app.get('io');
    const job = await jobService.updateJob(req.params.id, req.user.id, req.body, io);
    return ResponseHandler.success(res, 'Job updated successfully', { job });
  } catch (error) {
    next(error);
  }
};

const deleteJob = async (req, res, next) => {
  try {
    await jobService.deleteJob(req.params.id, req.user.id);
    return ResponseHandler.success(res, 'Job deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = { createJob, getAllJobs, getJobById, updateJob, deleteJob };
