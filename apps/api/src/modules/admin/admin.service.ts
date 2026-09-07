import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateChallengeDto, UpdateChallengeDto } from '../challenges/dto';
import { ReviewChallengeDto, AdminStatsDto } from './dto';
import { Challenge, ChallengeType, ChallengeStatus } from '@shared/types';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  private mapToChallenge(item: any): Challenge {
    return {
      id: item.id,
      title: item.title,
      difficulty: item.difficulty,
      category: item.category,
      prerequisite: item.prerequisite,
      description: item.description,
      examples: item.examples,
      constraints: item.constraints,
      java: item.java,
      ts: item.ts,
      type: item.type as ChallengeType,
      status: item.status as ChallengeStatus,
      authorId: item.authorId,
      authorName: item.authorName,
      rejectionReason: item.rejectionReason,
      createdAt: item.createdAt ? item.createdAt.toISOString() : undefined,
      updatedAt: item.updatedAt ? item.updatedAt.toISOString() : undefined,
    };
  }

  async getAdminStats(): Promise<AdminStatsDto> {
    const totalUsers = await this.prisma.user.count({ where: { role: 'USER' } });
    const totalOrganizations = await this.prisma.organization.count();
    const totalChallenges = await this.prisma.challenge.count();
    const coreChallenges = await this.prisma.challenge.count({
      where: { type: 'CORE' },
    });
    const bonusChallenges = await this.prisma.challenge.count({
      where: { type: 'BONUS', status: 'APPROVED' },
    });
    const pendingChallenges = await this.prisma.challenge.count({
      where: { status: 'PENDING' },
    });

    const progressRecords = await this.prisma.progress.findMany();
    let totalCompletions = 0;
    for (const p of progressRecords) {
      try {
        const arr = JSON.parse(p.completedDays || '[]');
        if (Array.isArray(arr)) {
          totalCompletions += arr.length;
        }
      } catch {
        // ignore
      }
    }

    return {
      totalUsers,
      totalOrganizations,
      totalChallenges,
      coreChallenges,
      bonusChallenges,
      pendingChallenges,
      totalCompletions,
    };
  }

  async getUsers(options: { role?: string; search?: string }): Promise<any> {
    const where: any = {};
    if (options.role && options.role !== 'ALL') {
      where.role = options.role;
    }
    if (options.search && options.search.trim().length > 0) {
      const q = options.search.trim();
      where.OR = [
        { name: { contains: q } },
        { email: { contains: q } },
      ];
    }

    const users = await this.prisma.user.findMany({
      where,
      include: {
        organization: true,
        ownedOrg: true,
        progress: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const mappedUsers = users.map((u) => {
      let daysCount = 0;
      try {
        const days = JSON.parse(u.progress?.completedDays || '[]');
        if (Array.isArray(days)) daysCount = days.length;
      } catch {
        // ignore
      }

      return {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        isEmailVerified: u.isEmailVerified,
        organizationName: u.organization?.name || u.ownedOrg?.name || null,
        completedDaysCount: daysCount,
        streak: u.progress?.streak || 0,
        createdAt: u.createdAt.toISOString(),
      };
    });

    return {
      users: mappedUsers,
      total: mappedUsers.length,
    };
  }

  async deleteUser(id: string): Promise<{ success: boolean; message: string }> {
    const existing = await this.prisma.user.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.prisma.user.delete({ where: { id } });
    return {
      success: true,
      message: `Account ${existing.email} (${existing.name}) has been deleted successfully`,
    };
  }

  async getAllChallenges(options: {
    type?: string;
    status?: string;
    search?: string;
  }): Promise<Challenge[]> {
    const where: any = {};
    if (options.type) where.type = options.type;
    if (options.status) where.status = options.status;
    if (options.search) {
      where.OR = [
        { title: { contains: options.search } },
        { category: { contains: options.search } },
      ];
    }

    const list = await this.prisma.challenge.findMany({
      where,
      orderBy: { id: 'asc' },
    });

    return list.map((c) => this.mapToChallenge(c));
  }

  async createChallenge(
    dto: CreateChallengeDto,
    author: { id: string; name: string },
  ): Promise<Challenge> {
    const created = await this.prisma.challenge.create({
      data: {
        title: dto.title,
        difficulty: dto.difficulty,
        category: dto.category,
        prerequisite: dto.prerequisite,
        description: dto.description,
        examples: dto.examples,
        constraints: dto.constraints,
        java: dto.java,
        ts: dto.ts,
        type: dto.type || 'CORE',
        status: 'APPROVED',
        authorId: author.id,
        authorName: author.name,
      },
    });

    return this.mapToChallenge(created);
  }

  async updateChallenge(id: number, dto: UpdateChallengeDto): Promise<Challenge> {
    const existing = await this.prisma.challenge.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Challenge with ID ${id} not found`);
    }

    const updated = await this.prisma.challenge.update({
      where: { id },
      data: {
        title: dto.title,
        difficulty: dto.difficulty,
        category: dto.category,
        prerequisite: dto.prerequisite,
        description: dto.description,
        examples: dto.examples,
        constraints: dto.constraints,
        java: dto.java,
        ts: dto.ts,
        type: dto.type,
        status: dto.status,
        rejectionReason: dto.rejectionReason,
      },
    });

    return this.mapToChallenge(updated);
  }

  async reviewChallenge(id: number, dto: ReviewChallengeDto): Promise<Challenge> {
    const existing = await this.prisma.challenge.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Challenge with ID ${id} not found`);
    }

    const updated = await this.prisma.challenge.update({
      where: { id },
      data: {
        status: dto.status,
        rejectionReason: dto.status === 'REJECTED' ? dto.rejectionReason : null,
      },
    });

    return this.mapToChallenge(updated);
  }

  async deleteChallenge(id: number): Promise<{ success: boolean }> {
    const existing = await this.prisma.challenge.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Challenge with ID ${id} not found`);
    }

    await this.prisma.challenge.delete({ where: { id } });
    return { success: true };
  }
}
