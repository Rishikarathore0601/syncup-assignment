'use strict';

const logger = require('../../utils/logger');

/**
 * AI-powered keyword-based resume-to-job matching service.
 *
 * Formula: score = (matchedSkills / totalRequiredSkills) * 100
 *
 * This can be swapped out for an external LLM/AI API call
 * (e.g., OpenAI, Google Gemini) by replacing the matchResumeToJob function.
 */

/**
 * Tokenize text into a normalized set of lowercase words/skills
 * @param {string} text
 * @returns {Set<string>}
 */
const tokenize = (text) => {
  if (!text || typeof text !== 'string') return new Set();

  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s.#+]/g, ' ')  // Keep language-specific chars like C++, C#
      .split(/\s+/)
      .map((w) => w.trim())
      .filter((w) => w.length > 1)
  );
};

/**
 * Extract skills from a resume URL or resume text.
 * In production this can call an NLP/OCR service.
 * For now, we accept resumeText passed alongside the URL.
 *
 * @param {string} resumeTextOrUrl
 * @returns {Set<string>}
 */
const extractResumeSkills = (resumeTextOrUrl) => {
  // If plain text is passed, tokenize it directly
  if (resumeTextOrUrl && !resumeTextOrUrl.startsWith('http')) {
    return tokenize(resumeTextOrUrl);
  }

  // When only URL is provided, return empty set.
  // In production: call OCR/NLP service here.
  logger.debug('Resume is a URL — no text extraction. Pass resumeText for better matching.');
  return new Set();
};

/**
 * Match a resume against a job description using keyword overlap.
 *
 * @param {string} resumeTextOrUrl - Resume text or S3 URL
 * @param {object} job - Job document (must have .skills and .description)
 * @returns {{ score: number, matchedSkills: string[], totalSkills: number }}
 */
const matchResumeToJob = async (resumeTextOrUrl, job) => {
  try {
    const jobSkills = new Set(
      (job.skills || []).map((s) => s.toLowerCase().trim())
    );

    // Also extract keywords from description to increase coverage
    const descriptionKeywords = tokenize(job.description || '');

    // Combined set of required keywords
    const allRequired = new Set([...jobSkills, ...descriptionKeywords]);

    const resumeTokens = extractResumeSkills(resumeTextOrUrl);

    if (resumeTokens.size === 0 || allRequired.size === 0) {
      logger.debug('AI match: insufficient data for matching, returning score 0');
      return { score: 0, matchedSkills: [], totalSkills: jobSkills.size };
    }

    // Find intersection — skills present in resume that are required for the job
    const matched = [...jobSkills].filter((skill) => resumeTokens.has(skill));

    const score = jobSkills.size > 0
      ? Math.round((matched.length / jobSkills.size) * 100)
      : 0;

    logger.debug(
      `AI match: ${matched.length}/${jobSkills.size} skills matched, score=${score}`
    );

    return {
      score: Math.min(score, 100),
      matchedSkills: matched,
      totalSkills: jobSkills.size,
    };
  } catch (error) {
    logger.error(`AI matching error: ${error.message}`);
    // Fail gracefully — don't block application submission
    return { score: 0, matchedSkills: [], totalSkills: 0 };
  }
};

/**
 * Get top matching jobs for a given resume/skills set.
 * @param {string[]} userSkills - Array of user skills
 * @param {object[]} jobs - Array of job documents
 * @returns {object[]} Jobs sorted by match score descending
 */
const rankJobsForUser = async (userSkills, jobs) => {
  const skillSet = new Set(userSkills.map((s) => s.toLowerCase().trim()));

  const scored = jobs.map((job) => {
    const jobSkills = new Set((job.skills || []).map((s) => s.toLowerCase()));
    const matched = [...jobSkills].filter((s) => skillSet.has(s));
    const score = jobSkills.size > 0
      ? Math.round((matched.length / jobSkills.size) * 100)
      : 0;

    return { ...job, matchScore: score, matchedSkills: matched };
  });

  return scored.sort((a, b) => b.matchScore - a.matchScore);
};

module.exports = { matchResumeToJob, rankJobsForUser, tokenize };
