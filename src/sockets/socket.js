'use strict';

const { Server } = require('socket.io');
const env = require('../config/env');
const logger = require('../utils/logger');
const { SOCKET_EVENTS } = require('../utils/constants');

let io = null;

/**
 * Initialize Socket.io server attached to an HTTP server
 * @param {http.Server} httpServer
 * @returns {Server} io instance
 */
const initSocketServer = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: env.CORS_ORIGIN,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.on(SOCKET_EVENTS.CONNECT, (socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    // Allow clients to join a room (e.g., by userId for private events)
    socket.on(SOCKET_EVENTS.JOIN_ROOM, (roomId) => {
      socket.join(roomId);
      logger.debug(`Socket ${socket.id} joined room: ${roomId}`);
      socket.emit('room_joined', { room: roomId });
    });

    socket.on(SOCKET_EVENTS.LEAVE_ROOM, (roomId) => {
      socket.leave(roomId);
      logger.debug(`Socket ${socket.id} left room: ${roomId}`);
    });

    socket.on(SOCKET_EVENTS.DISCONNECT, (reason) => {
      logger.info(`Socket disconnected: ${socket.id} (reason: ${reason})`);
    });

    socket.on('error', (err) => {
      logger.error(`Socket error [${socket.id}]: ${err.message}`);
    });
  });

  logger.info('Socket.io server initialized');
  return io;
};

/**
 * Get the current io instance
 */
const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized. Call initSocketServer first.');
  }
  return io;
};

/**
 * Emit a socket event to all connected clients
 */
const emitToAll = (event, data) => {
  if (io) {
    io.emit(event, data);
    logger.debug(`Socket event broadcast: ${event}`);
  }
};

/**
 * Emit a socket event to a specific room
 */
const emitToRoom = (room, event, data) => {
  if (io) {
    io.to(room).emit(event, data);
    logger.debug(`Socket event to room [${room}]: ${event}`);
  }
};

module.exports = { initSocketServer, getIO, emitToAll, emitToRoom };
