'use strict';

require('dotenv').config();

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 5000,

  // MongoDB
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/job_matching_platform',

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret_change_in_production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '30d',

  // Redis
  REDIS_HOST: process.env.REDIS_HOST || '127.0.0.1',
  REDIS_PORT: parseInt(process.env.REDIS_PORT, 10) || 6379,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || '',
  REDIS_DB: parseInt(process.env.REDIS_DB, 10) || 0,
  REDIS_TTL: parseInt(process.env.REDIS_TTL, 10) || 3600,



  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000,
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,

  // AI Matching
  AI_MATCH_MIN_SCORE: parseInt(process.env.AI_MATCH_MIN_SCORE, 10) || 30,

  // Pagination
  DEFAULT_PAGE: parseInt(process.env.DEFAULT_PAGE, 10) || 1,
  DEFAULT_LIMIT: parseInt(process.env.DEFAULT_LIMIT, 10) || 10,
  MAX_LIMIT: parseInt(process.env.MAX_LIMIT, 10) || 100,
};

module.exports = env;
