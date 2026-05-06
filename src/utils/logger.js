'use strict';

const winston = require('winston');
const path = require('path');
const env = require('../config/env');

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

// Custom log format for development
const devFormat = printf(({ level, message, timestamp, stack, ...metadata }) => {
  let log = `${timestamp} [${level}]: ${stack || message}`;
  if (Object.keys(metadata).length > 0) {
    log += ` | ${JSON.stringify(metadata)}`;
  }
  return log;
});

// Production format (structured JSON)
const prodFormat = combine(
  timestamp(),
  errors({ stack: true }),
  json()
);

// Development format (human-readable with colors)
const developmentFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  devFormat
);

const transports = [
  new winston.transports.Console({
    format: env.NODE_ENV === 'production' ? prodFormat : developmentFormat,
  }),
];

// Add file transports in production
if (env.NODE_ENV === 'production') {
  transports.push(
    new winston.transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error',
      format: prodFormat,
    }),
    new winston.transports.File({
      filename: path.join('logs', 'combined.log'),
      format: prodFormat,
    })
  );
}

const logger = winston.createLogger({
  level: env.NODE_ENV === 'production' ? 'warn' : 'debug',
  transports,
  exitOnError: false,
});

module.exports = logger;
