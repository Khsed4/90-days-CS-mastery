import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEmail, IsInt, Min, Max } from 'class-validator';
import { CreateOrgInviteRequest } from '@shared/contracts';

export class CreateInviteDto implements CreateOrgInviteRequest {
  @ApiProperty({ example: 'colleague@company.com', description: 'Optional email for targeted invite', required: false })
  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email?: string;

  @ApiProperty({ example: 0, description: 'Maximum uses allowed (0 for unlimited)', required: false, default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  maxUses?: number;

  @ApiProperty({ example: 30, description: 'Expiration in days (optional)', required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(365)
  expiresInDays?: number;
}
