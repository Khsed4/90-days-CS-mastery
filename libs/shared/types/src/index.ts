// ==========================================
// Domain Enums and Primitive Types
// ==========================================

export type UserRole = 'USER' | 'ADMIN';
export type InterfaceLanguage = 'en' | 'fa' | 'ps';
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

export interface EmailVerificationRecord {
  id: string;
  email: string;
  code: string;
  expiresAt: string;
  createdAt: string;
}
