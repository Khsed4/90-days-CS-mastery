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
    if (
      !confirm(
        `Are you sure you want to remove ${member.name} (${member.email}) from your organization? Their personal challenge progress will remain preserved.`
      )
    ) {
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
      <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-6 h-6 border-2 border-zinc-900 dark:border-zinc-100 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">Loading Organization Portal...</p>
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
      <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-6 h-6 border-2 border-zinc-900 dark:border-zinc-100 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">Loading Organization Details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col transition-colors">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {orgStats && <OrgStatsBanner stats={orgStats} orgName={orgName} />}

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-[#14161b] p-1 rounded-lg border border-zinc-200 dark:border-zinc-800 w-fit">
          <button
            onClick={() => setActiveTab('members')}
            className={`flex items-center gap-2 py-1.5 px-3.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'members'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-200/80 dark:border-zinc-700/60 shadow-xs'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span>Team Members &amp; Invites</span>
          </button>

          <button
            onClick={() => setActiveTab('challenges')}
            className={`flex items-center gap-2 py-1.5 px-3.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'challenges'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-200/80 dark:border-zinc-700/60 shadow-xs'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Team Challenges Moderation</span>
          </button>

          <button
            onClick={() => setActiveTab('curriculum')}
            className={`flex items-center gap-2 py-1.5 px-3.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'curriculum'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-200/80 dark:border-zinc-700/60 shadow-xs'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
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

        {activeTab === 'challenges' && <OrgChallengesModeration />}

        {activeTab === 'curriculum' && <OrgCurriculumSettings />}
      </main>

      <MemberProgressModal member={selectedMember} onClose={() => setSelectedMember(null)} />
    </div>
  );
}
