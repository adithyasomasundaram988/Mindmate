import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useActivity } from '../contexts/ActivityContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Coffee, Heart, Play, Wind } from 'lucide-react';

export default function BreakReminderModal() {
  const { activeBreakAlert, dismissBreakAlert, resetSessionTimer } = useActivity();
  const { t } = useLanguage();
  const navigate = useNavigate();

  if (!activeBreakAlert) return null;

  const isExtended = activeBreakAlert === 'extended';
  const isBreak = activeBreakAlert === 'break';

  const title = isExtended
    ? 'Gentle Pause for Rest'
    : isBreak
    ? t('breakPromptTitle', 'Time for a Short Rest')
    : t('breakCheckInTitle', 'Gentle Check-in');

  const message = isExtended
    ? 'You have been engaged in activities for over 45 minutes today. Taking a soothing break right now will keep your mind fresh and comfortable.'
    : isBreak
    ? t('breakPromptMsg', 'A short pause can feel refreshing for your eyes and mind. You can return whenever you feel ready.')
    : t('breakCheckInMsg', 'You have spent some time playing. How are you feeling right now?');

  const handleRelaxClick = () => {
    dismissBreakAlert();
    navigate('/relaxation');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#142038] border border-slate-200 dark:border-[#233558] shadow-2xl text-center">
        {/* Decorative gentle icon */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 flex items-center justify-center shadow-inner">
          {isBreak || isExtended ? (
            <Coffee className="w-8 h-8" />
          ) : (
            <Heart className="w-8 h-8 text-rose-500 fill-rose-500/20" />
          )}
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
          {title}
        </h3>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
          {message}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleRelaxClick}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-medium shadow-md transition-all active:scale-95"
          >
            <Wind className="w-4 h-4" />
            {t('relaxButton', 'Take a Calm Breath')}
          </button>

          <button
            onClick={dismissBreakAlert}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-[#1c2c4e] dark:hover:bg-[#253963] text-slate-700 dark:text-slate-200 font-medium transition-all"
          >
            <Play className="w-4 h-4" />
            {t('dismissReminder', 'Continue Playing')}
          </button>
        </div>

        <p className="mt-4 text-xs text-slate-400 dark:text-slate-400">
          Caregiver wellness threshold check • Configurable in Settings
        </p>
      </div>
    </div>
  );
}
