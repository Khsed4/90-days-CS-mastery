import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateChallengeDto } from './dto';
import { Challenge } from '@shared/types';

@Injectable()
export class ChallengesService {
  constructor(private prisma: PrismaService) {}

  private parseJsonRecord(json: string | null | undefined): Record<string, string> | null {
    if (!json) return null;
    try {
      const parsed = JSON.parse(json);
      return typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }

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
      organizationId: item.organizationId ?? null,
      organizationName: item.organization?.name ?? null,
      solutions: this.parseJsonRecord(item.solutions),
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

  async findBonusChallenges(user?: { id: string; role: string; organizationId?: string | null }): Promise<Challenge[]> {
    const orConditions: any[] = [
      // Always include globally approved bonus challenges
      { type: 'BONUS', status: 'APPROVED' },
    ];

    if (user) {
      // Include org-approved challenges if user belongs to an org
      if (user.organizationId) {
        orConditions.push({
          type: 'BONUS',
          status: 'ORG_APPROVED',
          organizationId: user.organizationId,
        });
      }

      // Include the user's own submissions (any status)
      orConditions.push({
        type: 'BONUS',
        authorId: user.id,
      });
    }

    const list = await this.prisma.challenge.findMany({
      where: { OR: orConditions },
      include: { organization: true },
      orderBy: { id: 'asc' },
    });

    // De-duplicate by id (a user's own APPROVED challenge could match multiple conditions)
    const seen = new Set<number>();
    const unique = list.filter((c) => {
      if (seen.has(c.id)) return false;
      seen.add(c.id);
      return true;
    });

    return unique.map((c) => this.mapToChallenge(c));
  }

  async findUserSubmissions(userId: string): Promise<Challenge[]> {
    const list = await this.prisma.challenge.findMany({
      where: { authorId: userId },
      include: { organization: true },
      orderBy: { createdAt: 'desc' },
    });
    return list.map((c) => this.mapToChallenge(c));
  }

  async createChallenge(
    dto: CreateChallengeDto,
    user: { id: string; name: string; role: string; organizationId?: string | null },
  ): Promise<Challenge> {
    const isAdmin = user.role === 'ADMIN';

    let status: string;
    let organizationId: string | null = null;

    if (isAdmin) {
      // Admin submissions are auto-approved globally
      status = 'APPROVED';
    } else if (user.organizationId) {
      // Org member: goes for org review first
      status = 'PENDING_ORG';
      organizationId = user.organizationId;
    } else {
      // Standalone user: goes for admin review
      status = 'PENDING';
    }

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
        status,
        authorId: user.id,
        authorName: user.name,
        organizationId,
      },
      include: { organization: true },
    });

    return this.mapToChallenge(created);
  }

  async findOne(id: number, user?: { id: string; role: string; organizationId?: string | null }): Promise<Challenge> {
    const challenge = await this.prisma.challenge.findUnique({
      where: { id },
      include: { organization: true },
    });

    if (!challenge) {
      throw new NotFoundException(`Challenge with ID ${id} not found`);
    }

    const isAdmin = user?.role === 'ADMIN';
    const isAuthor = user && user.id === challenge.authorId;

    if (challenge.status === 'APPROVED') {
      // Globally approved — accessible to all
      return this.mapToChallenge(challenge);
    }

    if (challenge.status === 'ORG_APPROVED') {
      // Accessible to org members of the owning org, author, and admin
      const isOrgMember = user && user.organizationId && user.organizationId === challenge.organizationId;
      if (!isAuthor && !isAdmin && !isOrgMember) {
        throw new ForbiddenException('This challenge is only available to members of the owning organization');
      }
      return this.mapToChallenge(challenge);
    }

    if (challenge.status === 'PENDING_ORG') {
      // Accessible to author, org manager of the owning org, and admin
      if (!isAuthor && !isAdmin) {
        throw new ForbiddenException('This challenge is awaiting organization review');
      }
      return this.mapToChallenge(challenge);
    }

    if (challenge.status === 'PENDING') {
      // Accessible to author and admin
      if (!isAuthor && !isAdmin) {
        throw new ForbiddenException('This challenge is currently under review by administrators');
      }
      return this.mapToChallenge(challenge);
    }

    // REJECTED: only author and admin
    if (!isAuthor && !isAdmin) {
      throw new ForbiddenException('This challenge is not available');
    }

    return this.mapToChallenge(challenge);
  }
}
