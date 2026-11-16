import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

// Curated Selective Mixed-Color Themes
export const MIXED_COLOR_THEMES = [
  {
    id: 'emerald-blossom',
    name: 'Emerald & Blossom',
    tag: 'Mindmate Signature',
    primary: '#0d9488', // Teal 600
    secondary: '#f43f5e', // Rose 500
    primaryName: 'Deep Teal',
    secondaryName: 'Blossom Rose',
    gradient: 'linear-gradient(135deg, #0d9488 0%, #f43f5e 100%)',
    glow1: 'rgba(13, 148, 136, 0.22)',
    glow2: 'rgba(244, 63, 94, 0.18)',
    icon: '🌸',
  },
  {
    id: 'cyber-dusk',
    name: 'Cyber Dusk',
    tag: 'Futuristic & Deep',
    primary: '#06b6d4', // Cyan 500
    secondary: '#8b5cf6', // Violet 500
    primaryName: 'Electric Cyan',
    secondaryName: 'Neon Violet',
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
    glow1: 'rgba(6, 182, 212, 0.25)',
    glow2: 'rgba(139, 92, 246, 0.22)',
    icon: '🌌',
  },
  {
    id: 'sunset-twilight',
    name: 'Sunset Twilight',
    tag: 'Warm & Comforting',
    primary: '#f59e0b', // Amber 500
    secondary: '#e11d48', // Crimson Berry 600
    primaryName: 'Golden Amber',
    secondaryName: 'Crimson Berry',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #e11d48 100%)',
    glow1: 'rgba(245, 158, 11, 0.24)',
    glow2: 'rgba(225, 29, 72, 0.20)',
    icon: '🌅',
  },
  {
    id: 'ocean-aurora',
    name: 'Oceanic Aurora',
    tag: 'Deep Sea & Royal',
    primary: '#10b981', // Mint 500
    secondary: '#6366f1', // Indigo 500
    primaryName: 'Aquamarine Mint',
    secondaryName: 'Royal Indigo',
    gradient: 'linear-gradient(135deg, #10b981 0%, #6366f1 100%)',
    glow1: 'rgba(16, 185, 129, 0.22)',
    glow2: 'rgba(99, 102, 241, 0.22)',
    icon: '🌊',
  },
  {
    id: 'lavender-sage',
    name: 'Lavender & Sage',
    tag: 'Herbal Serenity',
    primary: '#a855f7', // Purple 500
    secondary: '#14b8a6', // Sage Teal 500
    primaryName: 'Amethyst Lavender',
    secondaryName: 'Herbal Sage',
    gradient: 'linear-gradient(135deg, #a855f7 0%, #14b8a6 100%)',
    glow1: 'rgba(168, 85, 247, 0.22)',
    glow2: 'rgba(20, 184, 166, 0.20)',
    icon: '🪻',
  },
  {
    id: 'mocha-honey',
    name: 'Mocha & Honey Gold',
    tag: 'Earthy & Cozy',
    primary: '#d97706', // Warm Bronze 600
    secondary: '#fbbf24', // Honey Amber 400
    primaryName: 'Caramel Bronze',
    secondaryName: 'Honey Gold',
    gradient: 'linear-gradient(135deg, #b45309 0%, #fbbf24 100%)',
    glow1: 'rgba(217, 119, 6, 0.22)',
    glow2: 'rgba(251, 191, 36, 0.20)',
    icon: '☕',
  }
];

export function ThemeProvider({ children }) {
  // Day / Night mode
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('mindmate_theme');
      if (saved) return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  // Selective Mixed Color Theme
  const [colorTheme, setColorTheme] = useState(() => {
    try {
      return localStorage.getItem('mindmate_color_theme') || 'emerald-blossom';
    } catch {
      return 'emerald-blossom';
    }
  });

  const activeColorTheme = MIXED_COLOR_THEMES.find(t => t.id === colorTheme) || MIXED_COLOR_THEMES[0];

  const [fontSize, setFontSize] = useState(() => {
    try {
      return localStorage.getItem('mindmate_fontsize') || 'normal';
    } catch {
      return 'normal';
    }
  });

  const [highContrast, setHighContrast] = useState(() => {
    try {
      return localStorage.getItem('mindmate_high_contrast') === 'true';
    } catch {
      return false;
    }
  });

  const [reducedMotion, setReducedMotion] = useState(() => {
    try {
      const saved = localStorage.getItem('mindmate_reduced_motion');
      if (saved !== null) return saved === 'true';
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch {
      return false;
    }
  });

  // Apply Day/Night theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('mindmate_theme', theme);
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [theme]);

  // Apply Selective Mixed Color Theme to document
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-color-theme', colorTheme);
    root.style.setProperty('--theme-primary', activeColorTheme.primary);
    root.style.setProperty('--theme-secondary', activeColorTheme.secondary);
    root.style.setProperty('--theme-gradient', activeColorTheme.gradient);
    root.style.setProperty('--theme-glow-1', activeColorTheme.glow1);
    root.style.setProperty('--theme-glow-2', activeColorTheme.glow2);
    try {
      localStorage.setItem('mindmate_color_theme', colorTheme);
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [colorTheme, activeColorTheme]);

  // Apply font size
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('font-size-large', 'font-size-xl');
    if (fontSize === 'large') {
      root.classList.add('font-size-large');
    } else if (fontSize === 'xl') {
      root.classList.add('font-size-xl');
    }
    try {
      localStorage.setItem('mindmate_fontsize', fontSize);
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [fontSize]);

  // Apply high contrast
  useEffect(() => {
    const root = document.documentElement;
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    try {
      localStorage.setItem('mindmate_high_contrast', String(highContrast));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [highContrast]);

  // Apply reduced motion
  useEffect(() => {
    const root = document.documentElement;
    if (reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
    try {
      localStorage.setItem('mindmate_reduced_motion', String(reducedMotion));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [reducedMotion]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      setTheme,
      toggleTheme,
      isDark: theme === 'dark',
      colorTheme,
      setColorTheme,
      activeColorTheme,
      colorThemes: MIXED_COLOR_THEMES,
      fontSize,
      setFontSize,
      highContrast,
      setHighContrast,
      reducedMotion,
      setReducedMotion
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
