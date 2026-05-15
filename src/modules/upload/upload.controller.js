'use strict';

const multer = require('multer');
const uploadService = require('./upload.service');
const userService = require('../users/user.service');
const ResponseHandler = require('../../utils/responseHandler');
const { FILE_UPLOAD } = require('../../utils/constants');

// Use memory storage — buffer is passed directly to S3
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (FILE_UPLOAD.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, and DOCX are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: FILE_UPLOAD.MAX_FILE_SIZE },
});

/**
 * Single resume upload middleware
 */
const uploadResume = upload.single('resume');

/**
 * Upload resume to S3 and update user profile
 */
const uploadResumeController = async (req, res, next) => {
  try {
    if (!req.file) {
      return ResponseHandler.badRequest(res, 'No resume file provided');
    }

    uploadService.validateFile(req.file);

    const { url, public_id } = await uploadService.uploadFileToSupabase(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    // Optionally update user's resume URL in profile
    await userService.updateResumeUrl(req.user.id, url);

    return ResponseHandler.success(res, 'Resume uploaded successfully', {
      resumeUrl: url,
      publicId: public_id,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadResume, uploadResumeController };
