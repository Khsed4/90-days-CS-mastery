import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, MinLength, IsOptional } from 'class-validator';
import { DifficultyLevel, ChallengeType } from '@shared/types';
import { CreateChallengeRequest } from '@shared/contracts';

export class CreateChallengeDto implements CreateChallengeRequest {
  @ApiProperty({ example: 'Two Sum', description: 'Challenge title' })
  @IsString()
  @MinLength(3)
  title: string;

  @ApiProperty({ example: 'Easy', description: 'Difficulty level (Easy, Medium, Hard)' })
  @IsString()
  difficulty: DifficultyLevel;

  @ApiProperty({ example: 'Arrays & Hashing', description: 'Challenge category' })
  @IsString()
  category: string;

  @ApiProperty({ example: 'Basic Array Knowledge', description: 'Prerequisites' })
  @IsString()
  prerequisite: string;

  @ApiProperty({ example: 'Given an array of integers...', description: 'Full problem description' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]', description: 'Examples' })
  @IsString()
  examples: string;

  @ApiProperty({ example: '2 <= nums.length <= 10^4', description: 'Problem constraints' })
  @IsString()
  constraints: string;

  @ApiProperty({ example: 'class Solution { ... }', description: 'Java solution / boilerplate' })
  @IsString()
  java: string;

  @ApiProperty({ example: 'function twoSum(...) { ... }', description: 'TypeScript solution / boilerplate' })
  @IsString()
  ts: string;

  @ApiPropertyOptional({ example: 'BONUS', description: 'Challenge type (CORE, BONUS)' })
  @IsOptional()
  @IsString()
  type?: ChallengeType;
}
