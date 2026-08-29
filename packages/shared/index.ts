export type UserRole = 'USER' | 'ADMIN';
export type InterfaceLanguage = 'en' | 'fa' | 'ps';
export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';
export type ChallengeType = 'CORE' | 'BONUS';
export type ChallengeStatus = 'APPROVED' | 'PENDING' | 'REJECTED';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isEmailVerified: boolean;
  createdAt: string;
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

export interface AuthResponse {
  accessToken: string;
  user: User;
  requiresEmailVerification?: boolean;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface SendVerificationCodeDto {
  email: string;
}

export interface VerifyCodeDto {
  email: string;
  code: string;
}

export interface SyncProgressDto {
  completedDays: number[];
  interfaceLang?: InterfaceLanguage;
}

export interface CreateChallengeDto {
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

export interface UpdateChallengeDto {
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

export interface ReviewChallengeDto {
  status: 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
}

export interface AdminStatsDto {
  totalUsers: number;
  totalChallenges: number;
  coreChallenges: number;
  bonusChallenges: number;
  pendingChallenges: number;
  totalCompletions: number;
}
