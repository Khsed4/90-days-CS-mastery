import { IsString, IsOptional, IsIn } from 'class-validator';
import { DifficultyLevel, ChallengeType, ChallengeStatus } from '@shared';

export class UpdateChallengeDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsIn(['Easy', 'Medium', 'Hard'])
  difficulty?: DifficultyLevel;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  prerequisite?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  examples?: string;

  @IsOptional()
  @IsString()
  constraints?: string;

  @IsOptional()
  @IsString()
  java?: string;

  @IsOptional()
  @IsString()
  ts?: string;

  @IsOptional()
  @IsIn(['CORE', 'BONUS'])
  type?: ChallengeType;

  @IsOptional()
  @IsIn(['APPROVED', 'PENDING', 'REJECTED'])
  status?: ChallengeStatus;

  @IsOptional()
  @IsString()
  rejectionReason?: string;
}
