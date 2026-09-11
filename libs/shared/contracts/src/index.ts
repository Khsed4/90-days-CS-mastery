import {
  DifficultyLevel,
  ChallengeType,
  ChallengeStatus,
  InterfaceLanguage,
  ProgrammingLanguage,
  User,
  Challenge,
  UserProgress,
  Organization,
  OrganizationInvite,
  OrganizationMember,
  OrganizationStats,
  AdminUserDetails,
} from '@shared/types';

// ==========================================
// Authentication Contracts
// ==========================================

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  inviteToken?: string;
}

export interface RegisterOrganizationRequest {
  organizationName: string;
  name: string;
  email: string;
  password: string;
  /** Languages this org allows its members to use (defaults to all if omitted) */
  allowedLanguages?: ProgrammingLanguage[];
  /** Categories this org allows its members to study (defaults to all if omitted) */
  allowedCategories?: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SendVerificationCodeRequest {
  email: string;
}

export interface VerifyCodeRequest {
  email: string;
  code: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
  requiresEmailVerification?: boolean;
}

export interface SendCodeResponse {
  success: boolean;
  message: string;
}

// ==========================================
// Organization Contracts
// ==========================================

export interface CreateOrgInviteRequest {
  email?: string;
  maxUses?: number;
  expiresInDays?: number;
}

export interface JoinOrgRequest {
  token: string;
}

export interface OrgOverviewResponse {
  organization: Organization;
  stats: OrganizationStats;
}

export interface OrgMembersResponse {
  members: OrganizationMember[];
  total: number;
}

export interface OrgMemberProgressResponse {
  member: OrganizationMember;
  progress: UserProgress;
}

/**
 * Request for an organization manager to review a member's submitted challenge.
 */
export interface OrgReviewChallengeRequest {
  /** 'ORG_APPROVED' to approve for team, 'REJECTED' to reject */
  status: 'ORG_APPROVED' | 'REJECTED';
  rejectionReason?: string;
}

/**
 * Request for updating organization curriculum settings.
 */
export interface UpdateOrgCurriculumRequest {
  allowedLanguages: ProgrammingLanguage[];
  allowedCategories: string[];
}

// ==========================================
// User Preference Contracts
// ==========================================

/**
 * Request for a user to update their active language and category preferences.
 */
export interface UpdateUserPreferencesRequest {
  selectedLanguage?: ProgrammingLanguage;
  selectedCategories?: string[];
}

// ==========================================
// Progress Contracts
// ==========================================

export interface SyncProgressRequest {
  completedDays: number[];
  interfaceLang?: InterfaceLanguage;
}

export interface UpdateSettingsRequest {
  interfaceLang: InterfaceLanguage;
}

// ==========================================
// Challenge Contracts
// ==========================================

export interface CreateChallengeRequest {
  title: string;
  difficulty: DifficultyLevel;
  category: string;
  prerequisite: string;
  description: string;
  examples: string;
  constraints: string;
  java: string;
  ts: string;
  type?: ChallengeType;
}

export interface UpdateChallengeRequest {
  title?: string;
  difficulty?: DifficultyLevel;
  category?: string;
  prerequisite?: string;
  description?: string;
  examples?: string;
  constraints?: string;
  java?: string;
  ts?: string;
  type?: ChallengeType;
  status?: ChallengeStatus;
  rejectionReason?: string | null;
}

export interface ReviewChallengeRequest {
  /** Admin can set APPROVED (global) or REJECTED */
  status: 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
}

// ==========================================
// Admin Governance Contracts
// ==========================================

export interface AdminStatsResponse {
  totalUsers: number;
  totalOrganizations: number;
  totalChallenges: number;
  coreChallenges: number;
  bonusChallenges: number;
  pendingChallenges: number;
  totalCompletions: number;
}

export interface AdminUserListResponse {
  users: AdminUserDetails[];
  total: number;
}
