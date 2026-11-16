import React, { useState, useEffect, useCallback } from 'react';
import {
  Sparkles,
  Flower2,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Eye,
  HelpCircle,
  Footprints
} from 'lucide-react';
import GameWrapper from '../components/GameWrapper';

// 7x7 Grid: 0 = Path, 1 = Wall
const GENTLE_MAZE = [
  [0, 0, 1, 0, 0, 0, 0],
  [1, 0, 1, 0, 1, 1, 0],
  [0, 0, 0, 0, 1, 0, 0],
  [0, 1, 1, 0, 0, 0, 1],
  [0, 0, 1, 1, 1, 0, 0],
  [1, 0, 0, 0, 1, 1, 0],
  [1, 1, 1, 0, 0, 0, 0],
];

// 9x9 Regular Maze
const REGULAR_MAZE = [
  [0, 0, 0, 1, 0, 0, 0, 1, 0],
  [1, 1, 0, 1, 0, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 1, 1, 0],
  [0, 1, 1, 1, 0, 0, 0, 1, 0],
  [0, 0, 0, 1, 1, 1, 0, 1, 0],
  [1, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 0],
  [0, 1, 0, 0, 0, 0, 0, 1, 0],
  [0, 1, 1, 1, 1, 1, 0, 0, 0],
];

export default function Maze() {
  const [difficulty, setDifficulty] = useState('Gentle');
  const [playerPos, setPlayerPos] = useState([0, 0]);
  const [visited, setVisited] = useState(new Set(['0,0']));
  const [isComplete, setIsComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const mazeGrid = difficulty === 'Gentle' ? GENTLE_MAZE : REGULAR_MAZE;
  const numRows = mazeGrid.length;
  const numCols = mazeGrid[0].length;
  const targetPos = [numRows - 1, numCols - 1];

  const resetMaze = () => {
    setPlayerPos([0, 0]);
    setVisited(new Set(['0,0']));
    setIsComplete(false);
    setShowHint(false);
  };

  useEffect(() => {
    resetMaze();
  }, [difficulty]);

  const movePlayer = useCallback((dr, dc) => {
    if (isComplete) return;
    setPlayerPos(([r, c]) => {
      const nr = r + dr;
      const nc = c + dc;

      // Check bounds and wall
      if (nr >= 0 && nr < numRows && nc >= 0 && nc < numCols && mazeGrid[nr][nc] === 0) {
        setVisited(prev => new Set([...prev, `${nr},${nc}`]));
        if (nr === targetPos[0] && nc === targetPos[1]) {
          setIsComplete(true);
        }
        return [nr, nc];
      }
      return [r, c];
    });
  }, [isComplete, numRows, numCols, mazeGrid, targetPos]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        movePlayer(-1, 0);
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        movePlayer(1, 0);
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        movePlayer(0, -1);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        movePlayer(0, 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePlayer]);

  return (
    <GameWrapper
      gameId="maze"
      gameTitle="Garden Maze"
      icon={Footprints}
      difficulty={difficulty}
      setDifficulty={setDifficulty}
      instructions="Navigate your friendly companion through the garden paths to reach the blooming flower. Use the arrow keys or the large on-screen directional buttons."
      spokenInstruction="Welcome to Garden Maze. Guide your companion to reach the blooming flower. You can use your keyboard arrows or tap the large directional buttons on screen."
      isComplete={isComplete}
      score={100}
      onRestart={resetMaze}
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 text-sm">
        <div className="text-slate-600 dark:text-slate-300 font-medium">
          Start at Top-Left 🐾 • Reach the Flower 🌸
        </div>
        <button
          onClick={() => setShowHint(!showHint)}
          className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#162544] dark:hover:bg-[#1c2c4e] text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors"
        >
          {showHint ? 'Hide Footprint Trail' : 'Show Footprint Trail'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
        
        {/* Maze Grid */}
        <div className="p-3 sm:p-4 rounded-3xl bg-slate-100 dark:bg-[#0c1527] border border-slate-200 dark:border-[#223558] shadow-inner inline-block">
          <div
            className="grid gap-1 sm:gap-1.5"
            style={{ gridTemplateColumns: `repeat(${numCols}, minmax(0, 1fr))` }}
          >
            {mazeGrid.map((row, r) =>
              row.map((cell, c) => {
                const isPlayer = playerPos[0] === r && playerPos[1] === c;
                const isTarget = targetPos[0] === r && targetPos[1] === c;
                const isVisited = visited.has(`${r},${c}`);
                const isWall = cell === 1;

                return (
                  <div
                    key={`${r}-${c}`}
                    className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition-all ${
                      isWall
                        ? 'bg-slate-300 dark:bg-[#1c2c4e] border border-slate-400/40 dark:border-[#223558]'
                        : isPlayer
                        ? 'bg-teal-500 text-white font-bold shadow-md scale-105 z-10'
                        : isTarget
                        ? 'bg-rose-100 dark:bg-rose-950/80 border border-rose-300 text-rose-500'
                        : isVisited && showHint
                        ? 'bg-teal-50 dark:bg-[#162544] border border-teal-200/50 dark:border-teal-900/50'
                        : 'bg-white dark:bg-[#142038] border border-slate-200 dark:border-[#223558]'
                    }`}
                  >
                    {isPlayer ? (
                      <span className="text-xl animate-bounce">🐾</span>
                    ) : isTarget ? (
                      <Flower2 className="w-6 h-6 text-rose-500" />
                    ) : isVisited && showHint ? (
                      <span className="w-2 h-2 rounded-full bg-teal-400/60"></span>
                    ) : null}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Large Touch Directional Pad */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            Touch Directional Controls
          </span>

          <button
            onClick={() => movePlayer(-1, 0)}
            className="w-16 h-14 rounded-2xl bg-teal-600 hover:bg-teal-700 active:scale-95 text-white flex items-center justify-center shadow-md transition-all"
            aria-label="Move Up"
          >
            <ArrowUp className="w-7 h-7" />
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => movePlayer(0, -1)}
              className="w-16 h-14 rounded-2xl bg-teal-600 hover:bg-teal-700 active:scale-95 text-white flex items-center justify-center shadow-md transition-all"
              aria-label="Move Left"
            >
              <ArrowLeft className="w-7 h-7" />
            </button>

            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-[#162544] flex items-center justify-center text-xs font-bold text-slate-500">
              OK
            </div>

            <button
              onClick={() => movePlayer(0, 1)}
              className="w-16 h-14 rounded-2xl bg-teal-600 hover:bg-teal-700 active:scale-95 text-white flex items-center justify-center shadow-md transition-all"
              aria-label="Move Right"
            >
              <ArrowRight className="w-7 h-7" />
            </button>
          </div>

          <button
            onClick={() => movePlayer(1, 0)}
            className="w-16 h-14 rounded-2xl bg-teal-600 hover:bg-teal-700 active:scale-95 text-white flex items-center justify-center shadow-md transition-all"
            aria-label="Move Down"
          >
            <ArrowDown className="w-7 h-7" />
          </button>
        </div>

      </div>
    </GameWrapper>
  );
}
