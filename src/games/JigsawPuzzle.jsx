import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Puzzle,
  RotateCcw,
  Sparkles,
  Eye,
  CheckCircle,
  HelpCircle,
  Image as ImageIcon,
  Layers,
  Volume2,
  VolumeX,
  Trophy,
  Lightbulb,
  Check,
  RotateCw,
  Flame,
  ShieldAlert,
  Clock,
  Compass,
  Filter,
  Maximize2
} from 'lucide-react';
import GameWrapper from '../components/GameWrapper';

// Intricate, high-detail photographic artworks for deep visual observation
const ARTWORKS = [
  {
    id: 'cosmic-nebula',
    title: 'Deep Space Cosmic Nebula',
    category: 'High Challenge • Starfields',
    src: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=900&auto=format&fit=crop&q=80',
    description: 'Swirling stellar gas, distant glowing galaxies, and thousands of twinkling cosmic stars.'
  },
  {
    id: 'bavarian-castle',
    title: 'Neuschwanstein Alpine Castle',
    category: 'Intricate Architecture',
    src: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=900&auto=format&fit=crop&q=80',
    description: 'Bavarian fairy tale towers perched on jagged alpine crags amidst dense autumn woodlands.'
  },
  {
    id: 'zen-garden',
    title: 'Japanese Zen Pagoda & Koi Pond',
    category: 'Tranquil Nature',
    src: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=900&auto=format&fit=crop&q=80',
    description: 'Spring cherry blossoms, arched wooden bridge, stone lanterns, and reflecting koi pond.'
  },
  {
    id: 'matterhorn-lake',
    title: 'Matterhorn Glacier Reflection',
    category: 'Scenic Landscape',
    src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&auto=format&fit=crop&q=80',
    description: 'Iconic triangular alpine peak reflected in turquoise water surrounded by pine needles.'
  },
  {
    id: 'antique-library',
    title: 'Antique Scholar Library',
    category: 'Fine Textures',
    src: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=900&auto=format&fit=crop&q=80',
    description: 'Thousands of leatherbound tomes, brass astrolabes, spiral mahogany ladders, and globes.'
  },
  {
    id: 'sunflower-field',
    title: 'Sunlit Sunflower Meadow',
    category: 'Floral Warmth',
    src: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=900&auto=format&fit=crop&q=80',
    description: 'Golden petals and rich green leaves stretching towards a brilliant summer sky.'
  }
];

// Difficulty presets supporting tough 25, 36, 49, and 64 piece modes
const GRID_CONFIGS = [
  { id: 'gentle', rows: 3, cols: 3, label: '9 Pieces (3×3)', difficultyMatch: 'Gentle', badge: 'Relaxed' },
  { id: 'regular', rows: 4, cols: 4, label: '16 Pieces (4×4)', difficultyMatch: 'Regular', badge: 'Standard' },
  { id: 'tough', rows: 5, cols: 5, label: '25 Pieces (5×5)', difficultyMatch: 'Challenge', badge: 'Tough 🔥' },
  { id: 'hardcore', rows: 6, cols: 6, label: '36 Pieces (6×6)', difficultyMatch: 'Challenge', badge: 'Hardcore ⚡' },
  { id: 'master', rows: 7, cols: 7, label: '49 Pieces (7×7)', difficultyMatch: 'Challenge', badge: 'Master 🏆' },
  { id: 'nightmare', rows: 8, cols: 8, label: '64 Pieces (8×8)', difficultyMatch: 'Challenge', badge: 'Extreme 💀' },
];

/**
 * Creates an authentic interlocking jigsaw edge curve.
 */
function createJigsawEdge(p1, p2, tabDir) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const len = Math.hypot(dx, dy);
  if (len === 0) return '';
  if (tabDir === 0) {
    return `L ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }

  const tx = dx / len;
  const ty = dy / len;
  const nx = -ty * tabDir;
  const ny = tx * tabDir;

  const pt = (u, v) => {
    const x = p1.x + tx * (u * len) + nx * (v * len);
    const y = p1.y + ty * (u * len) + ny * (v * len);
    return `${x.toFixed(2)} ${y.toFixed(2)}`;
  };

  return [
    `L ${pt(0.36, 0)}`,
    `C ${pt(0.38, -0.04)}, ${pt(0.37, 0.08)}, ${pt(0.40, 0.14)}`,
    `C ${pt(0.42, 0.20)}, ${pt(0.45, 0.22)}, ${pt(0.50, 0.22)}`,
    `C ${pt(0.55, 0.22)}, ${pt(0.58, 0.20)}, ${pt(0.60, 0.14)}`,
    `C ${pt(0.63, 0.08)}, ${pt(0.62, -0.04)}, ${pt(0.64, 0)}`,
    `L ${pt(1.0, 0)}`
  ].join(' ');
}

/**
 * Creates a complete closed SVG path for a jigsaw piece at (r, c)
 */
function createPieceSvgPath(w, h, topTab, rightTab, bottomTab, leftTab) {
  const p0 = { x: 0, y: 0 };
  const p1 = { x: w, y: 0 };
  const p2 = { x: w, y: h };
  const p3 = { x: 0, y: h };

  return [
    `M ${p0.x} ${p0.y}`,
    createJigsawEdge(p0, p1, topTab),
    createJigsawEdge(p1, p2, rightTab),
    createJigsawEdge(p2, p3, bottomTab),
    createJigsawEdge(p3, p0, leftTab),
    'Z'
  ].join(' ');
}

export default function JigsawPuzzle() {
  const [difficulty, setDifficulty] = useState('Challenge'); // Default to Challenge / Tough!
  const [selectedGridId, setSelectedGridId] = useState('tough'); // Default 5x5 (25 pieces)
  const [selectedArtwork, setSelectedArtwork] = useState(ARTWORKS[0]);
  const [showGhost, setShowGhost] = useState(false); // Ghost guide off by default for real challenge
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [rotationEnabled, setRotationEnabled] = useState(true); // Piece rotation on by default
  const [filterEdgesOnly, setFilterEdgesOnly] = useState(false); // Pro border sorter
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Puzzle State
  const [pieces, setPieces] = useState([]);
  const [placedSlots, setPlacedSlots] = useState({}); // slotIndex -> piece
  const [selectedPieceId, setSelectedPieceId] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [moves, setMoves] = useState(0);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [feedbackToast, setFeedbackToast] = useState({ show: false, message: '', type: 'info' });

  const audioCtxRef = useRef(null);

  // Resolve active grid configuration
  const activeGrid = GRID_CONFIGS.find(g => g.id === selectedGridId) || GRID_CONFIGS[2];
  const { rows, cols } = activeGrid;
  const boardSize = 460;
  const pieceW = boardSize / cols;
  const pieceH = boardSize / rows;
  const tabPadding = Math.round(Math.max(pieceW, pieceH) * 0.28);

  // Keep grid size in sync when user clicks GameWrapper difficulty header
  useEffect(() => {
    if (difficulty === 'Gentle') {
      setSelectedGridId('gentle');
      setRotationEnabled(false);
    } else if (difficulty === 'Regular') {
      setSelectedGridId('regular');
      setRotationEnabled(false);
    } else if (difficulty === 'Challenge') {
      setSelectedGridId('tough'); // 25 pieces
      setRotationEnabled(true);
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

  // Web Audio Synthesizer for tactile snap & mismatch sounds
  const playSoundEffect = useCallback((type = 'snap') => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;
      if (type === 'snap') {
        // Crisp wooden puzzle lock
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(380, now);
        osc.frequency.exponentialRampToValueAtTime(90, now + 0.08);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'rotate') {
        // Subtle rotational tick
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(540, now);
        osc.frequency.exponentialRampToValueAtTime(420, now + 0.05);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'mismatch') {
        // Dull wooden thud for non-fitting piece or wrong rotation
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(130, now);
        osc.frequency.exponentialRampToValueAtTime(70, now + 0.12);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'complete') {
        // Victory melodic chime
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.09);
          gain.gain.setValueAtTime(0.14, now + i * 0.09);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 1.1);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.09);
          osc.stop(now + i * 0.09 + 1.1);
        });
      }
    } catch {
      // Audio fallback
    }
  }, [soundEnabled]);

  // Show quick helper notification
  const showNotice = (message, type = 'info') => {
    setFeedbackToast({ show: true, message, type });
    setTimeout(() => {
      setFeedbackToast(prev => ({ ...prev, show: false }));
    }, 2400);
  };

  // Initialize and slice puzzle pieces with interlocking tabs & random rotation
  const initPuzzle = useCallback(() => {
    setSelectedPieceId(null);
    setIsComplete(false);
    setPlacedSlots({});
    setMoves(0);
    setElapsedSec(0);

    const numRows = rows;
    const numCols = cols;

    // Generate consistent internal tabs
    const hTabs = Array.from({ length: numRows - 1 }, () =>
      Array.from({ length: numCols }, () => (Math.random() < 0.5 ? 1 : -1))
    );
    const vTabs = Array.from({ length: numRows }, () =>
      Array.from({ length: numCols - 1 }, () => (Math.random() < 0.5 ? 1 : -1))
    );

    const generatedPieces = [];
    const rotationPool = rotationEnabled ? [0, 90, 180, 270] : [0];

    for (let r = 0; r < numRows; r++) {
      for (let c = 0; c < numCols; c++) {
        const topTab = r === 0 ? 0 : -hTabs[r - 1][c];
        const rightTab = c === numCols - 1 ? 0 : vTabs[r][c];
        const bottomTab = r === numRows - 1 ? 0 : hTabs[r][c];
        const leftTab = c === 0 ? 0 : -vTabs[r][c - 1];

        const pathData = createPieceSvgPath(pieceW, pieceH, topTab, rightTab, bottomTab, leftTab);
        const index = r * numCols + c;
        const isBorder = r === 0 || r === numRows - 1 || c === 0 || c === numCols - 1;

        generatedPieces.push({
          id: `piece-${index}`,
          correctSlot: index,
          row: r,
          col: c,
          pathData,
          topTab,
          rightTab,
          bottomTab,
          leftTab,
          isBorder,
          rotation: rotationPool[Math.floor(Math.random() * rotationPool.length)],
          currentSlot: null,
        });
      }
    }

    // Shuffle unplaced pieces in tray
    const shuffled = [...generatedPieces].sort(() => Math.random() - 0.5);
    setPieces(shuffled);
  }, [rows, cols, pieceW, pieceH, rotationEnabled]);

  useEffect(() => {
    initPuzzle();
  }, [initPuzzle, selectedGridId, selectedArtwork]);

  // Rotate selected piece by 90 degrees
  const handleRotateSelected = useCallback(() => {
    if (!selectedPieceId) return;
    setPieces(prev =>
      prev.map(p => {
        if (p.id === selectedPieceId) {
          const nextRot = (p.rotation + 90) % 360;
          return { ...p, rotation: nextRot };
        }
        return p;
      })
    );
    playSoundEffect('rotate');
  }, [selectedPieceId, playSoundEffect]);

  // Keyboard shortcut: Press 'R' or Spacebar to rotate selected piece
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === 'r' || e.key === 'R' || e.key === ' ') && selectedPieceId && rotationEnabled) {
        e.preventDefault();
        handleRotateSelected();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPieceId, rotationEnabled, handleRotateSelected]);

  // Tray piece click / selection
  const handlePieceClickInTray = (pieceId) => {
    if (isComplete) return;
    if (selectedPieceId === pieceId) {
      if (rotationEnabled) {
        handleRotateSelected();
      } else {
        setSelectedPieceId(null);
      }
    } else {
      setSelectedPieceId(pieceId);
      playSoundEffect('rotate');
    }
  };

  // True Jigsaw Placement Validation (Realistic Matching)
  const handleSlotClick = (slotIndex) => {
    if (isComplete) return;

    // If slot has a piece and no new piece is selected: return it to tray
    if (!selectedPieceId) {
      const existingPiece = placedSlots[slotIndex];
      if (existingPiece) {
        const updatedPlaced = { ...placedSlots };
        delete updatedPlaced[slotIndex];
        setPlacedSlots(updatedPlaced);
        setPieces(prev => [...prev, { ...existingPiece, currentSlot: null }]);
        playSoundEffect('snap');
      }
      return;
    }

    const piece = pieces.find(p => p.id === selectedPieceId);
    if (!piece) return;

    setMoves(m => m + 1);

    // REALISTIC TOUGH VALIDATION:
    // 1. Is this piece placed in its correct slot?
    // 2. Is the piece rotated correctly (0°)?
    const isSlotMatch = piece.correctSlot === slotIndex;
    const isRotationMatch = !rotationEnabled || piece.rotation === 0;

    if (!isSlotMatch) {
      playSoundEffect('mismatch');
      showNotice("These edges don't fit here. Match the colors and interlocking tabs!", 'error');
      return;
    }

    if (!isRotationMatch) {
      playSoundEffect('mismatch');
      showNotice('Right location, but rotated! Tap "Rotate ↻" to orient it upright.', 'warning');
      return;
    }

    // Success! Lock into the slot
    const updatedPlaced = { ...placedSlots, [slotIndex]: { ...piece, currentSlot: slotIndex } };
    const updatedPieces = pieces.filter(p => p.id !== selectedPieceId);

    setPlacedSlots(updatedPlaced);
    setPieces(updatedPieces);
    setSelectedPieceId(null);
    playSoundEffect('snap');

    // Check completion
    const totalCount = rows * cols;
    if (Object.keys(updatedPlaced).length === totalCount) {
      setIsComplete(true);
      playSoundEffect('complete');
    }
  };

  // Drag and Drop support
  const handleDragStart = (e, pieceId) => {
    e.dataTransfer.setData('text/plain', pieceId);
    setSelectedPieceId(pieceId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDropOnSlot = (e, slotIndex) => {
    e.preventDefault();
    const pieceId = e.dataTransfer.getData('text/plain') || selectedPieceId;
    if (!pieceId) return;

    const piece = pieces.find(p => p.id === pieceId);
    if (!piece) return;

    setMoves(m => m + 1);

    const isSlotMatch = piece.correctSlot === slotIndex;
    const isRotationMatch = !rotationEnabled || piece.rotation === 0;

    if (!isSlotMatch) {
      playSoundEffect('mismatch');
      showNotice("Piece doesn't interlock here.", 'error');
      return;
    }

    if (!isRotationMatch) {
      playSoundEffect('mismatch');
      showNotice('Right spot, but rotated! Rotate 90° to fit.', 'warning');
      return;
    }

    const updatedPlaced = { ...placedSlots, [slotIndex]: { ...piece, currentSlot: slotIndex } };
    const updatedPieces = pieces.filter(p => p.id !== pieceId);

    setPlacedSlots(updatedPlaced);
    setPieces(updatedPieces);
    setSelectedPieceId(null);
    playSoundEffect('snap');

    if (Object.keys(updatedPlaced).length === rows * cols) {
      setIsComplete(true);
      playSoundEffect('complete');
    }
  };

  // Hint / Auto-place one random piece
  const handleGiveHint = () => {
    if (pieces.length === 0 || isComplete) return;

    const targetPiece = pieces[0];
    const targetSlot = targetPiece.correctSlot;

    const updatedPiece = { ...targetPiece, rotation: 0, currentSlot: targetSlot };
    const updatedPlaced = { ...placedSlots, [targetSlot]: updatedPiece };
    const updatedPieces = pieces.slice(1);

    setPlacedSlots(updatedPlaced);
    setPieces(updatedPieces);
    setSelectedPieceId(null);
    playSoundEffect('snap');

    if (Object.keys(updatedPlaced).length === rows * cols) {
      setIsComplete(true);
      playSoundEffect('complete');
    }
  };

  // Sorter / Filter pieces in tray (e.g. Edges Only)
  const displayedPieces = filterEdgesOnly
    ? pieces.filter(p => p.isBorder)
    : pieces;

  const totalPieces = rows * cols;
  const placedCount = Object.keys(placedSlots).length;
  const progressPercent = Math.round((placedCount / totalPieces) * 100);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  return (
    <GameWrapper
      gameId="jigsaw-puzzle"
      gameTitle="Authentic Jigsaw Puzzle"
      icon={Puzzle}
      difficulty={difficulty}
      setDifficulty={setDifficulty}
      instructions="Examine authentic interlocking tabs, subtle textures, and colors. Rotate pieces to their upright angle and snap them into the dark wooden frame."
      spokenInstruction="Welcome to Authentic Jigsaw Puzzle. Select pieces from the tray, rotate them to the upright orientation, and match them with interlocking tabs on the board."
      isComplete={isComplete}
      score={100}
      onRestart={initPuzzle}
    >
      {/* 1. Tough Grid Density Selector & Artwork Picker */}
      <div className="space-y-4 mb-6">
        
        {/* Grid Density Tabs: 9, 16, 25, 36, 49, 64 Pieces */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-2xl bg-slate-100 dark:bg-[#142038] border border-slate-200 dark:border-[#223558]">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
            <span className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-wide">
              Puzzle Grid Size:
            </span>
          </div>

          <div className="grid grid-cols-3 sm:flex sm:flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {GRID_CONFIGS.map(g => {
              const isSelected = selectedGridId === g.id;
              return (
                <button
                  key={g.id}
                  onClick={() => {
                    setSelectedGridId(g.id);
                    if (g.rows >= 5) setRotationEnabled(true);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all text-center ${
                    isSelected
                      ? 'bg-teal-600 text-white shadow-md ring-2 ring-teal-400/30'
                      : 'bg-white dark:bg-[#0c1527] text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-[#1c2c4e] border border-slate-200 dark:border-[#223558]'
                  }`}
                >
                  <span>{g.rows * g.cols} Pcs</span>
                  <span className="hidden md:inline ml-1 text-[10px] opacity-80">({g.rows}×{g.cols})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Artwork Carousel & Advanced Puzzle Toggles */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Artwork Carousel */}
          <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
              Artwork:
            </span>
            {ARTWORKS.map(art => (
              <button
                key={art.id}
                onClick={() => setSelectedArtwork(art)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shrink-0 ${
                  selectedArtwork.id === art.id
                    ? 'bg-teal-50 border-teal-500 text-teal-800 dark:bg-teal-950/80 dark:border-teal-500 dark:text-teal-300 ring-2 ring-teal-400/30 shadow-xs'
                    : 'bg-white dark:bg-[#142038] border-slate-200 dark:border-[#223558] text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                }`}
              >
                <img src={art.src} alt={art.title} className="w-4 h-4 rounded object-cover" />
                <span>{art.title.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          {/* Tough Mode Control Toggles */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Piece Rotation Toggle */}
            <button
              onClick={() => {
                setRotationEnabled(!rotationEnabled);
                initPuzzle();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                rotationEnabled
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-700 dark:text-amber-300 shadow-xs ring-1 ring-amber-400/30'
                  : 'bg-slate-100 dark:bg-[#142038] border-slate-200 dark:border-[#223558] text-slate-500'
              }`}
              title="When ON, pieces spawn rotated 0°, 90°, 180°, 270°!"
            >
              <RotateCw className="w-3.5 h-3.5 text-amber-500" />
              <span>Rotation: {rotationEnabled ? 'ON (Tough)' : 'OFF'}</span>
            </button>

            {/* Ghost Guide Toggle */}
            <button
              onClick={() => setShowGhost(!showGhost)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                showGhost
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-indigo-950/70 dark:border-indigo-700 dark:text-indigo-300'
                  : 'bg-slate-100 dark:bg-[#142038] border-slate-200 dark:border-[#223558] text-slate-500'
              }`}
              title="Toggle faint background artwork guide"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showGhost ? 'Guide ON' : 'Blind (Guide OFF)'}</span>
            </button>

            {/* Reference Lightbox */}
            <button
              onClick={() => setShowPreviewModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#142038] dark:hover:bg-[#1c2c4e] border border-slate-200 dark:border-[#223558] text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
            >
              <ImageIcon className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Photo</span>
            </button>

            {/* Hint Button */}
            <button
              onClick={handleGiveHint}
              disabled={pieces.length === 0 || isComplete}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-bold transition-all disabled:opacity-40"
              title="Automatically place one piece"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>Hint</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Jigsaw Interactive Canvas Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left/Center: The Authentic Wooden Framed Puzzle Board */}
        <div className="lg:col-span-7 flex flex-col items-center">
          
          {/* Framed Wooden / Slate Canvas Container */}
          <div className="relative p-4 rounded-3xl bg-amber-950/20 dark:bg-[#070d19] border-4 border-amber-900/40 dark:border-[#223558] shadow-2xl backdrop-blur-md">
            
            {/* The Actual Assembly Canvas */}
            <div
              className="relative rounded-2xl overflow-hidden bg-slate-950 shadow-inner select-none"
              style={{
                width: `${boardSize}px`,
                height: `${boardSize}px`,
                maxWidth: '100%',
                aspectRatio: '1 / 1'
              }}
            >
              {/* Optional Ghost Guide (Faint 15% opacity watermark) */}
              {showGhost && (
                <img
                  src={selectedArtwork.src}
                  alt="Ghost Guide"
                  className="absolute inset-0 w-full h-full object-cover opacity-15 pointer-events-none select-none filter blur-[0.2px]"
                />
              )}

              {/* Grid Outline Slots (NO SPOILER NUMBERS!) */}
              <div
                className="absolute inset-0 grid z-0"
                style={{
                  gridTemplateColumns: `repeat(${cols}, 1fr)`,
                  gridTemplateRows: `repeat(${rows}, 1fr)`
                }}
              >
                {Array.from({ length: rows * cols }).map((_, slotIdx) => {
                  const placedPiece = placedSlots[slotIdx];

                  return (
                    <div
                      key={slotIdx}
                      onClick={() => handleSlotClick(slotIdx)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDropOnSlot(e, slotIdx)}
                      className={`relative border border-white/5 flex items-center justify-center transition-all cursor-pointer ${
                        !placedPiece && selectedPieceId
                          ? 'hover:bg-teal-500/20 hover:border-teal-400/50'
                          : ''
                      }`}
                    >
                      {/* Authentic subtle wooden slot indentation indicator */}
                      {!placedPiece && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white/10 pointer-events-none" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Placed Pieces Rendered on the Board with Jigsaw SVG Clipping */}
              {Object.entries(placedSlots).map(([slotIdx, piece]) => {
                const sIdx = parseInt(slotIdx, 10);
                const r = Math.floor(sIdx / cols);
                const c = sIdx % cols;

                return (
                  <div
                    key={piece.id}
                    onClick={() => handleSlotClick(sIdx)}
                    title="Click to return to tray"
                    className="absolute cursor-pointer group transition-transform active:scale-98 z-10"
                    style={{
                      left: `${c * pieceW - tabPadding}px`,
                      top: `${r * pieceH - tabPadding}px`,
                      width: `${pieceW + 2 * tabPadding}px`,
                      height: `${pieceH + 2 * tabPadding}px`,
                    }}
                  >
                    <svg
                      viewBox={`${-tabPadding} ${-tabPadding} ${pieceW + 2 * tabPadding} ${pieceH + 2 * tabPadding}`}
                      className="w-full h-full overflow-visible drop-shadow-md"
                    >
                      <defs>
                        <clipPath id={`board-clip-${piece.id}`}>
                          <path d={piece.pathData} />
                        </clipPath>
                      </defs>

                      {/* Clipped Image Piece */}
                      <g clipPath={`url(#board-clip-${piece.id})`}>
                        <image
                          href={selectedArtwork.src}
                          x={-piece.col * pieceW}
                          y={-piece.row * pieceH}
                          width={boardSize}
                          height={boardSize}
                          preserveAspectRatio="none"
                        />
                      </g>

                      {/* 3D Embossed Jigsaw Seams */}
                      <path
                        d={piece.pathData}
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.4)"
                        strokeWidth="1.2"
                      />
                      <path
                        d={piece.pathData}
                        fill="none"
                        stroke="rgba(0, 0, 0, 0.35)"
                        strokeWidth="0.8"
                      />
                    </svg>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Progress Bar & Stats HUD */}
          <div className="w-full max-w-[460px] mt-4 p-3 rounded-2xl bg-white dark:bg-[#142038] border border-slate-200 dark:border-[#223558] shadow-sm flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span className="font-mono">{formatTime(elapsedSec)}</span>
            </div>

            <div className="flex items-center gap-2">
              <span>{placedCount} / {totalPieces} Locked ({progressPercent}%)</span>
              <div className="w-24 h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="text-slate-400 font-mono">
              Moves: {moves}
            </div>
          </div>
        </div>

        {/* Right Side: The Jigsaw Loose Pieces Tray with Rotation & Sorter */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          
          <div className="p-4 sm:p-5 rounded-3xl bg-slate-100 dark:bg-[#142038] border border-slate-200 dark:border-[#223558] shadow-sm">
            
            {/* Tray Header & Edge Sorter Filter */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Piece Tray ({displayedPieces.length} left)
                </h3>
              </div>

              {/* Pro Sorter: Edges Only Filter */}
              <button
                onClick={() => setFilterEdgesOnly(!filterEdgesOnly)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all border ${
                  filterEdgesOnly
                    ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/40'
                    : 'bg-white dark:bg-[#0c1527] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-[#223558]'
                }`}
                title="Filter to show only straight-edged border pieces"
              >
                <Filter className="w-3 h-3" />
                <span>{filterEdgesOnly ? 'Borders Only' : 'All Pieces'}</span>
              </button>
            </div>

            {/* Rotation Control Toolbar (Appears when a piece is selected) */}
            {selectedPieceId && rotationEnabled && (
              <div className="mb-3 p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between animate-fade-in">
                <span className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                  <RotateCw className="w-4 h-4 text-amber-600" />
                  <span>Selected Piece:</span>
                </span>
                <button
                  onClick={handleRotateSelected}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Rotate 90° (or Press R)</span>
                </button>
              </div>
            )}

            {/* Empty Tray Notice */}
            {pieces.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                <h4 className="font-bold text-base text-slate-800 dark:text-slate-200">
                  Masterpiece Complete!
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isComplete
                    ? `Solved ${rows * cols} pieces in ${formatTime(elapsedSec)} with ${moves} moves!`
                    : 'All pieces placed onto the assembly board.'}
                </p>
              </div>
            ) : (
              /* Grid of Loose Jigsaw Pieces with Realistic Tabs, Sockets & Rotations */
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[460px] overflow-y-auto p-2 rounded-2xl bg-slate-50 dark:bg-[#0c1527] border border-slate-200 dark:border-[#223558]">
                {displayedPieces.map(piece => {
                  const isSelected = selectedPieceId === piece.id;

                  return (
                    <div
                      key={piece.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, piece.id)}
                      onClick={() => handlePieceClickInTray(piece.id)}
                      className={`relative aspect-square rounded-2xl p-1 flex items-center justify-center cursor-pointer transition-all duration-200 active:scale-95 select-none ${
                        isSelected
                          ? 'ring-4 ring-teal-500 bg-teal-500/15 scale-105 z-20 shadow-xl'
                          : 'hover:bg-slate-200/50 dark:hover:bg-[#162544] hover:scale-102'
                      }`}
                    >
                      {/* SVG with dynamic piece rotation applied */}
                      <div
                        className="w-full h-full flex items-center justify-center transition-transform duration-200"
                        style={{
                          transform: `rotate(${piece.rotation}deg)`
                        }}
                      >
                        <svg
                          viewBox={`${-tabPadding} ${-tabPadding} ${pieceW + 2 * tabPadding} ${pieceH + 2 * tabPadding}`}
                          className="w-full h-full overflow-visible drop-shadow-md"
                        >
                          <defs>
                            <clipPath id={`tray-clip-${piece.id}`}>
                              <path d={piece.pathData} />
                            </clipPath>
                          </defs>

                          {/* Clipped Image Piece */}
                          <g clipPath={`url(#tray-clip-${piece.id})`}>
                            <image
                              href={selectedArtwork.src}
                              x={-piece.col * pieceW}
                              y={-piece.row * pieceH}
                              width={boardSize}
                              height={boardSize}
                              preserveAspectRatio="none"
                            />
                          </g>

                          {/* 3D Realistic Embossed Seams */}
                          <path
                            d={piece.pathData}
                            fill="none"
                            stroke="rgba(255, 255, 255, 0.55)"
                            strokeWidth="1.6"
                          />
                          <path
                            d={piece.pathData}
                            fill="none"
                            stroke="rgba(0, 0, 0, 0.4)"
                            strokeWidth="1"
                          />
                        </svg>
                      </div>

                      {/* Selection Badge with Current Rotation Angle */}
                      {isSelected && (
                        <div className="absolute top-1 right-1 px-1.5 py-0.5 rounded-md bg-teal-600 text-white flex items-center justify-center text-[9px] font-mono font-bold shadow-xs">
                          {piece.rotation}°
                        </div>
                      )}

                      {/* Border piece indicator */}
                      {piece.isBorder && (
                        <span className="absolute bottom-1 left-1 w-1.5 h-1.5 rounded-full bg-amber-400" title="Border piece" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Instruction Tip */}
            <div className="mt-3 p-2.5 rounded-xl bg-slate-50 dark:bg-[#0c1527] text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <span className="text-base">💡</span>
              <span>
                {selectedPieceId
                  ? rotationEnabled
                    ? 'Selected! Tap Rotate 90° if needed, then tap its spot on the board to snap.'
                    : 'Selected! Tap its spot on the board to snap.'
                  : 'Tap or drag a piece. In Tough mode, pieces only snap when placed in the exact slot with upright rotation!'}
              </span>
            </div>
          </div>

          {/* Artwork Info Box */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#142038] border border-slate-200 dark:border-[#223558] text-xs space-y-1">
            <span className="text-[10px] uppercase font-bold text-teal-600 dark:text-teal-400">
              {selectedArtwork.category}
            </span>
            <h4 className="font-bold text-slate-900 dark:text-white">
              {selectedArtwork.title}
            </h4>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
              {selectedArtwork.description}
            </p>
          </div>
        </div>
      </div>

      {/* Floating Feedback Toast for mismatches / wrong rotation */}
      {feedbackToast.show && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-2xl shadow-2xl backdrop-blur-xl border flex items-center gap-2.5 text-xs font-bold animate-scale-up bg-slate-900/90 text-white border-amber-500/50">
          <span>{feedbackToast.type === 'error' ? '❌' : '⚠️'}</span>
          <span>{feedbackToast.message}</span>
        </div>
      )}

      {/* Reference Image Preview Lightbox Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="relative max-w-lg w-full bg-white dark:bg-[#142038] border border-slate-200 dark:border-[#223558] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Target Masterpiece
                </h3>
                <p className="text-xs text-slate-400">{selectedArtwork.title}</p>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-[#0c1527] dark:hover:bg-[#1a2846] flex items-center justify-center text-slate-500 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-[#223558] shadow-md">
              <img
                src={selectedArtwork.src}
                alt={selectedArtwork.title}
                className="w-full aspect-square object-cover"
              />
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
              Study the subtle color variations and edge lines to place pieces without the ghost guide.
            </p>

            <button
              onClick={() => setShowPreviewModal(false)}
              className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-colors shadow-sm"
            >
              Back to Puzzle Board
            </button>
          </div>
        </div>
      )}
    </GameWrapper>
  );
}
