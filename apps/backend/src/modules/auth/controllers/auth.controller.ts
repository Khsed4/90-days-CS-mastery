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
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dto/request/register.dto';
import { LoginDto } from '../dto/request/login.dto';
import { SendCodeDto } from '../dto/request/send-code.dto';
import { VerifyCodeDto } from '../dto/request/verify-code.dto';
import { AuthResponseDto, UserProfileDto } from '../dto/response/auth-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('send-verification-code')
  async sendVerificationCode(@Body() dto: SendCodeDto) {
    return this.authService.sendVerificationCode(dto.email);
  }

  @HttpCode(HttpStatus.OK)
  @Post('verify-code')
  async verifyCode(@Body() dto: VerifyCodeDto): Promise<AuthResponseDto> {
    return this.authService.verifyCode(dto.email, dto.code);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getProfile(@Request() req: any): Promise<UserProfileDto> {
    return req.user;
  }
}
