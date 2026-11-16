import React, { useState, useEffect, useRef } from 'react';
import {
  Palette,
  Check,
  X,
  Sun,
  Moon,
  Sparkles,
  Contrast,
  Sliders
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function CornerThemeSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    colorTheme,
    setColorTheme,
    activeColorTheme,
    colorThemes,
    theme,
    toggleTheme,
    isDark
  } = useTheme();

  const panelRef = useRef(null);

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('pointerdown', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('pointerdown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={panelRef} className="fixed bottom-6 right-6 z-40 select-none">
      
      {/* 1. Floating Flyout Panel (Opens from the side corner) */}
      {isOpen && (
        <div
          className="absolute bottom-14 right-0 w-80 sm:w-96 rounded-3xl bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-2xl border border-slate-200/80 dark:border-[#223558] p-5 shadow-2xl animate-scale-up text-left overflow-hidden"
          style={{
            boxShadow: `0 20px 60px -10px rgba(0, 0, 0, 0.45), 0 0 25px ${activeColorTheme.glow1}`,
          }}
        >
          {/* Subtle Top Gradient Accent Bar */}
          <div
            className="absolute top-0 left-0 right-0 h-1.5"
            style={{ background: activeColorTheme.gradient }}
          />

          {/* Panel Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-[#1e293b]">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-xs"
                style={{ background: activeColorTheme.gradient }}
              >
                <Palette className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight flex items-center gap-1.5">
                  <span>Mixed Color Themes</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                    Manual
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Select a curated dual-color palette
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-[#1e293b] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              aria-label="Close theme selector"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 6 Selective Mixed-Color Themes Grid */}
          <div className="space-y-2 mb-4 max-h-[340px] overflow-y-auto pr-1">
            {colorThemes.map(t => {
              const isSelected = colorTheme === t.id;

              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setColorTheme(t.id);
                  }}
                  className={`w-full p-2.5 rounded-2xl border text-left transition-all flex items-center justify-between group ${
                    isSelected
                      ? 'bg-slate-50 dark:bg-[#1e293b] border-slate-400 dark:border-slate-500 shadow-md ring-2 ring-teal-500/30'
                      : 'bg-white dark:bg-[#0c1527] border-slate-200/80 dark:border-[#1e293b] hover:bg-slate-50/80 dark:hover:bg-[#16233b]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Dual-Color Split Swatch */}
                    <div
                      className="w-9 h-9 rounded-xl shadow-xs overflow-hidden flex items-center justify-center shrink-0 border border-white/20 transition-transform group-hover:scale-105"
                      style={{ background: t.gradient }}
                    >
                      <span className="text-sm select-none drop-shadow-xs">{t.icon}</span>
                    </div>

                    <div className="overflow-hidden">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                          {t.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: t.primary }} />
                        <span>{t.primaryName}</span>
                        <span className="text-slate-300 dark:text-slate-600">×</span>
                        <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: t.secondary }} />
                        <span>{t.secondaryName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Active Indicator Checkmark */}
                  {isSelected ? (
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-white shrink-0 shadow-xs"
                      style={{ background: t.gradient }}
                    >
                      <Check className="w-3 h-3 stroke-[2.5]" />
                    </div>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Select
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Day / Night Switch Footer */}
          <div className="pt-3 border-t border-slate-100 dark:border-[#1e293b] flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Mode: <strong className="text-slate-700 dark:text-slate-200 capitalize">{theme}</strong>
            </span>

            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#1e293b] dark:hover:bg-[#283852] text-slate-700 dark:text-slate-200 font-bold transition-colors"
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Daylight</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Night Mode</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* 2. Floating Side Corner Button (Always Visible) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-xl border border-slate-200 dark:border-[#223558] text-slate-800 dark:text-slate-100 shadow-xl hover:shadow-2xl transition-all duration-300 active:scale-95 hover:-translate-y-0.5"
        style={{
          boxShadow: `0 8px 25px -4px rgba(0, 0, 0, 0.25), 0 0 15px ${activeColorTheme.glow1}`,
        }}
        aria-label="Manual theme selection"
        title={`Current Theme: ${activeColorTheme.name} (${activeColorTheme.primaryName} × ${activeColorTheme.secondaryName})`}
      >
        {/* Dual-Color Swatch Circle Indicator */}
        <div
          className="w-5 h-5 rounded-full shadow-xs shrink-0 flex items-center justify-center transition-transform group-hover:rotate-45"
          style={{ background: activeColorTheme.gradient }}
        >
          <span className="text-[10px] select-none">{activeColorTheme.icon}</span>
        </div>

        {/* Text Label */}
        <div className="flex flex-col text-left leading-none">
          <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">
            Theme
          </span>
          <span className="text-xs font-black truncate max-w-[90px] sm:max-w-[110px]">
            {activeColorTheme.name.split(' ')[0]}
          </span>
        </div>

        <Palette className="w-4 h-4 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors ml-0.5" />

        {/* Subtle Ping Dot */}
        <span
          className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: activeColorTheme.secondary }}
        />
      </button>

    </div>
  );
}
