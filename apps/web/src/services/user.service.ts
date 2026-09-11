import api from './api';
import { UpdateUserPreferencesRequest } from '@shared/contracts';
import { ProgrammingLanguage } from '@shared/types';

export interface UserPreferencesResponse {
  selectedLanguage: ProgrammingLanguage;
  selectedCategories: string[] | null;
  allowedLanguages: ProgrammingLanguage[] | null;
  allowedCategories: string[] | null;
  organizationName: string | null;
}

export const userService = {
  async getPreferences(): Promise<UserPreferencesResponse> {
    const res = await api.get<UserPreferencesResponse>('/users/preferences');
    return res.data;
  },

  async updatePreferences(dto: UpdateUserPreferencesRequest): Promise<{
    success: boolean;
    selectedLanguage: ProgrammingLanguage;
    selectedCategories: string[] | null;
  }> {
    const res = await api.put<{
      success: boolean;
      selectedLanguage: ProgrammingLanguage;
      selectedCategories: string[] | null;
    }>('/users/preferences', dto);
    return res.data;
  },
};
