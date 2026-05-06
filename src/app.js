'use strict';

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const env = require('./config/env');
const logger = require('./utils/logger');
const { errorHandler, notFound } = require('./middlewares/error.middleware');

// Route imports
const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/users/user.routes');
const jobRoutes = require('./modules/jobs/job.routes');
const applicationRoutes = require('./modules/applications/application.routes');
const uploadRoutes = require('./modules/upload/upload.routes');
const aiRoutes = require('./modules/ai/ai.routes');

const createApp = () => {
  const app = express();

  // ─── Security Middleware ────────────────────────────────────────────────────
  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // ─── Body Parsing ───────────────────────────────────────────────────────────
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // ─── HTTP Request Logging ───────────────────────────────────────────────────
  const morganFormat = env.NODE_ENV === 'production' ? 'combined' : 'dev';
  app.use(
    morgan(morganFormat, {
      stream: { write: (message) => logger.http(message.trim()) },
      skip: (req) => req.url === '/health', // Skip health check logs
    })
  );

  // ─── Health Check ───────────────────────────────────────────────────────────
  app.get('/health', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Job Matching Platform API is running',
      version: '1.0.0',
      environment: env.NODE_ENV,
      timestamp: new Date().toISOString(),
    });
  });

  // ─── API Routes ─────────────────────────────────────────────────────────────
  const API_PREFIX = '/api/v1';
  app.use(`${API_PREFIX}/auth`, authRoutes);
  app.use(`${API_PREFIX}/users`, userRoutes);
  app.use(`${API_PREFIX}/jobs`, jobRoutes);
  app.use(`${API_PREFIX}/applications`, applicationRoutes);
  app.use(`${API_PREFIX}/upload`, uploadRoutes);
  app.use(`${API_PREFIX}/ai`, aiRoutes);

  // ─── 404 Handler ───────────────────────────────────────────────────────────
  app.use(notFound);

  // ─── Global Error Handler ──────────────────────────────────────────────────
  app.use(errorHandler);

  return app;
};

module.exports = createApp;
