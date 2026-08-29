import { Injectable, Inject } from '@nestjs/common';
import { IProgressRepository, PROGRESS_REPOSITORY } from '../repositories/progress.repository.interface';
import { ProgressEntity } from '../domain/entities/progress.entity';

@Injectable()
export class ProgressService {
  constructor(
    @Inject(PROGRESS_REPOSITORY) private progressRepo: IProgressRepository,
  ) {}

  private async getOrCreate(userId: string): Promise<ProgressEntity> {
    let progress = await this.progressRepo.findByUserId(userId);
    if (!progress) {
      progress = await this.progressRepo.create({
        userId,
        completedDays: [],
        streak: 0,
        interfaceLang: 'en',
      });
    }
    return progress;
  }

  async getProgress(userId: string): Promise<ProgressEntity> {
    return this.getOrCreate(userId);
  }

  async toggleDay(userId: string, dayId: number): Promise<ProgressEntity> {
    const progress = await this.getOrCreate(userId);
    let days = [...progress.completedDays];

    if (days.includes(dayId)) {
      days = days.filter((d) => d !== dayId);
    } else {
      days.push(dayId);
      days.sort((a, b) => a - b);
    }

    progress.completedDays = days;
    progress.calculateStreak();

    return this.progressRepo.update(progress);
  }

  async updateSettings(userId: string, interfaceLang: 'en' | 'fa' | 'ps'): Promise<ProgressEntity> {
    const progress = await this.getOrCreate(userId);
    progress.interfaceLang = interfaceLang;
    return this.progressRepo.update(progress);
  }

  async syncProgress(
    userId: string,
    guestDays: number[],
    interfaceLang?: 'en' | 'fa' | 'ps',
  ): Promise<ProgressEntity> {
    const progress = await this.getOrCreate(userId);
    const merged = Array.from(new Set([...progress.completedDays, ...guestDays])).sort((a, b) => a - b);

    progress.completedDays = merged;
    if (interfaceLang) {
      progress.interfaceLang = interfaceLang;
    }
    progress.calculateStreak();

    return this.progressRepo.update(progress);
  }
}
