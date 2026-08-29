import api from './api';
import {
  Challenge,
  CreateChallengeDto,
  UpdateChallengeDto,
  ReviewChallengeDto,
  AdminStatsDto,
  ChallengeType,
  ChallengeStatus,
} from '@shared';

export interface AdminChallengeFilter {
  type?: ChallengeType;
  status?: ChallengeStatus;
  authorId?: string;
  search?: string;
}

export const adminService = {
  async getStats(): Promise<AdminStatsDto> {
    const res = await api.get<AdminStatsDto>('/admin/stats');
    return res.data;
  },

  async getChallenges(filters: AdminChallengeFilter = {}): Promise<Challenge[]> {
    const res = await api.get<Challenge[]>('/admin/challenges', {
      params: filters,
    });
    return res.data;
  },

  async createChallenge(dto: CreateChallengeDto): Promise<Challenge> {
    const res = await api.post<Challenge>('/admin/challenges', dto);
    return res.data;
  },

  async updateChallenge(id: number, dto: UpdateChallengeDto): Promise<Challenge> {
    const res = await api.put<Challenge>(`/admin/challenges/${id}`, dto);
    return res.data;
  },

  async reviewChallenge(id: number, dto: ReviewChallengeDto): Promise<Challenge> {
    const res = await api.patch<Challenge>(`/admin/challenges/${id}/status`, dto);
    return res.data;
  },

  async deleteChallenge(id: number): Promise<{ success: boolean }> {
    const res = await api.delete<{ success: boolean }>(`/admin/challenges/${id}`);
    return res.data;
  },
};
