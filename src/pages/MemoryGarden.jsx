import React from 'react';
import {
  TreePine,
  Flower2,
  Sparkles,
  Sun,
  Flame,
  Award,
  CheckCircle2,
  Lock,
  Heart,
  Droplets,
  Wind
} from 'lucide-react';
import { useActivity } from '../contexts/ActivityContext';
import { useLanguage } from '../contexts/LanguageContext';

export default function MemoryGarden() {
  const { totalCompleted, gardenStage, gardenStageLabel, unlockedAchievements, streak } = useActivity();
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
          <TreePine className="w-4 h-4" />
          <span>Interactive Progress Sanctuary</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white">
          {t('gardenTitle', 'Your Memory Garden')}
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          {t('gardenSubtitle', 'Watch your garden bloom with flowers and gentle trees as you participate in daily activities.')}
        </p>
      </div>

      {/* Visual Living Garden Canvas / SVG Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-sky-100 via-emerald-50 to-emerald-100 dark:from-[#0e1d38] dark:via-[#112440] dark:to-[#0f2838] border-2 border-emerald-200 dark:border-[#223558] p-8 sm:p-12 shadow-lg min-h-96 flex flex-col justify-between">
        
        {/* Sky Elements: Sun & Fluffy Clouds */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3 bg-white/70 dark:bg-[#142038]/70 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-200/50 dark:border-[#223558]">
            <TreePine className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Current Stage
              </span>
              <span className="text-sm font-black text-slate-900 dark:text-white">
                {gardenStageLabel} ({totalCompleted} Activities)
              </span>
            </div>
          </div>

          <div className="w-16 h-16 rounded-full bg-amber-300 dark:bg-amber-400/90 shadow-lg shadow-amber-300/40 flex items-center justify-center animate-pulse">
            <Sun className="w-9 h-9 text-amber-600" />
          </div>
        </div>

        {/* Dynamic Blooming Garden Centerpiece based on gardenStage */}
        <div className="py-8 text-center flex flex-col items-center justify-center space-y-4">
          <div className="flex items-end justify-center gap-4 sm:gap-8 flex-wrap">
            
            {/* Stage 1: Sprout */}
            <div className="flex flex-col items-center transform transition-all duration-700">
              <span className="text-5xl sm:text-6xl animate-bounce">🌱</span>
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 mt-2">
                Fresh Seedling
              </span>
            </div>

            {/* Stage 2: Budding Flowers (Unlocked if totalCompleted >= 3) */}
            {totalCompleted >= 3 ? (
              <div className="flex flex-col items-center animate-fade-in">
                <span className="text-5xl sm:text-6xl">🌷</span>
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400 mt-2">
                  Spring Tulip
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center opacity-30">
                <span className="text-5xl sm:text-6xl filter grayscale">🌷</span>
                <span className="text-xs font-medium text-slate-400 mt-2">
                  3 Activities Needed
                </span>
              </div>
            )}

            {/* Stage 3: Blooming Tree (Unlocked if totalCompleted >= 6) */}
            {totalCompleted >= 6 ? (
              <div className="flex flex-col items-center animate-fade-in">
                <span className="text-6xl sm:text-7xl">🌳</span>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 mt-2">
                  Grand Shade Tree
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center opacity-30">
                <span className="text-6xl sm:text-7xl filter grayscale">🌳</span>
                <span className="text-xs font-medium text-slate-400 mt-2">
                  6 Activities Needed
                </span>
              </div>
            )}

            {/* Stage 4: Sanctuary Flowers & Butterflies (Unlocked if totalCompleted >= 11) */}
            {totalCompleted >= 11 ? (
              <div className="flex flex-col items-center animate-fade-in">
                <span className="text-5xl sm:text-6xl">🦋</span>
                <span className="text-xs font-bold text-sky-600 dark:text-sky-300 mt-2">
                  Garden Butterflies
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center opacity-30">
                <span className="text-5xl sm:text-6xl filter grayscale">🦋</span>
                <span className="text-xs font-medium text-slate-400 mt-2">
                  11 Activities Needed
                </span>
              </div>
            )}

          </div>

          <p className="text-xs sm:text-sm text-emerald-900 dark:text-emerald-200 font-semibold max-w-md pt-4">
            {totalCompleted >= 11
              ? 'Your garden is a lush, flourishing sanctuary of peace and cognitive vitality!'
              : totalCompleted >= 6
              ? 'Your garden is blooming beautifully with shade trees and colorful petals!'
              : totalCompleted >= 3
              ? 'Gentle buds are opening into fresh spring flowers as you continue your journey.'
              : 'Your garden seedling is warmly planted. Complete more activities to see flowers bloom!'}
          </p>
        </div>

        {/* Ground Soil Bar */}
        <div className="pt-4 border-t border-emerald-300/60 dark:border-emerald-800/60 flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-300">
          <span>Fertile Ground: Nurtured with Daily Mindfulness</span>
          <span>{totalCompleted} / 12 activities toward Full Sanctuary</span>
        </div>
      </div>

      {/* Real-time Dynamic Achievements Grid */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Personal Wellness Achievements
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Automatically unlocked from your genuine activity records.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {unlockedAchievements.map(ach => (
            <div
              key={ach.id}
              className={`p-6 rounded-3xl border transition-all ${
                ach.isUnlocked
                  ? 'bg-white dark:bg-[#142038] border-teal-300 dark:border-teal-700 shadow-md ring-1 ring-teal-400/30'
                  : 'bg-slate-50 dark:bg-[#0e172a] border-slate-200 dark:border-[#1e2c4c] opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-4xl">{ach.icon}</span>
                {ach.isUnlocked ? (
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Unlocked
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-200 dark:bg-[#1c2c4e] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> In Progress
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                {ach.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {ach.description}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
