import React, { useState, useEffect, useRef } from 'react';
import {
  Wind,
  Music,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  Heart,
  CheckCircle2,
  RotateCcw,
  Bell,
  BellOff,
  Plus,
  Minus
} from 'lucide-react';
import { useAudio } from '../contexts/AudioContext';
import { useActivity } from '../contexts/ActivityContext';
import { useLanguage } from '../contexts/LanguageContext';

// Clinically tested, natural breathing modes
const MODES = [
  {
    id: 'normal',
    name: 'Normal Calm',
    badge: 'Realistic & Natural',
    desc: '4 seconds in, 4 seconds out. The gold standard for everyday natural relaxation without holding your breath.',
    icon: '🌿',
    tag: 'Recommended',
    phases: [
      { id: 'inhale', name: 'Breathe In', sub: 'Inhale gently through your nose', sec: 4 },
      { id: 'exhale', name: 'Breathe Out', sub: 'Release softly through your mouth', sec: 4 }
    ]
  },
  {
    id: 'gentle',
    name: 'Gentle Quick',
    badge: '3-Second Rhythm',
    desc: '3 seconds in, 3 seconds out. Light, effortless, and fast pace for immediate refreshment.',
    icon: '⚡',
    tag: 'Easy & Fast',
    phases: [
      { id: 'inhale', name: 'Breathe In', sub: 'Breathe in easily', sec: 3 },
      { id: 'exhale', name: 'Breathe Out', sub: 'Let it flow out smoothly', sec: 3 }
    ]
  },
  {
    id: 'deep',
    name: 'Deep Calm',
    badge: '5-Second Rhythm',
    desc: '5 seconds in, 5 seconds out. Expanded lung volume that naturally lowers stress and heart rate.',
    icon: '🌊',
    tag: 'Deep Breath',
    phases: [
      { id: 'inhale', name: 'Breathe In', sub: 'Fill chest and belly slowly', sec: 5 },
      { id: 'exhale', name: 'Breathe Out', sub: 'Slow, steady release', sec: 5 }
    ]
  },
  {
    id: 'box',
    name: 'Box Breathing',
    badge: '4-4-4-4 Square',
    desc: '4s in, 4s hold, 4s out, 4s hold. Equal 4-part square cycle used for mental clarity and nervous system control.',
    icon: '🟦',
    tag: 'Focus Reset',
    phases: [
      { id: 'inhale', name: 'Breathe In', sub: 'Inhale deeply', sec: 4 },
      { id: 'hold1', name: 'Hold Gently', sub: 'Keep lungs comfortably full', sec: 4 },
      { id: 'exhale', name: 'Breathe Out', sub: 'Exhale completely', sec: 4 },
      { id: 'hold2', name: 'Rest & Pause', sub: 'Wait quietly before next breath', sec: 4 }
    ]
  },
  {
    id: 'sleep478',
    name: 'Sleep 4-7-8',
    badge: 'Nighttime Sleep',
    desc: '4s in, 7s hold, 8s out. Classical long-hold sedative technique for falling asleep.',
    icon: '🌙',
    tag: 'Bedtime',
    phases: [
      { id: 'inhale', name: 'Breathe In', sub: 'Inhale quietly through nose', sec: 4 },
      { id: 'hold1', name: 'Hold Breath', sub: 'Hold gently and stay relaxed', sec: 7 },
      { id: 'exhale', name: 'Breathe Out', sub: 'Exhale completely with soft whoosh', sec: 8 }
    ]
  },
  {
    id: 'custom',
    name: 'Custom Timing',
    badge: 'Set Your Own Seconds',
    desc: 'Choose your own custom seconds for Breathe In and Breathe Out to match your personal comfort.',
    icon: '⚙️',
    tag: 'Custom',
    phases: [] // Generated dynamically based on customInhale / customExhale
  }
];

export default function RelaxationHub() {
  const {
    ambientEnabled,
    setAmbientEnabled,
    ambientTrack,
    setAmbientTrack,
    ambientVol,
    setAmbientVol
  } = useAudio();
  const { recordActivity } = useActivity();
  const { t } = useLanguage();

  // Selected Mode
  const [selectedModeId, setSelectedModeId] = useState('normal');
  const [customInhale, setCustomInhale] = useState(4);
  const [customExhale, setCustomExhale] = useState(4);

  // Breathing State
  const [breathingActive, setBreathingActive] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(4);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [audioChimesEnabled, setAudioChimesEnabled] = useState(true);
  const [savedNotice, setSavedNotice] = useState(false);

  // Audio Context Ref
  const audioCtxRef = useRef(null);
  const recordActivityRef = useRef(recordActivity);
  useEffect(() => {
    recordActivityRef.current = recordActivity;
  }, [recordActivity]);

  // Compute active phases
  const getPhasesForMode = (modeId) => {
    if (modeId === 'custom') {
      return [
        { id: 'inhale', name: 'Breathe In', sub: 'Inhale gently through your nose', sec: customInhale },
        { id: 'exhale', name: 'Breathe Out', sub: 'Release softly through your mouth', sec: customExhale }
      ];
    }
    const found = MODES.find(m => m.id === modeId) || MODES[0];
    return found.phases;
  };

  const currentPhases = getPhasesForMode(selectedModeId);
  const currentPhase = currentPhases[phaseIndex] || currentPhases[0];
  const activeMode = MODES.find(m => m.id === selectedModeId) || MODES[0];

  // Soft Chime Synthesizer
  const playChime = (phaseType) => {
    if (!audioChimesEnabled) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      let freq = 528; // Inhale pitch
      if (phaseType === 'exhale') freq = 396; // Exhale pitch
      else if (phaseType.includes('hold')) freq = 432; // Hold pitch

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.07, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.9);
    } catch {
      // Audio fallback
    }
  };

  // Main 1-Second Precision Timer Loop
  useEffect(() => {
    if (!breathingActive) return;

    const interval = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          // Switch to next phase
          const nextIdx = (phaseIndex + 1) % currentPhases.length;
          setPhaseIndex(nextIdx);

          // If completing full round (returned to index 0)
          if (nextIdx === 0) {
            setCompletedCycles(c => {
              const updated = c + 1;
              if (updated % 3 === 0 && recordActivityRef.current) {
                recordActivityRef.current({
                  gameId: 'breathing',
                  gameTitle: 'Calm Breathing Mindfulness',
                  difficulty: activeMode.name,
                  durationSec: 60,
                  score: 100,
                });
              }
              return updated;
            });
          }

          const nextSec = currentPhases[nextIdx].sec;
          playChime(currentPhases[nextIdx].id);
          return nextSec;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [breathingActive, phaseIndex, currentPhases, activeMode.name, audioChimesEnabled]);

  // Mode Selection Handler
  const handleSelectMode = (modeId) => {
    setSelectedModeId(modeId);
    setPhaseIndex(0);
    const phases = getPhasesForMode(modeId);
    setSecondsRemaining(phases[0].sec);
  };

  // Quick Pace Shortcut (3s, 4s, 5s)
  const handleSetQuickPace = (sec) => {
    if (sec === 3) handleSelectMode('gentle');
    else if (sec === 4) handleSelectMode('normal');
    else if (sec === 5) handleSelectMode('deep');
  };

  // Toggle Start / Pause
  const handleTogglePlay = () => {
    if (!breathingActive) {
      setBreathingActive(true);
      playChime(currentPhase.id);
    } else {
      setBreathingActive(false);
    }
  };

  // Reset Session
  const handleReset = () => {
    setBreathingActive(false);
    setPhaseIndex(0);
    const phases = getPhasesForMode(selectedModeId);
    setSecondsRemaining(phases[0].sec);
    setCompletedCycles(0);
  };

  // Save to Activity
  const handleSaveToHistory = () => {
    if (recordActivityRef.current) {
      recordActivityRef.current({
        gameId: 'breathing',
        gameTitle: 'Calm Breathing Mindfulness',
        difficulty: activeMode.name,
        durationSec: Math.max(30, completedCycles * 10),
        score: 100,
      });
    }
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3500);
  };

  // Diaphragm Visual Scaling & Coloring
  const isExpanding = currentPhase.id === 'inhale';
  const isHolding = currentPhase.id.includes('hold');
  const isDeflating = currentPhase.id === 'exhale';

  const soundscapes = [
    { id: 'alpha', name: 'Alpha Waves (10 Hz)', desc: 'Soothing binaural harmonic pad for gentle focus and everyday relaxation.' },
    { id: 'theta', name: 'Theta Waves (6 Hz)', desc: 'Warm deep relaxation tones inspired by peaceful rest and calm reflection.' },
    { id: 'ocean', name: 'Ocean Tide Breeze', desc: 'Gentle, filtered soft sea waves rolling quietly against the shore.' },
    { id: 'chimes', name: 'Garden Windchimes', desc: 'Serene pentatonic chimes with a warm fundamental ambient background.' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 text-xs font-bold shadow-xs">
          <Wind className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <span>Rest & Mindful Sanctuary</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Calm & Relaxation Hub
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed">
          Soothe your mind with realistic breathing rhythms, clear visual guidance, and peaceful ambient soundscapes.
        </p>
      </div>

      {/* Main Guided Breathing Container */}
      <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#142038] border border-slate-200 dark:border-[#223558] shadow-xl text-center relative overflow-hidden">
        
        {/* Subtle Ambient Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-gradient-to-b from-teal-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Top Mode Header & Quick Pace Shortcuts */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-[#223558]">
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{activeMode.icon}</span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {activeMode.name}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/15 text-teal-700 dark:text-teal-300 text-xs font-bold">
                {activeMode.badge}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {activeMode.desc}
            </p>
          </div>

          {/* Quick Pace Buttons (3s / 4s / 5s) & Chimes Toggle */}
          <div className="flex items-center gap-2">
            <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-[#0c1527] border border-slate-200 dark:border-[#223558] text-xs font-bold">
              <button
                onClick={() => handleSetQuickPace(3)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedModeId === 'gentle'
                    ? 'bg-white dark:bg-[#1c2c4e] text-teal-700 dark:text-teal-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                3s Quick
              </button>
              <button
                onClick={() => handleSetQuickPace(4)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedModeId === 'normal'
                    ? 'bg-white dark:bg-[#1c2c4e] text-teal-700 dark:text-teal-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                4s Normal
              </button>
              <button
                onClick={() => handleSetQuickPace(5)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedModeId === 'deep'
                    ? 'bg-white dark:bg-[#1c2c4e] text-teal-700 dark:text-teal-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                5s Deep
              </button>
            </div>

            <button
              onClick={() => setAudioChimesEnabled(!audioChimesEnabled)}
              className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                audioChimesEnabled
                  ? 'bg-teal-50 border-teal-300 text-teal-700 dark:bg-teal-950/60 dark:border-teal-700 dark:text-teal-300'
                  : 'bg-slate-50 border-slate-200 text-slate-500 dark:bg-[#0c1527] dark:border-[#223558]'
              }`}
              title="Toggle audio chimes on breath transition"
            >
              {audioChimesEnabled ? <Bell className="w-4 h-4 text-teal-600 dark:text-teal-400" /> : <BellOff className="w-4 h-4 text-slate-400" />}
              <span className="hidden md:inline">{audioChimesEnabled ? 'Chimes ON' : 'Chimes OFF'}</span>
            </button>
          </div>
        </div>

        {/* Breathing Rhythm Cards Grid */}
        <div className="py-6">
          <label className="block text-left text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Select Breathing Mode:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {MODES.map(m => {
              const isSelected = selectedModeId === m.id;
              const timingPreview = m.id === 'custom'
                ? `${customInhale}s In • ${customExhale}s Out`
                : m.id === 'box'
                ? '4s-4s-4s-4s'
                : m.id === 'sleep478'
                ? '4s-7s-8s'
                : `${m.phases[0].sec}s In • ${m.phases[1].sec}s Out`;

              return (
                <button
                  key={m.id}
                  onClick={() => handleSelectMode(m.id)}
                  className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-teal-50 dark:bg-[#162544] border-teal-500 shadow-md ring-2 ring-teal-400/40'
                      : 'bg-slate-50 dark:bg-[#0c1527] border-slate-200 dark:border-[#223558] hover:bg-slate-100 dark:hover:bg-[#1a2846]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xl">{m.icon}</span>
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        isSelected ? 'bg-teal-600 text-white' : 'bg-slate-200 dark:bg-[#1c2c4e] text-slate-600 dark:text-slate-300'
                      }`}>
                        {timingPreview}
                      </span>
                    </div>
                    <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-tight">
                      {m.name}
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                    {m.badge}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Custom Inhale / Exhale Steppers if 'custom' is active */}
          {selectedModeId === 'custom' && (
            <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-[#0c1527] border border-slate-200 dark:border-[#223558] max-w-md mx-auto flex items-center justify-around gap-4 animate-fade-in">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 block">Breathe In</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const val = Math.max(2, customInhale - 1);
                      setCustomInhale(val);
                      if (phaseIndex === 0) setSecondsRemaining(val);
                    }}
                    className="w-8 h-8 rounded-lg bg-white dark:bg-[#142038] border border-slate-200 dark:border-[#223558] flex items-center justify-center font-bold"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono font-bold text-base text-slate-900 dark:text-white w-8 text-center">{customInhale}s</span>
                  <button
                    onClick={() => {
                      const val = Math.min(8, customInhale + 1);
                      setCustomInhale(val);
                      if (phaseIndex === 0) setSecondsRemaining(val);
                    }}
                    className="w-8 h-8 rounded-lg bg-white dark:bg-[#142038] border border-slate-200 dark:border-[#223558] flex items-center justify-center font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 block">Breathe Out</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const val = Math.max(2, customExhale - 1);
                      setCustomExhale(val);
                      if (phaseIndex === 1) setSecondsRemaining(val);
                    }}
                    className="w-8 h-8 rounded-lg bg-white dark:bg-[#142038] border border-slate-200 dark:border-[#223558] flex items-center justify-center font-bold"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono font-bold text-base text-slate-900 dark:text-white w-8 text-center">{customExhale}s</span>
                  <button
                    onClick={() => {
                      const val = Math.min(10, customExhale + 1);
                      setCustomExhale(val);
                      if (phaseIndex === 1) setSecondsRemaining(val);
                    }}
                    className="w-8 h-8 rounded-lg bg-white dark:bg-[#142038] border border-slate-200 dark:border-[#223558] flex items-center justify-center font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Central Fluid Diaphragm & Animation Sphere */}
        <div className="relative py-8 sm:py-12 flex flex-col items-center justify-center">
          
          {/* Animated Glowing Outer Aura */}
          <div
            className={`absolute w-72 h-72 sm:w-80 sm:h-80 rounded-full blur-3xl transition-all duration-1000 ease-in-out ${
              breathingActive
                ? isExpanding
                  ? 'bg-teal-400/25 scale-125'
                  : isHolding
                  ? 'bg-indigo-400/25 scale-110'
                  : 'bg-sky-400/25 scale-90'
                : 'bg-teal-500/10 scale-95'
            }`}
          />

          {/* Central Smooth Lung Orb */}
          <div
            className={`relative rounded-full flex flex-col items-center justify-center text-white shadow-2xl transition-all duration-1000 ease-in-out z-10 p-6 select-none ${
              breathingActive
                ? isExpanding
                  ? 'bg-gradient-to-tr from-teal-500 to-emerald-400 scale-115 shadow-teal-500/40'
                  : isHolding
                  ? 'bg-gradient-to-tr from-indigo-500 to-purple-400 scale-105 shadow-indigo-500/40'
                  : 'bg-gradient-to-tr from-sky-500 to-teal-400 scale-85 shadow-sky-500/40'
                : 'bg-gradient-to-tr from-teal-600 to-cyan-600 scale-95 shadow-md'
            }`}
            style={{
              width: '220px',
              height: '220px',
            }}
          >
            {breathingActive ? (
              <div className="space-y-1">
                <div className="text-xs uppercase font-extrabold tracking-widest text-white/90">
                  {currentPhase.name}
                </div>
                <div className="text-6xl font-black font-mono tracking-tight drop-shadow-md">
                  {secondsRemaining}s
                </div>
                <div className="text-[11px] text-white/80 font-medium max-w-[160px] mx-auto leading-tight">
                  {currentPhase.sub}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Wind className="w-12 h-12 mx-auto text-white/90 animate-pulse" />
                <div className="text-base font-extrabold tracking-wide">Ready to Relax</div>
                <div className="text-xs text-white/75">
                  {currentPhase.sec}s In • {currentPhases[1]?.sec || currentPhase.sec}s Out
                </div>
              </div>
            )}
          </div>

          {/* Dynamic Guidance Caption Below Orb */}
          <div className="mt-6 max-w-sm mx-auto">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {breathingActive ? currentPhase.name : 'Take a Mindful Breath'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {breathingActive
                ? currentPhase.sub
                : 'Choose your rhythm and press Start Breathing whenever you are ready.'}
            </p>
          </div>

          {/* Main Controls */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleTogglePlay}
              className={`px-8 py-4 rounded-2xl font-extrabold text-sm sm:text-base shadow-lg transition-all active:scale-95 flex items-center gap-2.5 ${
                breathingActive
                  ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/25 ring-2 ring-rose-400/40'
                  : 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/30'
              }`}
            >
              {breathingActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
              <span>{breathingActive ? 'Pause Exercise' : 'Start Breathing'}</span>
            </button>

            <button
              onClick={handleReset}
              className="p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-[#0c1527] dark:hover:bg-[#1a2846] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#223558] transition-colors"
              title="Reset counter & seconds"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            {completedCycles > 0 && (
              <button
                onClick={handleSaveToHistory}
                className="px-5 py-3.5 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold text-sm border border-emerald-500/30 transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Save {completedCycles} Cycles to History</span>
              </button>
            )}
          </div>

          {/* Session Metrics Bar */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-md text-center">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0c1527] border border-slate-200 dark:border-[#223558]">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Cycles Completed</span>
              <span className="text-lg font-black text-slate-800 dark:text-slate-100">{completedCycles}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0c1527] border border-slate-200 dark:border-[#223558]">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Current Cadence</span>
              <span className="text-lg font-black text-teal-600 dark:text-teal-400">
                {currentPhase.sec}s {currentPhase.name.toLowerCase()}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0c1527] border border-slate-200 dark:border-[#223558] col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Sound Cues</span>
              <span className="text-lg font-black text-slate-800 dark:text-slate-100">
                {audioChimesEnabled ? 'Active 🔔' : 'Muted 🔕'}
              </span>
            </div>
          </div>

          {/* Toast on Activity Record */}
          {savedNotice && (
            <div className="mt-4 p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Breathing session successfully saved to your wellness history!</span>
            </div>
          )}
        </div>
      </div>

      {/* Ambient Soundscapes Synthesizer Player */}
      <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#142038] border border-slate-200 dark:border-[#223558] shadow-sm space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Music className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                Ambient Soundscape Player
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Low-volume peaceful sound frequencies synthesized directly in your browser without ads or external audio streams.
            </p>
          </div>

          <button
            onClick={() => setAmbientEnabled(!ambientEnabled)}
            className={`px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shadow-sm ${
              ambientEnabled
                ? 'bg-rose-500 text-white hover:bg-rose-600'
                : 'bg-teal-600 hover:bg-teal-700 text-white'
            }`}
          >
            {ambientEnabled ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{ambientEnabled ? 'Stop Soundscape' : 'Play Soundscape'}</span>
          </button>
        </div>

        {/* Volume Slider */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0c1527] border border-slate-200 dark:border-[#223558] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Volume2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Soundscape Volume: {Math.round(ambientVol * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={ambientVol}
            onChange={(e) => setAmbientVol(parseFloat(e.target.value))}
            className="w-full sm:w-64 accent-teal-600 cursor-pointer"
            aria-label="Soundscape Volume"
          />
        </div>

        {/* Track Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {soundscapes.map(track => {
            const isSelected = ambientTrack === track.id;
            return (
              <button
                key={track.id}
                onClick={() => {
                  setAmbientTrack(track.id);
                  if (!ambientEnabled) setAmbientEnabled(true);
                }}
                className={`p-6 rounded-2xl border text-left transition-all ${
                  isSelected && ambientEnabled
                    ? 'bg-teal-50 dark:bg-[#162544] border-teal-500 ring-2 ring-teal-400 shadow-sm'
                    : isSelected
                    ? 'bg-slate-50 dark:bg-[#111d35] border-teal-300 dark:border-[#334b77]'
                    : 'bg-white dark:bg-[#0c1527] border-slate-200 dark:border-[#223558] hover:bg-slate-50 dark:hover:bg-[#162544]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-base text-slate-900 dark:text-white">
                    {track.name}
                  </h4>
                  {isSelected && ambientEnabled && (
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-ping"></span>
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {track.desc}
                </p>
              </button>
            );
          })}
        </div>

        {/* Smart Audio Coordination Notice */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0c1527] text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          <strong>Smart Audio Coordination:</strong> When you tap &quot;Listen&quot; on any game instructions, the ambient soundscape volume automatically ducks to 15% so spoken instructions are crystal clear.
        </div>
      </div>

    </div>
  );
}
