import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { SendVerificationCodeRequest } from '@shared/contracts';

export class SendVerificationCodeDto implements SendVerificationCodeRequest {
  @ApiProperty({ example: 'user@example.com', description: 'User email address to send OTP' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;
}
