'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { USER_ROLES, VALIDATION } = require('../../utils/constants');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [VALIDATION.NAME_MAX_LENGTH, `Name cannot exceed ${VALIDATION.NAME_MAX_LENGTH} characters`],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [VALIDATION.PASSWORD_MIN_LENGTH, `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`],
      select: false, // Never return password in queries by default
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.JOB_SEEKER,
    },
    profile: {
      bio: { type: String, maxlength: 500 },
      phone: { type: String, trim: true },
      location: { type: String, trim: true },
      website: { type: String, trim: true },
      linkedin: { type: String, trim: true },
      github: { type: String, trim: true },
      skills: [{ type: String, lowercase: true, trim: true }],
      experience: { type: String },
      education: { type: String },
      resumeUrl: { type: String },
    },
    company: {
      // For recruiters
      name: { type: String, trim: true },
      website: { type: String, trim: true },
      description: { type: String },
    },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'profile.skills': 1 });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method: compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Instance method: get public profile (no password)
userSchema.methods.toPublicJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
