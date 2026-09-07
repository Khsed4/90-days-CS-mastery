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
          <span className="px-2 py-0.5 rounded-full bg-rose-950/80 border border-rose-800 text-[11px] font-bold text-rose-400">
            🛡️ ADMIN
          </span>
        );
      case 'ORGANIZATION':
        return (
          <span className="px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-800 text-[11px] font-bold text-purple-300">
            🏢 ORGANIZATION
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full bg-blue-950/80 border border-blue-800 text-[11px] font-bold text-blue-300">
            👤 LEARNER
          </span>
        );
    }
  };

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <span>👥</span> Platform User & Organization Directory
          </h2>
          <p className="text-xs text-zinc-400">
            Manage, inspect, and remove accounts across the entire platform.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-zinc-700"
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
            className="w-full sm:w-60 px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-zinc-500 animate-pulse">
          Loading platform directory...
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-zinc-800 rounded-xl space-y-1">
          <p className="text-xs text-zinc-400">No accounts matched your query.</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-zinc-800 rounded-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 font-semibold">
                <th className="py-3 px-4">Account</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Organization</th>
                <th className="py-3 px-4 text-center">Progress / Streak</th>
                <th className="py-3 px-4">Joined</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 bg-zinc-900/50">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-white">{u.name}</div>
                    <div className="text-[11px] text-zinc-400 font-mono">{u.email}</div>
                  </td>
                  <td className="py-3 px-4">{getRoleBadge(u.role)}</td>
                  <td className="py-3 px-4 text-zinc-300">
                    {u.organizationName ? (
                      <span className="inline-flex items-center gap-1 font-medium text-purple-300">
                        🏢 {u.organizationName}
                      </span>
                    ) : (
                      <span className="text-zinc-600">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {u.role === 'USER' ? (
                      <div className="text-[11px]">
                        <span className="font-semibold text-zinc-200">{u.completedDaysCount} / 90</span>
                        {u.streak > 0 && <span className="text-amber-400 ml-1.5 font-bold">🔥 {u.streak}d</span>}
                      </div>
                    ) : (
                      <span className="text-zinc-600 text-[11px]">N/A</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-zinc-400">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDeleteUser(u)}
                      className="px-2.5 py-1 rounded-md text-[11px] font-medium text-rose-400 hover:text-white hover:bg-rose-600 border border-rose-900/60 transition-colors"
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
