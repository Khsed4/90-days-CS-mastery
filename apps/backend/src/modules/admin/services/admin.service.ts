import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IChallengeRepository, CHALLENGE_REPOSITORY, ChallengeFilterOptions } from '../../challenges/repositories/challenge.repository.interface';
import { DatabaseService } from '../../../infrastructure/database/database.service';
import { ChallengeEntity } from '../../challenges/domain/entities/challenge.entity';
import { CreateChallengeDto } from '../../challenges/dto/request/create-challenge.dto';
import { UpdateChallengeDto } from '../../challenges/dto/request/update-challenge.dto';
import { ReviewChallengeDto } from '../dto/request/review-challenge.dto';
import { AdminStatsDto } from '../dto/response/admin-stats.dto';

@Injectable()
export class AdminService {
  constructor(
    @Inject(CHALLENGE_REPOSITORY) private challengeRepo: IChallengeRepository,
    private db: DatabaseService,
  ) {}

  async getStats(): Promise<AdminStatsDto> {
    const userCountRows = await this.db.query<any[]>('SELECT COUNT(*) as total FROM users');
    const totalUsers = userCountRows[0]?.total || 0;

    const totalChallenges = await this.challengeRepo.count();
    const coreChallenges = await this.challengeRepo.count({ type: 'CORE' });
    const bonusChallenges = await this.challengeRepo.count({ type: 'BONUS', status: 'APPROVED' });
    const pendingChallenges = await this.challengeRepo.count({ status: 'PENDING' });

    const progressRows = await this.db.query<any[]>('SELECT completedDays FROM progress');
    let totalCompletions = 0;
    for (const row of progressRows) {
      try {
        const arr = JSON.parse(row.completedDays || '[]');
        if (Array.isArray(arr)) {
          totalCompletions += arr.length;
        }
      } catch {}
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

  async getAllChallenges(filters: ChallengeFilterOptions): Promise<ChallengeEntity[]> {
    return this.challengeRepo.findAll(filters);
  }

  async createChallenge(
    dto: CreateChallengeDto,
    adminUser: { id: string; name: string },
  ): Promise<ChallengeEntity> {
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
      status: 'APPROVED',
      authorId: adminUser.id,
      authorName: adminUser.name || 'Administrator',
    });

    return this.challengeRepo.create(entity);
  }

  async updateChallenge(id: number, dto: UpdateChallengeDto): Promise<ChallengeEntity> {
    const existing = await this.challengeRepo.findById(id);
    if (!existing) {
      throw new NotFoundException(`Challenge with ID ${id} not found`);
    }

    const updated = await this.challengeRepo.update(id, dto);
    return updated!;
  }

  async reviewChallenge(id: number, dto: ReviewChallengeDto): Promise<ChallengeEntity> {
    const existing = await this.challengeRepo.findById(id);
    if (!existing) {
      throw new NotFoundException(`Challenge with ID ${id} not found`);
    }

    const updated = await this.challengeRepo.update(id, {
      status: dto.status,
      rejectionReason: dto.status === 'REJECTED' ? dto.rejectionReason || 'Requires revision' : null,
    });

    return updated!;
  }

  async deleteChallenge(id: number): Promise<boolean> {
    const existing = await this.challengeRepo.findById(id);
    if (!existing) {
      throw new NotFoundException(`Challenge with ID ${id} not found`);
    }

    return this.challengeRepo.delete(id);
  }
}
