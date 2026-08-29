import api from './api';
import { Challenge, CreateChallengeDto } from '@shared';

export const challengeService = {
  async getCoreChallenges(): Promise<Challenge[]> {
    const res = await api.get<Challenge[]>('/challenges');
    return res.data;
  },

  async getBonusChallenges(): Promise<Challenge[]> {
    const res = await api.get<Challenge[]>('/challenges/bonus');
    return res.data;
  },

  async getMySubmissions(): Promise<Challenge[]> {
    const res = await api.get<Challenge[]>('/challenges/my-submissions');
    return res.data;
  },

  async getChallengeById(id: number): Promise<Challenge> {
    const res = await api.get<Challenge>(`/challenges/${id}`);
    return res.data;
  },

  async createChallenge(dto: CreateChallengeDto): Promise<Challenge> {
    const res = await api.post<Challenge>('/challenges', dto);
    return res.data;
  },
};
