import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray } from 'class-validator';
import { ProgrammingLanguage } from '@shared/types';
import { UpdateUserPreferencesRequest } from '@shared/contracts';

export class UpdateUserPreferencesDto implements UpdateUserPreferencesRequest {
  @ApiPropertyOptional({ example: 'python', description: 'Active programming language' })
  @IsOptional()
  @IsString()
  selectedLanguage?: ProgrammingLanguage;

  @ApiPropertyOptional({ example: ['Arrays & Hashing', 'Trees'], description: 'Active categories filter' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  selectedCategories?: string[];
}
