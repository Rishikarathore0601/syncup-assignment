'use strict';

const Job = require('./job.model');
const { getRedisClient } = require('../../config/redis');
const { CACHE_KEYS, JOB_STATUS } = require('../../utils/constants');
const env = require('../../config/env');
const logger = require('../../utils/logger');

/**
 * Build filter query from request query params
 */
const buildFilter = (query) => {
  const filter = { status: JOB_STATUS.ACTIVE };

  if (query.search) {
    filter.$text = { $search: query.search };
  }

  if (query.skills) {
    const skillsArray = query.skills
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    if (skillsArray.length) filter.skills = { $in: skillsArray };
  }

  if (query.location) {
    filter.location = { $regex: query.location, $options: 'i' };
  }

  if (query.type) {
    filter.type = query.type;
  }

  if (query.experienceLevel) {
    filter.experienceLevel = query.experienceLevel;
  }

  return filter;
};

/**
 * Create a new job posting
 */
const createJob = async (jobData, recruiterId, io) => {
  const job = await Job.create({ ...jobData, postedBy: recruiterId });
  const populated = await job.populate('postedBy', 'name email company');

  // Invalidate jobs cache
  try {
    const redis = getRedisClient();
    const keys = await redis.keys(`${CACHE_KEYS.ALL_JOBS}*`);
    if (keys.length) {
      await redis.del(...keys);
      logger.debug(`Cache invalidated: ${keys.length} keys deleted`);
    }
  } catch (err) {
    logger.warn(`Cache invalidation failed: ${err.message}`);
  }

  // Emit real-time event
  if (io) {
    io.emit('job_created', {
      jobId: job._id,
      title: job.title,
      company: job.company.name,
      postedAt: job.createdAt,
    });
    logger.debug(`Socket event emitted: job_created [${job._id}]`);
  }

  logger.info(`Job created: "${job.title}" by user ${recruiterId}`);
  return populated;
};

/**
 * Get all jobs with pagination, filtering, and Redis caching
 */
const getAllJobs = async (query) => {
  const page = Math.max(parseInt(query.page, 10) || env.DEFAULT_PAGE, 1);
  const limit = Math.min(
    parseInt(query.limit, 10) || env.DEFAULT_LIMIT,
    env.MAX_LIMIT
  );
  const skip = (page - 1) * limit;

  // Build a cache key unique to this query
  const cacheKey = `${CACHE_KEYS.ALL_JOBS}:${JSON.stringify({ ...query, page, limit })}`;

  // Try cache first
  try {
    const redis = getRedisClient();
    const cached = await redis.get(cacheKey);
    if (cached) {
      logger.debug(`Cache HIT: ${cacheKey}`);
      return JSON.parse(cached);
    }
    logger.debug(`Cache MISS: ${cacheKey}`);
  } catch (err) {
    logger.warn(`Redis read error: ${err.message}`);
  }

  const filter = buildFilter(query);

  const sortOptions = {};
  if (query.search) {
    sortOptions.score = { $meta: 'textScore' };
  }
  sortOptions.createdAt = -1;

  const [jobs, total] = await Promise.all([
    Job.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .populate('postedBy', 'name email company')
      .lean(),
    Job.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  const result = {
    jobs,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };

  // Store in cache
  try {
    const redis = getRedisClient();
    await redis.setex(cacheKey, env.REDIS_TTL, JSON.stringify(result));
    logger.debug(`Cache SET: ${cacheKey} (TTL: ${env.REDIS_TTL}s)`);
  } catch (err) {
    logger.warn(`Redis write error: ${err.message}`);
  }

  return result;
};

/**
 * Get a single job by ID
 */
const getJobById = async (jobId) => {
  const cacheKey = CACHE_KEYS.JOB_BY_ID(jobId);

  try {
    const redis = getRedisClient();
    const cached = await redis.get(cacheKey);
    if (cached) {
      logger.debug(`Cache HIT: ${cacheKey}`);
      return JSON.parse(cached);
    }
  } catch (err) {
    logger.warn(`Redis read error: ${err.message}`);
  }

  const job = await Job.findById(jobId).populate('postedBy', 'name email company').lean();

  if (!job) {
    const error = new Error('Job not found');
    error.statusCode = 404;
    throw error;
  }

  try {
    const redis = getRedisClient();
    await redis.setex(cacheKey, env.REDIS_TTL, JSON.stringify(job));
  } catch (err) {
    logger.warn(`Redis write error: ${err.message}`);
  }

  return job;
};

/**
 * Update a job (recruiter must own it)
 */
const updateJob = async (jobId, recruiterId, updates, io) => {
  const job = await Job.findOne({ _id: jobId, postedBy: recruiterId });

  if (!job) {
    const error = new Error('Job not found or you are not authorized to update it');
    error.statusCode = 404;
    throw error;
  }

  Object.assign(job, updates);
  await job.save();

  // Invalidate caches
  try {
    const redis = getRedisClient();
    const keys = await redis.keys(`${CACHE_KEYS.ALL_JOBS}*`);
    const singleKey = CACHE_KEYS.JOB_BY_ID(jobId);
    const toDelete = [...keys, singleKey].filter(Boolean);
    if (toDelete.length) await redis.del(...toDelete);
  } catch (err) {
    logger.warn(`Cache invalidation error: ${err.message}`);
  }

  return job;
};

/**
 * Delete a job (recruiter must own it)
 */
const deleteJob = async (jobId, recruiterId) => {
  const job = await Job.findOneAndDelete({ _id: jobId, postedBy: recruiterId });

  if (!job) {
    const error = new Error('Job not found or you are not authorized to delete it');
    error.statusCode = 404;
    throw error;
  }

  // Invalidate caches
  try {
    const redis = getRedisClient();
    const keys = await redis.keys(`${CACHE_KEYS.ALL_JOBS}*`);
    const singleKey = CACHE_KEYS.JOB_BY_ID(jobId);
    const toDelete = [...keys, singleKey].filter(Boolean);
    if (toDelete.length) await redis.del(...toDelete);
  } catch (err) {
    logger.warn(`Cache invalidation error: ${err.message}`);
  }

  logger.info(`Job deleted: ${jobId}`);
  return job;
};

module.exports = { createJob, getAllJobs, getJobById, updateJob, deleteJob };
