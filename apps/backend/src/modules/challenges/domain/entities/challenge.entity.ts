import { ChallengeType, ChallengeStatus, DifficultyLevel } from '@shared';

export class ChallengeEntity {
  id?: number;
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
  createdAt?: Date;
  updatedAt?: Date;

  constructor(partial: Partial<ChallengeEntity>) {
    Object.assign(this, partial);
    this.type = partial.type || 'CORE';
    this.status = partial.status || 'APPROVED';
  }
}
