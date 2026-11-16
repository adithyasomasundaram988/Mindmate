import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  Flower2,
  Bell,
  Eye,
  Footprints,
  FlaskConical,
  Puzzle,
  Sparkles,
  TreePine,
  Wind,
  Volume2,
  Clock,
  Award,
  ChevronRight,
  HelpCircle,
  Settings,
  Flame,
  Coffee,
  CheckCircle2,
  SpellCheck,
  Search
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useUserMode } from '../contexts/UserModeContext';
import { useActivity } from '../contexts/ActivityContext';
import { useAudio } from '../contexts/AudioContext';

const ALL_GAMES_METADATA = [
  {
    id: 'memory-match',
    title: 'Memory Match',
    desc: 'Reveal and pair comforting everyday symbols at your own peaceful pace.',
    icon: Flower2,
    color: 'from-teal-500 to-teal-700',
    tag: 'Familiar Pairs',
    path: '/games/memory-match',
    category: 'Memory',
  },
  {
    id: 'sequence-memory',
    title: 'Sequence Memory',
    desc: 'Listen and observe gentle colored bells chiming in musical harmony.',
    icon: Bell,
    color: 'from-amber-500 to-amber-700',
    tag: 'Pattern Chimes',
    path: '/games/sequence-memory',
    category: 'Attention',
  },
  {
    id: 'image-recognition',
    title: 'Visual Discovery & Recognition Lab',
    desc: 'Explore HD nostalgic photography with an interactive brass magnifier loupe & memory attics.',
    icon: Eye,
    color: 'from-sky-500 to-sky-700',
    tag: 'Visual Detective',
    path: '/games/image-recognition',
    category: 'Memory',
  },
  {
    id: 'maze',
    title: 'Garden Maze',
    desc: 'Guide your friendly animal companion through the floral garden paths.',
    icon: Footprints,
    color: 'from-emerald-500 to-emerald-700',
    tag: 'Exploration',
    path: '/games/maze',
    category: 'Spatial',
  },
  {
    id: 'test-tube-color',
    title: 'Test Tube Colour Sorting Lab',
    desc: 'Strategic multi-tier liquid sort puzzle with up to 9 flasks and undo.',
    icon: FlaskConical,
    color: 'from-cyan-500 to-cyan-700',
    tag: 'Color Sorting',
    path: '/games/test-tube-color',
    category: 'Sorting',
  },
  {
    id: 'jigsaw-puzzle',
    title: 'Authentic Jigsaw Puzzle',
    desc: 'Assemble scenic photographic masterpieces with interlocking jigsaw tabs & snap-to-grid.',
    icon: Puzzle,
    color: 'from-rose-500 to-rose-700',
    tag: 'Classic Jigsaw',
    path: '/games/jigsaw-puzzle',
    category: 'Visual',
  },
  {
    id: 'word-scramble',
    title: 'Word Scramble',
    desc: 'Unscramble heartwarming words with clues, hints, and letter shuffles.',
    icon: SpellCheck,
    color: 'from-fuchsia-500 to-fuchsia-700',
    tag: 'Word Unscramble',
    path: '/games/word-scramble',
    category: 'Language',
  },
  {
    id: 'word-search',
    title: 'Word Search & Circle Words',
    desc: 'Search letter grids to circle peaceful target words with glowing trails.',
    icon: Search,
    color: 'from-violet-500 to-violet-700',
    tag: 'Hidden Words',
    path: '/games/word-search',
    category: 'Language',
  },
];

export default function PatientDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { activeMode, modes, setMode } = useUserMode();
  const { streak, totalCompleted, history, gardenStageLabel, activeSessionSeconds } = useActivity();
  const { voiceGuidanceEnabled, setVoiceGuidanceEnabled, speak } = useAudio();
  const navigate = useNavigate();

  const [modeModalOpen, setModeModalOpen] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const activeMinutes = Math.floor(activeSessionSeconds / 60);

  // Suggested Activity based on active mode
  const suggestedGameId = activeMode.recommendedGames[0] || 'memory-match';
  const suggestedGame = ALL_GAMES_METADATA.find(g => g.id === suggestedGameId) || ALL_GAMES_METADATA[0];

  const handleListenGreeting = () => {
    const msg = `${getGreeting()}, ${user?.name || 'Friend'}. Welcome to your Mindmate wellness dashboard. Your active mode is ${activeMode.name}. You have completed ${totalCompleted} activities with a ${streak} day streak.`;
    speak(msg);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Top Welcome Banner Card */}
      <div className="relative overflow-hidden p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#142038] border border-slate-200 dark:border-[#223558] shadow-sm transition-colors">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800 dark:bg-[#162544] dark:text-teal-300">
                Patient Mode
              </span>
              <button
                onClick={() => setModeModalOpen(true)}
                className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-[#1c2c4e] dark:hover:bg-[#253963] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-[#334b77] transition-colors"
              >
                Mode: {activeMode.name} ✎
              </button>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
              {getGreeting()}, {user?.name || 'Friend'}!
            </h1>

            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
              {activeMode.tagline} Take your time, enjoy gentle exercises, and know that every memory matters.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleListenGreeting}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all active:scale-95"
            >
              <Volume2 className="w-4 h-4" />
              <span>Listen to Greeting</span>
            </button>

            <Link
              to="/relaxation"
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-[#1c2c4e] dark:hover:bg-[#253963] text-slate-800 dark:text-slate-200 font-bold text-sm transition-all"
            >
              <Wind className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Calm & Breathe</span>
            </Link>
          </div>

        </div>
      </div>

      {/* Highlights Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Streak */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#142038] border border-slate-200 dark:border-[#223558] shadow-xs">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-500 flex items-center justify-center">
              <Flame className="w-6 h-6 fill-amber-500/20" />
            </div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Current Streak</span>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {streak} <span className="text-sm font-semibold text-slate-500">{t('days', 'days')}</span>
          </div>
        </div>

        {/* Total Activities */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#142038] border border-slate-200 dark:border-[#223558] shadow-xs">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Activities Completed</span>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {totalCompleted}
          </div>
        </div>

        {/* Memory Garden Stage */}
        <Link
          to="/garden"
          className="p-6 rounded-3xl bg-white dark:bg-[#142038] hover:bg-slate-50 dark:hover:bg-[#182744] border border-slate-200 dark:border-[#223558] shadow-xs transition-colors group"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <TreePine className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Memory Garden</span>
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white flex items-center justify-between">
            <span>{gardenStageLabel}</span>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Active Time Today */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#142038] border border-slate-200 dark:border-[#223558] shadow-xs">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Active Play Time</span>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {activeMinutes} <span className="text-sm font-semibold text-slate-500">mins</span>
          </div>
        </div>

      </div>

      {/* Suggested Activity Highlight Card */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-teal-50 to-sky-50 dark:from-[#111d35] dark:to-[#162544] border-2 border-teal-200 dark:border-[#223558] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shrink-0">
            <Flower2 className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wider block mb-1">
              {t('suggestedActivity', "Today's Recommended Activity")}
            </span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              {suggestedGame.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-lg mt-1">
              {suggestedGame.desc}
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate(suggestedGame.path)}
          className="px-8 py-4 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-base shadow-md transition-all active:scale-95 shrink-0"
        >
          {t('continueActivity', 'Start Activity')} →
        </button>
      </div>

      {/* All Cognitive Games Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Cognitive Activities Library
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Eight fully playable activities. Tap any activity to begin.
            </p>
          </div>
          <Link
            to="/games"
            className="text-sm font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 flex items-center gap-1"
          >
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ALL_GAMES_METADATA.map(game => {
            const Icon = game.icon;
            const isRecommended = activeMode.recommendedGames.includes(game.id);

            return (
              <div
                key={game.id}
                onClick={() => navigate(game.path)}
                className="group cursor-pointer p-6 rounded-3xl bg-white dark:bg-[#142038] hover:bg-slate-50/80 dark:hover:bg-[#1a2b4b] border border-slate-200 dark:border-[#223558] shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${game.color} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    {isRecommended && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                        Recommended
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {game.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                    {game.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-[#223558] flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-400">{game.category}</span>
                  <span className="text-teal-600 dark:text-teal-400 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Play Now <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mode Switcher Modal */}
      {modeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="max-w-lg w-full p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#142038] border border-slate-200 dark:border-[#223558] shadow-2xl">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-2">
              Choose Your Active Mode
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-6">
              Select the experience that best fits how you are feeling right now:
            </p>

            <div className="space-y-3 mb-6">
              {modes.map(m => (
                <button
                  key={m.id}
                  onClick={() => {
                    setMode(m.id);
                    setModeModalOpen(false);
                  }}
                  className={`w-full p-4 rounded-2xl border text-left transition-all ${
                    activeMode.id === m.id
                      ? 'bg-teal-50 dark:bg-[#162544] border-teal-500 ring-2 ring-teal-400'
                      : 'bg-slate-50 dark:bg-[#0c1527] border-slate-200 dark:border-[#223558] hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 dark:text-white">{m.name}</span>
                    <span className="text-[11px] font-semibold text-teal-600 dark:text-teal-400">{m.badge}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {m.description}
                  </p>
                </button>
              ))}
            </div>

            <button
              onClick={() => setModeModalOpen(false)}
              className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-[#1c2c4e] dark:hover:bg-[#253963] text-slate-700 dark:text-slate-200 font-bold text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
