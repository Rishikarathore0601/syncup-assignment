'use strict';

const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');
const { FILE_UPLOAD } = require('../../utils/constants');
const logger = require('../../utils/logger');

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

let supabase;
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
}

/**
 * Upload a buffer to Supabase and return the public URL
 * @param {Buffer} fileBuffer - File data
 * @param {string} originalName - Original file name
 * @param {string} mimetype - File mime type
 */
const uploadFileToSupabase = async (fileBuffer, originalName, mimetype) => {
  if (!supabase) {
    throw new Error('Supabase client not initialized. Check credentials.');
  }

  const fileName = `${uuidv4()}-${originalName}`;
  const bucketName = 'resumes';

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(fileName, fileBuffer, {
      contentType: mimetype,
      upsert: false
    });

  if (error) {
    logger.error(`Supabase upload failed: ${error.message}`);
    throw new Error(`File upload failed. ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(fileName);

  logger.info(`File uploaded to Supabase: ${fileName}`);
  return { url: publicUrlData.publicUrl, public_id: fileName };
};

/**
 * Delete a file from Supabase by filename
 */
const deleteFileFromSupabase = async (fileName) => {
  if (!supabase) return;
  try {
    const { error } = await supabase.storage.from('resumes').remove([fileName]);
    if (error) throw error;
    logger.info(`File deleted from Supabase: ${fileName}`);
    return true;
  } catch (error) {
    logger.error(`Supabase delete failed: ${error.message}`);
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
  uploadFileToSupabase,
  deleteFileFromSupabase,
  validateFile,
};
