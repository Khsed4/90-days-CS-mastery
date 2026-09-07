import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateChallengeDto } from './dto';
import { Challenge } from '@shared/types';

@Injectable()
export class ChallengesService {
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
      type: item.type,
      status: item.status,
      authorId: item.authorId,
      authorName: item.authorName,
      rejectionReason: item.rejectionReason,
      createdAt: item.createdAt ? item.createdAt.toISOString() : undefined,
      updatedAt: item.updatedAt ? item.updatedAt.toISOString() : undefined,
    };
  }

  async findAllCore(): Promise<Challenge[]> {
    const list = await this.prisma.challenge.findMany({
      where: {
        type: 'CORE',
        status: 'APPROVED',
      },
      orderBy: { id: 'asc' },
    });
    return list.map((c) => this.mapToChallenge(c));
  }

  async findBonusChallenges(userId?: string): Promise<Challenge[]> {
    const approved = await this.prisma.challenge.findMany({
      where: {
        type: 'BONUS',
        status: 'APPROVED',
      },
      orderBy: { id: 'asc' },
    });

    if (!userId) {
      return approved.map((c) => this.mapToChallenge(c));
    }

    const userSubmissions = await this.prisma.challenge.findMany({
      where: {
        authorId: userId,
        type: 'BONUS',
      },
      orderBy: { id: 'asc' },
    });

    const userPendingOrRejected = userSubmissions.filter((c) => c.status !== 'APPROVED');
    const combined = [...approved, ...userPendingOrRejected].sort((a, b) => a.id - b.id);
    return combined.map((c) => this.mapToChallenge(c));
  }

  async findUserSubmissions(userId: string): Promise<Challenge[]> {
    const list = await this.prisma.challenge.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: 'desc' },
    });
    return list.map((c) => this.mapToChallenge(c));
  }

  async createChallenge(
    dto: CreateChallengeDto,
    user: { id: string; name: string; role: string },
  ): Promise<Challenge> {
    const isAdmin = user.role === 'ADMIN';

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
        type: dto.type || 'BONUS',
        status: isAdmin ? 'APPROVED' : 'PENDING',
        authorId: user.id,
        authorName: user.name,
      },
    });

    return this.mapToChallenge(created);
  }

  async findOne(id: number, user?: { id: string; role: string }): Promise<Challenge> {
    const challenge = await this.prisma.challenge.findUnique({
      where: { id },
    });
    if (!challenge) {
      throw new NotFoundException(`Challenge with ID ${id} not found`);
    }

    if (challenge.status !== 'APPROVED') {
      const isAuthor = user && user.id === challenge.authorId;
      const isAdmin = user && user.role === 'ADMIN';

      if (!isAuthor && !isAdmin) {
        throw new ForbiddenException('This challenge is currently under review by administrators');
      }
    }

    return this.mapToChallenge(challenge);
  }
}
