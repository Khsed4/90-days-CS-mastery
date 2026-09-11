import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsArray, IsOptional } from 'class-validator';
import { RegisterOrganizationRequest } from '@shared/contracts';
import { ProgrammingLanguage } from '@shared/types';

export class RegisterOrganizationDto implements RegisterOrganizationRequest {
  @ApiProperty({ example: 'Acme Corporation', description: 'Organization / Company Name' })
  @IsString()
  @MinLength(2, { message: 'Organization name must be at least 2 characters long' })
  organizationName: string;

  @ApiProperty({ example: 'Alice Smith', description: 'Organization Admin Full Name' })
  @IsString()
  @MinLength(2, { message: 'Admin name must be at least 2 characters long' })
  name: string;

  @ApiProperty({ example: 'admin@acme.com', description: 'Organization work email' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @ApiProperty({ example: 'securePassword123', description: 'Admin account password (min 4 characters)' })
  @IsString()
  @MinLength(4, { message: 'Password must be at least 4 characters long' })
  password: string;

  @ApiPropertyOptional({
    example: ['java', 'typescript'],
    description: 'Programming languages allowed for org members. Defaults to all if omitted.',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  allowedLanguages?: ProgrammingLanguage[];

  @ApiPropertyOptional({
    example: ['arrays-hashing', 'graphs', 'dynamic-programming'],
    description: 'Challenge categories allowed for org members. Defaults to all if omitted.',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  allowedCategories?: string[];
}
