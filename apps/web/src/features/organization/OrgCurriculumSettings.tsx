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
    return <div className="p-8 text-center text-xs text-zinc-500">Loading curriculum settings...</div>;
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">Curriculum &amp; Language Restrictions</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Configure the specific programming languages and CS topics permitted for your team members. Learners under your organization will be restricted strictly to these options.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="py-2 px-5 rounded-lg text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 transition-colors shadow-md shadow-purple-600/20 disabled:opacity-50 flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          {saving ? 'Saving...' : '💾 Save Changes'}
        </button>
      </div>

      {successMessage && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-800/80 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
          <span>✓</span>
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 bg-rose-950/60 border border-rose-800/80 rounded-lg text-xs text-rose-300">
          {errorMessage}
        </div>
      )}

      {/* Programming Languages Section */}
      <div className="space-y-3 pt-2 border-t border-zinc-800/80">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-zinc-200">
              Permitted Programming Languages ({selectedLangs.length} / {PROGRAMMING_LANGUAGES.length})
            </h3>
            <p className="text-[11px] text-zinc-400">
              Only checked languages will appear in your members&apos; code editor and language switchers.
            </p>
          </div>
          <button
            type="button"
            onClick={selectAllLanguages}
            className="text-xs text-purple-400 hover:text-purple-300 font-medium"
          >
            Select All Languages
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
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-purple-950/40 border-purple-600/60 shadow-sm'
                    : 'bg-zinc-950/60 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-xl">{lang.icon}</span>
                  <span
                    className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
                      isSelected ? 'bg-purple-600 text-white' : 'border border-zinc-700 text-transparent'
                    }`}
                  >
                    ✓
                  </span>
                </div>
                <div>
                  <div className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-zinc-400'}`}>
                    {lang.name}
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono mt-0.5">{lang.fileExtension}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Curriculum Categories Section */}
      <div className="space-y-3 pt-4 border-t border-zinc-800/80">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-zinc-200">
              Permitted CS Topics &amp; Categories ({selectedCats.length} / {CS_CATEGORIES.length})
            </h3>
            <p className="text-[11px] text-zinc-400">
              Filter the 90-day mastery curriculum roadmap to focus exclusively on target domains.
            </p>
          </div>
          <button
            type="button"
            onClick={selectAllCategories}
            className="text-xs text-purple-400 hover:text-purple-300 font-medium"
          >
            Select All Topics
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
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs text-left transition-all ${
                  isSelected
                    ? 'bg-purple-950/30 border-purple-600/50 text-purple-200 font-medium'
                    : 'bg-zinc-950/50 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                }`}
              >
                <span className="text-sm">{cat.icon}</span>
                <span className="truncate flex-1">{cat.name}</span>
                {isSelected && <span className="text-purple-400 text-xs">✓</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
