export class UserProfileDto {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  isEmailVerified: boolean;
  createdAt: string;
}

export class AuthResponseDto {
  accessToken: string;
  user: UserProfileDto;
  requiresEmailVerification?: boolean;
}
