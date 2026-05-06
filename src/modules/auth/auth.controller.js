'use strict';

const authService = require('./auth.service');
const ResponseHandler = require('../../utils/responseHandler');

const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const result = await authService.register({ name, email, password, role });
    return ResponseHandler.created(res, 'Registration successful', result);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    return ResponseHandler.success(res, 'Login successful', result);
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return ResponseHandler.badRequest(res, 'Refresh token is required');
    }
    const tokens = await authService.refreshToken(refreshToken);
    return ResponseHandler.success(res, 'Token refreshed successfully', tokens);
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user.id);
    return ResponseHandler.success(res, 'Profile fetched successfully', { user });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, refreshToken, getMe };
