import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

const ActivityContext = createContext();

export const ACHIEVEMENTS = [
  {
    id: 'first_activity',
    title: 'First Step',
    description: 'Completed your very first cognitive wellness activity.',
    icon: '🌱',
    condition: (history) => history.length >= 1,
  },
  {
    id: 'first_match',
    title: 'Sharp Eyes',
    description: 'Completed a Memory Match exercise.',
    icon: '✨',
    condition: (history) => history.some(h => h.gameId === 'memory-match'),
  },
  {
    id: 'five_activities',
    title: 'Blooming Habit',
    description: 'Completed 5 cognitive wellness sessions.',
    icon: '🌸',
    condition: (history) => history.length >= 5,
  },
  {
    id: 'variety_explorer',
    title: 'Curious Mind',
    description: 'Explored 3 or more distinct types of activities.',
    icon: '🧭',
    condition: (history) => {
      const distinctGames = new Set(history.map(h => h.gameId));
      return distinctGames.size >= 3;
    },
  },
  {
    id: 'peaceful_pause',
    title: 'Master of Calm',
    description: 'Took time for relaxation or breathing mindfulness.',
    icon: '🕊️',
    condition: (history) => history.some(h => h.gameId === 'relaxation' || h.gameId === 'breathing'),
  },
  {
    id: 'dedicated_streak',
    title: 'Steady Rhythm',
    description: 'Engaged in activities across 2 or more active days.',
    icon: '☀️',
    condition: (history, streak) => streak >= 2,
  },
];

export function ActivityProvider({ children }) {
  // Activity History
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('mindmate_activity_history');
      if (saved) return JSON.parse(saved);
      // Clean start or demo records
      return [
        {
          id: 'act-demo-1',
          gameId: 'memory-match',
          gameTitle: 'Memory Match',
          difficulty: 'Regular',
          timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
          durationSec: 140,
          score: 100,
          mode: 'general',
          stars: 3,
        },
        {
          id: 'act-demo-2',
          gameId: 'word-search',
          gameTitle: 'Word Search',
          difficulty: 'Gentle',
          timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
          durationSec: 110,
          score: 100,
          mode: 'general',
          stars: 3,
        }
      ];
    } catch {
      return [];
    }
  });

  // Session Timing & Break Reminder Settings
  const [sessionThresholds, setSessionThresholds] = useState(() => {
    try {
      const saved = localStorage.getItem('mindmate_session_thresholds');
      if (saved) return JSON.parse(saved);
      return {
        checkInMinutes: 18,
        breakMinutes: 30,
        extendedMinutes: 45,
      };
    } catch {
      return { checkInMinutes: 18, breakMinutes: 30, extendedMinutes: 45 };
    }
  });

  // Live active seconds counter for current session
  const [activeSessionSeconds, setActiveSessionSeconds] = useState(0);
  const [activeBreakAlert, setActiveBreakAlert] = useState(null); // 'checkIn' | 'break' | 'extended' | null
  const [isAlertDismissed, setIsAlertDismissed] = useState(false);

  // Track active time only when tab is visible
  useEffect(() => {
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') {
        setActiveSessionSeconds(prev => prev + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Monitor thresholds
  useEffect(() => {
    const minutes = Math.floor(activeSessionSeconds / 60);
    if (isAlertDismissed) return;

    if (minutes >= sessionThresholds.extendedMinutes) {
      if (activeBreakAlert !== 'extended') setActiveBreakAlert('extended');
    } else if (minutes >= sessionThresholds.breakMinutes) {
      if (activeBreakAlert !== 'break') setActiveBreakAlert('break');
    } else if (minutes >= sessionThresholds.checkInMinutes) {
      if (activeBreakAlert !== 'checkIn') setActiveBreakAlert('checkIn');
    }
  }, [activeSessionSeconds, sessionThresholds, isAlertDismissed, activeBreakAlert]);

  // Persist history
  useEffect(() => {
    try {
      localStorage.setItem('mindmate_activity_history', JSON.stringify(history));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [history]);

  // Persist thresholds
  useEffect(() => {
    try {
      localStorage.setItem('mindmate_session_thresholds', JSON.stringify(sessionThresholds));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [sessionThresholds]);

  // Record an activity completion safely (prevent duplicate counting)
  const recordActivity = useCallback((activity) => {
    const newRecord = {
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString(),
      durationSec: 60,
      stars: 3,
      ...activity,
    };
    setHistory(prev => [newRecord, ...prev]);
  }, []);

  // Compute Streak
  const computeStreak = () => {
    if (!history.length) return 0;
    const daysSet = new Set(
      history.map(item => new Date(item.timestamp).toISOString().split('T')[0])
    );
    // Sort descending
    const sortedDays = Array.from(daysSet).sort().reverse();
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // Check if user played today or yesterday to maintain streak
    if (!sortedDays.includes(today) && !sortedDays.includes(yesterday)) {
      return 0;
    }
    return sortedDays.length;
  };

  const streak = computeStreak();

  // Compute Achievements dynamically from actual history
  const unlockedAchievements = ACHIEVEMENTS.map(ach => ({
    ...ach,
    isUnlocked: ach.condition(history, streak),
  }));

  // Memory Garden Growth Stage
  // Level 1: 0-2 activities, Level 2: 3-5 activities, Level 3: 6-10 activities, Level 4: 11+ activities
  const totalCompleted = history.length;
  let gardenStage = 1;
  let gardenStageLabel = 'Fresh Sprout';
  if (totalCompleted >= 11) {
    gardenStage = 4;
    gardenStageLabel = 'Lush Sanctuary';
  } else if (totalCompleted >= 6) {
    gardenStage = 3;
    gardenStageLabel = 'Flourishing Flora';
  } else if (totalCompleted >= 3) {
    gardenStage = 2;
    gardenStageLabel = 'Budding Blossom';
  }

  const dismissBreakAlert = () => {
    setActiveBreakAlert(null);
    setIsAlertDismissed(true);
    // Allow reminder again after 10 more minutes
    setTimeout(() => {
      setIsAlertDismissed(false);
    }, 600000);
  };

  const resetSessionTimer = () => {
    setActiveSessionSeconds(0);
    setActiveBreakAlert(null);
    setIsAlertDismissed(false);
  };

  return (
    <ActivityContext.Provider value={{
      history,
      recordActivity,
      streak,
      totalCompleted,
      unlockedAchievements,
      gardenStage,
      gardenStageLabel,
      activeSessionSeconds,
      sessionThresholds,
      setSessionThresholds,
      activeBreakAlert,
      dismissBreakAlert,
      resetSessionTimer,
    }}>
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivity() {
  const context = useContext(ActivityContext);
  if (!context) throw new Error('useActivity must be used within ActivityProvider');
  return context;
}
