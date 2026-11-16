import React from 'react';
import { useAudio } from '../contexts/AudioContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Volume2, VolumeX, Info, X } from 'lucide-react';

export default function VoiceNoticeBanner() {
  const { voiceNotice, setVoiceNotice, speakEnglishFallback } = useAudio();
  const { t } = useLanguage();

  if (!voiceNotice) return null;

  return (
    <div className="bg-amber-50 dark:bg-amber-950/70 border-b border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200 px-4 py-2.5 text-xs sm:text-sm">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>
            {t('voiceNoticeUnavailable', 'Notice: Speech synthesis voice in the selected language is not currently installed in this browser. Written instructions remain fully available.')}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          {voiceNotice.canFallbackToEnglish && (
            <button
              onClick={() => {
                speakEnglishFallback(voiceNotice.text);
                setVoiceNotice(null);
              }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs shadow-sm transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5" />
              {t('listenInEnglishFallback', 'Listen in English')}
            </button>
          )}

          <button
            onClick={() => setVoiceNotice(null)}
            className="p-1 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900 text-amber-700 dark:text-amber-300 transition-colors"
            title="Dismiss notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
