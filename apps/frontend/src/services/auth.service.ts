import api from './api';
import {
  RegisterDto,
  LoginDto,
  AuthResponse,
  User,
  SendVerificationCodeDto,
  VerifyCodeDto,
} from '@shared';

export const authService = {
  async register(dto: RegisterDto): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/register', dto);
    return res.data;
  },

  async login(dto: LoginDto): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/login', dto);
    return res.data;
  },

  async sendVerificationCode(email: string): Promise<{ success: boolean; message: string }> {
    const res = await api.post('/auth/send-verification-code', { email });
    return res.data;
  },

  async verifyCode(dto: VerifyCodeDto): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/verify-code', dto);
    return res.data;
  },

  async getProfile(): Promise<User> {
    const res = await api.get<User>('/auth/profile');
    return res.data;
  },
};
