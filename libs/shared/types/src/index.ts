// ==========================================
// Domain Enums and Primitive Types
// ==========================================

export type UserRole = 'USER' | 'ORGANIZATION' | 'ADMIN';
export type InterfaceLanguage = 'en';
export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';
export type ChallengeType = 'CORE' | 'BONUS';
export type ChallengeStatus = 'APPROVED' | 'PENDING' | 'REJECTED';

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
  createdAt: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
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
