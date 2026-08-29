import {
  Injectable,
  Inject,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IUserRepository, USER_REPOSITORY } from '../repositories/user.repository.interface';
import {
  IEmailVerificationRepository,
  EMAIL_VERIFICATION_REPOSITORY,
} from '../repositories/email-verification.repository.interface';
import { MailService } from '../../../infrastructure/mail/mail.service';
import { RegisterDto } from '../dto/request/register.dto';
import { LoginDto } from '../dto/request/login.dto';
import { AuthResponseDto } from '../dto/response/auth-response.dto';
import { UserEntity } from '../domain/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY) private userRepo: IUserRepository,
    @Inject(EMAIL_VERIFICATION_REPOSITORY) private emailVerificationRepo: IEmailVerificationRepository,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  private generate6DigitOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private buildAuthResponse(user: UserEntity): AuthResponseDto {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);
    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt ? user.createdAt.toISOString() : new Date().toISOString(),
      },
      requiresEmailVerification: !user.isEmailVerified,
    };
  }

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const existing = await this.userRepo.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.userRepo.create({
      email: dto.email,
      password: hashedPassword,
      name: dto.name,
      role: 'USER',
      isEmailVerified: false,
    });

    // Generate & send OTP
    const code = this.generate6DigitOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
    await this.emailVerificationRepo.create(user.email, code, expiresAt);
    await this.mailService.sendOtpCode(user.email, code, user.name);

    return this.buildAuthResponse(user);
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.buildAuthResponse(user);
  }

  async sendVerificationCode(email: string): Promise<{ success: boolean; message: string }> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new NotFoundException('No user found with this email address');
    }

    await this.emailVerificationRepo.deleteByEmail(email);
    const code = this.generate6DigitOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await this.emailVerificationRepo.create(email, code, expiresAt);
    await this.mailService.sendOtpCode(email, code, user.name);

    return {
      success: true,
      message: 'Verification code sent successfully',
    };
  }

  async verifyCode(email: string, code: string): Promise<AuthResponseDto> {
    const record = await this.emailVerificationRepo.findLatestValid(email, code);
    if (!record) {
      throw new BadRequestException('Invalid or expired verification code');
    }

    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.userRepo.updateEmailVerified(user.id, true);
    await this.emailVerificationRepo.deleteByEmail(email);

    return this.buildAuthResponse(updatedUser);
  }

  async getProfile(userId: string): Promise<UserEntity> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
