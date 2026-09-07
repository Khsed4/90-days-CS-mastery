import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { RegisterRequest } from '@shared/contracts';

export class RegisterDto implements RegisterRequest {
  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @ApiProperty({ example: 'password123', description: 'User password (min 4 characters)' })
  @IsString()
  @MinLength(4, { message: 'Password must be at least 4 characters long' })
  password: string;

  @ApiProperty({ example: 'John Doe', description: 'User full name' })
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  name: string;

  @ApiProperty({ example: 'org-invite-token-123', description: 'Optional organization invitation token', required: false })
  @IsString()
  @MinLength(3)
  inviteToken?: string;
}
