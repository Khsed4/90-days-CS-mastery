import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../infrastructure/database/database.service';
import { IEmailVerificationRepository } from './email-verification.repository.interface';
import { EmailVerificationEntity } from '../domain/entities/email-verification.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class MysqlEmailVerificationRepository implements IEmailVerificationRepository {
  constructor(private db: DatabaseService) {}

  private mapToEntity(row: any): EmailVerificationEntity {
    return new EmailVerificationEntity({
      id: row.id,
      email: row.email,
      code: row.code,
      expiresAt: new Date(row.expiresAt),
      createdAt: new Date(row.createdAt),
    });
  }

  async create(email: string, code: string, expiresAt: Date): Promise<EmailVerificationEntity> {
    const id = randomUUID();
    await this.db.query(
      'INSERT INTO email_verifications (id, email, code, expiresAt) VALUES (?, ?, ?, ?)',
      [id, email.toLowerCase(), code, expiresAt],
    );

    return new EmailVerificationEntity({
      id,
      email: email.toLowerCase(),
      code,
      expiresAt,
      createdAt: new Date(),
    });
  }

  async findLatestValid(email: string, code: string): Promise<EmailVerificationEntity | null> {
    const rows = await this.db.query<any[]>(
      'SELECT * FROM email_verifications WHERE LOWER(email) = LOWER(?) AND code = ? AND expiresAt >= NOW() ORDER BY createdAt DESC LIMIT 1',
      [email, code],
    );
    return rows.length > 0 ? this.mapToEntity(rows[0]) : null;
  }

  async deleteByEmail(email: string): Promise<void> {
    await this.db.query(
      'DELETE FROM email_verifications WHERE LOWER(email) = LOWER(?)',
      [email],
    );
  }
}
