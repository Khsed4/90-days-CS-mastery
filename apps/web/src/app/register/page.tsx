'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useAuth, OtpVerificationModal } from '@/features/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { translations } from '@/lib/translations';
import { organizationService } from '@/services/organization.service';
import { PROGRAMMING_LANGUAGES } from '@shared/constants';
import { ProgrammingLanguage } from '@shared/types';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

/* ─── Shared form input ─── */
function Field({
  label,
  id,
  type = 'text',
  required = false,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  id: string;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-medium text-[var(--text-secondary)]">
        {label}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-sm rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] placeholder-[var(--text-faint)] focus:outline-none focus:border-[var(--accent)] transition-colors"
      />
    </div>
  );
}

/* ─── Terminal-style brand logo ─── */
function BrandIcon({ dark }: { dark?: boolean }) {
  return (
    <div className={`w-7 h-7 rounded-md flex items-center justify-center ${dark ? 'bg-[var(--bg-canvas)] text-[var(--text-primary)]' : 'bg-[var(--text-primary)] text-[var(--bg-canvas)]'}`}>
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z"/>
      </svg>
    </div>
  );
}

function RegisterForm() {
  const { user, register, registerOrganization, refreshUser, logout, handleAuthSuccess } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [accountType, setAccountType] = useState<'USER' | 'ORGANIZATION'>('USER');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteToken, setInviteToken] = useState('');

  const [orgName, setOrgName] = useState('');
  const [adminName, setAdminName] = useState('');
  const [orgEmail, setOrgEmail] = useState('');
  const [orgPassword, setOrgPassword] = useState('');
  const [selectedOrgLangs, setSelectedOrgLangs] = useState<ProgrammingLanguage[]>(
    PROGRAMMING_LANGUAGES.map((l) => l.id),
  );

  const toggleOrgLang = (id: ProgrammingLanguage) => {
    setSelectedOrgLangs((prev) =>
      prev.includes(id)
        ? prev.length === 1 ? prev : prev.filter((x) => x !== id)
        : [...prev, id],
    );
  };

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [joiningExisting, setJoiningExisting] = useState(false);

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  const [registeredRole, setRegisteredRole] = useState<'USER' | 'ORGANIZATION'>('USER');

  const t = translations.en;

  useEffect(() => {
    const invite = searchParams?.get('invite');
    if (invite) { setInviteToken(invite); setAccountType('USER'); }
  }, [searchParams]);

  const handleJoinExisting = async () => {
    if (!inviteToken) return;
    setJoiningExisting(true);
    setError('');
    try {
      const res = await organizationService.joinOrganization({ token: inviteToken });
      await refreshUser();
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to join organization. The invitation may be expired.');
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
        const res = await registerOrganization(orgName.trim(), adminName.trim(), targetEmail, orgPassword, selectedOrgLangs);
        if (res.requiresEmailVerification) {
          setPendingEmail(targetEmail);
          setRegisteredRole('ORGANIZATION');
          setShowOtpModal(true);
        } else {
          router.push('/organization');
        }
      } else {
        const targetEmail = email.toLowerCase().trim();
        const res = await register(targetEmail, password, name.trim(), inviteToken ? inviteToken.trim() : undefined);
        if (res.requiresEmailVerification) {
          setPendingEmail(targetEmail);
          setRegisteredRole('USER');
          setShowOtpModal(true);
        } else {
          router.push('/');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Check your details and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOtpSuccess = (authData: any) => {
    handleAuthSuccess(authData);
    setShowOtpModal(false);
    router.push(authData.user?.role === 'ORGANIZATION' ? '/organization' : '/');
  };

  /* ── Already logged in + invite token ── */
  if (user && inviteToken) {
    return (
      <div className="min-h-[100dvh] bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col justify-center items-center px-6 py-12">
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-sm space-y-6">
          <Link href="/" className="inline-flex items-center gap-2">
            <BrandIcon />
            <span className="font-semibold text-sm">CS Mastery</span>
          </Link>

          <div>
            <h1 className="text-xl font-bold tracking-tight">Organization invitation</h1>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              Signed in as <strong className="text-[var(--text-primary)]">{user.name}</strong> ({user.email}).
            </p>
          </div>

          {error && (
            <div className="px-3.5 py-2.5 rounded-md border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/30 text-xs text-rose-700 dark:text-rose-400">
              {error}
            </div>
          )}

          {user.role === 'USER' ? (
            <div className="space-y-2">
              <button
                onClick={handleJoinExisting}
                disabled={joiningExisting}
                className="w-full py-2.5 px-4 rounded-md text-sm font-semibold text-white bg-[var(--text-primary)] hover:opacity-80 active:scale-[0.98] transition-all disabled:opacity-40"
              >
                {joiningExisting ? 'Joining…' : 'Accept and join team'}
              </button>
              <button
                onClick={() => logout()}
                className="w-full py-2 px-4 rounded-md text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--border-mid)] transition-colors"
              >
                Sign out and use a different account
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-[var(--text-muted)]">Admins and organization managers cannot join as member learners.</p>
              <button
                onClick={() => logout()}
                className="w-full py-2 px-4 rounded-md text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--border-mid)] transition-colors"
              >
                Sign out to register a learner account
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ── Main register form ── */
  return (
    <div className="min-h-[100dvh] flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-[42%] xl:w-[45%] flex-col justify-between bg-[var(--text-primary)] text-[var(--bg-canvas)] p-10 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(var(--bg-canvas) 1px, transparent 1px), linear-gradient(90deg, var(--bg-canvas) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
        <Link href="/" className="relative inline-flex items-center gap-2.5 w-fit">
          <BrandIcon dark />
          <span className="font-semibold text-sm tracking-tight">CS Mastery</span>
        </Link>

        <div className="relative space-y-6">
          <h2 className="text-3xl font-bold tracking-tight leading-snug">
            {inviteToken ? 'Join your team.' : 'Start your journey.'}
          </h2>
          <p className="text-sm text-[var(--bg-hover)] leading-relaxed max-w-[38ch]">
            {inviteToken
              ? 'Complete your profile and get access to your organization\'s custom curriculum track.'
              : 'Build real problem-solving muscle over 90 consecutive days. Progress is tracked and synced across devices.'}
          </p>
          <ul className="space-y-2 text-sm">
            {['90 structured daily problems', 'Interactive workspaces in 6 languages', 'Hint & reference solution per challenge', 'Team progress tracking for organizations'].map((feat) => (
              <li key={feat} className="flex items-center gap-2.5 text-[var(--bg-hover)]">
                <span className="w-1 h-1 rounded-full bg-[var(--bg-canvas)] shrink-0" />
                {feat}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-[11px] text-[var(--text-muted)]">
          Already have an account?{' '}
          <Link href="/login" className="text-[var(--bg-canvas)] underline underline-offset-2">
            Sign in
          </Link>
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-[var(--bg-canvas)] relative overflow-y-auto">
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-sm space-y-6">
          {/* Mobile brand */}
          <div className="lg:hidden flex items-center gap-2">
            <BrandIcon />
            <span className="font-semibold text-sm">CS Mastery</span>
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
              {inviteToken ? 'Join your team' : 'Create an account'}
            </h1>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              Have an account?{' '}
              <Link href="/login" className="text-[var(--accent)] hover:underline underline-offset-2">
                Sign in
              </Link>
            </p>
          </div>

          {/* Account type toggle — only if no invite */}
          {!inviteToken && (
            <div className="flex rounded-md border border-[var(--border-subtle)] overflow-hidden bg-[var(--bg-subtle)] p-0.5 gap-0.5">
              {(['USER', 'ORGANIZATION'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => { setAccountType(type); setError(''); }}
                  className={`flex-1 py-1.5 px-3 rounded text-xs font-medium transition-colors ${
                    accountType === type
                      ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                  }`}
                >
                  {type === 'USER' ? 'Learner' : 'Organization'}
                </button>
              ))}
            </div>
          )}

          {/* Invite notice */}
          {inviteToken && (
            <div className="px-3 py-2.5 rounded-md border border-[var(--accent-border)] bg-[var(--accent-subtle)] text-xs text-[var(--accent)]">
              Registering via organization invitation link.
            </div>
          )}

          {error && (
            <div className="px-3.5 py-2.5 rounded-md border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/30 text-xs text-rose-700 dark:text-rose-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {accountType === 'USER' ? (
              <>
                <Field id="name" label={t.name} required value={name} onChange={setName} placeholder="Ada Lovelace" />
                <Field id="email" label={t.email} type="email" required value={email} onChange={setEmail} placeholder="you@example.com" />
                <Field id="password" label={t.password} type="password" required value={password} onChange={setPassword} placeholder="••••••••" />
              </>
            ) : (
              <>
                <Field id="orgName" label="Organization name" required value={orgName} onChange={setOrgName} placeholder="Meridian Engineering" />
                <Field id="adminName" label="Your name" required value={adminName} onChange={setAdminName} placeholder="Taylor Morgan" />
                <Field id="orgEmail" label="Work email" type="email" required value={orgEmail} onChange={setOrgEmail} placeholder="taylor@meridian.io" />
                <Field id="orgPassword" label="Password" type="password" required value={orgPassword} onChange={setOrgPassword} placeholder="••••••••" />

                {/* Curriculum language selection */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-[var(--text-secondary)]">
                      Curriculum languages <span className="text-[var(--text-faint)] font-normal">({selectedOrgLangs.length} active)</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setSelectedOrgLangs(PROGRAMMING_LANGUAGES.map((l) => l.id))}
                      className="text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors underline underline-offset-2"
                    >
                      Select all
                    </button>
                  </div>
                  <p className="text-[11px] text-[var(--text-faint)]">
                    Team members can only solve challenges in the selected languages.
                  </p>
                  <div className="grid grid-cols-2 gap-1 pt-0.5">
                    {PROGRAMMING_LANGUAGES.map((lang) => {
                      const isSelected = selectedOrgLangs.includes(lang.id);
                      return (
                        <button
                          key={lang.id}
                          type="button"
                          onClick={() => toggleOrgLang(lang.id)}
                          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-mono transition-colors text-left border ${
                            isSelected
                              ? 'bg-[var(--text-primary)] text-[var(--bg-canvas)] border-[var(--text-primary)]'
                              : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--border-mid)]'
                          }`}
                        >
                          <span className="flex-1 truncate">{lang.name}</span>
                          {isSelected && <span className="text-[10px] opacity-70">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 px-4 rounded-md text-sm font-semibold text-white bg-[var(--text-primary)] hover:opacity-80 active:scale-[0.98] transition-all disabled:opacity-40"
            >
              {submitting
                ? 'Creating account…'
                : inviteToken
                ? 'Join team'
                : accountType === 'ORGANIZATION'
                ? 'Create organization'
                : 'Create account'}
            </button>
          </form>

          <div className="pt-1 border-t border-[var(--border-subtle)]">
            <Link
              href="/"
              className="block text-center text-xs text-[var(--text-faint)] hover:text-[var(--text-muted)] transition-colors pt-3"
            >
              ← Continue as guest (days 1–3 free)
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
    <Suspense fallback={
      <div className="min-h-[100dvh] bg-[var(--bg-canvas)] flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-[var(--border-mid)] border-t-[var(--accent)] animate-spin" />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
