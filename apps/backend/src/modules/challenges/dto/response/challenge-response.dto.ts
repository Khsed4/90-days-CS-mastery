import { DifficultyLevel, ChallengeType, ChallengeStatus } from '@shared';

export class ChallengeResponseDto {
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
