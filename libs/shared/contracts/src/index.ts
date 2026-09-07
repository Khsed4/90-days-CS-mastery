import {
  DifficultyLevel,
  ChallengeType,
  ChallengeStatus,
  InterfaceLanguage,
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
