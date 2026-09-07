import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { InterfaceLanguage } from '@shared/types';
import { SyncProgressRequest } from '@shared/contracts';

export class SyncProgressDto implements SyncProgressRequest {
  @ApiProperty({ example: [1, 2, 3], description: 'Array of completed day IDs (1-90)' })
  @IsArray()
  completedDays: number[];

  @ApiPropertyOptional({ example: 'en', description: 'Interface language (en)' })
  @IsOptional()
  @IsString()
  interfaceLang?: InterfaceLanguage;
}
