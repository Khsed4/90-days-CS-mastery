import api from './api';
import {
  CreateOrgInviteRequest,
  JoinOrgRequest,
  OrgOverviewResponse,
  OrgMembersResponse,
  OrgMemberProgressResponse,
} from '@shared/contracts';
import { OrganizationInvite, Challenge } from '@shared/types';

export const organizationService = {
  async getOverview(): Promise<OrgOverviewResponse> {
    const res = await api.get<OrgOverviewResponse>('/organizations/overview');
    return res.data;
  },

  async getMembers(search?: string): Promise<OrgMembersResponse> {
    const params = search ? { search } : {};
    const res = await api.get<OrgMembersResponse>('/organizations/members', { params });
    return res.data;
  },

  async getMemberProgress(memberId: string): Promise<OrgMemberProgressResponse> {
    const res = await api.get<OrgMemberProgressResponse>(`/organizations/members/${memberId}/progress`);
    return res.data;
  },

  async removeMember(memberId: string): Promise<{ success: boolean; message: string }> {
    const res = await api.delete<{ success: boolean; message: string }>(`/organizations/members/${memberId}`);
    return res.data;
  },

  async createInvite(dto: CreateOrgInviteRequest): Promise<OrganizationInvite> {
    const res = await api.post<OrganizationInvite>('/organizations/invites', dto);
    return res.data;
  },

  async getInvites(): Promise<OrganizationInvite[]> {
    const res = await api.get<OrganizationInvite[]>('/organizations/invites');
    return res.data;
  },

  async revokeInvite(inviteId: string): Promise<{ success: boolean; message: string }> {
    const res = await api.delete<{ success: boolean; message: string }>(`/organizations/invites/${inviteId}`);
    return res.data;
  },

  async joinOrganization(dto: JoinOrgRequest): Promise<{ success: boolean; organizationName: string }> {
    const res = await api.post<{ success: boolean; organizationName: string }>('/organizations/join', dto);
    return res.data;
  },

  async getChallenges(): Promise<Challenge[]> {
    const res = await api.get<Challenge[]>('/organizations/challenges');
    return res.data;
  },

  async reviewChallenge(
    id: number,
    dto: { status: 'ORG_APPROVED' | 'REJECTED'; rejectionReason?: string },
  ): Promise<Challenge> {
    const res = await api.patch<Challenge>(`/organizations/challenges/${id}/review`, dto);
    return res.data;
  },

  async updateCurriculum(dto: {
    allowedLanguages: string[];
    allowedCategories: string[];
  }): Promise<{ success: boolean; allowedLanguages: string[]; allowedCategories: string[] }> {
    const res = await api.put<{ success: boolean; allowedLanguages: string[]; allowedCategories: string[] }>(
      '/organizations/curriculum',
      dto,
    );
    return res.data;
  },
};

