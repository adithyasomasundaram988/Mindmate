import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Brain,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Music,
  Globe,
  Settings,
  HelpCircle,
  User,
  Heart,
  Shield,
  Eye,
  Menu,
  X,
  Sparkles,
  TreePine,
  Wind,
  LogIn,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useAudio } from '../contexts/AudioContext';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme, fontSize, setFontSize, highContrast, setHighContrast } = useTheme();
  const { language, setLanguage, languages, t } = useLanguage();
  const { user, isPatient, isCaregiver, switchRole, signOut, triggerLogout } = useAuth();
  const { voiceGuidanceEnabled, setVoiceGuidanceEnabled, ambientEnabled, setAmbientEnabled } = useAudio();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [accessMenuOpen, setAccessMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: t('navHome', 'Home') },
    { to: '/patient', label: t('navPatient', 'Patient Mode') },
    { to: '/caregiver', label: t('navCaregiver', 'Caregiver Mode') },
    { to: '/games', label: t('navGames', 'Cognitive Games') },
    { to: '/garden', label: t('navGarden', 'Memory Garden') },
    { to: '/relaxation', label: t('navRelaxation', 'Calm & Relaxation') },
    { to: '/help', label: t('navHelp', 'Help Desk') },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#0c1527]/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-[#223558]/80 transition-all duration-300 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Tagline (No SIH branding) */}
          <Link
            to="/"
            className="flex items-center gap-3.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-2xl p-1"
          >
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-600 via-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 group-hover:shadow-teal-500/30 transition-all duration-300">
              <Brain className="w-6 h-6 transform group-hover:rotate-6 transition-transform" />
              <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white font-sans">
                  Mindmate
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold tracking-wide">
                {t('tagline', 'Every memory matters.')}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1" aria-label="Main Navigation">
            {navLinks.map(link => {
              const active = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all relative ${
                    active
                      ? 'bg-teal-500/10 text-teal-700 dark:text-teal-300 shadow-xs border border-teal-500/20'
                      : 'text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-[#162544]/70'
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-teal-500 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-2">
            
            {/* Quick Role Switcher Pill */}
            <div className="hidden md:flex items-center bg-slate-100/90 dark:bg-[#142038] p-1 rounded-2xl border border-slate-200 dark:border-[#223558] text-xs font-semibold">
              <button
                onClick={() => { switchRole('patient'); navigate('/patient'); }}
                className={`px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  isPatient
                    ? 'bg-white dark:bg-[#1c2c4e] text-teal-700 dark:text-teal-300 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="Switch to Patient View"
              >
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                <span>Patient</span>
              </button>
              <button
                onClick={() => { switchRole('caregiver'); navigate('/caregiver'); }}
                className={`px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  isCaregiver
                    ? 'bg-white dark:bg-[#1c2c4e] text-teal-700 dark:text-teal-300 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="Switch to Caregiver View"
              >
                <Shield className="w-3.5 h-3.5 text-sky-500" />
                <span>Caregiver</span>
              </button>
            </div>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="p-2.5 rounded-xl bg-slate-100/80 hover:bg-slate-200/80 dark:bg-[#142038] dark:hover:bg-[#1c2c4e] text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1"
                aria-label="Select Language"
                title="Change language"
              >
                <Globe className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span className="text-xs font-black uppercase">{language}</span>
              </button>

              {langDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 max-h-80 overflow-y-auto rounded-2xl bg-white dark:bg-[#142038] border border-slate-200 dark:border-[#223558] shadow-2xl py-2 z-50 text-sm animate-scale-up"
                  onMouseLeave={() => setLangDropdownOpen(false)}
                >
                  <div className="px-3 py-1.5 text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
                    Languages ({languages.length})
                  </div>
                  {languages.map(l => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-[#1c2c4e] transition-colors ${
                        language === l.code ? 'font-bold text-teal-600 dark:text-teal-400 bg-teal-50/50 dark:bg-[#162544]' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="font-medium text-xs sm:text-sm">{l.name}</span>
                      <span className="text-xs text-slate-400">{l.nativeName}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Voice Guidance Toggle */}
            <button
              onClick={() => setVoiceGuidanceEnabled(!voiceGuidanceEnabled)}
              className={`p-2.5 rounded-xl transition-all ${
                voiceGuidanceEnabled
                  ? 'bg-teal-100 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300 ring-1 ring-teal-500/30'
                  : 'bg-slate-100/80 dark:bg-[#142038] text-slate-400'
              }`}
              title={voiceGuidanceEnabled ? t('voiceOn', 'Voice Guidance ON') : t('voiceOff', 'Voice Guidance OFF')}
              aria-label="Toggle Voice Guidance"
            >
              {voiceGuidanceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Ambient Soundscape Toggle */}
            <button
              onClick={() => setAmbientEnabled(!ambientEnabled)}
              className={`p-2.5 rounded-xl transition-all ${
                ambientEnabled
                  ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300 ring-1 ring-sky-500/30'
                  : 'bg-slate-100/80 dark:bg-[#142038] text-slate-400'
              }`}
              title={ambientEnabled ? t('bgMusicOn', 'Soundscape ON') : t('bgMusicOff', 'Soundscape OFF')}
              aria-label="Toggle Ambient Soundscape"
            >
              <Music className="w-4 h-4" />
            </button>

            {/* Accessibility Quick Menu */}
            <div className="relative">
              <button
                onClick={() => setAccessMenuOpen(!accessMenuOpen)}
                className="p-2.5 rounded-xl bg-slate-100/80 hover:bg-slate-200/80 dark:bg-[#142038] dark:hover:bg-[#1c2c4e] text-slate-700 dark:text-slate-200 transition-colors"
                title="Accessibility Preferences"
                aria-label="Accessibility options"
              >
                <Eye className="w-4 h-4 text-indigo-500" />
              </button>

              {accessMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#142038] border border-slate-200 dark:border-[#223558] shadow-2xl p-3 z-50 text-xs animate-scale-up"
                  onMouseLeave={() => setAccessMenuOpen(false)}
                >
                  <div className="font-bold text-slate-800 dark:text-slate-100 mb-2 pb-1 border-b border-slate-100 dark:border-[#223558]">
                    Accessibility Settings
                  </div>

                  <div className="mb-3">
                    <span className="text-slate-500 dark:text-slate-400 block mb-1.5 font-medium">Text Size:</span>
                    <div className="grid grid-cols-3 gap-1">
                      {['normal', 'large', 'xl'].map(size => (
                        <button
                          key={size}
                          onClick={() => setFontSize(size)}
                          className={`py-1 rounded-lg font-bold capitalize transition-all ${
                            fontSize === size
                              ? 'bg-teal-600 text-white'
                              : 'bg-slate-100 dark:bg-[#1c2c4e] text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {size === 'normal' ? 'Standard' : size === 'large' ? 'Large' : 'XL'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-[#223558]">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">High Contrast:</span>
                    <button
                      onClick={() => setHighContrast(!highContrast)}
                      className={`px-3 py-1 rounded-lg font-bold transition-all ${
                        highContrast
                          ? 'bg-teal-600 text-white'
                          : 'bg-slate-100 dark:bg-[#1c2c4e] text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {highContrast ? 'ON' : 'OFF'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Day / Night Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-100/80 hover:bg-slate-200/80 dark:bg-[#142038] dark:hover:bg-[#1c2c4e] text-slate-700 dark:text-slate-200 transition-colors"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Night Mode'}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Auth / Account Profile Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="p-1.5 sm:px-3 sm:py-2 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 dark:bg-[#162544] dark:hover:bg-[#1c2c4e] text-teal-700 dark:text-teal-300 transition-all flex items-center gap-2"
                  title={`Account: ${user.name}`}
                >
                  <div className="relative w-6 h-6 rounded-full bg-gradient-to-tr from-teal-600 to-cyan-500 text-white font-black text-xs grid place-items-center shadow-xs">
                    {user.name.charAt(0).toUpperCase()}
                    <span className="absolute bottom-[-1px] right-[-1px] w-2 h-2 rounded-full bg-emerald-400 border border-white dark:border-[#0c1527]" />
                  </div>
                  <span className="hidden lg:inline-block text-xs font-bold text-slate-800 dark:text-slate-200">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-[#142038] border border-slate-200 dark:border-[#223558] shadow-2xl p-3 z-50 animate-scale-up text-xs"
                    onMouseLeave={() => setUserMenuOpen(false)}
                  >
                    {/* User Profile Summary */}
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0c1527] border border-slate-100 dark:border-[#223558] mb-2 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-600 to-cyan-500 text-white font-black text-sm grid place-items-center shadow-md shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="overflow-hidden">
                        <div className="font-bold text-slate-900 dark:text-white truncate text-sm">
                          {user.name}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {user.email || 'user@mindmate.app'}
                        </div>
                        <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/15 text-teal-700 dark:text-teal-300">
                          {user.role === 'caregiver' ? '🛡️ Caregiver Mode' : '🌸 Patient Mode'}
                        </div>
                      </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-1 mb-2">
                      <Link
                        to="/settings"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1c2c4e] transition-colors font-medium"
                      >
                        <Settings className="w-4 h-4 text-slate-400" />
                        <span>Account & Settings</span>
                      </Link>

                      <button
                        onClick={() => {
                          const nextRole = user.role === 'caregiver' ? 'patient' : 'caregiver';
                          switchRole(nextRole);
                          setUserMenuOpen(false);
                          navigate(nextRole === 'caregiver' ? '/caregiver' : '/patient');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1c2c4e] transition-colors font-medium text-left"
                      >
                        <Shield className="w-4 h-4 text-indigo-500" />
                        <span>Switch to {user.role === 'caregiver' ? 'Patient' : 'Caregiver'} Mode</span>
                      </button>
                    </div>

                    {/* Prominent Satisfying Sign Out Button */}
                    <div className="pt-2 border-t border-slate-100 dark:border-[#223558]">
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          triggerLogout(() => navigate('/login'));
                        }}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold transition-all border border-rose-500/25 group shadow-xs active:scale-98"
                      >
                        <span className="flex items-center gap-2">
                          <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                          <span>Sign Out & Lock Session</span>
                        </span>
                        <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-rose-500/20">Secure</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-extrabold text-xs shadow-md shadow-teal-600/20 flex items-center gap-1.5 transition-all transform active:scale-95"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            )}

            {/* Mobile Drawer Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2.5 rounded-xl bg-slate-100/80 dark:bg-[#142038] text-slate-700 dark:text-slate-200"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white/95 dark:bg-[#0c1527]/95 backdrop-blur-xl border-b border-slate-200 dark:border-[#223558] px-4 pt-2 pb-6 space-y-2 animate-fade-in">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-teal-50 dark:hover:bg-[#162544] transition-colors"
            >
              {link.label}
            </Link>
          ))}
          
          <div className="pt-3 border-t border-slate-100 dark:border-[#223558] space-y-2">
            <div className="flex gap-2">
              <button
                onClick={() => { switchRole('patient'); setMobileMenuOpen(false); navigate('/patient'); }}
                className="flex-1 py-2.5 rounded-xl bg-teal-50 dark:bg-[#162544] text-teal-700 dark:text-teal-300 font-bold text-center text-xs"
              >
                Patient Mode
              </button>
              <button
                onClick={() => { switchRole('caregiver'); setMobileMenuOpen(false); navigate('/caregiver'); }}
                className="flex-1 py-2.5 rounded-xl bg-sky-50 dark:bg-[#162544] text-sky-700 dark:text-sky-300 font-bold text-center text-xs"
              >
                Caregiver Mode
              </button>
            </div>

            {user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  triggerLogout(() => navigate('/login'));
                }}
                className="w-full py-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold text-center text-xs flex items-center justify-center gap-2 border border-rose-500/25"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out ({user.name.split(' ')[0]})</span>
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-xl bg-teal-600 text-white font-bold text-center text-xs flex items-center justify-center gap-2 shadow-md"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In / Create Account</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
