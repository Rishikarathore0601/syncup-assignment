'use strict';

const { validationResult } = require('express-validator');
const ResponseHandler = require('../utils/responseHandler');

/**
 * Runs validation results and short-circuits with 400 if any errors exist.
 * Place this AFTER your express-validator chain in the route definition.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formatted = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value,
    }));

    return ResponseHandler.badRequest(res, 'Validation failed', formatted);
  }

  next();
};

module.exports = { validate };
