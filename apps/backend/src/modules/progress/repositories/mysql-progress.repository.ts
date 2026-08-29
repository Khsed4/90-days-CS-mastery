import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../infrastructure/database/database.service';
import { IProgressRepository } from './progress.repository.interface';
import { ProgressEntity } from '../domain/entities/progress.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class MysqlProgressRepository implements IProgressRepository {
  constructor(private db: DatabaseService) {}

  private mapToEntity(row: any): ProgressEntity {
    let completedDays: number[] = [];
    try {
      completedDays = JSON.parse(row.completedDays || '[]');
    } catch {
      completedDays = [];
    }

    return new ProgressEntity({
      id: row.id,
      userId: row.userId,
      completedDays,
      streak: row.streak || 0,
      interfaceLang: (row.interfaceLang || 'en') as 'en' | 'fa' | 'ps',
      updatedAt: new Date(row.updatedAt),
    });
  }

  async findByUserId(userId: string): Promise<ProgressEntity | null> {
    const rows = await this.db.query<any[]>(
      'SELECT * FROM progress WHERE userId = ? LIMIT 1',
      [userId],
    );
    return rows.length > 0 ? this.mapToEntity(rows[0]) : null;
  }

  async create(data: Partial<ProgressEntity>): Promise<ProgressEntity> {
    const id = data.id || randomUUID();
    const userId = data.userId!;
    const completedDays = JSON.stringify(data.completedDays || []);
    const streak = data.streak || 0;
    const interfaceLang = data.interfaceLang || 'en';

    await this.db.query(
      'INSERT INTO progress (id, userId, completedDays, streak, interfaceLang) VALUES (?, ?, ?, ?, ?)',
      [id, userId, completedDays, streak, interfaceLang],
    );

    return (await this.findByUserId(userId))!;
  }

  async update(progress: ProgressEntity): Promise<ProgressEntity> {
    const completedDays = JSON.stringify(progress.completedDays);
    await this.db.query(
      'UPDATE progress SET completedDays = ?, streak = ?, interfaceLang = ? WHERE userId = ?',
      [completedDays, progress.streak, progress.interfaceLang, progress.userId],
    );

    return (await this.findByUserId(progress.userId))!;
  }
}
