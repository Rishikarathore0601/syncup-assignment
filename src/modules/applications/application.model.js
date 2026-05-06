'use strict';

const mongoose = require('mongoose');
const { APPLICATION_STATUS } = require('../../utils/constants');

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Job reference is required'],
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Applicant reference is required'],
    },
    resumeUrl: {
      type: String,
      required: [true, 'Resume URL is required'],
    },
    coverLetter: {
      type: String,
      maxlength: 2000,
    },
    status: {
      type: String,
      enum: Object.values(APPLICATION_STATUS),
      default: APPLICATION_STATUS.PENDING,
    },
    matchScore: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    matchedSkills: [{ type: String }],
    notes: {
      type: String, // Internal recruiter notes
      select: false,
    },
    reviewedAt: { type: Date },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Enforce one application per job per applicant
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });
applicationSchema.index({ applicant: 1, createdAt: -1 });
applicationSchema.index({ job: 1, status: 1 });
applicationSchema.index({ status: 1 });

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
