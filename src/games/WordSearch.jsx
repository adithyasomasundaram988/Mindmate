import React, { useState, useRef, useCallback } from 'react';
import {
  Search,
  CheckCircle2,
  Lightbulb,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX
} from 'lucide-react';
import GameWrapper from '../components/GameWrapper';

// Rich thematic word pools across all 3 modes
const THEMES_BY_DIFFICULTY = {
  Gentle: [
    {
      theme: 'Morning Serenity',
      words: ['TEA', 'WARM', 'CALM', 'MUG', 'TOAST', 'HONEY', 'BREAD', 'BOWL', 'MILK', 'SPOON'],
    },
    {
      theme: 'Garden Flowers',
      words: ['ROSE', 'TULIP', 'DAISY', 'LILY', 'FERN', 'LEAF', 'STEM', 'BUD', 'IRIS', 'PETAL'],
    },
    {
      theme: 'Sunny Skies',
      words: ['SUN', 'STAR', 'BLUE', 'SKY', 'GOLD', 'GLOW', 'BEAM', 'DAWN', 'RAY', 'LIGHT'],
    },
    {
      theme: 'Sweet Songbirds',
      words: ['BIRD', 'DOVE', 'NEST', 'WING', 'SONG', 'ROBIN', 'CHIRP', 'LARK', 'SWAN', 'BEAK'],
    },
    {
      theme: 'Peaceful Rest',
      words: ['REST', 'SAFE', 'SOFT', 'SLOW', 'EASY', 'PEACE', 'SLEEP', 'QUIET', 'STILL', 'PAUSE'],
    },
    {
      theme: 'Loving Heart',
      words: ['LOVE', 'HOPE', 'KIND', 'CARE', 'GOOD', 'DEAR', 'TRUE', 'SMILE', 'JOY', 'PURE'],
    },
    {
      theme: 'Cozy Home',
      words: ['HOME', 'BOOK', 'WOOL', 'LAMP', 'RUG', 'FIRE', 'NOOK', 'ROOM', 'DOOR', 'COZY'],
    },
    {
      theme: 'Spring Pond',
      words: ['RAIN', 'POND', 'DUCK', 'FROG', 'GRASS', 'CLOUD', 'GREEN', 'FISH', 'LAKE', 'PATH'],
    },
    {
      theme: 'Sweet Orchard',
      words: ['PLUM', 'PEAR', 'FIG', 'APPLE', 'BERRY', 'MINT', 'HERB', 'SWEET', 'FRUIT', 'RIPE'],
    },
    {
      theme: 'Gentle Ocean',
      words: ['WIND', 'MIST', 'WAVE', 'TIDE', 'SAIL', 'BOAT', 'SAND', 'COVE', 'CALM', 'BLUE'],
    },
    {
      theme: 'Woodland Walk',
      words: ['PINE', 'BARK', 'DEER', 'MOSS', 'WOOD', 'CONE', 'WALK', 'TREE', 'LEAF'],
    },
    {
      theme: 'Melody & Chimes',
      words: ['BELL', 'CHIME', 'HARP', 'TUNE', 'NOTE', 'SONG', 'PLAY', 'SOFT', 'RING', 'HYMN'],
    },
  ],
  Regular: [
    {
      theme: 'Spring Garden',
      words: ['FLOWER', 'GARDEN', 'SPRING', 'BLOSSOM', 'PETALS', 'ORCHID', 'CLOVER', 'VIOLET', 'DAHLIA', 'POPPY'],
    },
    {
      theme: 'Joyful Living',
      words: ['SMILE', 'CHEER', 'JOYFUL', 'RADIANT', 'DELIGHT', 'MERRY', 'SUNNY', 'HAPPY', 'LAUGH', 'BRIGHT'],
    },
    {
      theme: 'Tranquil Waters',
      words: ['STREAM', 'RIVER', 'OCEAN', 'PEBBLE', 'SHORE', 'BREEZE', 'HARBOR', 'ISLAND', 'DRIFT', 'LAGOON'],
    },
    {
      theme: 'Fireside Hearth',
      words: ['CANDLE', 'HEARTH', 'BLANKET', 'SLIPPER', 'SWEATER', 'COMFORT', 'TEACUP', 'QUILT', 'FIRESIDE', 'PARLOR'],
    },
    {
      theme: 'Cherished Friends',
      words: ['FRIEND', 'FAMILY', 'CHERISH', 'KINDNESS', 'EMBRACE', 'CARING', 'NURTURE', 'WELCOME', 'WARMTH', 'GENTLE'],
    },
    {
      theme: 'Musical Melodies',
      words: ['MELODY', 'CHORD', 'BALLAD', 'PIANO', 'FLUTE', 'STRINGS', 'SONATA', 'LULLABY', 'HARP', 'RHYTHM'],
    },
    {
      theme: 'Country Meadow',
      words: ['MEADOW', 'FOREST', 'VALLEY', 'SUNSET', 'TIMBER', 'BREEZY', 'HORIZON', 'NATURE', 'SUMMER', 'PASTURE'],
    },
    {
      theme: 'Golden Autumn',
      words: ['AUTUMN', 'HARVEST', 'PUMPKIN', 'ACORN', 'GOLDEN', 'RUSSET', 'CRISP', 'MAPLE', 'ORCHARD', 'YELLOW'],
    },
    {
      theme: 'Starlit Evening',
      words: ['STARLIGHT', 'TWILIGHT', 'EVENING', 'LANTERN', 'MOONLIT', 'DUSK', 'SERENE', 'WONDER', 'SHADOW', 'HEAVEN'],
    },
    {
      theme: 'Bayside Breeze',
      words: ['SEAGULL', 'SEASHELL', 'COASTAL', 'MARINA', 'SAILBOAT', 'TIDEWAY', 'ANCHOR', 'REEF'],
    },
    {
      theme: 'Morning Bakery',
      words: ['WAFFLE', 'MUFFIN', 'PANCAKE', 'CINNAMON', 'VANILLA', 'GINGER', 'PASTRY', 'BUTTER', 'CRUMPET', 'HONEY'],
    },
    {
      theme: 'Floral Sanctuary',
      words: ['JASMINE', 'LAVENDER', 'MARIGOLD', 'AZALEA', 'PEONY', 'BEGONIA', 'GARDENIA', 'BLOSSOM'],
    },
  ],
  Challenge: [
    {
      theme: 'Restorative Sanctuary',
      words: ['SANCTUARY', 'TRANQUIL', 'HARMONY', 'SERENITY', 'BEAUTIFUL', 'HEALING', 'RECOVERY', 'WELLNESS', 'PEACEFUL'],
    },
    {
      theme: 'Radiant Sunshine',
      words: ['SUNSHINE', 'SUNLIGHT', 'DAYLIGHT', 'SPLENDOR', 'BRILLIANT', 'MORNING', 'LUMINOUS', 'RADIANCE', 'GLORIOUS'],
    },
    {
      theme: 'Everlasting Kindness',
      words: ['KINDNESS', 'COMPASSION', 'GRATITUDE', 'CHERISHED', 'AFFECTION', 'BLESSINGS', 'DEVOTION', 'SINCERITY'],
    },
    {
      theme: 'Timeless Memories',
      words: ['MEMORIES', 'KEEPSAKE', 'TREASURE', 'NOSTALGIA', 'REFLECTION', 'HEIRLOOM', 'JOURNEY', 'REMEMBER'],
    },
    {
      theme: 'Vibrant Wildflower',
      words: ['WILDFLOWER', 'BUTTERFLY', 'BOTANICAL', 'LANDSCAPE', 'PERENNIAL', 'GREENHOUSE', 'BLOSSOM'],
    },
    {
      theme: 'Ocean Horizons',
      words: ['SEASHORE', 'LIGHTHOUSE', 'COASTLINE', 'VOYAGER', 'WATERSIDE', 'SAILBOAT', 'DRIFTWOOD', 'MARITIME'],
    },
    {
      theme: 'Symphonic Harmony',
      words: ['SYMPHONY', 'ORCHESTRA', 'SERENADE', 'RHAPSODY', 'NOCTURNE', 'RESONANCE', 'MELODIOUS', 'COMPOSER'],
    },
    {
      theme: 'Countryside Living',
      words: ['COUNTRYSIDE', 'WOODLAND', 'FIRESIDE', 'HOMESTEAD', 'GREENERY', 'PORCHSWING', 'BIRDHOUSE'],
    },
    {
      theme: 'Autumn Harvest',
      words: ['CRANBERRY', 'PERSIMMON', 'SUNFLOWER', 'GATHERING', 'GOLDENROD', 'CHESTNUT', 'HARVEST'],
    },
    {
      theme: 'Celestial Wonders',
      words: ['STARGAZING', 'MOONBEAM', 'ASTRONOMY', 'MILKYWAY', 'SUPERNOVA', 'AURORA', 'HORIZON'],
    },
    {
      theme: 'Peaceful Retreat',
      words: ['MEDITATION', 'STILLNESS', 'REJUVENATE', 'WHISPERING', 'TRANQUIL', 'CONTENT'],
    },
    {
      theme: 'Heartfelt Fellowship',
      words: ['FRIENDSHIP', 'GENEROSITY', 'NEIGHBORLY', 'CELEBRATE', 'CHERISHED', 'HARMONY'],
    },
  ],
};

const DIFFICULTY_CONFIG = {
  Gentle: {
    size: 6,
    wordCount: 3,
    directions: [
      [0, 1], // Horizontal
      [1, 0], // Vertical
    ],
  },
  Regular: {
    size: 8,
    wordCount: 4,
    directions: [
      [0, 1], // Horizontal
      [1, 0], // Vertical
      [1, 1], // Diagonal down-right
    ],
  },
  Challenge: {
    size: 10,
    wordCount: 5,
    directions: [
      [0, 1],  // Horizontal
      [1, 0],  // Vertical
      [1, 1],  // Diagonal down-right
      [-1, 1], // Diagonal up-right
    ],
  },
};

function findRandomPlacement(grid, word, size, directions) {
  const validPlacements = [];

  for (const [dr, dc] of directions) {
    const minR = dr < 0 ? word.length - 1 : 0;
    const maxR = dr > 0 ? size - word.length : size - 1;
    const minC = dc < 0 ? word.length - 1 : 0;
    const maxC = dc > 0 ? size - word.length : size - 1;

    for (let r = minR; r <= maxR; r++) {
      for (let c = minC; c <= maxC; c++) {
        let canPlace = true;
        for (let i = 0; i < word.length; i++) {
          const currR = r + i * dr;
          const currC = c + i * dc;
          const cell = grid[currR][currC];
          if (cell !== '' && cell !== word[i]) {
            canPlace = false;
            break;
          }
        }
        if (canPlace) {
          validPlacements.push({ r, c, dr, dc });
        }
      }
    }
  }

  if (validPlacements.length === 0) return null;
  return validPlacements[Math.floor(Math.random() * validPlacements.length)];
}

const COMMON_LETTERS = 'EEEEAAAIIIOOOUUUNNNRRRSSSTTTTTDDDGGGLLLMMMCCCPPFB';

function generateWordSearch(difficulty = 'Gentle') {
  const config = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.Gentle;
  const { size, wordCount, directions } = config;
  const themes = THEMES_BY_DIFFICULTY[difficulty] || THEMES_BY_DIFFICULTY.Gentle;

  // Pick a random theme
  const chosenTheme = themes[Math.floor(Math.random() * themes.length)];
  const candidateWords = chosenTheme.words.filter(w => w.length <= size);

  for (let attempt = 0; attempt < 30; attempt++) {
    const shuffled = [...candidateWords].sort(() => 0.5 - Math.random());
    const selectedWords = shuffled.slice(0, wordCount);
    selectedWords.sort((a, b) => b.length - a.length);

    const grid = Array.from({ length: size }, () => Array(size).fill(''));
    const solutions = [];
    let allPlaced = true;

    for (const word of selectedWords) {
      const placement = findRandomPlacement(grid, word, size, directions);
      if (!placement) {
        allPlaced = false;
        break;
      }
      const coords = [];
      for (let i = 0; i < word.length; i++) {
        const r = placement.r + i * placement.dr;
        const c = placement.c + i * placement.dc;
        grid[r][c] = word[i];
        coords.push([r, c]);
      }
      solutions.push({ word, coords });
    }

    if (allPlaced && solutions.length === selectedWords.length) {
      // Fill empty spaces with organic weighted English letters
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (!grid[r][c]) {
            grid[r][c] = COMMON_LETTERS[Math.floor(Math.random() * COMMON_LETTERS.length)];
          }
        }
      }

      return {
        id: `ws-${Date.now()}-${Math.random()}`,
        theme: chosenTheme.theme,
        size,
        words: solutions.map(s => s.word),
        grid,
        solutions,
      };
    }
  }

  // Safe fallback template if randomization takes too long
  return {
    id: `ws-fallback-${Date.now()}`,
    theme: chosenTheme.theme,
    size: 6,
    words: ['TEA', 'CALM', 'ROSE'],
    grid: [
      ['T', 'E', 'A', 'M', 'P', 'R'],
      ['S', 'H', 'B', 'O', 'S', 'O'],
      ['R', 'O', 'S', 'E', 'L', 'S'],
      ['B', 'P', 'F', 'C', 'N', 'E'],
      ['C', 'A', 'L', 'M', 'G', 'D'],
      ['W', 'K', 'T', 'H', 'Y', 'A'],
    ],
    solutions: [
      { word: 'TEA', coords: [[0, 0], [0, 1], [0, 2]] },
      { word: 'ROSE', coords: [[2, 0], [2, 1], [2, 2], [2, 3]] },
      { word: 'CALM', coords: [[4, 0], [4, 1], [4, 2], [4, 3]] },
    ],
  };
}

export default function WordSearch() {
  const [difficulty, setDifficulty] = useState('Gentle');
  const [puzzle, setPuzzle] = useState(() => generateWordSearch('Gentle'));
  const [foundWords, setFoundWords] = useState([]);
  const [selectedStart, setSelectedStart] = useState(null);
  const [highlightedCoords, setHighlightedCoords] = useState([]);
  const [hintCoord, setHintCoord] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

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
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(780, now + 0.05);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'found') {
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
      }
    } catch {
      // Audio fallback
    }
  }, [soundEnabled]);

  const handleDifficultyChange = (newDiff) => {
    setDifficulty(newDiff);
    setPuzzle(generateWordSearch(newDiff));
    setFoundWords([]);
    setSelectedStart(null);
    setHighlightedCoords([]);
    setHintCoord(null);
    setIsComplete(false);
  };

  const handleRestart = useCallback(() => {
    setPuzzle(generateWordSearch(difficulty));
    setFoundWords([]);
    setSelectedStart(null);
    setHighlightedCoords([]);
    setHintCoord(null);
    setIsComplete(false);
  }, [difficulty]);

  function getLinePath(r1, c1, r2, c2) {
    const dr = r2 - r1;
    const dc = c2 - c1;

    const isHorizontal = dr === 0;
    const isVertical = dc === 0;
    const isDiagonal = Math.abs(dr) === Math.abs(dc);

    if (!isHorizontal && !isVertical && !isDiagonal) return null;

    const steps = Math.max(Math.abs(dr), Math.abs(dc));
    const stepR = dr === 0 ? 0 : dr / steps;
    const stepC = dc === 0 ? 0 : dc / steps;

    const path = [];
    for (let i = 0; i <= steps; i++) {
      path.push([r1 + i * stepR, c1 + i * stepC]);
    }
    return path;
  }

  const handleCellHover = (r, c) => {
    if (!selectedStart || isComplete) return;
    const [startR, startC] = selectedStart;
    const path = getLinePath(startR, startC, r, c);
    if (path) {
      setHighlightedCoords(path);
    } else {
      setHighlightedCoords([[startR, startC]]);
    }
  };

  const handleCellClick = (r, c) => {
    if (isComplete) return;

    if (!selectedStart) {
      playSound('tap');
      setSelectedStart([r, c]);
      setHighlightedCoords([[r, c]]);
      setHintCoord(null);
    } else {
      const [startR, startC] = selectedStart;

      // If user tapped the same starting cell, deselect it
      if (startR === r && startC === c) {
        setSelectedStart(null);
        setHighlightedCoords([]);
        return;
      }

      const path = getLinePath(startR, startC, r, c);

      if (path && path.length > 1) {
        const wordAttempt = path.map(([pr, pc]) => puzzle.grid[pr][pc]).join('');
        const reverseWord = wordAttempt.split('').reverse().join('');

        const matchedSolution = puzzle.solutions.find(
          sol => (sol.word === wordAttempt || sol.word === reverseWord) && !foundWords.includes(sol.word)
        );

        if (matchedSolution) {
          playSound('found');
          const newFound = [...foundWords, matchedSolution.word];
          setFoundWords(newFound);
          if (newFound.length >= puzzle.words.length) {
            setIsComplete(true);
          }
        }
      }

      setSelectedStart(null);
      setHighlightedCoords([]);
    }
  };

  const permanentlyFoundCoords = new Set();
  puzzle.solutions.forEach(sol => {
    if (foundWords.includes(sol.word)) {
      sol.coords.forEach(([r, c]) => permanentlyFoundCoords.add(`${r},${c}`));
    }
  });

  const handleHint = () => {
    if (isComplete) return;
    const unfoundWord = puzzle.words.find(w => !foundWords.includes(w));
    if (!unfoundWord) return;

    const sol = puzzle.solutions.find(s => s.word === unfoundWord);
    if (sol && sol.coords.length > 0) {
      setHintCoord(sol.coords[0]);
    }
  };

  const cellSizeClass =
    puzzle.size <= 6
      ? 'w-11 h-11 sm:w-14 sm:h-14 rounded-2xl text-lg sm:text-2xl'
      : puzzle.size <= 8
      ? 'w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl text-base sm:text-xl'
      : 'w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl text-xs sm:text-base';

  return (
    <GameWrapper
      gameId="word-search"
      gameTitle="Word Search & Circle Words"
      icon={Search}
      difficulty={difficulty}
      setDifficulty={handleDifficultyChange}
      instructions="Locate the peaceful words hidden in the letter grid. Tap the first letter of a word, then tap the last letter to circle it. A fresh, randomized puzzle with different words is loaded every time you finish or refresh."
      spokenInstruction="Welcome to Word Search. Look for the words listed above in the grid. Tap the first letter, then tap the last letter to highlight your word. Tap Hint anytime."
      isComplete={isComplete}
      score={100}
      onRestart={handleRestart}
    >
      {/* Top HUD status */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 p-3 rounded-2xl bg-slate-100 dark:bg-[#142038] border border-slate-200 dark:border-[#223558] text-xs font-bold text-slate-700 dark:text-slate-300">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>
              Words Found: <strong className="text-teal-600 dark:text-teal-400 font-mono text-sm">{foundWords.length}</strong> of {puzzle.words.length}
            </span>
          </div>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <span className="text-slate-500 dark:text-slate-400">
            Theme: <strong>{puzzle.theme}</strong>
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

          {/* Hint button */}
          <button
            onClick={handleHint}
            disabled={foundWords.length >= puzzle.words.length}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/80 dark:hover:bg-amber-900 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs font-bold transition-colors disabled:opacity-50"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>Hint</span>
          </button>

          {/* Next Puzzle Grid */}
          <button
            onClick={handleRestart}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white dark:bg-[#0c1527] border border-slate-200 dark:border-[#223558] text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/40 transition-colors shadow-sm text-xs font-bold"
            title="Load brand new word search grid"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Grid</span>
          </button>
        </div>
      </div>

      {/* Target Word Checklist */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8 p-4 rounded-2xl bg-teal-50/60 dark:bg-[#111d35] border border-teal-200/60 dark:border-[#223558]">
        {puzzle.words.map(w => {
          const isFound = foundWords.includes(w);
          return (
            <span
              key={w}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 ${
                isFound
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 line-through opacity-70'
                  : 'bg-white dark:bg-[#162544] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-[#334b77] shadow-xs'
              }`}
            >
              {isFound && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 no-underline" />}
              <span>{w}</span>
            </span>
          );
        })}
      </div>

      {/* Letter Grid */}
      <div className="inline-block mx-auto p-4 rounded-3xl bg-slate-100 dark:bg-[#0c1527] border border-slate-200 dark:border-[#223558] shadow-inner text-center">
        <div
          className="grid gap-1.5 sm:gap-2"
          style={{ gridTemplateColumns: `repeat(${puzzle.size}, minmax(0, 1fr))` }}
        >
          {puzzle.grid.map((row, r) =>
            row.map((char, c) => {
              const isFound = permanentlyFoundCoords.has(`${r},${c}`);
              const isSelectedStart = selectedStart && selectedStart[0] === r && selectedStart[1] === c;
              const isHighlighted = highlightedCoords.some(([hr, hc]) => hr === r && hc === c);
              const isHint = hintCoord && hintCoord[0] === r && hintCoord[1] === c;

              let cellStyle =
                'bg-white hover:bg-teal-50 dark:bg-[#142038] dark:hover:bg-[#1e2f50] border border-slate-200 dark:border-[#223558] text-slate-800 dark:text-white shadow-xs';
              if (isFound) {
                cellStyle = 'bg-emerald-500 text-white shadow-sm ring-2 ring-emerald-400 font-black';
              } else if (isSelectedStart) {
                cellStyle = 'bg-teal-600 text-white scale-105 ring-4 ring-teal-400/50 shadow-md font-black';
              } else if (isHighlighted) {
                cellStyle = 'bg-teal-200 dark:bg-teal-900/60 text-teal-900 dark:text-teal-100 ring-2 ring-teal-400 font-black';
              } else if (isHint) {
                cellStyle = 'bg-amber-400 text-slate-900 animate-bounce ring-4 ring-amber-300 font-black';
              }

              return (
                <button
                  key={`${r}-${c}`}
                  onClick={() => handleCellClick(r, c)}
                  onMouseEnter={() => handleCellHover(r, c)}
                  className={`${cellSizeClass} flex items-center justify-center transition-all select-none ${cellStyle}`}
                  aria-label={`Letter ${char} at row ${r + 1} column ${c + 1}`}
                >
                  {char}
                </button>
              );
            })
          )}
        </div>
      </div>

      <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-6">
        Tip: Tap a starting letter, then tap the ending letter in a straight line to circle the word.
      </p>
    </GameWrapper>
  );
}
