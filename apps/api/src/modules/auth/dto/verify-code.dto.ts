import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { VerifyCodeRequest } from '@shared/contracts';

export class VerifyCodeDto implements VerifyCodeRequest {
  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @ApiProperty({ example: '123456', description: '6-digit verification code' })
  @IsString()
  @MinLength(4, { message: 'Verification code must be at least 4 digits' })
  code: string;
}
