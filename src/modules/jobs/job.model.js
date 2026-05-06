'use strict';

const mongoose = require('mongoose');
const { JOB_STATUS, JOB_TYPE, EXPERIENCE_LEVEL, VALIDATION } = require('../../utils/constants');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [VALIDATION.TITLE_MAX_LENGTH, `Title cannot exceed ${VALIDATION.TITLE_MAX_LENGTH} characters`],
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
      maxlength: [VALIDATION.DESCRIPTION_MAX_LENGTH, `Description cannot exceed ${VALIDATION.DESCRIPTION_MAX_LENGTH} characters`],
    },
    company: {
      name: { type: String, required: [true, 'Company name is required'], trim: true },
      website: { type: String, trim: true },
      logo: { type: String },
    },
    location: {
      type: String,
      required: [true, 'Job location is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: Object.values(JOB_TYPE),
      default: JOB_TYPE.FULL_TIME,
    },
    experienceLevel: {
      type: String,
      enum: Object.values(EXPERIENCE_LEVEL),
      default: EXPERIENCE_LEVEL.MID,
    },
    skills: {
      type: [String],
      required: [true, 'At least one skill is required'],
      validate: {
        validator: (arr) => arr.length > 0 && arr.length <= VALIDATION.SKILLS_MAX_COUNT,
        message: `Skills must have between 1 and ${VALIDATION.SKILLS_MAX_COUNT} entries`,
      },
    },
    salary: {
      min: { type: Number, min: 0 },
      max: { type: Number, min: 0 },
      currency: { type: String, default: 'USD' },
      isPublic: { type: Boolean, default: true },
    },
    status: {
      type: String,
      enum: Object.values(JOB_STATUS),
      default: JOB_STATUS.ACTIVE,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    applicationCount: {
      type: Number,
      default: 0,
    },
    deadline: {
      type: Date,
    },
    tags: [{ type: String, lowercase: true, trim: true }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for search/filter performance
jobSchema.index({ title: 'text', description: 'text', skills: 'text' });
jobSchema.index({ skills: 1 });
jobSchema.index({ status: 1, createdAt: -1 });
jobSchema.index({ postedBy: 1 });
jobSchema.index({ location: 1 });
jobSchema.index({ type: 1 });
jobSchema.index({ experienceLevel: 1 });

// Normalize skills to lowercase before saving
jobSchema.pre('save', function (next) {
  if (this.isModified('skills')) {
    this.skills = this.skills.map((s) => s.toLowerCase().trim());
  }
  next();
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
