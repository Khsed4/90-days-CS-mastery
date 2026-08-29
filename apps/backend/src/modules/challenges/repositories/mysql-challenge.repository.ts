import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../infrastructure/database/database.service';
import { IChallengeRepository, ChallengeFilterOptions } from './challenge.repository.interface';
import { ChallengeEntity } from '../domain/entities/challenge.entity';

@Injectable()
export class MysqlChallengeRepository implements IChallengeRepository {
  constructor(private db: DatabaseService) {}

  private mapToEntity(row: any): ChallengeEntity {
    return new ChallengeEntity({
      id: row.id,
      title: row.title,
      difficulty: row.difficulty,
      category: row.category,
      prerequisite: row.prerequisite,
      description: row.description,
      examples: row.examples,
      constraints: row.constraints,
      java: row.java,
      ts: row.ts,
      type: row.type || 'CORE',
      status: row.status || 'APPROVED',
      authorId: row.authorId,
      authorName: row.authorName,
      rejectionReason: row.rejectionReason,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    });
  }

  async findAll(options: ChallengeFilterOptions = {}): Promise<ChallengeEntity[]> {
    const conditions: string[] = [];
    const params: any[] = [];

    if (options.type) {
      conditions.push('type = ?');
      params.push(options.type);
    }
    if (options.status) {
      conditions.push('status = ?');
      params.push(options.status);
    }
    if (options.authorId) {
      conditions.push('authorId = ?');
      params.push(options.authorId);
    }
    if (options.search) {
      conditions.push('(title LIKE ? OR category LIKE ?)');
      params.push(`%${options.search}%`, `%${options.search}%`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const sql = `SELECT * FROM challenges ${whereClause} ORDER BY id ASC`;

    const rows = await this.db.query<any[]>(sql, params);
    return rows.map((r) => this.mapToEntity(r));
  }

  async findById(id: number): Promise<ChallengeEntity | null> {
    const rows = await this.db.query<any[]>(
      'SELECT * FROM challenges WHERE id = ? LIMIT 1',
      [id],
    );
    return rows.length > 0 ? this.mapToEntity(rows[0]) : null;
  }

  async create(challenge: ChallengeEntity): Promise<ChallengeEntity> {
    const sql = `
      INSERT INTO challenges (
        title, difficulty, category, prerequisite, description, examples, constraints, java, ts, type, status, authorId, authorName
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await this.db.query<any>(sql, [
      challenge.title,
      challenge.difficulty,
      challenge.category,
      challenge.prerequisite,
      challenge.description,
      challenge.examples,
      challenge.constraints,
      challenge.java,
      challenge.ts,
      challenge.type || 'BONUS',
      challenge.status || 'PENDING',
      challenge.authorId || null,
      challenge.authorName || null,
    ]);

    const createdId = result.insertId;
    return (await this.findById(createdId))!;
  }

  async update(id: number, data: Partial<ChallengeEntity>): Promise<ChallengeEntity | null> {
    const fields: string[] = [];
    const values: any[] = [];

    const allowedKeys: (keyof ChallengeEntity)[] = [
      'title',
      'difficulty',
      'category',
      'prerequisite',
      'description',
      'examples',
      'constraints',
      'java',
      'ts',
      'type',
      'status',
      'rejectionReason',
    ];

    for (const key of allowedKeys) {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(data[key]);
      }
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    await this.db.query(
      `UPDATE challenges SET ${fields.join(', ')} WHERE id = ?`,
      values,
    );

    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db.query<any>('DELETE FROM challenges WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  async count(options: ChallengeFilterOptions = {}): Promise<number> {
    const conditions: string[] = [];
    const params: any[] = [];

    if (options.type) {
      conditions.push('type = ?');
      params.push(options.type);
    }
    if (options.status) {
      conditions.push('status = ?');
      params.push(options.status);
    }
    if (options.authorId) {
      conditions.push('authorId = ?');
      params.push(options.authorId);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const rows = await this.db.query<any[]>(`SELECT COUNT(*) as count FROM challenges ${whereClause}`, params);
    return rows[0]?.count || 0;
  }
}
