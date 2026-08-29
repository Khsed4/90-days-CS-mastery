import { EmailVerificationEntity } from '../domain/entities/email-verification.entity';

export interface IEmailVerificationRepository {
  create(email: string, code: string, expiresAt: Date): Promise<EmailVerificationEntity>;
  findLatestValid(email: string, code: string): Promise<EmailVerificationEntity | null>;
  deleteByEmail(email: string): Promise<void>;
}

export const EMAIL_VERIFICATION_REPOSITORY = Symbol('EMAIL_VERIFICATION_REPOSITORY');
