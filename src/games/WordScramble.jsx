import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sparkles,
  Shuffle,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  SpellCheck,
  ArrowRight,
  Heart,
  Volume2,
  VolumeX
} from 'lucide-react';
import GameWrapper from '../components/GameWrapper';

const WORD_BANKS = {
  Easy: [
    { word: 'CALM', clue: 'A serene and quiet state of peace and stillness.' },
    { word: 'HOPE', clue: 'A warm, gentle feeling of optimism and faith.' },
    { word: 'SMILE', clue: 'A kind curve of happiness that lights up your face.' },
    { word: 'WARM', clue: 'Comforting, pleasant temperature like gentle sunshine.' },
    { word: 'ROSES', clue: 'Fragrant sweet blossoms growing along the garden path.' },
    { word: 'PEACE', clue: 'Freedom from worry, deep inner contentment and rest.' },
    { word: 'BIRD', clue: 'A feathered friend singing cheerfully from tree branches.' },
    { word: 'KIND', clue: 'Showing warm consideration, gentleness, and grace.' },
    { word: 'LOVE', clue: 'Affectionate caring bond shared with cherished ones.' },
    { word: 'STAR', clue: 'A sparkling beacon in the twilight night sky.' },
    { word: 'HOME', clue: 'A beloved sanctuary of family, laughter, and comfort.' },
    { word: 'BLUE', clue: 'The tranquil hue of clear skies and peaceful seas.' },
    { word: 'SONG', clue: 'Harmonious music that lifts the heart and mind.' },
  ],
  Medium: [
    { word: 'BREEZE', clue: 'A soft, cooling wind rustling through garden trees.' },
    { word: 'FLOWER', clue: 'A delicate petal blooming vibrantly in springtime.' },
    { word: 'GARDEN', clue: 'A place of green leaves, fresh soil, and quiet.' },
    { word: 'SERENE', clue: 'Calm, untroubled, dignified, and peaceful.' },
    { word: 'SUNSHINE', clue: 'Bright golden light that bathes and warms the day.' },
    { word: 'HEALING', clue: 'Growing healthier, resting, and revitalizing strength.' },
    { word: 'SPRING', clue: 'The joyful season of awakening buds and new life.' },
    { word: 'MEADOW', clue: 'A sunny clearing filled with wild clovers and grass.' },
    { word: 'FRIEND', clue: 'A loyal companion who stands by you with love.' },
    { word: 'STREAM', clue: 'A freshwater brook trickling gently over river stones.' },
    { word: 'CANDLE', clue: 'A flickering flame casting gentle warmth in the evening.' },
    { word: 'TEACUP', clue: 'A comforting porcelain vessel of warm aromatic brew.' },
  ],
  Hard: [
    { word: 'HARMONY', clue: 'Pleasing arrangement, melodious chord, and agreement.' },
    { word: 'PEACEFUL', clue: 'Full of serene stillness, relaxation, and comfort.' },
    { word: 'MEMORIES', clue: 'Cherished moments and stories treasured in our hearts.' },
    { word: 'SANCTUARY', clue: 'A safe, tranquil haven for rest and calm reflection.' },
    { word: 'COMPASSION', clue: 'Deep caring, empathy, and warmth for one another.' },
    { word: 'TRANQUILITY', clue: 'A state of absolute peace and quietude.' },
    { word: 'KINDNESS', clue: 'Selfless gentle acts that bring light to someone’s day.' },
    { word: 'BLOSSOMS', clue: 'Clusters of fragrant flowers heralding rich harvest.' },
    { word: 'GRATITUDE', clue: 'Heartfelt thankfulness for life’s blessings and beauty.' },
    { word: 'SUNLIGHT', clue: 'Warm rays breaking through morning mist with hope.' },
  ],
};

function scrambleWord(word) {
  const letters = word.split('');
  // Ensure the scramble is not identical to original
  for (let i = 0; i < 15; i++) {
    letters.sort(() => Math.random() - 0.5);
    if (letters.join('') !== word) break;
  }
  return letters;
}

const ROUNDS_PER_GAME = 3;

export default function WordScramble() {
  const [difficulty, setDifficulty] = useState('Gentle');
  const diffKey = difficulty === 'Gentle' ? 'Easy' : difficulty === 'Challenge' ? 'Hard' : 'Medium';

  const [sessionWords, setSessionWords] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [targetWordObj, setTargetWordObj] = useState(WORD_BANKS.Easy[0]);
  const [availableLetters, setAvailableLetters] = useState([]);
  const [placedLetters, setPlacedLetters] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [isRoundComplete, setIsRoundComplete] = useState(false);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [score, setScore] = useState(100);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [gameCount, setGameCount] = useState(1);

  const playedWordsRef = useRef(new Set());
  const audioCtxRef = useRef(null);

  const playSound = useCallback((type) => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;
      if (type === 'tap') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(480, now);
        osc.frequency.exponentialRampToValueAtTime(720, now + 0.05);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'correct') {
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.07);
          gain.gain.setValueAtTime(0.12, now + idx * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.6);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.07);
          osc.stop(now + idx * 0.07 + 0.6);
        });
      } else if (type === 'try_again') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.15);
        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
      }
    } catch {
      // Audio fallback
    }
  }, [soundEnabled]);

  // Load a brand new set of non-repeating words whenever a session starts or finishes
  const generateNewSessionWords = useCallback(() => {
    const list = WORD_BANKS[diffKey] || WORD_BANKS.Easy;

    let pool = list.filter(w => !playedWordsRef.current.has(w.word));
    if (pool.length < ROUNDS_PER_GAME) {
      playedWordsRef.current.clear();
      pool = [...list];
    }

    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const chosen = shuffled.slice(0, ROUNDS_PER_GAME);
    chosen.forEach(w => playedWordsRef.current.add(w.word));

    setSessionWords(chosen);
    setCurrentRound(0);
    setIsGameComplete(false);

    if (chosen.length > 0) {
      setupRound(chosen[0]);
    }
  }, [diffKey]);

  const setupRound = (item) => {
    setTargetWordObj(item);
    const letterObjects = scrambleWord(item.word).map((char, idx) => ({
      id: `${char}-${idx}-${Date.now()}-${Math.random()}`,
      char,
    }));
    setAvailableLetters(letterObjects);
    setPlacedLetters([]);
    setFeedback(null);
    setIsRoundComplete(false);
  };

  useEffect(() => {
    generateNewSessionWords();
  }, [diffKey, generateNewSessionWords]);

  const handleSelectLetter = (letterObj) => {
    if (isRoundComplete || isGameComplete) return;
    playSound('tap');
    setPlacedLetters(prev => [...prev, letterObj]);
    setAvailableLetters(prev => prev.filter(item => item.id !== letterObj.id));
    setFeedback(null);
  };

  const handleReturnLetter = (letterObj) => {
    if (isRoundComplete || isGameComplete) return;
    playSound('tap');
    setPlacedLetters(prev => prev.filter(item => item.id !== letterObj.id));
    setAvailableLetters(prev => [...prev, letterObj]);
    setFeedback(null);
  };

  const handleShuffle = () => {
    if (isRoundComplete || isGameComplete || availableLetters.length <= 1) return;
    playSound('tap');
    setAvailableLetters(prev => [...prev].sort(() => Math.random() - 0.5));
  };

  const handleHint = () => {
    if (isRoundComplete || isGameComplete || !targetWordObj) return;
    const nextIndex = placedLetters.length;
    if (nextIndex >= targetWordObj.word.length) return;

    const neededChar = targetWordObj.word[nextIndex];
    const found = availableLetters.find(item => item.char === neededChar);

    if (found) {
      handleSelectLetter(found);
    } else {
      const wrongIndex = placedLetters.findIndex((item, idx) => item.char !== targetWordObj.word[idx]);
      if (wrongIndex !== -1) {
        handleReturnLetter(placedLetters[wrongIndex]);
      }
    }
  };

  const handleCheckAnswer = () => {
    if (isRoundComplete || isGameComplete || !targetWordObj) return;

    const currentSpelling = placedLetters.map(item => item.char).join('');
    if (currentSpelling === targetWordObj.word) {
      setIsRoundComplete(true);
      playSound('correct');
      setFeedback({
        type: 'success',
        msg: `Splendid! You unscrambled "${targetWordObj.word}" perfectly.`
      });

      setTimeout(() => {
        if (currentRound + 1 >= sessionWords.length) {
          setIsGameComplete(true);
        } else {
          const next = currentRound + 1;
          setCurrentRound(next);
          if (sessionWords[next]) {
            setupRound(sessionWords[next]);
          }
        }
      }, 1300);
    } else {
      playSound('try_again');
      setFeedback({
        type: 'try_again',
        msg: 'Not quite in order yet. Tap any letter to return it, or tap Shuffle to try again.'
      });
    }
  };

  const handleRestart = () => {
    setGameCount(g => g + 1);
    generateNewSessionWords(); // Always pulls brand new words and clues!
  };

  return (
    <GameWrapper
      gameId="word-scramble"
      gameTitle="Word Scramble"
      icon={SpellCheck}
      difficulty={difficulty}
      setDifficulty={setDifficulty}
      instructions="Rearrange the scrambled letters into the correct comforting word. A brand new set of words is prepared every time you play."
      spokenInstruction="Welcome to Word Scramble. Read the clue, then tap the letter tiles below in order to spell the word. Tap Check Answer when you are ready."
      isComplete={isGameComplete}
      score={score}
      onRestart={handleRestart}
    >
      {/* Top HUD status */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 p-3 rounded-2xl bg-slate-100 dark:bg-[#142038] border border-slate-200 dark:border-[#223558] text-xs font-bold text-slate-700 dark:text-slate-300">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>
              Round <strong className="text-teal-600 dark:text-teal-400 font-mono text-sm">{currentRound + 1}</strong> of {sessionWords.length || ROUNDS_PER_GAME}
            </span>
          </div>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <span className="text-slate-500 dark:text-slate-400">
            Game #{gameCount} • Fresh Words
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-1.5 rounded-xl border transition-colors ${
              soundEnabled
                ? 'bg-teal-500/10 border-teal-500/30 text-teal-600 dark:text-teal-400'
                : 'bg-white dark:bg-[#0c1527] border-slate-200 dark:border-[#223558] text-slate-400'
            }`}
            title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Shuffle button */}
          <button
            onClick={handleShuffle}
            disabled={isRoundComplete || availableLetters.length <= 1}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white dark:bg-[#0c1527] border border-slate-200 dark:border-[#223558] text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors disabled:opacity-40"
          >
            <Shuffle className="w-3.5 h-3.5 text-sky-500" />
            <span>Shuffle</span>
          </button>

          {/* Hint button */}
          <button
            onClick={handleHint}
            disabled={isRoundComplete}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/80 dark:hover:bg-amber-900 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs font-bold transition-colors disabled:opacity-40"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>Hint</span>
          </button>

          {/* New Words */}
          <button
            onClick={handleRestart}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white dark:bg-[#0c1527] border border-slate-200 dark:border-[#223558] text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/40 transition-colors shadow-sm text-xs font-bold"
            title="Load brand new words"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Set</span>
          </button>
        </div>
      </div>

      {/* Clue Card */}
      {targetWordObj && (
        <div className="max-w-lg mx-auto mb-8 p-6 rounded-3xl bg-teal-50/80 dark:bg-[#162544] border-2 border-teal-200/80 dark:border-[#253961] text-center shadow-md">
          <span className="text-xs font-extrabold text-teal-700 dark:text-teal-300 uppercase tracking-widest block mb-1">
            Word Clue
          </span>
          <p className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100">
            "{targetWordObj.clue}"
          </p>
        </div>
      )}

      {/* Word Placement Slots */}
      {targetWordObj && (
        <div className="max-w-lg mx-auto mb-8">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 min-h-[72px] p-3 rounded-2xl bg-white/60 dark:bg-[#0c1527]/60 border-2 border-dashed border-teal-300/80 dark:border-[#223558]">
            {Array.from({ length: targetWordObj.word.length }).map((_, idx) => {
              const placed = placedLetters[idx];
              return (
                <button
                  key={idx}
                  onClick={() => placed && handleReturnLetter(placed)}
                  className={`w-12 h-14 sm:w-14 sm:h-16 rounded-2xl font-black text-xl sm:text-2xl flex items-center justify-center transition-all ${
                    placed
                      ? isRoundComplete
                        ? 'bg-emerald-500 text-white shadow-md scale-105 ring-2 ring-emerald-300'
                        : 'bg-teal-600 text-white shadow-md hover:scale-105 active:scale-95'
                      : 'bg-slate-100/80 dark:bg-[#142038] text-slate-400 border border-slate-200 dark:border-[#223558]'
                  }`}
                  disabled={isRoundComplete || !placed}
                  aria-label={placed ? `Slot ${idx + 1}: ${placed.char}` : `Empty slot ${idx + 1}`}
                >
                  {placed ? placed.char : ''}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Available Letters Pool */}
      <div className="max-w-lg mx-auto mb-8 text-center">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
          Available Scrambled Letters:
        </span>
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {availableLetters.map(letterObj => (
            <button
              key={letterObj.id}
              onClick={() => handleSelectLetter(letterObj)}
              disabled={isRoundComplete}
              className="w-12 h-14 sm:w-14 sm:h-16 rounded-2xl bg-white dark:bg-[#142038] hover:bg-teal-50 dark:hover:bg-[#1c2c4e] border-2 border-slate-300 dark:border-[#334b77] text-slate-800 dark:text-white font-black text-xl sm:text-2xl flex items-center justify-center shadow-md active:scale-95 transition-all hover:border-teal-500 disabled:opacity-30"
            >
              {letterObj.char}
            </button>
          ))}
        </div>
      </div>

      {/* Action / Check Button */}
      <div className="max-w-sm mx-auto mb-6">
        <button
          onClick={handleCheckAnswer}
          disabled={placedLetters.length !== (targetWordObj?.word.length || 0) || isRoundComplete}
          className="w-full py-3.5 px-6 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-lg shadow-teal-600/30 transition-all active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>Check Answer</span>
        </button>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`max-w-md mx-auto p-4 rounded-2xl text-center text-sm font-semibold transition-all shadow-md animate-scale-up ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30'
              : 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/30'
          }`}
        >
          {feedback.msg}
        </div>
      )}
    </GameWrapper>
  );
}
