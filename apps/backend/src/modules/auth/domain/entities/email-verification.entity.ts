export class EmailVerificationEntity {
  id: string;
  email: string;
  code: string;
  expiresAt: Date;
  createdAt: Date;

  constructor(partial: Partial<EmailVerificationEntity>) {
    Object.assign(this, partial);
  }

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }
}
