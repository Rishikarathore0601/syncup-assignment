'use strict';

require('dotenv').config();

const http = require('http');
const createApp = require('./src/app');
const { connectDB } = require('./src/config/db');
const { connectRedis } = require('./src/config/redis');
const { configureCloudinary } = require('./src/config/cloudinary');
const { initSocketServer } = require('./src/sockets/socket');
const env = require('./src/config/env');
const logger = require('./src/utils/logger');

const bootstrap = async () => {
  try {
    // ─── Connect to MongoDB ──────────────────────────────────────────────────
    await connectDB();

    // ─── Connect to Redis ────────────────────────────────────────────────────
    connectRedis();

    // ─── Configure Cloudinary ───────────────────────────────────────────────
    configureCloudinary();

    // ─── Create Express App ──────────────────────────────────────────────────
    const app = createApp();

    // ─── Create HTTP Server ──────────────────────────────────────────────────
    const httpServer = http.createServer(app);

    // ─── Initialize Socket.io ────────────────────────────────────────────────
    const io = initSocketServer(httpServer);

    // Attach io to app so controllers can access it via req.app.get('io')
    app.set('io', io);

    // ─── Start Listening ─────────────────────────────────────────────────────
    httpServer.listen(env.PORT, () => {
      logger.info(`
╔══════════════════════════════════════════════════════╗
║         JOB MATCHING PLATFORM API                    ║
╠══════════════════════════════════════════════════════╣
║  Status    : RUNNING                                 ║
║  Port      : ${String(env.PORT).padEnd(38)}║
║  Env       : ${String(env.NODE_ENV).padEnd(38)}║
║  Base URL  : http://localhost:${String(env.PORT).padEnd(25)}║
║  API Prefix: /api/v1                                 ║
╚══════════════════════════════════════════════════════╝
      `);
    });

    // ─── Graceful Shutdown ───────────────────────────────────────────────────
    const gracefulShutdown = async (signal) => {
      logger.info(`Received ${signal}. Starting graceful shutdown...`);

      httpServer.close(async () => {
        logger.info('HTTP server closed');

        try {
          const mongoose = require('mongoose');
          await mongoose.connection.close();
          logger.info('MongoDB connection closed');

          const { disconnectRedis } = require('./src/config/redis');
          await disconnectRedis();
          logger.info('Redis connection closed');

          logger.info('Graceful shutdown complete');
          process.exit(0);
        } catch (err) {
          logger.error(`Error during shutdown: ${err.message}`);
          process.exit(1);
        }
      });

      // Force exit if graceful shutdown takes too long
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Unhandled rejection & exception handlers
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Promise Rejection:', { reason: reason?.message || reason });
    });

    process.on('uncaughtException', (error) => {
      logger.error(`Uncaught Exception: ${error.message}`, { stack: error.stack });
      process.exit(1);
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

bootstrap();
