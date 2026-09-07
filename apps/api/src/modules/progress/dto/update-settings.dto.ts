import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn } from 'class-validator';
import { InterfaceLanguage } from '@shared/types';
import { UpdateSettingsRequest } from '@shared/contracts';

export class UpdateSettingsDto implements UpdateSettingsRequest {
  @ApiProperty({ example: 'en', description: 'Interface language (en, fa, ps)' })
  @IsString()
  @IsIn(['en', 'fa', 'ps'])
  interfaceLang: InterfaceLanguage;
}
