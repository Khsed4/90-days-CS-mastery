import {
  DifficultyLevel,
  ChallengeType,
  ChallengeStatus,
  InterfaceLanguage,
  User,
  Challenge,
  UserProgress,
} from '@shared/types';

// ==========================================
// Authentication Contracts
// ==========================================

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
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
// Admin Statistics Contracts
// ==========================================

export interface AdminStatsResponse {
  totalUsers: number;
  totalChallenges: number;
  coreChallenges: number;
  bonusChallenges: number;
  pendingChallenges: number;
  totalCompletions: number;
}
