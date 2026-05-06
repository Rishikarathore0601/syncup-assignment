'use strict';

const Redis = require('ioredis');
const env = require('./env');
const logger = require('../utils/logger');

let redisClient = null;

const connectRedis = () => {
  const options = {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    db: env.REDIS_DB,
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    retryStrategy(times) {
      const delay = Math.min(times * 100, 3000);
      logger.warn(`Redis retry attempt ${times}, reconnecting in ${delay}ms...`);
      return delay;
    },
  };

  if (env.REDIS_PASSWORD) {
    options.password = env.REDIS_PASSWORD;
  }

  redisClient = new Redis(options);

  redisClient.on('connect', () => {
    logger.info('Redis client connected');
  });

  redisClient.on('ready', () => {
    logger.info('Redis client ready');
  });

  redisClient.on('error', (err) => {
    logger.error(`Redis error: ${err.message}`);
  });

  redisClient.on('close', () => {
    logger.warn('Redis connection closed');
  });

  redisClient.on('reconnecting', () => {
    logger.warn('Redis reconnecting...');
  });

  return redisClient;
};

const getRedisClient = () => {
  if (!redisClient) {
    return connectRedis();
  }
  return redisClient;
};

const disconnectRedis = async () => {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    logger.info('Redis connection closed');
  }
};

module.exports = { connectRedis, getRedisClient, disconnectRedis };
