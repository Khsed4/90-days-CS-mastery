import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { SyncProgressDto } from './dto';
import { UserProgress, InterfaceLanguage } from '@shared/types';
import { calculateStreak } from '@shared/utils';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  private parseCompletedDays(jsonString: string): number[] {
    try {
      const parsed = JSON.parse(jsonString || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  async getProgress(userId: string): Promise<UserProgress> {
    let prog = await this.prisma.progress.findUnique({
      where: { userId },
    });

    if (!prog) {
      prog = await this.prisma.progress.create({
        data: {
          userId,
          completedDays: '[]',
          streak: 0,
          interfaceLang: 'en',
        },
      });
    }

    const completedDays = this.parseCompletedDays(prog.completedDays);
    return {
      userId: prog.userId,
      completedDays,
      streak: prog.streak,
      interfaceLang: (prog.interfaceLang || 'en') as InterfaceLanguage,
    };
  }

  async toggleDay(userId: string, dayId: number): Promise<UserProgress> {
    if (dayId < 1 || dayId > 90) {
      throw new BadRequestException('Day must be between 1 and 90');
    }

    const current = await this.getProgress(userId);
    let updatedDays: number[];

    if (current.completedDays.includes(dayId)) {
      updatedDays = current.completedDays.filter((d) => d !== dayId);
    } else {
      updatedDays = [...current.completedDays, dayId].sort((a, b) => a - b);
    }

    const streak = calculateStreak(updatedDays);

    const updated = await this.prisma.progress.upsert({
      where: { userId },
      update: {
        completedDays: JSON.stringify(updatedDays),
        streak,
      },
      create: {
        userId,
        completedDays: JSON.stringify(updatedDays),
        streak,
        interfaceLang: 'en',
      },
    });

    return {
      userId: updated.userId,
      completedDays: updatedDays,
      streak: updated.streak,
      interfaceLang: (updated.interfaceLang || 'en') as InterfaceLanguage,
    };
  }

  async updateSettings(userId: string, lang: InterfaceLanguage): Promise<UserProgress> {
    const updated = await this.prisma.progress.upsert({
      where: { userId },
      update: { interfaceLang: lang },
      create: {
        userId,
        completedDays: '[]',
        streak: 0,
        interfaceLang: lang,
      },
    });

    return {
      userId: updated.userId,
      completedDays: this.parseCompletedDays(updated.completedDays),
      streak: updated.streak,
      interfaceLang: (updated.interfaceLang || 'en') as InterfaceLanguage,
    };
  }

  async syncProgress(userId: string, dto: SyncProgressDto): Promise<UserProgress> {
    const current = await this.getProgress(userId);
    const mergedDays = Array.from(new Set([...current.completedDays, ...(dto.completedDays || [])])).sort(
      (a, b) => a - b,
    );
    const streak = calculateStreak(mergedDays);
    const lang = dto.interfaceLang || current.interfaceLang || 'en';

    const updated = await this.prisma.progress.upsert({
      where: { userId },
      update: {
        completedDays: JSON.stringify(mergedDays),
        streak,
        interfaceLang: lang,
      },
      create: {
        userId,
        completedDays: JSON.stringify(mergedDays),
        streak,
        interfaceLang: lang,
      },
    });

    return {
      userId: updated.userId,
      completedDays: mergedDays,
      streak: updated.streak,
      interfaceLang: (updated.interfaceLang || 'en') as InterfaceLanguage,
    };
  }
}
