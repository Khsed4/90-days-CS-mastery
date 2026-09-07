import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../../database/prisma.service';
import { CreateInviteDto } from './dto';
import {
  OrgOverviewResponse,
  OrgMembersResponse,
  OrgMemberProgressResponse,
} from '@shared/contracts';
import { OrganizationInvite } from '@shared/types';
import { TOTAL_ROADMAP_DAYS } from '@shared/constants';

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  private async getOwnedOrganization(userId: string) {
    const org = await this.prisma.organization.findUnique({
      where: { ownerId: userId },
      include: {
        _count: {
          select: { members: true, invites: true },
        },
      },
    });

    if (!org) {
      throw new NotFoundException('You do not own an organization account');
    }
    return org;
  }

  private parseCompletedDays(jsonString: string | null | undefined): number[] {
    try {
      const parsed = JSON.parse(jsonString || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  async getOverview(userId: string): Promise<OrgOverviewResponse> {
    const org = await this.getOwnedOrganization(userId);

    const members = await this.prisma.user.findMany({
      where: { organizationId: org.id },
      include: { progress: true },
    });

    const activeInvitesCount = await this.prisma.organizationInvite.count({
      where: {
        organizationId: org.id,
        isActive: true,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
    });

    let totalCompletedDaysSum = 0;
    let totalActiveStreaks = 0;

    members.forEach((member) => {
      const days = this.parseCompletedDays(member.progress?.completedDays);
      totalCompletedDaysSum += days.length;
      if (member.progress && member.progress.streak > 0) {
        totalActiveStreaks += 1;
      }
    });

    const memberCount = members.length;
    const avgCompletedDays = memberCount > 0 ? Math.round((totalCompletedDaysSum / memberCount) * 10) / 10 : 0;
    const overallCompletionRate =
      memberCount > 0
        ? Math.round((totalCompletedDaysSum / (memberCount * TOTAL_ROADMAP_DAYS)) * 100)
        : 0;

    return {
      organization: {
        id: org.id,
        name: org.name,
        slug: org.slug,
        ownerId: org.ownerId,
        createdAt: org.createdAt.toISOString(),
        _count: {
          members: memberCount,
          invites: activeInvitesCount,
        },
      },
      stats: {
        totalMembers: memberCount,
        avgCompletedDays,
        totalActiveStreaks,
        overallCompletionRate,
        activeInviteCount: activeInvitesCount,
      },
    };
  }

  async getMembers(userId: string, search?: string): Promise<OrgMembersResponse> {
    const org = await this.getOwnedOrganization(userId);

    const whereClause: any = { organizationId: org.id };
    if (search && search.trim().length > 0) {
      const q = search.trim();
      whereClause.OR = [
        { name: { contains: q } },
        { email: { contains: q } },
      ];
    }

    const members = await this.prisma.user.findMany({
      where: whereClause,
      include: { progress: true },
      orderBy: { createdAt: 'desc' },
    });

    const mappedMembers = members.map((m) => {
      const days = this.parseCompletedDays(m.progress?.completedDays);
      const progressPercentage = Math.min(100, Math.round((days.length / TOTAL_ROADMAP_DAYS) * 100));

      return {
        id: m.id,
        name: m.name,
        email: m.email,
        joinedAt: m.createdAt.toISOString(),
        completedDaysCount: days.length,
        streak: m.progress?.streak || 0,
        progressPercentage,
        completedDaysList: days,
      };
    });

    return {
      members: mappedMembers,
      total: mappedMembers.length,
    };
  }

  async getMemberProgress(userId: string, memberId: string): Promise<OrgMemberProgressResponse> {
    const org = await this.getOwnedOrganization(userId);

    const member = await this.prisma.user.findFirst({
      where: { id: memberId, organizationId: org.id },
      include: { progress: true },
    });

    if (!member) {
      throw new NotFoundException('Member not found in your organization');
    }

    const days = this.parseCompletedDays(member.progress?.completedDays);
    const progressPercentage = Math.min(100, Math.round((days.length / TOTAL_ROADMAP_DAYS) * 100));

    return {
      member: {
        id: member.id,
        name: member.name,
        email: member.email,
        joinedAt: member.createdAt.toISOString(),
        completedDaysCount: days.length,
        streak: member.progress?.streak || 0,
        progressPercentage,
        completedDaysList: days,
      },
      progress: {
        userId: member.id,
        completedDays: days,
        streak: member.progress?.streak || 0,
        interfaceLang: (member.progress?.interfaceLang as any) || 'en',
      },
    };
  }

  async removeMember(userId: string, memberId: string): Promise<{ success: boolean; message: string }> {
    const org = await this.getOwnedOrganization(userId);

    const member = await this.prisma.user.findFirst({
      where: { id: memberId, organizationId: org.id },
    });

    if (!member) {
      throw new NotFoundException('Member not found in your organization');
    }

    if (member.id === org.ownerId) {
      throw new BadRequestException('Organization owner cannot be removed as a member');
    }

    // Detach member from organization (preserves user and personal progress)
    await this.prisma.user.update({
      where: { id: memberId },
      data: { organizationId: null },
    });

    return {
      success: true,
      message: `User ${member.name} has been removed from the organization`,
    };
  }

  async createInvite(userId: string, dto: CreateInviteDto): Promise<OrganizationInvite> {
    const org = await this.getOwnedOrganization(userId);

    const token = crypto.randomBytes(16).toString('hex');
    let expiresAt: Date | null = null;

    if (dto.expiresInDays && dto.expiresInDays > 0) {
      expiresAt = new Date(Date.now() + dto.expiresInDays * 24 * 60 * 60 * 1000);
    }

    const invite = await this.prisma.organizationInvite.create({
      data: {
        organizationId: org.id,
        token,
        email: dto.email ? dto.email.toLowerCase().trim() : null,
        maxUses: dto.maxUses || 0,
        expiresAt,
        isActive: true,
      },
    });

    return {
      id: invite.id,
      organizationId: invite.organizationId,
      token: invite.token,
      email: invite.email,
      maxUses: invite.maxUses,
      usedCount: invite.usedCount,
      expiresAt: invite.expiresAt ? invite.expiresAt.toISOString() : null,
      isActive: invite.isActive,
      createdAt: invite.createdAt.toISOString(),
    };
  }

  async getInvites(userId: string): Promise<OrganizationInvite[]> {
    const org = await this.getOwnedOrganization(userId);

    const invites = await this.prisma.organizationInvite.findMany({
      where: { organizationId: org.id, isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    return invites.map((inv) => ({
      id: inv.id,
      organizationId: inv.organizationId,
      token: inv.token,
      email: inv.email,
      maxUses: inv.maxUses,
      usedCount: inv.usedCount,
      expiresAt: inv.expiresAt ? inv.expiresAt.toISOString() : null,
      isActive: inv.isActive,
      createdAt: inv.createdAt.toISOString(),
    }));
  }

  async revokeInvite(userId: string, inviteId: string): Promise<{ success: boolean; message: string }> {
    const org = await this.getOwnedOrganization(userId);

    const invite = await this.prisma.organizationInvite.findFirst({
      where: { id: inviteId, organizationId: org.id },
    });

    if (!invite) {
      throw new NotFoundException('Invite link not found');
    }

    await this.prisma.organizationInvite.update({
      where: { id: inviteId },
      data: { isActive: false },
    });

    return {
      success: true,
      message: 'Invitation link has been revoked',
    };
  }

  async joinOrganization(userId: string, token: string): Promise<{ success: boolean; organizationName: string }> {
    const invite = await this.prisma.organizationInvite.findUnique({
      where: { token: token.trim() },
      include: { organization: true },
    });

    if (
      !invite ||
      !invite.isActive ||
      (invite.expiresAt && invite.expiresAt < new Date()) ||
      (invite.maxUses > 0 && invite.usedCount >= invite.maxUses)
    ) {
      throw new BadRequestException('Invalid or expired invitation token');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role === 'ORGANIZATION' || user.role === 'ADMIN') {
      throw new ForbiddenException('Organization managers or Admins cannot join as member learners');
    }

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: { organizationId: invite.organizationId },
      }),
      this.prisma.organizationInvite.update({
        where: { id: invite.id },
        data: { usedCount: { increment: 1 } },
      }),
    ]);

    return {
      success: true,
      organizationName: invite.organization.name,
    };
  }
}
