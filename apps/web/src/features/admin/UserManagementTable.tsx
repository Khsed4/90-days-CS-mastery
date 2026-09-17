'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { adminService } from '../../services/admin.service';

export function UserManagementTable() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.getUsers({
        role: roleFilter,
        search: search.trim() || undefined,
      });
      setUsers(res.users);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  }, [roleFilter, search]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleDeleteUser = async (user: any) => {
    if (
      !confirm(
        `Are you sure you want to permanently delete the ${user.role} account "${user.name}" (${user.email})? This action cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      await adminService.deleteUser(user.id);
      loadUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400">
            ADMIN
          </span>
        );
      case 'ORGANIZATION':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300">
            ORGANIZATION
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300">
            LEARNER
          </span>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-[#14161b] border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="font-display text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <svg className="w-4 h-4 text-zinc-500 dark:text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span>Platform User &amp; Organization Directory</span>
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Manage, inspect, and remove accounts across the entire platform.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-1.5 bg-white dark:bg-[#0c0d10] border border-zinc-200 dark:border-zinc-800 rounded-md text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
          >
            <option value="ALL">All Roles</option>
            <option value="USER">Learners Only</option>
            <option value="ORGANIZATION">Organizations Only</option>
            <option value="ADMIN">Admins Only</option>
          </select>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full sm:w-60 px-3 py-1.5 bg-white dark:bg-[#0c0d10] border border-zinc-200 dark:border-zinc-800 rounded-md text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-zinc-500 font-mono animate-pulse">
          Loading platform directory...
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg space-y-1">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">No accounts matched your query.</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-zinc-200 dark:border-zinc-800 rounded-lg">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-zinc-50 dark:bg-[#0c0d10] border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 font-semibold">
                <th className="py-3 px-4">Account</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Organization</th>
                <th className="py-3 px-4 text-center">Progress / Streak</th>
                <th className="py-3 px-4">Joined</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/70 bg-white dark:bg-[#14161b]">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-zinc-900 dark:text-white">{u.name}</div>
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">{u.email}</div>
                  </td>
                  <td className="py-3 px-4">{getRoleBadge(u.role)}</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">
                    {u.organizationName ? (
                      <span className="inline-flex items-center gap-1 font-medium text-purple-700 dark:text-purple-300">
                        {u.organizationName}
                      </span>
                    ) : (
                      <span className="text-zinc-400 dark:text-zinc-600">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {u.role === 'USER' ? (
                      <div className="text-[11px]">
                        <span className="font-semibold text-zinc-800 dark:text-zinc-200 tabular-nums">{u.completedDaysCount} / 90</span>
                        {u.streak > 0 && <span className="text-amber-600 dark:text-amber-400 ml-1.5 font-bold tabular-nums">🔥 {u.streak}d</span>}
                      </div>
                    ) : (
                      <span className="text-zinc-400 dark:text-zinc-600 text-[11px]">N/A</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-zinc-500 dark:text-zinc-400 tabular-nums">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDeleteUser(u)}
                      className="px-2.5 py-1 rounded-md text-[11px] font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 transition-colors"
                    >
                      Delete Account
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
