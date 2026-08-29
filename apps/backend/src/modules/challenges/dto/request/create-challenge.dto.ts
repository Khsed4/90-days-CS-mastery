import { IsString, IsNotEmpty, IsIn, IsOptional } from 'class-validator';
import { DifficultyLevel, ChallengeType } from '@shared';

export class CreateChallengeDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @IsString()
  @IsIn(['Easy', 'Medium', 'Hard'], { message: 'Difficulty must be Easy, Medium, or Hard' })
  difficulty: DifficultyLevel;

  @IsString()
  @IsNotEmpty({ message: 'Category is required' })
  category: string;

  @IsString()
  @IsNotEmpty({ message: 'Prerequisite/Concepts explanation is required' })
  prerequisite: string;

  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @IsString()
  @IsNotEmpty({ message: 'Examples are required' })
  examples: string;

  @IsString()
  @IsNotEmpty({ message: 'Constraints are required' })
  constraints: string;

  @IsString()
  @IsNotEmpty({ message: 'Java solution is required' })
  java: string;

  @IsString()
  @IsNotEmpty({ message: 'TypeScript solution is required' })
  ts: string;

  @IsOptional()
  @IsIn(['CORE', 'BONUS'])
  type?: ChallengeType;
}
