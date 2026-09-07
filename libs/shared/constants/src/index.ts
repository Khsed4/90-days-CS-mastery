export const USER_ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
} as const;

export const DIFFICULTY_LEVELS = {
  EASY: 'Easy',
  MEDIUM: 'Medium',
  HARD: 'Hard',
} as const;

export const CHALLENGE_TYPES = {
  CORE: 'CORE',
  BONUS: 'BONUS',
} as const;

export const CHALLENGE_STATUSES = {
  APPROVED: 'APPROVED',
  PENDING: 'PENDING',
  REJECTED: 'REJECTED',
} as const;

export const INTERFACE_LANGUAGES = {
  EN: 'en',
  FA: 'fa',
  PS: 'ps',
} as const;

export const DEFAULT_TRIAL_DAYS = [1, 2, 3];
export const TOTAL_ROADMAP_DAYS = 90;
