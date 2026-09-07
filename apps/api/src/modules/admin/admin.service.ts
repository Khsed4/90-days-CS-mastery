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
    const totalUsers = await this.prisma.user.count();
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
      totalChallenges,
      coreChallenges,
      bonusChallenges,
      pendingChallenges,
      totalCompletions,
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
