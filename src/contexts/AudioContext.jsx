import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useLanguage } from './LanguageContext';
import {
  startAmbientSoundscape,
  stopAmbientSoundscape,
  setAmbientVolume,
  duckAmbientVolume
} from '../utils/audioSynth';

const AudioContext = createContext();

export function AudioProvider({ children }) {
  const { language, currentLangMeta } = useLanguage();

  // Voice Guidance Settings
  const [voiceGuidanceEnabled, setVoiceGuidanceEnabled] = useState(() => {
    try {
      return localStorage.getItem('mindmate_voice_enabled') !== 'false';
    } catch {
      return true;
    }
  });

  const [voicePreference, setVoicePreference] = useState(() => {
    try {
      return localStorage.getItem('mindmate_voice_pref') || 'female'; // 'female' | 'automatic' | 'default'
    } catch {
      return 'female';
    }
  });

  const [speechSpeed, setSpeechSpeed] = useState(() => {
    try {
      return parseFloat(localStorage.getItem('mindmate_speech_speed')) || 0.85; // slower for seniors
    } catch {
      return 0.85;
    }
  });

  const [speechVolume, setSpeechVolume] = useState(() => {
    try {
      return parseFloat(localStorage.getItem('mindmate_speech_volume')) || 1.0;
    } catch {
      return 1.0;
    }
  });

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastSpokenText, setLastSpokenText] = useState('');
  const [voiceNotice, setVoiceNotice] = useState(null);

  // Background Music / Soundscape Settings
  const [ambientEnabled, setAmbientEnabled] = useState(() => {
    try {
      return localStorage.getItem('mindmate_ambient_enabled') === 'true';
    } catch {
      return false;
    }
  });

  const [ambientTrack, setAmbientTrack] = useState(() => {
    try {
      return localStorage.getItem('mindmate_ambient_track') || 'alpha'; // 'alpha' | 'theta' | 'ocean' | 'chimes'
    } catch {
      return 'alpha';
    }
  });

  const [ambientVol, setAmbientVol] = useState(() => {
    try {
      return parseFloat(localStorage.getItem('mindmate_ambient_volume')) || 0.4;
    } catch {
      return 0.4;
    }
  });

  // Browser voices list
  const [availableVoices, setAvailableVoices] = useState([]);
  const activeUtteranceRef = useRef(null);

  useEffect(() => {
    const updateVoices = () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
      }
    };

    updateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Sync ambient soundscape
  useEffect(() => {
    if (ambientEnabled) {
      startAmbientSoundscape(ambientTrack, ambientVol);
    } else {
      stopAmbientSoundscape();
    }
    return () => {
      stopAmbientSoundscape();
    };
  }, [ambientEnabled, ambientTrack]);

  // Update ambient volume
  useEffect(() => {
    if (ambientEnabled) {
      setAmbientVolume(ambientVol);
    }
    try {
      localStorage.setItem('mindmate_ambient_volume', String(ambientVol));
    } catch (e) {
      console.warn(e);
    }
  }, [ambientVol, ambientEnabled]);

  // Save voice settings
  useEffect(() => {
    try {
      localStorage.setItem('mindmate_voice_enabled', String(voiceGuidanceEnabled));
      localStorage.setItem('mindmate_voice_pref', voicePreference);
      localStorage.setItem('mindmate_speech_speed', String(speechSpeed));
      localStorage.setItem('mindmate_speech_volume', String(speechVolume));
      localStorage.setItem('mindmate_ambient_enabled', String(ambientEnabled));
      localStorage.setItem('mindmate_ambient_track', ambientTrack);
    } catch (e) {
      console.warn(e);
    }
  }, [voiceGuidanceEnabled, voicePreference, speechSpeed, speechVolume, ambientEnabled, ambientTrack]);

  // Find best matching voice for active language
  const findBestVoice = (targetLangCode) => {
    if (!availableVoices.length) return null;

    // Search by prefix or exact code e.g. 'ta', 'ta-IN', 'hi', 'hi-IN'
    const langPrefix = targetLangCode.split('-')[0].toLowerCase();
    const matching = availableVoices.filter(v =>
      v.lang.toLowerCase().startsWith(langPrefix) ||
      v.lang.toLowerCase().replace('_', '-').includes(targetLangCode.toLowerCase())
    );

    if (matching.length === 0) return null;

    if (voicePreference === 'female') {
      const femaleVoice = matching.find(v =>
        v.name.toLowerCase().includes('female') ||
        v.name.toLowerCase().includes('woman') ||
        v.name.toLowerCase().includes('zira') ||
        v.name.toLowerCase().includes('kalpana') ||
        v.name.toLowerCase().includes('swara') ||
        v.name.toLowerCase().includes('sangeeta') ||
        v.name.toLowerCase().includes('valluvar') === false
      );
      if (femaleVoice) return femaleVoice;
    }

    if (voicePreference === 'default') {
      const def = matching.find(v => v.default);
      if (def) return def;
    }

    return matching[0];
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    duckAmbientVolume(false, ambientVol);
  };

  const speak = (text, customLang = null) => {
    if (!voiceGuidanceEnabled) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setVoiceNotice('Speech synthesis is not supported on this browser device.');
      return;
    }

    // Stop ongoing speech
    stopSpeaking();
    setLastSpokenText(text);

    const targetLang = customLang || currentLangMeta.voiceLang || 'en-US';
    const voice = findBestVoice(targetLang);

    // If no voice exists for the target language (e.g. Kokborok or Khasi on standard OS)
    if (!voice && targetLang.split('-')[0] !== 'en') {
      setVoiceNotice({
        languageName: currentLangMeta.name,
        nativeName: currentLangMeta.nativeName,
        canFallbackToEnglish: true,
        text,
      });
      return;
    }

    setVoiceNotice(null);

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      } else {
        utterance.lang = targetLang;
      }

      utterance.rate = speechSpeed;
      utterance.volume = speechVolume;

      utterance.onstart = () => {
        setIsSpeaking(true);
        // Duck ambient music while speech is playing
        if (ambientEnabled) {
          duckAmbientVolume(true, ambientVol);
        }
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        // Restore ambient music volume
        if (ambientEnabled) {
          duckAmbientVolume(false, ambientVol);
        }
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        if (ambientEnabled) {
          duckAmbientVolume(false, ambientVol);
        }
      };

      activeUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech error:', err);
      setIsSpeaking(false);
    }
  };

  const replay = () => {
    if (lastSpokenText) {
      speak(lastSpokenText);
    }
  };

  const speakEnglishFallback = (fallbackText) => {
    speak(fallbackText || lastSpokenText, 'en-US');
  };

  return (
    <AudioContext.Provider value={{
      voiceGuidanceEnabled,
      setVoiceGuidanceEnabled,
      voicePreference,
      setVoicePreference,
      speechSpeed,
      setSpeechSpeed,
      speechVolume,
      setSpeechVolume,
      isSpeaking,
      speak,
      stopSpeaking,
      replay,
      voiceNotice,
      setVoiceNotice,
      speakEnglishFallback,
      ambientEnabled,
      setAmbientEnabled,
      ambientTrack,
      setAmbientTrack,
      ambientVol,
      setAmbientVol,
      availableVoices,
    }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) throw new Error('useAudio must be used within AudioProvider');
  return context;
}
