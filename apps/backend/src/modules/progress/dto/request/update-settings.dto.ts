import { IsIn, IsString } from 'class-validator';

export class UpdateSettingsDto {
  @IsString()
  @IsIn(['en', 'fa', 'ps'], { message: 'interfaceLang must be en, fa, or ps' })
  interfaceLang: 'en' | 'fa' | 'ps';
}
