'use strict';

const userService = require('./user.service');
const ResponseHandler = require('../../utils/responseHandler');

const getUserProfile = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id || req.user.id);
    return ResponseHandler.success(res, 'User profile fetched', { user });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await userService.updateProfile(req.user.id, req.body);
    return ResponseHandler.success(res, 'Profile updated successfully', { user });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const { users, pagination } = await userService.getAllUsers(req.query);
    return ResponseHandler.paginated(res, 'Users fetched successfully', users, pagination);
  } catch (error) {
    next(error);
  }
};

module.exports = { getUserProfile, updateProfile, getAllUsers };
