import api from './api';
import { UserProgress, SyncProgressDto } from '@shared';

export const progressService = {
  async getProgress(): Promise<UserProgress> {
    const res = await api.get<UserProgress>('/progress');
    return res.data;
  },

  async toggleDay(dayId: number): Promise<UserProgress> {
    const res = await api.post<UserProgress>('/progress/toggle', { dayId });
    return res.data;
  },

  async updateSettings(interfaceLang: 'en' | 'fa' | 'ps'): Promise<UserProgress> {
    const res = await api.post<UserProgress>('/progress/settings', { interfaceLang });
    return res.data;
  },

  async syncProgress(dto: SyncProgressDto): Promise<UserProgress> {
    const res = await api.post<UserProgress>('/progress/sync', dto);
    return res.data;
  },
};
