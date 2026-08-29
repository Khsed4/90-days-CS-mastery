import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../infrastructure/database/database.service';
import { IUserRepository } from './user.repository.interface';
import { UserEntity } from '../domain/entities/user.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class MysqlUserRepository implements IUserRepository {
  constructor(private db: DatabaseService) {}

  private mapToEntity(row: any): UserEntity {
    return new UserEntity({
      id: row.id,
      email: row.email,
      password: row.password,
      name: row.name,
      role: row.role as 'USER' | 'ADMIN',
      isEmailVerified: Boolean(row.isEmailVerified),
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    });
  }

  async findById(id: string): Promise<UserEntity | null> {
    const rows = await this.db.query<any[]>(
      'SELECT * FROM users WHERE id = ? LIMIT 1',
      [id],
    );
    return rows.length > 0 ? this.mapToEntity(rows[0]) : null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const rows = await this.db.query<any[]>(
      'SELECT * FROM users WHERE LOWER(email) = LOWER(?) LIMIT 1',
      [email],
    );
    return rows.length > 0 ? this.mapToEntity(rows[0]) : null;
  }

  async create(data: Partial<UserEntity>): Promise<UserEntity> {
    const id = data.id || randomUUID();
    const email = data.email!.toLowerCase();
    const password = data.password!;
    const name = data.name!;
    const role = data.role || 'USER';
    const isEmailVerified = data.isEmailVerified ? 1 : 0;

    await this.db.query(
      'INSERT INTO users (id, email, password, name, role, isEmailVerified) VALUES (?, ?, ?, ?, ?, ?)',
      [id, email, password, name, role, isEmailVerified],
    );

    // Also initialize empty progress
    const progressId = randomUUID();
    await this.db.query(
      'INSERT INTO progress (id, userId, completedDays, streak, interfaceLang) VALUES (?, ?, ?, ?, ?)',
      [progressId, id, '[]', 0, 'en'],
    );

    return this.findById(id) as Promise<UserEntity>;
  }

  async updateEmailVerified(id: string, isVerified: boolean): Promise<UserEntity> {
    await this.db.query(
      'UPDATE users SET isEmailVerified = ? WHERE id = ?',
      [isVerified ? 1 : 0, id],
    );
    return (await this.findById(id))!;
  }

  async update(id: string, data: Partial<UserEntity>): Promise<UserEntity> {
    const fields: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) {
      fields.push('name = ?');
      values.push(data.name);
    }
    if (data.role !== undefined) {
      fields.push('role = ?');
      values.push(data.role);
    }
    if (data.isEmailVerified !== undefined) {
      fields.push('isEmailVerified = ?');
      values.push(data.isEmailVerified ? 1 : 0);
    }

    if (fields.length > 0) {
      values.push(id);
      await this.db.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
    }

    return (await this.findById(id))!;
  }
}
