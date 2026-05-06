'use strict';

const cloudinary = require('cloudinary').v2;
const env = require('./env');
const logger = require('../utils/logger');

const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
  });

  logger.info('Cloudinary configured successfully');
  return cloudinary;
};

module.exports = { configureCloudinary, cloudinary };
