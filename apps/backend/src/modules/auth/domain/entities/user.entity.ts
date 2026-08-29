export class UserEntity {
  id: string;
  email: string;
  password?: string;
  name: string;
  role: 'USER' | 'ADMIN';
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
