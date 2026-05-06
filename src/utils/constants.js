'use strict';

// HTTP Status Codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
};

// User Roles
const USER_ROLES = {
  JOB_SEEKER: 'job_seeker',
  RECRUITER: 'recruiter',
  ADMIN: 'admin',
};

// Job Status
const JOB_STATUS = {
  ACTIVE: 'active',
  CLOSED: 'closed',
  DRAFT: 'draft',
};

// Application Status
const APPLICATION_STATUS = {
  PENDING: 'pending',
  REVIEWED: 'reviewed',
  SHORTLISTED: 'shortlisted',
  REJECTED: 'rejected',
  HIRED: 'hired',
};

// Job Types
const JOB_TYPE = {
  FULL_TIME: 'full_time',
  PART_TIME: 'part_time',
  CONTRACT: 'contract',
  INTERNSHIP: 'internship',
  REMOTE: 'remote',
  HYBRID: 'hybrid',
};

// Experience Levels
const EXPERIENCE_LEVEL = {
  ENTRY: 'entry',
  MID: 'mid',
  SENIOR: 'senior',
  LEAD: 'lead',
  EXECUTIVE: 'executive',
};

// Redis Cache Keys
const CACHE_KEYS = {
  ALL_JOBS: 'jobs:all',
  JOB_BY_ID: (id) => `jobs:${id}`,
  USER_JOBS: (userId) => `jobs:user:${userId}`,
  JOB_APPLICATIONS: (jobId) => `applications:job:${jobId}`,
};

// Socket Events
const SOCKET_EVENTS = {
  JOB_CREATED: 'job_created',
  JOB_UPDATED: 'job_updated',
  JOB_CLOSED: 'job_closed',
  JOB_APPLIED: 'job_applied',
  APPLICATION_STATUS_UPDATED: 'application_status_updated',
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  JOIN_ROOM: 'join_room',
  LEAVE_ROOM: 'leave_room',
};

// File Upload
const FILE_UPLOAD = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_MIME_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  S3_RESUME_FOLDER: 'resumes',
};

// Validation Limits
const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  NAME_MAX_LENGTH: 100,
  TITLE_MAX_LENGTH: 200,
  DESCRIPTION_MAX_LENGTH: 5000,
  SKILLS_MAX_COUNT: 30,
};

module.exports = {
  HTTP_STATUS,
  USER_ROLES,
  JOB_STATUS,
  APPLICATION_STATUS,
  JOB_TYPE,
  EXPERIENCE_LEVEL,
  CACHE_KEYS,
  SOCKET_EVENTS,
  FILE_UPLOAD,
  VALIDATION,
};
