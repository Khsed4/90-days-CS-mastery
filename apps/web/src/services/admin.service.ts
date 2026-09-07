import api from './api';
import {
  CreateChallengeRequest,
  UpdateChallengeRequest,
  ReviewChallengeRequest,
  AdminStatsResponse,
} from '@shared/contracts';
import {
  Challenge,
  ChallengeType,
  ChallengeStatus,
} from '@shared/types';

export interface AdminChallengeFilter {
  type?: ChallengeType;
  status?: ChallengeStatus;
  authorId?: string;
  search?: string;
}

export const adminService = {
  async getStats(): Promise<AdminStatsResponse> {
    const res = await api.get<AdminStatsResponse>('/admin/stats');
    return res.data;
  },

  async getChallenges(filters: AdminChallengeFilter = {}): Promise<Challenge[]> {
    const res = await api.get<Challenge[]>('/admin/challenges', {
      params: filters,
    });
    return res.data;
  },

  async createChallenge(dto: CreateChallengeRequest): Promise<Challenge> {
    const res = await api.post<Challenge>('/admin/challenges', dto);
    return res.data;
  },

  async updateChallenge(id: number, dto: UpdateChallengeRequest): Promise<Challenge> {
    const res = await api.put<Challenge>(`/admin/challenges/${id}`, dto);
    return res.data;
  },

  async reviewChallenge(id: number, dto: ReviewChallengeRequest): Promise<Challenge> {
    const res = await api.patch<Challenge>(`/admin/challenges/${id}/status`, dto);
    return res.data;
  },

  async deleteChallenge(id: number): Promise<{ success: boolean }> {
    const res = await api.delete<{ success: boolean }>(`/admin/challenges/${id}`);
    return res.data;
  },
};
