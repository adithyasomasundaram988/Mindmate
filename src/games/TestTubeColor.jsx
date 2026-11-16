import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  FlaskConical,
  RotateCcw,
  Undo2,
  Sparkles,
  Droplets,
  Leaf,
  Sun,
  Star,
  Flame,
  Gem,
  Waves,
  PlusCircle,
  Trophy,
  CheckCircle2,
  HelpCircle,
  Volume2,
  VolumeX,
  Clock,
  Layers
} from 'lucide-react';
import GameWrapper from '../components/GameWrapper';

// Rich, high-contrast, dual-coded color segments (accessible for colorblind & seniors)
const SEGMENTS = {
  sky: {
    id: 'sky',
    label: 'Azure',
    icon: Droplets,
    color: 'bg-sky-500 text-white',
    border: 'border-sky-400',
    glow: 'rgba(14, 165, 233, 0.45)',
    textColor: 'text-sky-500'
  },
  mint: {
    id: 'mint',
    label: 'Mint',
    icon: Leaf,
    color: 'bg-emerald-500 text-white',
    border: 'border-emerald-400',
    glow: 'rgba(16, 185, 129, 0.45)',
    textColor: 'text-emerald-500'
  },
  coral: {
    id: 'coral',
    label: 'Coral',
    icon: Sun,
    color: 'bg-rose-500 text-white',
    border: 'border-rose-400',
    glow: 'rgba(244, 63, 94, 0.45)',
    textColor: 'text-rose-500'
  },
  gold: {
    id: 'gold',
    label: 'Gold',
    icon: Star,
    color: 'bg-amber-400 text-amber-950 font-black',
    border: 'border-amber-300',
    glow: 'rgba(251, 191, 36, 0.45)',
    textColor: 'text-amber-500'
  },
  violet: {
    id: 'violet',
    label: 'Violet',
    icon: Gem,
    color: 'bg-purple-600 text-white',
    border: 'border-purple-400',
    glow: 'rgba(147, 51, 234, 0.45)',
    textColor: 'text-purple-500'
  },
  tangerine: {
    id: 'tangerine',
    label: 'Tangerine',
    icon: Flame,
    color: 'bg-orange-500 text-white',
    border: 'border-orange-400',
    glow: 'rgba(234, 88, 12, 0.45)',
    textColor: 'text-orange-500'
  },
  cobalt: {
    id: 'cobalt',
    label: 'Cobalt',
    icon: Waves,
    color: 'bg-blue-700 text-white',
    border: 'border-blue-500',
    glow: 'rgba(29, 78, 216, 0.45)',
    textColor: 'text-blue-600'
  }
};

// Five progressive difficulty tiers
const DIFFICULTY_LEVELS = [
  {
    id: 'gentle',
    name: 'Gentle (Easy)',
    capacity: 3,
    colorCount: 3,
    emptyTubes: 1,
    scrambleMoves: 45,
    desc: '3 colors, capacity 3, 4 flasks. Relaxed and quick to solve.',
    difficultyMatch: 'Gentle'
  },
  {
    id: 'regular',
    name: 'Regular (Medium)',
    capacity: 4,
    colorCount: 4,
    emptyTubes: 2,
    scrambleMoves: 75,
    desc: '4 colors, capacity 4, 6 flasks. Classic water sort puzzle.',
    difficultyMatch: 'Regular'
  },
  {
    id: 'tough',
    name: 'Tough Challenge',
    capacity: 4,
    colorCount: 5,
    emptyTubes: 2,
    scrambleMoves: 110,
    desc: '5 colors, capacity 4, 7 flasks. Deeply tangled multi-color bottlenecks.',
    difficultyMatch: 'Challenge'
  },
  {
    id: 'expert',
    name: 'Expert Chemist',
    capacity: 4,
    colorCount: 6,
    emptyTubes: 2,
    scrambleMoves: 155,
    desc: '6 colors, capacity 4, 8 flasks. Requires strategic multi-step foresight.',
    difficultyMatch: 'Challenge'
  },
  {
    id: 'master',
    name: 'Master Alchemist',
    capacity: 4,
    colorCount: 7,
    emptyTubes: 2,
    scrambleMoves: 210,
    desc: '7 colors, capacity 4, 9 flasks. High-complexity laboratory challenge.',
    difficultyMatch: 'Challenge'
  }
];

export default function TestTubeColor() {
  const [difficulty, setDifficulty] = useState('Challenge'); // Default to Challenge / Tough!
  const [selectedTierId, setSelectedTierId] = useState('tough'); // 5 colors, 7 tubes
  const [tubes, setTubes] = useState([]);
  const [selectedTube, setSelectedTube] = useState(null);
  const [history, setHistory] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [moves, setMoves] = useState(0);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [extraTubeAdded, setExtraTubeAdded] = useState(false);
  const [feedbackNotice, setFeedbackNotice] = useState(null);

  const audioCtxRef = useRef(null);

  const currentTier = DIFFICULTY_LEVELS.find(lvl => lvl.id === selectedTierId) || DIFFICULTY_LEVELS[2];
  const TUBE_CAPACITY = currentTier.capacity;

  // Sync with GameWrapper difficulty buttons
  useEffect(() => {
    if (difficulty === 'Gentle') {
      setSelectedTierId('gentle');
    } else if (difficulty === 'Regular') {
      setSelectedTierId('regular');
    } else if (difficulty === 'Challenge') {
      // Keep selected tier if already one of the tough/expert/master tiers, otherwise default to tough
      if (selectedTierId !== 'tough' && selectedTierId !== 'expert' && selectedTierId !== 'master') {
        setSelectedTierId('tough');
      }
    }
  }, [difficulty]);

  // Stopwatch timer
  useEffect(() => {
    if (isComplete) return;
    const timer = setInterval(() => {
      setElapsedSec(s => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isComplete]);

  // Web Audio Synthesizer for Liquid Pour & Glass Clinks
  const playSound = useCallback((type) => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;
      if (type === 'pour') {
        // Water bubbling frequency sweep
        [420, 540, 680, 820].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.04);
          osc.frequency.exponentialRampToValueAtTime(freq * 1.25, now + i * 0.04 + 0.08);
          gain.gain.setValueAtTime(0.12, now + i * 0.04);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + 0.08);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.04);
          osc.stop(now + i * 0.04 + 0.08);
        });
      } else if (type === 'select') {
        // Delicate glass tap
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1100, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.06);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.06);
      } else if (type === 'sealed') {
        // Tube completed celebration chord
        [523.25, 659.25, 783.99].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.06);
          gain.gain.setValueAtTime(0.12, now + i * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.6);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.06);
          osc.stop(now + i * 0.06 + 0.6);
        });
      } else if (type === 'mismatch') {
        // Soft error thud
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(75, now + 0.12);
        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'victory') {
        // Grand victory fanfare
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.09);
          gain.gain.setValueAtTime(0.14, now + i * 0.09);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.9);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.09);
          osc.stop(now + i * 0.09 + 0.9);
        });
      }
    } catch {
      // Audio fallback
    }
  }, [soundEnabled]);

  const showToast = (msg) => {
    setFeedbackNotice(msg);
    setTimeout(() => setFeedbackNotice(null), 2500);
  };

  // Generate 100% Solvable Tangled Test Tube Puzzle using Reverse-Pour Scrambler
  const initTubes = useCallback(() => {
    setSelectedTube(null);
    setHistory([]);
    setIsComplete(false);
    setMoves(0);
    setElapsedSec(0);
    setExtraTubeAdded(false);
    setFeedbackNotice(null);

    const availableKeys = Object.keys(SEGMENTS).slice(0, currentTier.colorCount);
    const capacity = currentTier.capacity;
    const scrambleMoves = currentTier.scrambleMoves || 100;

    // Start with fully solved state: each color in its own tube, plus empty tubes
    let state = [];
    for (let c = 0; c < currentTier.colorCount; c++) {
      state.push(Array(capacity).fill(SEGMENTS[availableKeys[c]]));
    }
    for (let e = 0; e < currentTier.emptyTubes; e++) {
      state.push([]);
    }

    // Scramble via mathematically legal reverse pours
    let lastDst = -1, lastSrc = -1;
    for (let m = 0; m < scrambleMoves; m++) {
      // Find candidate tubes to pop from:
      // In reverse, removing top segment is legal iff remaining tube is either empty OR has identical top color
      let validDsts = [];
      for (let d = 0; d < state.length; d++) {
        if (state[d].length > 0) {
          const top = state[d][state[d].length - 1];
          const next = state[d].length > 1 ? state[d][state[d].length - 2] : null;
          if (next === null || next.id === top.id) {
            validDsts.push(d);
          }
        }
      }

      if (validDsts.length === 0) break;
      validDsts.sort(() => Math.random() - 0.5);

      let moved = false;
      for (const d of validDsts) {
        // Find candidate destination tubes that have space (< capacity)
        let validSrcs = [];
        for (let s = 0; s < state.length; s++) {
          if (s !== d && state[s].length < capacity) {
            if (!(d === lastSrc && s === lastDst)) {
              validSrcs.push(s);
            }
          }
        }

        if (validSrcs.length > 0) {
          const s = validSrcs[Math.floor(Math.random() * validSrcs.length)];
          const seg = state[d].pop();
          state[s].push(seg);
          lastDst = d;
          lastSrc = s;
          moved = true;
          break;
        }
      }

      if (!moved) break;
    }

    // Shuffle the tube rack layout so empty and mixed flasks are dispersed
    state.sort(() => Math.random() - 0.5);

    setTubes(state);
  }, [currentTier]);

  useEffect(() => {
    initTubes();
  }, [initTubes]);

  // Add 1 extra flask lifeline when stuck
  const handleAddExtraFlask = () => {
    if (extraTubeAdded || isComplete) return;
    setTubes(prev => [...prev, []]);
    setExtraTubeAdded(true);
    playSound('select');
    showToast('Extra Empty Flask added! You have more room to maneuver.');
  };

  // Multi-segment Water Sort Pour Logic
  const handleTubeClick = (index) => {
    if (isComplete) return;

    if (selectedTube === null) {
      // Selecting source tube
      if (tubes[index].length > 0) {
        setSelectedTube(index);
        playSound('select');
      }
    } else if (selectedTube === index) {
      // Deselect
      setSelectedTube(null);
    } else {
      // Attempting to pour from selectedTube -> index
      const source = [...tubes[selectedTube]];
      const target = [...tubes[index]];

      if (source.length === 0 || target.length >= TUBE_CAPACITY) {
        setSelectedTube(null);
        return;
      }

      const topSegment = source[source.length - 1];
      const targetTop = target[target.length - 1];

      // Move is allowed if target is empty OR target top color matches
      if (target.length === 0 || targetTop.id === topSegment.id) {
        // Count how many consecutive matching segments on top of source can be poured
        let countMatching = 0;
        for (let i = source.length - 1; i >= 0; i--) {
          if (source[i].id === topSegment.id) countMatching++;
          else break;
        }

        const spaceAvailable = TUBE_CAPACITY - target.length;
        const pourAmount = Math.min(countMatching, spaceAvailable);

        if (pourAmount <= 0) {
          setSelectedTube(null);
          return;
        }

        // Save history for Undo
        setHistory(prev => [...prev, tubes.map(t => [...t])]);
        setMoves(m => m + 1);

        // Perform the pour
        for (let p = 0; p < pourAmount; p++) {
          source.pop();
          target.push(topSegment);
        }

        const newTubes = tubes.map((t, i) => {
          if (i === selectedTube) return source;
          if (i === index) return target;
          return t;
        });

        setTubes(newTubes);
        setSelectedTube(null);
        playSound('pour');

        // Check if this newly filled tube is completely sealed
        if (target.length === TUBE_CAPACITY && target.every(s => s.id === topSegment.id)) {
          playSound('sealed');
        }

        checkCompletion(newTubes);
      } else {
        // Cannot pour onto different color
        playSound('mismatch');
        showToast('Colors do not match! Liquids only blend with the exact same color.');
        if (target.length > 0) {
          setSelectedTube(index); // Switch active selection
        } else {
          setSelectedTube(null);
        }
      }
    }
  };

  // Undo Move
  const handleUndo = () => {
    if (history.length === 0 || isComplete) return;
    const previous = history[history.length - 1];
    setTubes(previous);
    setHistory(h => h.slice(0, -1));
    setSelectedTube(null);
    playSound('select');
  };

  // Check victory condition
  const checkCompletion = (currentTubes) => {
    const allSorted = currentTubes.every(tube => {
      if (tube.length === 0) return true;
      if (tube.length !== TUBE_CAPACITY) return false;
      const firstId = tube[0].id;
      return tube.every(seg => seg.id === firstId);
    });

    if (allSorted) {
      setIsComplete(true);
      playSound('victory');
    }
  };

  // Helper to test if a tube can legally receive pour from active selection
  const isValidPourTarget = (idx) => {
    if (selectedTube === null || selectedTube === idx) return false;
    const source = tubes[selectedTube];
    const target = tubes[idx];
    if (!source || source.length === 0 || !target || target.length >= TUBE_CAPACITY) return false;
    const topSegment = source[source.length - 1];
    const targetTop = target[target.length - 1];
    return target.length === 0 || targetTop.id === topSegment.id;
  };

  // Count fully sorted flasks
  const completedTubesCount = tubes.filter(
    t => t.length === TUBE_CAPACITY && t.every(s => s.id === t[0].id)
  ).length;

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  return (
    <GameWrapper
      gameId="test-tube-color"
      gameTitle="Test Tube Colour Sorting Lab"
      icon={FlaskConical}
      difficulty={difficulty}
      setDifficulty={setDifficulty}
      instructions="Tap a flask to select it, then tap another flask to pour. Liquids only pour onto matching colors or into empty tubes. Sort each color into its own sealed flask."
      spokenInstruction="Welcome to Test Tube Colour Sorting. Select a flask to pick up its liquid, then tap an empty flask or a matching color to pour. Use Undo anytime."
      isComplete={isComplete}
      score={100}
      onRestart={initTubes}
    >
      {/* 1. Difficulty Level Selector & Controls Bar */}
      <div className="space-y-4 mb-6">
        
        {/* Tier Selector: 5 Tiers up to Master */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-2xl bg-slate-100 dark:bg-[#142038] border border-slate-200 dark:border-[#223558]">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-wide">
              Lab Complexity:
            </span>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {DIFFICULTY_LEVELS.map(tier => {
              const isSelected = selectedTierId === tier.id;
              return (
                <button
                  key={tier.id}
                  onClick={() => {
                    setSelectedTierId(tier.id);
                    setDifficulty(tier.difficultyMatch);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all text-center ${
                    isSelected
                      ? 'bg-teal-600 text-white shadow-md ring-2 ring-teal-400/30'
                      : 'bg-white dark:bg-[#0c1527] text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-[#1c2c4e] border border-slate-200 dark:border-[#223558]'
                  }`}
                >
                  {tier.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* HUD Info: Moves, Timer, Completed Flasks & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-2 text-xs font-bold text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <strong className="font-mono text-sm">{formatTime(elapsedSec)}</strong>
            </span>
            <span>Moves: <strong className="font-mono text-sm">{moves}</strong></span>
            <span>Sealed: <strong className="text-emerald-600 dark:text-emerald-400 font-mono text-sm">{completedTubesCount} / {currentTier.colorCount}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            {/* Undo Button */}
            <button
              onClick={handleUndo}
              disabled={history.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#142038] dark:hover:bg-[#1c2c4e] border border-slate-200 dark:border-[#223558] text-slate-700 dark:text-slate-300 transition-colors disabled:opacity-30"
              title="Undo previous pour"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>Undo ({history.length})</span>
            </button>

            {/* +1 Flask Lifeline */}
            <button
              onClick={handleAddExtraFlask}
              disabled={extraTubeAdded || isComplete}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-700 dark:text-amber-300 transition-all disabled:opacity-30"
              title="Add 1 extra empty test tube to solve bottlenecks"
            >
              <PlusCircle className="w-3.5 h-3.5 text-amber-500" />
              <span>{extraTubeAdded ? '+1 Flask Added' : '+1 Extra Flask'}</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-xl border transition-colors ${
                soundEnabled
                  ? 'bg-teal-500/10 border-teal-500/30 text-teal-600 dark:text-teal-400'
                  : 'bg-slate-100 dark:bg-[#142038] border-slate-200 dark:border-[#223558] text-slate-400'
              }`}
              title={soundEnabled ? 'Mute Laboratory Audio' : 'Enable Laboratory Audio'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* Restart Level */}
            <button
              onClick={initTubes}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#142038] dark:hover:bg-[#1c2c4e] border border-slate-200 dark:border-[#223558] text-slate-500 hover:text-slate-800 transition-colors"
              title="Restart Level"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Glass Laboratory Tubes Work Area */}
      <div className="p-6 sm:p-10 rounded-3xl bg-slate-50/80 dark:bg-[#070d19]/90 border border-slate-200 dark:border-[#223558] shadow-inner relative min-h-[380px] flex flex-col justify-center">
        
        {/* Subtle Laboratory Backlight Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-64 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Flasks Row */}
        <div className="flex flex-wrap items-end justify-center gap-3 sm:gap-5 lg:gap-7 py-6 z-10">
          {tubes.map((tube, tIdx) => {
            const isSelected = selectedTube === tIdx;
            const isSealed = tube.length === TUBE_CAPACITY && tube.every(s => s.id === tube[0].id);
            const isValidTarget = isValidPourTarget(tIdx);
            const topSegment = tube[tube.length - 1];

            return (
              <div key={tIdx} className="flex flex-col items-center">
                
                {/* Tube Container Button */}
                <button
                  onClick={() => handleTubeClick(tIdx)}
                  className={`relative flex flex-col-reverse items-center justify-start rounded-b-[36px] rounded-t-xl border-4 transition-all duration-300 select-none p-1.5 ${
                    TUBE_CAPACITY === 3 ? 'w-18 sm:w-20 md:w-22 h-64' : 'w-16 sm:w-20 md:w-22 h-72 sm:h-80'
                  } ${
                    isSelected
                      ? '-translate-y-6 shadow-2xl scale-105 border-teal-500 bg-teal-500/10 rotate-[-2deg]'
                      : isValidTarget
                      ? 'border-emerald-400 bg-emerald-500/10 shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-400/80 animate-pulse'
                      : isSealed
                      ? 'border-emerald-400 dark:border-emerald-500 bg-emerald-500/5 shadow-md shadow-emerald-500/20'
                      : 'border-slate-300/80 dark:border-[#334b77] hover:border-teal-400/80 bg-white/80 dark:bg-[#0c1527]/80 backdrop-blur-sm shadow-sm'
                  }`}
                  style={{
                    boxShadow: isSelected && topSegment
                      ? `0 20px 40px -10px ${topSegment.glow}`
                      : undefined
                  }}
                  aria-label={`Test Tube ${tIdx + 1}`}
                >
                  {/* Subtle Glass Highlight Lip */}
                  <div className="absolute -top-1.5 left-2 right-2 h-1 rounded-full bg-white/40 dark:bg-white/20 pointer-events-none" />

                  {/* Measurement Tick Marks on Side */}
                  <div className="absolute right-1 top-4 bottom-8 flex flex-col justify-between items-end opacity-25 pointer-events-none text-[8px] font-mono select-none">
                    <span>-</span>
                    <span>-</span>
                    <span>-</span>
                    <span>-</span>
                  </div>

                  {/* Liquid Segments inside the Tube */}
                  {tube.map((seg, sIdx) => {
                    const Icon = seg.icon;
                    const isTop = sIdx === tube.length - 1;

                    return (
                      <div
                        key={sIdx}
                        className={`w-full rounded-2xl flex items-center justify-center gap-1.5 shadow-sm mb-1.5 border transition-all ${
                          TUBE_CAPACITY === 3 ? 'h-16' : 'h-14 sm:h-16'
                        } ${seg.color} ${seg.border} ${
                          sIdx === 0 ? 'rounded-b-[26px]' : ''
                        } ${isTop ? 'shadow-inner' : ''}`}
                      >
                        {/* Glossy Liquid Meniscus Gradient */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/30 via-transparent to-black/15 pointer-events-none" />
                        
                        <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5 drop-shadow-sm shrink-0" />
                        <span className="text-[11px] sm:text-xs font-black tracking-tight drop-shadow-sm">
                          {seg.label}
                        </span>
                      </div>
                    );
                  })}

                  {/* Empty Slot Placeholder Outlines */}
                  {Array.from({ length: TUBE_CAPACITY - tube.length }).map((_, emptyIdx) => (
                    <div
                      key={`empty-${emptyIdx}`}
                      className={`w-full rounded-2xl border-2 border-dashed border-slate-200/60 dark:border-[#1c2c4e] mb-1.5 opacity-35 transition-colors ${
                        TUBE_CAPACITY === 3 ? 'h-16' : 'h-14 sm:h-16'
                      } ${
                        emptyIdx === TUBE_CAPACITY - tube.length - 1 && tube.length === 0
                          ? 'rounded-b-[26px]'
                          : ''
                      }`}
                    />
                  ))}

                  {/* Active Selected Badge */}
                  {isSelected && (
                    <div className="absolute -top-3.5 px-2 py-0.5 rounded-full bg-teal-500 text-white text-[9px] font-extrabold flex items-center gap-1 shadow-md">
                      <span>⚡</span>
                      <span>ACTIVE</span>
                    </div>
                  )}

                  {/* Target Pour Indicator Badge */}
                  {isValidTarget && !isSelected && (
                    <div className="absolute -top-3.5 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-extrabold flex items-center gap-1 shadow-md">
                      <span>↓</span>
                      <span>POUR</span>
                    </div>
                  )}

                  {/* Fully Sealed Flask Badge */}
                  {isSealed && (
                    <div className="absolute -top-3.5 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-extrabold flex items-center gap-1 shadow-md">
                      <span>✓</span>
                      <span>SEALED</span>
                    </div>
                  )}
                </button>

                {/* Flask Index Number */}
                <span className="mt-2 text-[11px] font-bold text-slate-400">
                  Flask {tIdx + 1}
                </span>
              </div>
            );
          })}
        </div>

        {/* Floating Notification Toast */}
        {feedbackNotice && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-2xl bg-slate-900/90 text-white border border-amber-500/50 text-xs font-bold shadow-xl animate-scale-up flex items-center gap-2">
            <span>💡</span>
            <span>{feedbackNotice}</span>
          </div>
        )}
      </div>
    </GameWrapper>
  );
}
