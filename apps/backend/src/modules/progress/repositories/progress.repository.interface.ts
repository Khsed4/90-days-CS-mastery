import { ProgressEntity } from '../domain/entities/progress.entity';

export interface IProgressRepository {
  findByUserId(userId: string): Promise<ProgressEntity | null>;
  create(progress: Partial<ProgressEntity>): Promise<ProgressEntity>;
  update(progress: ProgressEntity): Promise<ProgressEntity>;
}

export const PROGRESS_REPOSITORY = Symbol('PROGRESS_REPOSITORY');
