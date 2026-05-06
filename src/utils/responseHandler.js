'use strict';

/**
 * Standard API response helper
 */
class ResponseHandler {
  /**
   * Send a success response
   * @param {object} res - Express response object
   * @param {string} message - Success message
   * @param {any} data - Response data
   * @param {number} statusCode - HTTP status code (default: 200)
   */
  static success(res, message = 'Success', data = null, statusCode = 200) {
    const response = {
      success: true,
      message,
    };

    if (data !== null && data !== undefined) {
      response.data = data;
    }

    return res.status(statusCode).json(response);
  }

  /**
   * Send a created response (201)
   */
  static created(res, message = 'Resource created successfully', data = null) {
    return ResponseHandler.success(res, message, data, 201);
  }

  /**
   * Send a paginated success response
   */
  static paginated(res, message = 'Success', data = [], pagination = {}) {
    return res.status(200).json({
      success: true,
      message,
      data,
      pagination: {
        page: pagination.page || 1,
        limit: pagination.limit || 10,
        total: pagination.total || 0,
        totalPages: pagination.totalPages || 0,
        hasNextPage: pagination.hasNextPage || false,
        hasPrevPage: pagination.hasPrevPage || false,
      },
    });
  }

  /**
   * Send an error response
   */
  static error(res, message = 'Internal Server Error', statusCode = 500, errors = null) {
    const response = {
      success: false,
      message,
    };

    if (errors) {
      response.errors = errors;
    }

    return res.status(statusCode).json(response);
  }

  /**
   * Send a not found response
   */
  static notFound(res, message = 'Resource not found') {
    return ResponseHandler.error(res, message, 404);
  }

  /**
   * Send an unauthorized response
   */
  static unauthorized(res, message = 'Unauthorized access') {
    return ResponseHandler.error(res, message, 401);
  }

  /**
   * Send a forbidden response
   */
  static forbidden(res, message = 'Access denied') {
    return ResponseHandler.error(res, message, 403);
  }

  /**
   * Send a bad request response
   */
  static badRequest(res, message = 'Bad request', errors = null) {
    return ResponseHandler.error(res, message, 400, errors);
  }

  /**
   * Send a conflict response
   */
  static conflict(res, message = 'Resource already exists') {
    return ResponseHandler.error(res, message, 409);
  }
}

module.exports = ResponseHandler;
