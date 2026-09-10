'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useAuth, OtpVerificationModal } from '@/features/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { translations } from '@/lib/translations';
import { organizationService } from '@/services/organization.service';

function RegisterForm() {
  const { user, register, registerOrganization, refreshUser, logout, handleAuthSuccess } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [accountType, setAccountType] = useState<'USER' | 'ORGANIZATION'>('USER');

  // Learner Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteToken, setInviteToken] = useState('');

  // Organization Form Fields
  const [orgName, setOrgName] = useState('');
  const [adminName, setAdminName] = useState('');
  const [orgEmail, setOrgEmail] = useState('');
  const [orgPassword, setOrgPassword] = useState('');

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [joiningExisting, setJoiningExisting] = useState(false);

  // OTP Verification Modal State
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  const [registeredRole, setRegisteredRole] = useState<'USER' | 'ORGANIZATION'>('USER');

  const t = translations.en;

  // Auto-detect invite token from URL query string ?invite=...
  useEffect(() => {
    const invite = searchParams?.get('invite');
    if (invite) {
      setInviteToken(invite);
      setAccountType('USER');
    }
  }, [searchParams]);

  const handleJoinExisting = async () => {
    if (!inviteToken) return;
    setJoiningExisting(true);
    setError('');
    try {
      const res = await organizationService.joinOrganization({ token: inviteToken });
      await refreshUser();
      alert(`🎉 Success! You have joined ${res.organizationName}.`);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to join organization with this invitation.');
    } finally {
      setJoiningExisting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (accountType === 'ORGANIZATION') {
        const targetEmail = orgEmail.toLowerCase().trim();
        const res = await registerOrganization(
          orgName.trim(),
          adminName.trim(),
          targetEmail,
          orgPassword,
        );
        if (res.requiresEmailVerification) {
          setPendingEmail(targetEmail);
          setRegisteredRole('ORGANIZATION');
          setShowOtpModal(true);
        } else {
          router.push('/organization');
        }
      } else {
        const targetEmail = email.toLowerCase().trim();
        const res = await register(
          targetEmail,
          password,
          name.trim(),
          inviteToken ? inviteToken.trim() : undefined,
        );
        if (res.requiresEmailVerification) {
          setPendingEmail(targetEmail);
          setRegisteredRole('USER');
          setShowOtpModal(true);
        } else {
          router.push('/');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please check your details.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOtpSuccess = (authData: any) => {
    handleAuthSuccess(authData);
    setShowOtpModal(false);
    if (authData.user?.role === 'ORGANIZATION') {
      router.push('/organization');
    } else {
      router.push('/');
    }
  };

  // If user is already logged in and arrives via an invite token
  if (user && inviteToken) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center px-4 py-12">
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-7 shadow-xl space-y-5 text-center">
          <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400 flex items-center justify-center mx-auto text-2xl">
            🏢
          </div>

          <div className="space-y-1">
            <h1 className="text-xl font-bold text-white tracking-tight">Organization Invitation</h1>
            <p className="text-xs text-zinc-400">
              You are currently signed in as <strong className="text-zinc-200">{user.name}</strong> ({user.email}).
            </p>
          </div>

          {error && (
            <div className="p-3 bg-rose-950/50 border border-rose-800 rounded-lg text-xs text-rose-300 text-left">
              {error}
            </div>
          )}

          {user.role === 'USER' ? (
            <div className="space-y-3 pt-2">
              <button
                onClick={handleJoinExisting}
                disabled={joiningExisting}
                className="w-full py-2.5 px-4 rounded-lg text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 transition-colors shadow-md shadow-purple-600/20 disabled:opacity-50"
              >
                {joiningExisting ? 'Joining Organization...' : 'Accept Invitation & Join Team'}
              </button>

              <button
                onClick={() => logout()}
                className="w-full py-2 px-3 rounded-lg text-xs font-medium text-zinc-400 hover:text-zinc-200 bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 transition-colors"
              >
                Sign Out / Create New Account
              </button>
            </div>
          ) : (
            <div className="space-y-3 pt-2 text-xs text-zinc-400">
              <p>Organization managers and Admins cannot join as member learners.</p>
              <button
                onClick={() => logout()}
                className="w-full py-2 px-3 rounded-lg text-xs font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 transition-colors"
              >
                Log Out to Register a Learner Account
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Logo & Title */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-blue-600 text-white font-bold text-xl mb-1 shadow-lg shadow-blue-500/20">
            ⚡
          </Link>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {inviteToken ? 'Join Team & Start Learning' : 'Create your account'}
          </h1>
          <p className="text-xs text-zinc-400">
            {inviteToken
              ? 'Complete your learner profile to join your organization.'
              : 'Select your account type to get started with 90-Days CS Mastery'}
          </p>
        </div>

        {/* Account Type Selector Tabs - ONLY shown if NOT using an invite token */}
        {!inviteToken && (
          <div className="grid grid-cols-2 gap-2 bg-zinc-900/90 border border-zinc-800 p-1.5 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setAccountType('USER');
                setError('');
              }}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                accountType === 'USER'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              <span>👤</span>
              <span>Personal Learner</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAccountType('ORGANIZATION');
                setError('');
              }}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                accountType === 'ORGANIZATION'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              <span>🏢</span>
              <span>Organization / Team</span>
            </button>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 sm:p-7 shadow-sm space-y-4">
          {inviteToken && (
            <div className="p-3 bg-blue-950/60 border border-blue-800/80 rounded-lg text-xs text-blue-300 flex items-center gap-2">
              <span className="text-sm">🎉</span>
              <span>You are registering with an <strong>Organization Invitation Link</strong>.</span>
            </div>
          )}

          {error && (
            <div className="p-3 bg-rose-950/50 border border-rose-800 rounded-lg text-xs text-rose-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {accountType === 'USER' ? (
              <>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-zinc-300">
                    {t.name}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ada Lovelace"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-zinc-300">
                    {t.email}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="developer@example.com"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-zinc-300">
                    {t.password}
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-zinc-300">
                    Organization / Company Name
                  </label>
                  <input
                    type="text"
                    required
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="Acme Technologies Inc."
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-zinc-300">
                    Manager / Admin Name
                  </label>
                  <input
                    type="text"
                    required
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    placeholder="Sarah Connor"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-zinc-300">
                    Work Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={orgEmail}
                    onChange={(e) => setOrgEmail(e.target.value)}
                    placeholder="sarah@acme.com"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-zinc-300">
                    Admin Password
                  </label>
                  <input
                    type="password"
                    required
                    value={orgPassword}
                    onChange={(e) => setOrgPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-2.5 px-4 rounded-lg text-xs font-semibold text-white transition-all shadow-sm disabled:opacity-50 ${
                accountType === 'ORGANIZATION'
                  ? 'bg-purple-600 hover:bg-purple-500 shadow-purple-600/20'
                  : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20'
              }`}
            >
              {submitting
                ? 'Creating account...'
                : inviteToken
                ? 'Join Team & Create Account'
                : accountType === 'ORGANIZATION'
                ? 'Create Organization Portal'
                : 'Create Learner Account'}
            </button>
          </form>

          <div className="pt-3 border-t border-zinc-800/80 text-center space-y-2">
            <Link
              href="/login"
              className="block text-xs text-blue-400 hover:text-blue-300 font-medium"
            >
              {t.haveAccount}
            </Link>
            <Link
              href="/"
              className="block text-xs text-zinc-500 hover:text-zinc-400"
            >
              ← Continue as Guest (Days 1–3 Free)
            </Link>
          </div>
        </div>
      </div>

      {showOtpModal && (
        <OtpVerificationModal
          isOpen={showOtpModal}
          email={pendingEmail}
          onClose={() => setShowOtpModal(false)}
          onSuccess={handleOtpSuccess}
        />
      )}
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950 flex items-center justify-center text-xs text-zinc-400">Loading registration...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
