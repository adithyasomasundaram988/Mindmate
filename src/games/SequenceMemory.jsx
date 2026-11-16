import React, { useState, useEffect, useRef } from 'react';
import { Bell, Sparkles, Volume2, RotateCcw } from 'lucide-react';
import GameWrapper from '../components/GameWrapper';

const TILES = [
  { id: 0, label: 'Teal Bell', color: 'bg-teal-500', activeColor: 'bg-teal-300 ring-4 ring-teal-400 scale-105', freq: 440 },
  { id: 1, label: 'Amber Bell', color: 'bg-amber-500', activeColor: 'bg-amber-300 ring-4 ring-amber-400 scale-105', freq: 554 },
  { id: 2, label: 'Sky Bell', color: 'bg-sky-500', activeColor: 'bg-sky-300 ring-4 ring-sky-400 scale-105', freq: 659 },
  { id: 3, label: 'Rose Bell', color: 'bg-rose-500', activeColor: 'bg-rose-300 ring-4 ring-rose-400 scale-105', freq: 880 },
];

export default function SequenceMemory() {
  const [difficulty, setDifficulty] = useState('Gentle');
  const [sequence, setSequence] = useState([]);
  const [playerIndex, setPlayerIndex] = useState(0);
  const [activeTile, setActiveTile] = useState(null);
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);
  const [round, setRound] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('Watch the gentle sequence of bells.');

  const audioCtxRef = useRef(null);

  const getTargetRounds = () => {
    if (difficulty === 'Gentle') return 3;
    if (difficulty === 'Challenge') return 6;
    return 4;
  };

  const playChimeTone = (freq) => {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      if (!audioCtxRef.current) audioCtxRef.current = new AudioContextClass();
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.55);
    } catch {
      // ignore
    }
  };

  const playSequence = (seqToPlay) => {
    setIsPlayingSequence(true);
    setFeedbackMsg('Listening to the bells...');
    let step = 0;

    const interval = setInterval(() => {
      if (step >= seqToPlay.length) {
        clearInterval(interval);
        setActiveTile(null);
        setIsPlayingSequence(false);
        setFeedbackMsg('Your turn: tap the bells in the same order.');
        return;
      }

      const tileId = seqToPlay[step];
      setActiveTile(tileId);
      const tile = TILES.find(t => t.id === tileId);
      if (tile) playChimeTone(tile.freq);

      setTimeout(() => {
        setActiveTile(null);
      }, 550);

      step++;
    }, 950);
  };

  const startRound = (roundNumber, existingSeq = []) => {
    const nextSeq = [...existingSeq, Math.floor(Math.random() * TILES.length)];
    setSequence(nextSeq);
    setPlayerIndex(0);
    setTimeout(() => {
      playSequence(nextSeq);
    }, 600);
  };

  const resetGame = () => {
    setIsComplete(false);
    setRound(1);
    startRound(1, []);
  };

  useEffect(() => {
    resetGame();
  }, [difficulty]);

  const handleTileClick = (tileId) => {
    if (isPlayingSequence || isComplete) return;

    // Flash & chime clicked tile
    setActiveTile(tileId);
    const tile = TILES.find(t => t.id === tileId);
    if (tile) playChimeTone(tile.freq);
    setTimeout(() => setActiveTile(null), 300);

    // Verify
    if (tileId === sequence[playerIndex]) {
      const nextIndex = playerIndex + 1;
      if (nextIndex === sequence.length) {
        // Round passed
        const target = getTargetRounds();
        if (round >= target) {
          setIsComplete(true);
          setFeedbackMsg('Splendid! You completed all bells with grace.');
        } else {
          setFeedbackMsg('Wonderful! Get ready for the next bell.');
          setRound(r => r + 1);
          setTimeout(() => {
            startRound(round + 1, sequence);
          }, 1000);
        }
      } else {
        setPlayerIndex(nextIndex);
      }
    } else {
      // Gentle retry without harsh penalty
      setFeedbackMsg('Almost there! Let\'s listen to the bells once more.');
      setTimeout(() => {
        setPlayerIndex(0);
        playSequence(sequence);
      }, 1000);
    }
  };

  const replaySequence = () => {
    if (!isPlayingSequence && sequence.length > 0) {
      setPlayerIndex(0);
      playSequence(sequence);
    }
  };

  return (
    <GameWrapper
      gameId="sequence-memory"
      gameTitle="Sequence Memory"
      icon={Bell}
      difficulty={difficulty}
      setDifficulty={setDifficulty}
      instructions="Observe the colored bells as they chime in sequence. Tap them back in the same gentle order. You can replay the pattern anytime."
      spokenInstruction="Welcome to Sequence Memory. Watch and listen to the bells as they ring. When they finish, tap the bells in the same order. If you want to listen again, tap Replay Pattern."
      isComplete={isComplete}
      score={100}
      onRestart={resetGame}
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 text-sm">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-600 dark:text-slate-300">
            Step: <span className="font-bold text-teal-600 dark:text-teal-400">{round}</span> of {getTargetRounds()}
          </span>
          <span className="text-slate-400">•</span>
          <span className="font-medium text-slate-500 dark:text-slate-400">
            {feedbackMsg}
          </span>
        </div>

        <button
          onClick={replaySequence}
          disabled={isPlayingSequence}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#162544] dark:hover:bg-[#1c2c4e] text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors disabled:opacity-50"
        >
          <Volume2 className="w-3.5 h-3.5 text-teal-600" />
          Replay Pattern
        </button>
      </div>

      {/* Bell Tiles Grid */}
      <div className="grid grid-cols-2 gap-4 sm:gap-6 max-w-md mx-auto">
        {TILES.map(tile => {
          const isActive = activeTile === tile.id;
          return (
            <button
              key={tile.id}
              onClick={() => handleTileClick(tile.id)}
              disabled={isPlayingSequence}
              className={`h-36 sm:h-44 rounded-3xl flex flex-col items-center justify-center p-4 transition-all duration-200 shadow-md ${
                isActive ? tile.activeColor : `${tile.color} hover:opacity-95`
              } ${isPlayingSequence ? 'cursor-default' : 'cursor-pointer active:scale-95'}`}
              aria-label={tile.label}
            >
              <Bell className="w-10 h-10 text-white mb-2" />
              <span className="text-sm sm:text-base font-bold text-white drop-shadow-sm">
                {tile.label}
              </span>
            </button>
          );
        })}
      </div>
    </GameWrapper>
  );
}
