import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaService } from '../../database/prisma.service';
import { MailService } from '../mail/mail.service';
import { RegisterDto, RegisterOrganizationDto, LoginDto } from './dto';
import { AuthResponse, SendCodeResponse } from '@shared/contracts';
import { User, UserRole, Organization } from '@shared/types';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  private generate6DigitOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private generateSlug(name: string): string {
    const base = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
      .slice(0, 50);
    const randomSuffix = crypto.randomBytes(3).toString('hex');
    return `${base || 'org'}-${randomSuffix}`;
  }

  private buildAuthResponse(
    user: {
      id: string;
      email: string;
      name: string;
      role: Role;
      isEmailVerified: boolean;
      organizationId?: string | null;
      organization?: { id: string; name: string; slug: string; ownerId: string; createdAt: Date } | null;
      ownedOrg?: { id: string; name: string; slug: string; ownerId: string; createdAt: Date } | null;
      createdAt: Date;
    },
  ): AuthResponse {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId || user.ownedOrg?.id || null,
    };
    const token = this.jwtService.sign(payload);

    const orgEntity = user.organization || user.ownedOrg;

    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as UserRole,
        isEmailVerified: user.isEmailVerified,
        organizationId: user.organizationId || user.ownedOrg?.id || null,
        organization: orgEntity
          ? {
              id: orgEntity.id,
              name: orgEntity.name,
              slug: orgEntity.slug,
              ownerId: orgEntity.ownerId,
              createdAt: orgEntity.createdAt.toISOString(),
            }
          : null,
        createdAt: user.createdAt.toISOString(),
      },
      requiresEmailVerification: !user.isEmailVerified,
    };
  }

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const normalizedEmail = dto.email.toLowerCase().trim();
    const existing = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (existing) {
      throw new ConflictException('Email is already registered. Please sign in instead.');
    }

    let resolvedOrgId: string | null = null;
    if (dto.inviteToken) {
      const invite = await this.prisma.organizationInvite.findUnique({
        where: { token: dto.inviteToken.trim() },
        include: { organization: true },
      });

      if (
        invite &&
        invite.isActive &&
        (!invite.expiresAt || invite.expiresAt > new Date()) &&
        (invite.maxUses === 0 || invite.usedCount < invite.maxUses)
      ) {
        resolvedOrgId = invite.organizationId;
        await this.prisma.organizationInvite.update({
          where: { id: invite.id },
          data: { usedCount: { increment: 1 } },
        });
      }
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        name: dto.name.trim(),
        role: Role.USER,
        isEmailVerified: true,
        organizationId: resolvedOrgId,
        progress: {
          create: {
            completedDays: '[]',
            streak: 0,
            interfaceLang: 'en',
          },
        },
      },
      include: {
        organization: true,
      },
    });

    return this.buildAuthResponse(user);
  }

  async registerOrganization(dto: RegisterOrganizationDto): Promise<AuthResponse> {
    const normalizedEmail = dto.email.toLowerCase().trim();
    const existing = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (existing) {
      throw new ConflictException('Email is already registered. Please sign in instead.');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const slug = this.generateSlug(dto.organizationName);

    // Create Organization owner and Organization atomically
    const user = await this.prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        name: dto.name.trim(),
        role: Role.ORGANIZATION,
        isEmailVerified: true,
        ownedOrg: {
          create: {
            name: dto.organizationName.trim(),
            slug,
            invites: {
              create: {
                token: crypto.randomUUID(),
                maxUses: 0,
                isActive: true,
              },
            },
          },
        },
      },
      include: {
        ownedOrg: true,
      },
    });

    return this.buildAuthResponse(user);
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
      include: {
        organization: true,
        ownedOrg: true,
      },
    });
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.buildAuthResponse(user);
  }

  async sendVerificationCode(email: string): Promise<SendCodeResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
    if (!user) {
      throw new NotFoundException('No user found with this email address');
    }

    await this.prisma.emailVerification.deleteMany({
      where: { email: user.email },
    });

    const code = this.generate6DigitOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.prisma.emailVerification.create({
      data: {
        email: user.email,
        code,
        expiresAt,
      },
    });

    await this.mailService.sendOtpCode(user.email, code, user.name);

    return {
      success: true,
      message: 'Verification code sent successfully',
    };
  }

  async verifyCode(email: string, code: string): Promise<AuthResponse> {
    const normalizedEmail = email.toLowerCase().trim();
    const record = await this.prisma.emailVerification.findFirst({
      where: {
        email: normalizedEmail,
        code: code.trim(),
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!record) {
      throw new BadRequestException('Invalid or expired verification code');
    }

    const user = await this.prisma.user.update({
      where: { email: normalizedEmail },
      data: { isEmailVerified: true },
      include: {
        organization: true,
        ownedOrg: true,
      },
    });

    await this.prisma.emailVerification.deleteMany({
      where: { email: normalizedEmail },
    });

    return this.buildAuthResponse(user);
  }

  async getProfile(userId: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        organization: true,
        ownedOrg: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const orgEntity = user.organization || user.ownedOrg;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as UserRole,
      isEmailVerified: user.isEmailVerified,
      organizationId: user.organizationId || user.ownedOrg?.id || null,
      organization: orgEntity
        ? {
            id: orgEntity.id,
            name: orgEntity.name,
            slug: orgEntity.slug,
            ownerId: orgEntity.ownerId,
            createdAt: orgEntity.createdAt.toISOString(),
          }
        : null,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
