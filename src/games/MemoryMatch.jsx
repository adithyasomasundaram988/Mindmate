import React, { useState, useEffect } from 'react';
import {
  Coffee,
  Flower2,
  Bird,
  Sun,
  BookOpen,
  TreePine,
  Apple,
  Music,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import GameWrapper from '../components/GameWrapper';

const ALL_CARDS = [
  { id: 'tea', label: 'Warm Tea', icon: Coffee, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/80' },
  { id: 'flower', label: 'Garden Rose', icon: Flower2, color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/80' },
  { id: 'bird', label: 'Morning Bird', icon: Bird, color: 'text-sky-500 bg-sky-50 dark:bg-sky-950/80' },
  { id: 'sun', label: 'Gentle Sunshine', icon: Sun, color: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-950/80' },
  { id: 'book', label: 'Story Book', icon: BookOpen, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/80' },
  { id: 'tree', label: 'Green Pine', icon: TreePine, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/80' },
  { id: 'apple', label: 'Fresh Apple', icon: Apple, color: 'text-red-500 bg-red-50 dark:bg-red-950/80' },
  { id: 'music', label: 'Calm Melody', icon: Music, color: 'text-teal-500 bg-teal-50 dark:bg-teal-950/80' },
];

export default function MemoryMatch() {
  const [difficulty, setDifficulty] = useState('Regular');
  const [deck, setDeck] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedIds, setMatchedIds] = useState(new Set());
  const [moves, setMoves] = useState(0);

  const getPairCount = () => {
    if (difficulty === 'Gentle') return 4;
    if (difficulty === 'Challenge') return 8;
    return 6;
  };

  const setupGame = () => {
    const pairCount = getPairCount();
    const selected = ALL_CARDS.slice(0, pairCount);
    // Duplicate for pairs
    const pairs = [...selected, ...selected].map((item, index) => ({
      ...item,
      uniqueId: `${item.id}-${index}`,
    }));
    // Shuffle
    pairs.sort(() => Math.random() - 0.5);
    setDeck(pairs);
    setFlippedIndices([]);
    setMatchedIds(new Set());
    setMoves(0);
  };

  useEffect(() => {
    setupGame();
  }, [difficulty]);

  const handleCardClick = (index) => {
    // If card already flipped or matched, ignore
    if (flippedIndices.includes(index) || matchedIds.has(deck[index].id)) return;
    if (flippedIndices.length === 2) return;

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const first = deck[newFlipped[0]];
      const second = deck[newFlipped[1]];

      if (first.id === second.id) {
        // Matched
        setMatchedIds(prev => new Set([...prev, first.id]));
        setFlippedIndices([]);
      } else {
        // Not matched, flip back after comfortable senior-friendly delay
        setTimeout(() => {
          setFlippedIndices([]);
        }, 1100);
      }
    }
  };

  const pairCount = getPairCount();
  const isComplete = matchedIds.size === pairCount && pairCount > 0;

  return (
    <GameWrapper
      gameId="memory-match"
      gameTitle="Memory Match"
      icon={Flower2}
      difficulty={difficulty}
      setDifficulty={setDifficulty}
      instructions="Flip cards to find pairs of comforting symbols. Take your time—there is no countdown."
      spokenInstruction="Welcome to Memory Match. Tap any card to reveal its picture, then tap another card to find its matching pair. Relax and enjoy finding each pair at your own pace."
      isComplete={isComplete}
      score={Math.max(50, 100 - moves * 2)}
      onRestart={setupGame}
    >
      <div className="flex items-center justify-between mb-6 px-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
        <div>
          Pairs Found: <span className="text-teal-600 dark:text-teal-400 font-bold">{matchedIds.size}</span> / {pairCount}
        </div>
        <div>
          Gentle Turns: <span className="font-bold text-slate-900 dark:text-white">{moves}</span>
        </div>
      </div>

      {/* Grid of cards */}
      <div className={`grid gap-3 sm:gap-4 ${
        pairCount <= 4
          ? 'grid-cols-2 sm:grid-cols-4'
          : pairCount === 6
          ? 'grid-cols-3 sm:grid-cols-4'
          : 'grid-cols-4'
      }`}>
        {deck.map((card, idx) => {
          const isFlipped = flippedIndices.includes(idx) || matchedIds.has(card.id);
          const isMatched = matchedIds.has(card.id);
          const Icon = card.icon;

          return (
            <button
              key={card.uniqueId}
              onClick={() => handleCardClick(idx)}
              disabled={isFlipped}
              className={`h-28 sm:h-36 rounded-2xl flex flex-col items-center justify-center p-3 text-center transition-all duration-300 transform active:scale-95 border ${
                isFlipped
                  ? `${card.color} border-teal-300 dark:border-teal-700/60 shadow-md`
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-[#162544] dark:hover:bg-[#1e3057] border-slate-200 dark:border-[#223558] text-slate-400 dark:text-slate-500 shadow-sm'
              }`}
              aria-label={isFlipped ? card.label : `Hidden Card ${idx + 1}`}
            >
              {isFlipped ? (
                <>
                  <Icon className="w-8 h-8 sm:w-10 sm:h-10 mb-2 transition-transform duration-200 scale-110" />
                  <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                    {card.label}
                  </span>
                  {isMatched && (
                    <span className="mt-1 text-[10px] text-teal-600 dark:text-teal-400 font-semibold flex items-center gap-0.5">
                      <CheckCircle className="w-3 h-3" /> Pair
                    </span>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-[#111d35] flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-teal-500" />
                  </div>
                  <span className="text-xs font-medium">Card {idx + 1}</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </GameWrapper>
  );
}
