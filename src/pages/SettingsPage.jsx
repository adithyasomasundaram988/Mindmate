import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings,
  Globe,
  Sun,
  Moon,
  Volume2,
  Music,
  Eye,
  Sliders,
  Lock,
  LogOut,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  EyeOff,
  Heart,
  ShieldCheck
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useUserMode } from '../contexts/UserModeContext';
import { useAudio } from '../contexts/AudioContext';
import { useActivity } from '../contexts/ActivityContext';
import { useAuth } from '../contexts/AuthContext';
import PasswordRequirementList from '../components/PasswordRequirementList';
import { validatePassword } from '../utils/passwordValidation';

export default function SettingsPage() {
  const navigate = useNavigate();
  const {
    theme,
    setTheme,
    colorTheme,
    setColorTheme,
    colorThemes,
    fontSize,
    setFontSize,
    highContrast,
    setHighContrast,
    reducedMotion,
    setReducedMotion
  } = useTheme();
  const { language, setLanguage, languages, t } = useLanguage();
  const { activeMode, modes, setMode } = useUserMode();
  const {
    voiceGuidanceEnabled,
    setVoiceGuidanceEnabled,
    voicePreference,
    setVoicePreference,
    speechSpeed,
    setSpeechSpeed,
    speechVolume,
    setSpeechVolume,
    speak,
    ambientEnabled,
    setAmbientEnabled,
    ambientTrack,
    setAmbientTrack,
    ambientVol,
    setAmbientVol
  } = useAudio();
  const { sessionThresholds, setSessionThresholds } = useActivity();
  const { user, signOut, triggerLogout, changePassword } = useAuth();

  // Password Settings state
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [pwdSuccessMsg, setPwdSuccessMsg] = useState('');
  const [pwdErrorMsg, setPwdErrorMsg] = useState('');

  const handleTestVoice = () => {
    speak('Welcome to Mindmate. Voice guidance is adjusted to your preferred speed and tone.');
  };

  const handleChangePasswordSubmit = (e) => {
    e.preventDefault();
    setPwdSuccessMsg('');
    setPwdErrorMsg('');

    if (newPwd !== confirmPwd) {
      setPwdErrorMsg('New password and confirmation password do not match.');
      return;
    }

    const val = validatePassword(newPwd);
    if (!val.isValid) {
      setPwdErrorMsg('Password does not fulfill all 5 security requirements.');
      return;
    }

    const res = changePassword(currentPwd, newPwd);
    if (res.success) {
      setPwdSuccessMsg('Password updated successfully. All security rules verified.');
      setCurrentPwd('');
      setNewPwd('');
      setConfirmPwd('');
    } else {
      setPwdErrorMsg(res.error || 'Unable to change password.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-[#223558]">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">
            Settings & Preferences
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Personalize your language, voice guidance, visual comfort, and account security.
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-[#142038] text-teal-600 dark:text-teal-400 flex items-center justify-center">
          <Settings className="w-6 h-6" />
        </div>
      </div>

      {/* 1. Language Preferences (13 Languages) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#142038] border border-slate-200 dark:border-[#223558] shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <Globe className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Interface & Audio Language
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Select from 13 supported languages. The interface updates instantly and matches regional speech synthesis.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
          {languages.map(l => (
            <button
              key={l.code}
              onClick={() => setLanguage(l.code)}
              className={`p-3 rounded-2xl border text-left transition-all ${
                language === l.code
                  ? 'bg-teal-50 dark:bg-[#162544] border-teal-500 ring-2 ring-teal-400'
                  : 'bg-slate-50 dark:bg-[#0c1527] border-slate-200 dark:border-[#223558] hover:bg-slate-100'
              }`}
            >
              <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">{l.name}</div>
              <div className="text-[11px] text-slate-400">{l.nativeName}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Theme & Visual Accessibility (Mild Navy Night Mode) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#142038] border border-slate-200 dark:border-[#223558] shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <Sun className="w-5 h-5 text-amber-500" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Appearance & Visual Comfort
          </h2>
        </div>

        {/* Theme mode selection */}
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Color Theme
          </label>
          <div className="grid grid-cols-2 gap-3 max-w-sm">
            <button
              onClick={() => setTheme('light')}
              className={`p-4 rounded-2xl border flex items-center justify-center gap-2 font-bold text-sm transition-all ${
                theme === 'light'
                  ? 'bg-teal-50 text-teal-800 border-teal-500 ring-2 ring-teal-400'
                  : 'bg-slate-50 dark:bg-[#0c1527] border-slate-200 dark:border-[#223558] text-slate-700 dark:text-slate-300'
              }`}
            >
              <Sun className="w-4 h-4 text-amber-500" />
              Day / Ivory Light
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-2xl border flex items-center justify-center gap-2 font-bold text-sm transition-all ${
                theme === 'dark'
                  ? 'bg-teal-50 dark:bg-[#162544] text-teal-800 dark:text-teal-200 border-teal-500 ring-2 ring-teal-400'
                  : 'bg-slate-50 dark:bg-[#0c1527] border-slate-200 dark:border-[#223558] text-slate-700 dark:text-slate-300'
              }`}
            >
              <Moon className="w-4 h-4 text-sky-400" />
              Mild Navy Night
            </button>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Night mode employs unified mild navy blue surfaces for low eye strain across both Patient and Caregiver modes.
          </p>
        </div>

        {/* Selective Mixed Color Themes */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Selective Mixed-Color Themes
            </label>
            <span className="text-[11px] text-slate-400">
              Also accessible via the floating side-corner button
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {colorThemes.map(t => {
              const isSelected = colorTheme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setColorTheme(t.id)}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-slate-50 dark:bg-[#162544] border-slate-400 dark:border-slate-500 ring-2 ring-teal-500/40 shadow-sm'
                      : 'bg-white dark:bg-[#0c1527] border-slate-200 dark:border-[#223558] hover:bg-slate-50 dark:hover:bg-[#16233b]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-xs shadow-xs shrink-0"
                      style={{ background: t.gradient }}
                    >
                      <span>{t.icon}</span>
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white leading-tight">
                        {t.name}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {t.primaryName} × {t.secondaryName}
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      ✓ Active
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Text Size Scaling */}
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Text Size Scale
          </label>
          <div className="grid grid-cols-3 gap-3 max-w-md">
            {[
              { id: 'normal', label: 'Standard (16px)' },
              { id: 'large', label: 'Large (18px)' },
              { id: 'xl', label: 'Extra Large (20px)' },
            ].map(size => (
              <button
                key={size.id}
                onClick={() => setFontSize(size.id)}
                className={`p-3 rounded-2xl border text-center font-bold text-xs transition-all ${
                  fontSize === size.id
                    ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                    : 'bg-slate-50 dark:bg-[#0c1527] border-slate-200 dark:border-[#223558] text-slate-700 dark:text-slate-300'
                }`}
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>

        {/* High Contrast & Reduced Motion Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-[#223558]">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-[#0c1527] border border-slate-200 dark:border-[#223558]">
            <div>
              <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white block">
                High Contrast Borders
              </span>
              <span className="text-[11px] text-slate-400">Crisp contrast for readability</span>
            </div>
            <button
              onClick={() => setHighContrast(!highContrast)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors ${
                highContrast ? 'bg-teal-600 text-white' : 'bg-slate-200 dark:bg-[#1c2c4e] text-slate-600 dark:text-slate-300'
              }`}
            >
              {highContrast ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-[#0c1527] border border-slate-200 dark:border-[#223558]">
            <div>
              <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white block">
                Reduced Motion
              </span>
              <span className="text-[11px] text-slate-400">Minimizes sliding animations</span>
            </div>
            <button
              onClick={() => setReducedMotion(!reducedMotion)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors ${
                reducedMotion ? 'bg-teal-600 text-white' : 'bg-slate-200 dark:bg-[#1c2c4e] text-slate-600 dark:text-slate-300'
              }`}
            >
              {reducedMotion ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Voice Guidance & Speech Tuning */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#142038] border border-slate-200 dark:border-[#223558] shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Volume2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Voice Guidance & Spoken Instructions
            </h2>
          </div>
          <button
            onClick={() => setVoiceGuidanceEnabled(!voiceGuidanceEnabled)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              voiceGuidanceEnabled
                ? 'bg-teal-600 text-white'
                : 'bg-slate-200 dark:bg-[#1c2c4e] text-slate-500'
            }`}
          >
            {voiceGuidanceEnabled ? 'Enabled' : 'Disabled'}
          </button>
        </div>

        {voiceGuidanceEnabled && (
          <div className="space-y-4 pt-2">
            {/* Voice preference */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Voice Tone Preference
              </label>
              <div className="grid grid-cols-3 gap-3 max-w-md">
                {[
                  { id: 'female', label: 'Female-Preferred' },
                  { id: 'automatic', label: 'Automatic Best' },
                  { id: 'default', label: 'System Default' },
                ].map(v => (
                  <button
                    key={v.id}
                    onClick={() => setVoicePreference(v.id)}
                    className={`p-2.5 rounded-xl border text-center font-bold text-xs transition-all ${
                      voicePreference === v.id
                        ? 'bg-teal-600 text-white border-teal-600'
                        : 'bg-slate-50 dark:bg-[#0c1527] border-slate-200 dark:border-[#223558] text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Speech speed */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                <span>Speech Speed (Slower for Seniors):</span>
                <span>{speechSpeed.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.7"
                max="1.2"
                step="0.05"
                value={speechSpeed}
                onChange={(e) => setSpeechSpeed(parseFloat(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
            </div>

            <button
              onClick={handleTestVoice}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#1c2c4e] dark:hover:bg-[#253963] text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5 text-teal-600" />
              Test Sample Voice
            </button>
          </div>
        )}
      </div>

      {/* 4. Password Settings with Live 5-Rule Checklist */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#142038] border border-slate-200 dark:border-[#223558] shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Password Settings & Account Security
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Enforces strict 5-rule password security. Requirements are checked live as you type.
        </p>

        {pwdSuccessMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 text-xs font-bold text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{pwdSuccessMsg}</span>
          </div>
        )}

        {pwdErrorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/80 border border-rose-300 text-xs font-bold text-rose-800 dark:text-rose-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{pwdErrorMsg}</span>
          </div>
        )}

        <form onSubmit={handleChangePasswordSubmit} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={currentPwd}
              onChange={(e) => setCurrentPwd(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0c1527] border border-slate-200 dark:border-[#223558] text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                New Password
              </label>
              <button
                type="button"
                onClick={() => setShowNewPwd(!showNewPwd)}
                className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
              >
                {showNewPwd ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {showNewPwd ? 'Hide' : 'Show'}
              </button>
            </div>
            <input
              type={showNewPwd ? 'text' : 'password'}
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
              placeholder="Create a strong password"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0c1527] border border-slate-200 dark:border-[#223558] text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {/* Live 5-rule checklist component */}
            <PasswordRequirementList password={newPwd} />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
              placeholder="Re-enter new password"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0c1527] border border-slate-200 dark:border-[#223558] text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {confirmPwd && (
              <span className={`text-xs font-semibold mt-1 block ${newPwd === confirmPwd ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {newPwd === confirmPwd ? '✓ Passwords match' : '✕ Passwords do not match'}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
          >
            Update Password
          </button>
        </form>
      </div>

      {/* 5. Sign Out Action */}
      <div className="pt-4 flex justify-between items-center">
        <span className="text-xs text-slate-400">
          Signed in as {user?.email || 'Demo User'}
        </span>
        <button
          onClick={() => triggerLogout(() => navigate('/login'))}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-extrabold text-xs transition-all border border-rose-500/25 shadow-xs active:scale-95 group"
        >
          <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Sign Out & Lock Session</span>
        </button>
      </div>

    </div>
  );
}
