import React, { createContext, useContext, useState, useEffect } from 'react';

const UserModeContext = createContext();

export const MODES = [
  {
    id: 'general',
    name: 'General',
    badge: 'Balanced',
    description: 'A harmonious blend of everyday memory exercises, gentle puzzles, and mindful relaxation.',
    tagline: 'Balanced cognitive wellness for everyday vitality.',
    accentColor: 'teal',
    recommendedGames: ['memory-match', 'word-search', 'jigsaw-puzzle'],
    defaultDifficulty: 'Regular',
    hintsEnabled: true,
  },
  {
    id: 'memoryFriendly',
    name: 'Memory-Friendly',
    badge: 'Gentle & Familiar',
    description: 'Simplified steps, familiar imagery, generous hints, and slower pacing without pressure.',
    tagline: 'Warm, stress-free engagement designed for comfort.',
    accentColor: 'sky',
    recommendedGames: ['memory-match', 'image-recognition', 'jigsaw-puzzle'],
    defaultDifficulty: 'Gentle',
    hintsEnabled: true,
  },
  {
    id: 'calmRelax',
    name: 'Calm & Relax',
    badge: 'Peaceful & Mindful',
    description: 'Zero time limits, soothing ambient soundscapes, breathing exercises, and tranquil interactions.',
    tagline: 'Relaxation and restorative mindfulness.',
    accentColor: 'indigo',
    recommendedGames: ['jigsaw-puzzle', 'test-tube-color', 'word-search'],
    defaultDifficulty: 'Gentle',
    hintsEnabled: true,
  },
  {
    id: 'focusTraining',
    name: 'Focus & Brain Training',
    badge: 'Stimulating Attention',
    description: 'Structured pattern recall, sequencing exercises, and engaging cognitive challenges.',
    tagline: 'Active attention building and pattern recognition.',
    accentColor: 'emerald',
    recommendedGames: ['sequence-memory', 'maze', 'word-scramble'],
    defaultDifficulty: 'Regular',
    hintsEnabled: false,
  },
];

export function UserModeProvider({ children }) {
  const [activeModeId, setActiveModeId] = useState(() => {
    try {
      return localStorage.getItem('mindmate_active_mode') || 'general';
    } catch {
      return 'general';
    }
  });

  const activeMode = MODES.find(m => m.id === activeModeId) || MODES[0];

  const setMode = (modeId) => {
    if (MODES.some(m => m.id === modeId)) {
      setActiveModeId(modeId);
      try {
        localStorage.setItem('mindmate_active_mode', modeId);
      } catch (e) {
        console.warn('Storage error', e);
      }
    }
  };

  return (
    <UserModeContext.Provider value={{
      activeMode,
      activeModeId,
      setMode,
      modes: MODES,
    }}>
      {children}
    </UserModeContext.Provider>
  );
}

export function useUserMode() {
  const context = useContext(UserModeContext);
  if (!context) throw new Error('useUserMode must be used within UserModeProvider');
  return context;
}
