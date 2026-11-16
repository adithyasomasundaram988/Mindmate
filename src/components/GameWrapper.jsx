import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  ArrowLeft,
  Sparkles,
  Award,
  HelpCircle,
  CheckCircle2,
  Heart
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../contexts/LanguageContext';
import { useAudio } from '../contexts/AudioContext';
import { useActivity } from '../contexts/ActivityContext';

export default function GameWrapper({
  gameId,
  gameTitle,
  icon: Icon,
  difficulty,
  setDifficulty,
  instructions,
  spokenInstruction,
  children,
  isComplete,
  score = 100,
  onRestart,
}) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { speak, isSpeaking, stopSpeaking } = useAudio();
  const { recordActivity } = useActivity();
  const [showInstructions, setShowInstructions] = useState(true);
  const [hasRecorded, setHasRecorded] = useState(false);

  // Trigger celebration and record activity once completed
  useEffect(() => {
    if (isComplete && !hasRecorded) {
      setHasRecorded(true);
      recordActivity({
        gameId,
        gameTitle,
        difficulty,
        score,
        durationSec: 90,
      });

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#0d9488', '#38bdf8', '#fbbf24', '#f43f5e']
        });
      } catch {
        // ignore
      }
    }
  }, [isComplete, hasRecorded, gameId, gameTitle, difficulty, score, recordActivity]);

  const handleListen = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speak(spokenInstruction || instructions);
    }
  };

  const handleRestart = () => {
    setHasRecorded(false);
    if (onRestart) onRestart();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Top Bar Navigation & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <button
          onClick={() => { stopSpeaking(); navigate('/games'); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-[#142038] hover:bg-slate-100 dark:hover:bg-[#1c2c4e] border border-slate-200 dark:border-[#223558] text-slate-700 dark:text-slate-200 font-semibold text-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('exitGame', 'Back to Games')}
        </button>

        <div className="flex items-center gap-2">
          {/* Difficulty Selector */}
          {setDifficulty && (
            <div className="flex items-center bg-white dark:bg-[#142038] p-1 rounded-2xl border border-slate-200 dark:border-[#223558] text-xs font-bold">
              {['Gentle', 'Regular', 'Challenge'].map(lvl => (
                <button
                  key={lvl}
                  onClick={() => { setDifficulty(lvl); handleRestart(); }}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    difficulty === lvl
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          )}

          {/* Restart Button */}
          <button
            onClick={handleRestart}
            className="p-2.5 rounded-2xl bg-white dark:bg-[#142038] hover:bg-slate-100 dark:hover:bg-[#1c2c4e] border border-slate-200 dark:border-[#223558] text-slate-700 dark:text-slate-200 transition-colors"
            title={t('restartGame', 'Restart Game')}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Game Header Card */}
      <div className="bg-white dark:bg-[#142038] rounded-3xl border border-slate-200 dark:border-[#223558] p-6 sm:p-8 shadow-sm mb-6 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-[#162544] text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 shadow-inner">
              <Icon className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {gameTitle}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Cognitive Wellness Exercise • {difficulty} Level
              </p>
            </div>
          </div>

          {/* Spoken Instructions Action */}
          <button
            onClick={handleListen}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-sm transition-all shadow-sm ${
              isSpeaking
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-teal-600 hover:bg-teal-700 text-white'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>{isSpeaking ? t('stopAudio', 'Stop Audio') : t('listen', 'Listen to instructions')}</span>
          </button>
        </div>

        {/* Instructions Banner */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0c1527] border border-slate-200 dark:border-[#223558] text-slate-700 dark:text-slate-300 text-sm leading-relaxed flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold block text-slate-900 dark:text-slate-100 mb-0.5">
              How to play:
            </span>
            {instructions}
          </div>
        </div>
      </div>

      {/* Game Interactive Area */}
      <div className="bg-white dark:bg-[#142038] rounded-3xl border border-slate-200 dark:border-[#223558] p-6 sm:p-10 shadow-sm relative overflow-hidden transition-colors">
        {children}

        {/* Victory / Completion Overlay Modal */}
        {isComplete && (
          <div className="absolute inset-0 bg-white/95 dark:bg-[#142038]/95 backdrop-blur-sm z-30 flex items-center justify-center p-6 animate-fade-in">
            <div className="max-w-md w-full text-center p-8 rounded-3xl bg-slate-50 dark:bg-[#0c1527] border border-teal-200 dark:border-[#223558] shadow-2xl">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-teal-100 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 flex items-center justify-center animate-bounce">
                <Sparkles className="w-10 h-10" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-2">
                {t('gameComplete', 'Wonderful Effort!')}
              </h2>

              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base mb-6 leading-relaxed">
                {t('gameCompleteMsg', 'You completed this activity with calmness and care.')}
              </p>

              <div className="flex items-center justify-center gap-2 mb-6">
                {[1, 2, 3].map(star => (
                  <Heart key={star} className="w-6 h-6 text-rose-500 fill-rose-500" />
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleRestart}
                  className="px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all active:scale-95"
                >
                  {t('playAgain', 'Play Again')}
                </button>

                <button
                  onClick={() => navigate('/games')}
                  className="px-6 py-3 rounded-2xl bg-white dark:bg-[#162544] hover:bg-slate-100 dark:hover:bg-[#1c2c4e] border border-slate-200 dark:border-[#223558] text-slate-800 dark:text-slate-200 font-bold text-sm transition-all"
                >
                  {t('nextActivity', 'Choose Another Game')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
