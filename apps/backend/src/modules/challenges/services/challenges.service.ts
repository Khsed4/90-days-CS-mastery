import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { IChallengeRepository, CHALLENGE_REPOSITORY } from '../repositories/challenge.repository.interface';
import { ChallengeEntity } from '../domain/entities/challenge.entity';
import { CreateChallengeDto } from '../dto/request/create-challenge.dto';

@Injectable()
export class ChallengesService {
  constructor(
    @Inject(CHALLENGE_REPOSITORY) private challengeRepo: IChallengeRepository,
  ) {}

  async findAllCore(): Promise<ChallengeEntity[]> {
    return this.challengeRepo.findAll({
      type: 'CORE',
      status: 'APPROVED',
    });
  }

  async findBonusChallenges(userId?: string): Promise<ChallengeEntity[]> {
    const approvedBonus = await this.challengeRepo.findAll({
      type: 'BONUS',
      status: 'APPROVED',
    });

    if (!userId) {
      return approvedBonus;
    }

    // Also fetch user's personal pending/rejected submissions
    const userSubmissions = await this.challengeRepo.findAll({
      authorId: userId,
      type: 'BONUS',
    });

    const userPendingOrRejected = userSubmissions.filter((c) => c.status !== 'APPROVED');

    // Combine and return
    return [...approvedBonus, ...userPendingOrRejected].sort((a, b) => (a.id || 0) - (b.id || 0));
  }

  async findUserSubmissions(userId: string): Promise<ChallengeEntity[]> {
    return this.challengeRepo.findAll({
      authorId: userId,
    });
  }

  async createChallenge(
    dto: CreateChallengeDto,
    user: { id: string; name: string; role: string },
  ): Promise<ChallengeEntity> {
    const isAdmin = user.role === 'ADMIN';

    const entity = new ChallengeEntity({
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
    });

    return this.challengeRepo.create(entity);
  }

  async findOne(id: number, user?: { id: string; role: string }): Promise<ChallengeEntity> {
    const challenge = await this.challengeRepo.findById(id);
    if (!challenge) {
      throw new NotFoundException(`Challenge with ID ${id} not found`);
    }

    // If challenge is not approved, only author or admin can view
    if (challenge.status !== 'APPROVED') {
      const isAuthor = user && user.id === challenge.authorId;
      const isAdmin = user && user.role === 'ADMIN';

      if (!isAuthor && !isAdmin) {
        throw new ForbiddenException('This challenge is currently under review by administrators');
      }
    }

    return challenge;
  }
}
