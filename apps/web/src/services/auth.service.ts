import api from './api';
import {
  RegisterRequest,
  LoginRequest,
  SendVerificationCodeRequest,
  VerifyCodeRequest,
  AuthResponse,
  SendCodeResponse,
} from '@shared/contracts';
import { User } from '@shared/types';

export const authService = {
  async register(dto: RegisterRequest): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/register', dto);
    return res.data;
  },

  async login(dto: LoginRequest): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/login', dto);
    return res.data;
  },

  async sendVerificationCode(email: string): Promise<SendCodeResponse> {
    const res = await api.post<SendCodeResponse>('/auth/send-verification-code', { email });
    return res.data;
  },

  async verifyCode(dto: VerifyCodeRequest): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/verify-code', dto);
    return res.data;
  },

  async getProfile(): Promise<User> {
    const res = await api.get<User>('/auth/profile');
    return res.data;
  },
};
