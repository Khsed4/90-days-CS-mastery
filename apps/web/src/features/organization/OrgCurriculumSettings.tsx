'use client';

import React, { useState, useEffect } from 'react';
import { organizationService } from '@/services/organization.service';
import { PROGRAMMING_LANGUAGES, CS_CATEGORIES } from '@shared/constants';
import { ProgrammingLanguage } from '@shared/types';

export function OrgCurriculumSettings() {
  const [selectedLangs, setSelectedLangs] = useState<ProgrammingLanguage[]>(
    PROGRAMMING_LANGUAGES.map((l) => l.id),
  );
  const [selectedCats, setSelectedCats] = useState<string[]>(
    CS_CATEGORIES.map((c) => c.name),
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadCurrentCurriculum();
  }, []);

  const loadCurrentCurriculum = async () => {
    setLoading(true);
    try {
      const overview = await organizationService.getOverview();
      const org = overview.organization as any;
      if (org.allowedLanguages && org.allowedLanguages.length > 0) {
        setSelectedLangs(org.allowedLanguages);
      }
      if (org.allowedCategories && org.allowedCategories.length > 0) {
        setSelectedCats(org.allowedCategories);
      }
    } catch (err) {
      console.error('Failed to load organization settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleLanguage = (id: ProgrammingLanguage) => {
    setSelectedLangs((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) {
          alert('At least one programming language must remain permitted for your team.');
          return prev;
        }
        return prev.filter((x) => x !== id);
      }
      return [...prev, id];
    });
  };

  const selectAllLanguages = () => {
    setSelectedLangs(PROGRAMMING_LANGUAGES.map((l) => l.id));
  };

  const toggleCategory = (catName: string) => {
    setSelectedCats((prev) => {
      if (prev.includes(catName)) {
        if (prev.length === 1) {
          alert('At least one category must remain permitted for your team.');
          return prev;
        }
        return prev.filter((x) => x !== catName);
      }
      return [...prev, catName];
    });
  };

  const selectAllCategories = () => {
    setSelectedCats(CS_CATEGORIES.map((c) => c.name));
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccessMessage('');
    setErrorMessage('');
    try {
      await organizationService.updateCurriculum({
        allowedLanguages: selectedLangs,
        allowedCategories: selectedCats,
      });
      setSuccessMessage('Curriculum settings updated successfully! Your team members will now follow these restrictions.');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to update curriculum settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-zinc-500 font-mono animate-pulse">Loading curriculum settings...</div>;
  }

  return (
    <div className="bg-white dark:bg-[#14161b] border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-base font-bold text-zinc-900 dark:text-white tracking-tight">Curriculum &amp; Language Restrictions</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Configure the specific programming languages and CS topics permitted for your team members. Learners under your organization will be restricted strictly to these options.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="py-2 px-5 rounded-md text-xs font-semibold text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 active:scale-98 transition-all disabled:opacity-50 flex items-center justify-center gap-2 self-start sm:self-auto shadow-xs"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {successMessage && (
        <div className="p-3 bg-[var(--badge-easy-bg)] border border-[var(--badge-easy-border)] rounded-md text-xs text-[var(--badge-easy-text)] font-medium flex items-center gap-2">
          <span>✓</span>
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 bg-[var(--badge-hard-bg)] border border-[var(--badge-hard-border)] rounded-md text-xs text-[var(--badge-hard-text)] font-medium">
          {errorMessage}
        </div>
      )}

      {/* Programming Languages Section */}
      <div className="space-y-3 pt-2 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Permitted Programming Languages ({selectedLangs.length} / {PROGRAMMING_LANGUAGES.length})
            </h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Only checked languages will appear in your members&apos; code editor and language switchers.
            </p>
          </div>
          <button
            type="button"
            onClick={selectAllLanguages}
            className="text-xs text-zinc-900 dark:text-zinc-100 underline underline-offset-2 hover:opacity-80 font-medium"
          >
            Select All
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {PROGRAMMING_LANGUAGES.map((lang) => {
            const isSelected = selectedLangs.includes(lang.id);
            return (
              <button
                key={lang.id}
                type="button"
                onClick={() => toggleLanguage(lang.id)}
                className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-zinc-900 dark:border-zinc-100 shadow-2xs'
                    : 'bg-zinc-50 dark:bg-[#0c0d10] border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-mono text-sm font-bold">{lang.fileExtension}</span>
                  <span
                    className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
                      isSelected
                        ? 'bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white'
                        : 'border border-zinc-300 dark:border-zinc-700 text-transparent'
                    }`}
                  >
                    ✓
                  </span>
                </div>
                <div>
                  <div className={`text-xs font-semibold ${isSelected ? 'text-white dark:text-zinc-900' : 'text-zinc-800 dark:text-zinc-200'}`}>
                    {lang.name}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Curriculum Categories Section */}
      <div className="space-y-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Permitted CS Topics &amp; Categories ({selectedCats.length} / {CS_CATEGORIES.length})
            </h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Filter the 90-day curriculum roadmap to focus exclusively on target domains.
            </p>
          </div>
          <button
            type="button"
            onClick={selectAllCategories}
            className="text-xs text-zinc-900 dark:text-zinc-100 underline underline-offset-2 hover:opacity-80 font-medium"
          >
            Select All
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {CS_CATEGORIES.map((cat) => {
            const isSelected = selectedCats.includes(cat.name);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggleCategory(cat.name)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md border text-xs text-left transition-all ${
                  isSelected
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-zinc-900 dark:border-zinc-100 font-medium'
                    : 'bg-zinc-50 dark:bg-[#0c0d10] border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <span className="truncate flex-1">{cat.name}</span>
                {isSelected && <span className="text-xs font-bold">✓</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
