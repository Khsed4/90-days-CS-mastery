import { ChallengeEntity } from '../domain/entities/challenge.entity';
import { ChallengeType, ChallengeStatus } from '@shared';

export interface ChallengeFilterOptions {
  type?: ChallengeType;
  status?: ChallengeStatus;
  authorId?: string;
  search?: string;
}

export interface IChallengeRepository {
  findAll(options?: ChallengeFilterOptions): Promise<ChallengeEntity[]>;
  findById(id: number): Promise<ChallengeEntity | null>;
  create(challenge: ChallengeEntity): Promise<ChallengeEntity>;
  update(id: number, challenge: Partial<ChallengeEntity>): Promise<ChallengeEntity | null>;
  delete(id: number): Promise<boolean>;
  count(options?: ChallengeFilterOptions): Promise<number>;
}

export const CHALLENGE_REPOSITORY = Symbol('CHALLENGE_REPOSITORY');
