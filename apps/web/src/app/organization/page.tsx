'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/features/auth';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import {
  OrgStatsBanner,
  OrgInviteHub,
  OrgMembersTable,
  MemberProgressModal,
  OrgChallengesModeration,
  OrgCurriculumSettings,
} from '@/features/organization';
import { organizationService } from '@/services/organization.service';
import { OrganizationMember, OrganizationInvite, OrganizationStats } from '@shared/types';

export default function OrganizationDashboardPage() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'members' | 'challenges' | 'curriculum'>('members');
  const [orgStats, setOrgStats] = useState<OrganizationStats | null>(null);
  const [orgName, setOrgName] = useState('Organization');
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [invites, setInvites] = useState<OrganizationInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedMember, setSelectedMember] = useState<OrganizationMember | null>(null);

  // Check role access
  useEffect(() => {
    if (!authLoading) {
      if (!token || !user) {
        router.push('/login');
      } else if (user.role !== 'ORGANIZATION' && user.role !== 'ADMIN') {
        router.push('/');
      }
    }
  }, [authLoading, token, user, router]);

  const loadData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [overviewRes, membersRes, invitesRes] = await Promise.all([
        organizationService.getOverview(),
        organizationService.getMembers(search),
        organizationService.getInvites(),
      ]);

      setOrgStats(overviewRes.stats);
      setOrgName(overviewRes.organization.name);
      setMembers(membersRes.members);
      setInvites(invitesRes);
    } catch (err) {
      console.error('Failed to load organization data:', err);
    } finally {
      setLoading(false);
    }
  }, [token, search]);

  useEffect(() => {
    if (token && (user?.role === 'ORGANIZATION' || user?.role === 'ADMIN')) {
      loadData();
    }
  }, [token, user, loadData]);

  const handleRemoveMember = async (member: OrganizationMember) => {
    if (!confirm(`Are you sure you want to remove ${member.name} (${member.email}) from your organization? Their personal challenge progress will remain preserved.`)) {
      return;
    }

    try {
      await organizationService.removeMember(member.id);
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to remove member');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-zinc-400">Loading Organization Portal...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!token || !user || (user.role !== 'ORGANIZATION' && user.role !== 'ADMIN')) {
    return null;
  }

  if (loading && !orgStats) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-zinc-400">Loading Organization Details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {orgStats && (
          <OrgStatsBanner stats={orgStats} orgName={orgName} />
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-1">
          <button
            onClick={() => setActiveTab('members')}
            className={`flex items-center gap-2 py-2 px-4 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'members'
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <span>👥</span>
            <span>Team Members &amp; Invites</span>
          </button>

          <button
            onClick={() => setActiveTab('challenges')}
            className={`flex items-center gap-2 py-2 px-4 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'challenges'
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <span>🎯</span>
            <span>Team Challenges Moderation</span>
          </button>

          <button
            onClick={() => setActiveTab('curriculum')}
            className={`flex items-center gap-2 py-2 px-4 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'curriculum'
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <span>⚙️</span>
            <span>Curriculum &amp; Languages</span>
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === 'members' && (
          <>
            <OrgInviteHub invites={invites} onInvitesChanged={loadData} />
            <OrgMembersTable
              members={members}
              loading={loading}
              search={search}
              onSearchChange={setSearch}
              onViewProgress={(m) => setSelectedMember(m)}
              onRemoveMember={handleRemoveMember}
            />
          </>
        )}

        {activeTab === 'challenges' && (
          <OrgChallengesModeration />
        )}

        {activeTab === 'curriculum' && (
          <OrgCurriculumSettings />
        )}
      </main>

      <MemberProgressModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </div>
  );
}
