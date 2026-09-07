import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RegisterDto, RegisterOrganizationDto, LoginDto, SendVerificationCodeDto, VerifyCodeDto } from './dto';
import { AuthResponse, SendCodeResponse } from '@shared/contracts';
import { User } from '@shared/types';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Register a new personal learner account' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 409, description: 'Email already registered' })
  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<AuthResponse> {
    return this.authService.register(dto);
  }

  @ApiOperation({ summary: 'Register a new organization account' })
  @ApiResponse({ status: 201, description: 'Organization registered successfully' })
  @ApiResponse({ status: 409, description: 'Email already registered' })
  @Post('register-organization')
  async registerOrganization(@Body() dto: RegisterOrganizationDto): Promise<AuthResponse> {
    return this.authService.registerOrganization(dto);
  }

  @ApiOperation({ summary: 'Log in with email and password' })
  @ApiResponse({ status: 200, description: 'Logged in successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(dto);
  }

  @ApiOperation({ summary: 'Send email verification OTP code' })
  @ApiResponse({ status: 200, description: 'Verification OTP sent' })
  @HttpCode(HttpStatus.OK)
  @Post('send-verification-code')
  async sendVerificationCode(@Body() dto: SendVerificationCodeDto): Promise<SendCodeResponse> {
    return this.authService.sendVerificationCode(dto.email);
  }

  @ApiOperation({ summary: 'Verify email with OTP code' })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired code' })
  @HttpCode(HttpStatus.OK)
  @Post('verify-code')
  async verifyCode(@Body() dto: VerifyCodeDto): Promise<AuthResponse> {
    return this.authService.verifyCode(dto.email, dto.code);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile returned' })
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getProfile(@Request() req: any): Promise<User> {
    return req.user;
  }
}
