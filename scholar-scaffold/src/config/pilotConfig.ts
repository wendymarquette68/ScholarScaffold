// Pipeline thresholds — controlled by VITE_PILOT_MODE environment variable.
// Production: 10 reviews, 5 include, 2 exclude
// Pilot mode: 2 reviews, 1 include, 1 exclude

const isPilot = import.meta.env.VITE_PILOT_MODE === 'true';

export const REVIEW_THRESHOLDS = {
  totalRequired: isPilot ? 2 : 10,
  includeRequired: isPilot ? 1 : 5,
  excludeRequired: isPilot ? 1 : 2,
};

export const IS_PILOT_MODE = isPilot;

export const PLATFORM_VERSION = isPilot ? '1.0-pilot' : '1.0';

// Minimum average rubric score (out of 4.0) to show "Proposal Ready" completion signal
export const PROPOSAL_COMPLETION_THRESHOLD = 3.0;
