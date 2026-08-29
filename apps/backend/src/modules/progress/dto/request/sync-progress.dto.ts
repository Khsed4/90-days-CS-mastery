import { IsArray, IsInt, IsOptional, IsIn } from 'class-validator';

export class SyncProgressDto {
  @IsArray()
  @IsInt({ each: true })
  completedDays: number[];

  @IsOptional()
  @IsIn(['en', 'fa', 'ps'])
  interfaceLang?: 'en' | 'fa' | 'ps';
}
