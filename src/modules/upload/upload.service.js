'use strict';

const { cloudinary } = require('../../config/cloudinary');
const { v4: uuidv4 } = require('uuid');
const { FILE_UPLOAD } = require('../../utils/constants');
const logger = require('../../utils/logger');

/**
 * Upload a buffer to Cloudinary and return the public URL
 * @param {Buffer} fileBuffer - File data
 * @param {string} originalName - Original file name
 */
const uploadFileToCloudinary = (fileBuffer, originalName) => {
  return new Promise((resolve, reject) => {
    const fileName = `${uuidv4()}-${originalName}`;
    
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: FILE_UPLOAD.S3_RESUME_FOLDER, // Reusing the constant name but it's now a Cloudinary folder
        public_id: fileName.split('.')[0],
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) {
          logger.error(`Cloudinary upload failed: ${error.message}`);
          return reject(new Error('File upload failed. Please try again.'));
        }
        logger.info(`File uploaded to Cloudinary: ${result.public_id}`);
        resolve({ url: result.secure_url, public_id: result.public_id });
      }
    );

    // Use a small helper to convert buffer to stream
    const bufferStream = require('stream').Readable.from(fileBuffer);
    bufferStream.pipe(uploadStream);
  });
};

/**
 * Delete a file from Cloudinary by public ID
 */
const deleteFileFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    logger.info(`File deleted from Cloudinary: ${publicId}`);
    return result;
  } catch (error) {
    logger.error(`Cloudinary delete failed: ${error.message}`);
    throw error;
  }
};

/**
 * Validate file before upload
 */
const validateFile = (file) => {
  if (!file) {
    const error = new Error('No file provided');
    error.statusCode = 400;
    throw error;
  }

  if (file.size > FILE_UPLOAD.MAX_FILE_SIZE) {
    const error = new Error(
      `File size exceeds limit of ${FILE_UPLOAD.MAX_FILE_SIZE / 1024 / 1024}MB`
    );
    error.statusCode = 400;
    throw error;
  }

  if (!FILE_UPLOAD.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    const error = new Error(
      `Invalid file type. Allowed types: PDF, DOC, DOCX`
    );
    error.statusCode = 400;
    throw error;
  }
};

module.exports = {
  uploadFileToCloudinary,
  deleteFileFromCloudinary,
  validateFile,
};
