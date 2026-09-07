import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { DifficultyLevel, ChallengeType, ChallengeStatus } from '@shared/types';
import { UpdateChallengeRequest } from '@shared/contracts';

export class UpdateChallengeDto implements UpdateChallengeRequest {
  @ApiPropertyOptional({ example: 'Updated Title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'Medium' })
  @IsOptional()
  @IsString()
  difficulty?: DifficultyLevel;

  @ApiPropertyOptional({ example: 'Trees' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  prerequisite?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  examples?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  constraints?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  java?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ts?: string;

  @ApiPropertyOptional({ example: 'BONUS' })
  @IsOptional()
  @IsString()
  type?: ChallengeType;

  @ApiPropertyOptional({ example: 'APPROVED' })
  @IsOptional()
  @IsString()
  status?: ChallengeStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  rejectionReason?: string | null;
}
