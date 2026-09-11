// ==========================================
// Domain Enums and Primitive Types
// ==========================================

export type UserRole = 'USER' | 'ORGANIZATION' | 'ADMIN';
export type InterfaceLanguage = 'en';
export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';
export type ChallengeType = 'CORE' | 'BONUS';

/**
 * Multi-tiered challenge status:
 * - APPROVED: globally visible to all users (published by admin)
 * - ORG_APPROVED: visible to all members of the submitting organization (approved by org manager)
 * - PENDING_ORG: awaiting organization manager review (submitted by an org member)
 * - PENDING: awaiting admin review (submitted by a standalone user)
 * - REJECTED: rejected by org or admin
 */
export type ChallengeStatus = 'APPROVED' | 'ORG_APPROVED' | 'PENDING_ORG' | 'PENDING' | 'REJECTED';

/**
 * Supported programming languages on the platform.
 */
export type ProgrammingLanguage =
  | 'java'
  | 'javascript'
  | 'typescript'
  | 'python'
  | 'cpp'
  | 'c'
  | 'csharp'
  | 'php'
  | 'go'
  | 'rust';

// ==========================================
// Domain Entity Models
// ==========================================

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isEmailVerified: boolean;
  organizationId?: string | null;
  organization?: Organization | null;
  /** User's currently active programming language */
  selectedLanguage?: ProgrammingLanguage | null;
  /** User's selected challenge categories (JSON-serialized array) */
  selectedCategories?: string[] | null;
  createdAt: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  /** Languages this org permits its members to work in */
  allowedLanguages?: ProgrammingLanguage[] | null;
  /** Categories this org permits its members to study */
  allowedCategories?: string[] | null;
  createdAt: string;
  updatedAt?: string;
  _count?: {
    members?: number;
    invites?: number;
  };
}

export interface OrganizationInvite {
  id: string;
  organizationId: string;
  token: string;
  email?: string | null;
  maxUses: number;
  usedCount: number;
  expiresAt?: string | null;
  isActive: boolean;
  createdAt: string;
  inviteUrl?: string;
}

export interface OrganizationMember {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
  completedDaysCount: number;
  streak: number;
  progressPercentage: number;
  completedDaysList: number[];
}

export interface OrganizationStats {
  totalMembers: number;
  avgCompletedDays: number;
  totalActiveStreaks: number;
  overallCompletionRate: number;
  activeInviteCount: number;
}

export interface AdminUserDetails {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isEmailVerified: boolean;
  createdAt: string;
  organizationName?: string | null;
  completedDaysCount?: number;
  streak?: number;
}

export interface Challenge {
  id: number;
  title: string;
  difficulty: DifficultyLevel;
  category: string;
  prerequisite: string;
  description: string;
  examples: string;
  constraints: string;
  java: string;
  ts: string;
  type: ChallengeType;
  status: ChallengeStatus;
  authorId?: string | null;
  authorName?: string | null;
  rejectionReason?: string | null;
  /** The organization that owns this challenge (for ORG_APPROVED challenges) */
  organizationId?: string | null;
  organizationName?: string | null;
  /** Language-specific solutions: Record<ProgrammingLanguage, code> stored as JSON */
  solutions?: Record<string, string> | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProgress {
  userId: string;
  completedDays: number[];
  streak: number;
  interfaceLang: InterfaceLanguage;
}

export interface EmailVerificationRecord {
  id: string;
  email: string;
  code: string;
  expiresAt: string;
  createdAt: string;
}
