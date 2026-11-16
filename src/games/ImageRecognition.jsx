import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Eye,
  Search,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Camera,
  Compass,
  Layers,
  Volume2,
  VolumeX,
  Trophy,
  Lightbulb,
  Award,
  Sliders,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import GameWrapper from '../components/GameWrapper';

// Rich Curated Photographic Collection with Nostalgic & Sensory Details
const ITEMS_DATABASE = [
  {
    id: 'pocket-watch',
    name: 'Vintage Brass Pocket Watch',
    category: 'Nostalgic Keepsake',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=700&auto=format&fit=crop&q=80',
    clue: 'Intricate brass gears, ticking secondhand, and Roman numerals.',
    memoryStory: 'Pocket watches were treasured family heirlooms carried in waistcoat pockets, wound by hand every morning.',
    funFact: 'Before wristwatches became common during World War I, virtually all gentlemen kept pocket watches on gold chains.'
  },
  {
    id: 'fountain-pen',
    name: 'Classic Fountain Pen',
    category: 'Artisan Desk',
    image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=700&auto=format&fit=crop&q=80',
    clue: 'Golden engraved metal nib and dark flowing ink reservoir.',
    memoryStory: 'Handwritten fountain pen letters carried the unique personality and care of the writer on parchment paper.',
    funFact: 'Fountain pen nibs gradually mold themselves to the exact angle and pressure of their owner’s handwriting hand.'
  },
  {
    id: 'antique-camera',
    name: 'Vintage Leather Camera',
    category: 'Memory Keeper',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=700&auto=format&fit=crop&q=80',
    clue: 'Twin-lens reflection, silver shutter dial, and textured black leather.',
    memoryStory: 'Waiting for film rolls to be developed at the local apothecary brought days of joyful anticipation.',
    funFact: 'Early film rolls were precious—families took only 12 or 24 carefully composed pictures for an entire vacation.'
  },
  {
    id: 'compass',
    name: 'Brass Navigator’s Compass',
    category: 'Adventure & Journey',
    image: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=700&auto=format&fit=crop&q=80',
    clue: 'Jeweled magnetic needle always pointing toward true magnetic North.',
    memoryStory: 'Guides travelers across uncharted seas and misty hiking trails without relying on any electricity.',
    funFact: 'Magnetic compasses were first invented during China’s Han Dynasty around 206 BC, originally using lodestone.'
  },
  {
    id: 'teacup',
    name: 'Floral Ceramic Teacup',
    category: 'Cozy Living',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=700&auto=format&fit=crop&q=80',
    clue: 'Delicate porcelain handle, gilt rim, and steaming aromatic tea.',
    memoryStory: 'Afternoon tea with butter biscuits and warm conversation with close friends and cherished relatives.',
    funFact: 'The handle on teacups was popularized in Europe in the early 1700s so hot porcelain wouldn’t burn fingertips.'
  },
  {
    id: 'butterfly',
    name: 'Monarch Butterfly on Lavender',
    category: 'Nature & Garden',
    image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=700&auto=format&fit=crop&q=80',
    clue: 'Bright orange patterned wings with black borders and white polka dots.',
    memoryStory: 'Watching gentle butterflies dance between summer garden blossoms on a warm, sunny afternoon.',
    funFact: 'Monarch butterflies travel up to 3,000 miles across North America each autumn in one of nature’s greatest migrations.'
  },
  {
    id: 'robin-bird',
    name: 'Garden Songbird (Robin)',
    category: 'Wildlife Friend',
    image: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=700&auto=format&fit=crop&q=80',
    clue: 'Vibrant red-orange breast plumage and curious dark round eyes.',
    memoryStory: 'The friendly garden robin that faithfully follows the spade when turning fresh springtime garden soil.',
    funFact: 'Robins can hear earthworms moving underground by tilting their heads and listening for subtle soil vibrations.'
  },
  {
    id: 'sunflower',
    name: 'Golden Sunflower Blossom',
    category: 'Sunlit Fields',
    image: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=700&auto=format&fit=crop&q=80',
    clue: 'Radiant golden yellow rays surrounding a spiral seeded dark center.',
    memoryStory: 'Tall sunflower gardens planted along backyard fences, tracking the golden sunlight from dawn until dusk.',
    funFact: 'Young sunflowers exhibit heliotropism: they literally turn their heads to follow the sun across the sky every day.'
  },
  {
    id: 'pinecone',
    name: 'Forest Pinecone & Moss',
    category: 'Woodland Serenity',
    image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=700&auto=format&fit=crop&q=80',
    clue: 'Fibonacci spiral overlapping wooden scales with crisp pine scent.',
    memoryStory: 'Walking through fragrant autumn woods, collecting pinecones and colorful leaves for a festive centerpiece.',
    funFact: 'Pinecones open their scales in dry weather so seeds can blow away, but seal tightly shut when wet or raining.'
  },
  {
    id: 'strawberries',
    name: 'Fresh Garden Strawberries',
    category: 'Sweet Orchard',
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=700&auto=format&fit=crop&q=80',
    clue: 'Ruby red heart-shaped berries speckled with tiny external seeds.',
    memoryStory: 'Picking sun-warmed ripe berries straight from the garden patch and topping warm vanilla ice cream.',
    funFact: 'Strawberries are the only fruit with their seeds on the outside—an average strawberry has about 200 tiny seeds!'
  },
  {
    id: 'honeycomb',
    name: 'Pure Golden Honeycomb',
    category: 'Nature’s Sweetness',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=700&auto=format&fit=crop&q=80',
    clue: 'Perfect hexagonal wax cells dripping with warm amber honey.',
    memoryStory: 'Drizzling sweet honey into hot morning tea or over fresh baked buttery scones.',
    funFact: 'Bees build hexagonal cells because hexagons use the least amount of wax while holding the maximum volume of honey.'
  },
  {
    id: 'coffee-beans',
    name: 'Roasted Arabica Coffee Beans',
    category: 'Morning Ritual',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=700&auto=format&fit=crop&q=80',
    clue: 'Deep mahogany roasted beans with a center crack and rich aroma.',
    memoryStory: 'The comforting, inviting aroma of fresh roasted coffee brewing on a peaceful Sunday morning.',
    funFact: 'Coffee beans aren’t beans at all—they are the pits or seeds of a red cherry that grows on tropical coffee shrubs.'
  }
];

// Creative Game Modes
const MODES = [
  {
    id: 'detective',
    title: 'The Detective’s Loupe',
    icon: Search,
    badge: 'Focus & Lens',
    desc: 'The image starts in a gentle mist. Move your brass magnifying loupe across the image or tap Sharpen to inspect details.'
  },
  {
    id: 'vanishing',
    title: 'The Memory Attic',
    icon: Layers,
    badge: 'What Vanished?',
    desc: 'Study a collection of cherished keepsakes. After the velvet curtain closes, discover which item went missing!'
  },
  {
    id: 'macro',
    title: 'Macro Mystery',
    icon: ZoomIn,
    badge: 'Texture Detective',
    desc: 'Examine an extreme close-up texture. Tap Zoom Out step-by-step to reveal the full object.'
  }
];

export default function ImageRecognition() {
  const [difficulty, setDifficulty] = useState('Regular');
  const [selectedModeId, setSelectedModeId] = useState('detective');
  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds] = useState(5);
  const [score, setScore] = useState(100);
  const [isComplete, setIsComplete] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Mode 1: Detective Loupe State
  const [detectiveItem, setDetectiveItem] = useState(null);
  const [detectiveOptions, setDetectiveOptions] = useState([]);
  const [lensBlur, setLensBlur] = useState(16); // px blur
  const [loupePos, setLoupePos] = useState({ x: 50, y: 50, active: false });
  const [selectedDetectiveOption, setSelectedDetectiveOption] = useState(null);
  const [showStoryModal, setShowStoryModal] = useState(false);

  // Mode 2: Vanishing Attic State
  const [atticItems, setAtticItems] = useState([]);
  const [vanishedItem, setVanishedItem] = useState(null);
  const [atticPhase, setAtticPhase] = useState('observe'); // 'observe' | 'curtain' | 'recall'
  const [atticOptions, setAtticOptions] = useState([]);
  const [selectedAtticOption, setSelectedAtticOption] = useState(null);

  // Mode 3: Macro Mystery State
  const [macroItem, setMacroItem] = useState(null);
  const [macroZoomLevel, setMacroZoomLevel] = useState(3.5); // 3.5 -> 2.2 -> 1.0
  const [macroOptions, setMacroOptions] = useState([]);
  const [selectedMacroOption, setSelectedMacroOption] = useState(null);

  // Feedback State
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
  const [streak, setStreak] = useState(0);

  const audioCtxRef = useRef(null);
  const imageContainerRef = useRef(null);

  // Synthesizer Audio Cues
  const playAudioCue = useCallback((type) => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;
      if (type === 'correct') {
        // Joyful ascending chime chord
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.12, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.8);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.8);
        });
      } else if (type === 'wrong') {
        // Soft mellow bump
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(90, now + 0.15);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'lens') {
        // Soft camera shutter / focus click
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);
        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.04);
      }
    } catch {
      // Audio fallback gracefully handled
    }
  }, [soundEnabled]);

  // Start / Reset Round Generator
  const initRound = useCallback(() => {
    setIsAnswerCorrect(null);
    setSelectedDetectiveOption(null);
    setSelectedAtticOption(null);
    setSelectedMacroOption(null);
    setShowStoryModal(false);

    const shuffledPool = [...ITEMS_DATABASE].sort(() => Math.random() - 0.5);

    if (selectedModeId === 'detective') {
      // Setup Detective Loupe
      const target = shuffledPool[0];
      const distractors = shuffledPool.slice(1, difficulty === 'Gentle' ? 3 : 4);
      const opts = [target, ...distractors].sort(() => Math.random() - 0.5);

      setDetectiveItem(target);
      setDetectiveOptions(opts);
      setLensBlur(difficulty === 'Gentle' ? 10 : difficulty === 'Challenge' ? 22 : 16);
      setLoupePos({ x: 50, y: 50, active: false });
    } else if (selectedModeId === 'vanishing') {
      // Setup Vanishing Attic
      const basketCount = difficulty === 'Gentle' ? 3 : difficulty === 'Challenge' ? 5 : 4;
      const chosenItems = shuffledPool.slice(0, basketCount);
      const toVanish = chosenItems[Math.floor(Math.random() * chosenItems.length)];
      const distractors = shuffledPool.slice(basketCount, basketCount + 3);
      const opts = [toVanish, ...distractors].sort(() => Math.random() - 0.5);

      setAtticItems(chosenItems);
      setVanishedItem(toVanish);
      setAtticOptions(opts);
      setAtticPhase('observe');
    } else if (selectedModeId === 'macro') {
      // Setup Macro Mystery
      const target = shuffledPool[0];
      const distractors = shuffledPool.slice(1, 4);
      const opts = [target, ...distractors].sort(() => Math.random() - 0.5);

      setMacroItem(target);
      setMacroOptions(opts);
      setMacroZoomLevel(difficulty === 'Gentle' ? 2.5 : 3.8);
    }
  }, [selectedModeId, difficulty]);

  useEffect(() => {
    setCurrentRound(1);
    setScore(100);
    setIsComplete(false);
    setStreak(0);
    initRound();
  }, [initRound, selectedModeId, difficulty]);

  // Handle Loupe Mouse / Touch Navigation
  const handleMouseMoveOverImage = (e) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const xPercent = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const yPercent = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setLoupePos({ x: xPercent, y: yPercent, active: true });
  };

  const handleTouchMoveOverImage = (e) => {
    if (!imageContainerRef.current || !e.touches[0]) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const xPercent = Math.max(0, Math.min(100, ((touch.clientX - rect.left) / rect.width) * 100));
    const yPercent = Math.max(0, Math.min(100, ((touch.clientY - rect.top) / rect.height) * 100));
    setLoupePos({ x: xPercent, y: yPercent, active: true });
  };

  // Sharpen Lens Helper
  const handleSharpenLens = () => {
    setLensBlur(prev => Math.max(0, prev - 5));
    playAudioCue('lens');
  };

  // Step Forward in Rounds
  const handleAdvanceRound = (wasCorrect) => {
    if (wasCorrect) {
      setStreak(s => s + 1);
      playAudioCue('correct');
    } else {
      playAudioCue('wrong');
    }

    setTimeout(() => {
      if (currentRound >= totalRounds) {
        setIsComplete(true);
      } else {
        setCurrentRound(r => r + 1);
        initRound();
      }
    }, 1500);
  };

  // 1. Submit Option in Detective Mode
  const handleSelectDetective = (item) => {
    if (selectedDetectiveOption !== null) return;
    setSelectedDetectiveOption(item.id);
    const correct = item.id === detectiveItem.id;
    setIsAnswerCorrect(correct);
    if (correct) {
      setShowStoryModal(true);
      setLensBlur(0);
    }
    handleAdvanceRound(correct);
  };

  // 2. Submit Option in Vanishing Mode
  const handleTriggerCurtain = () => {
    setAtticPhase('curtain');
    playAudioCue('lens');
    setTimeout(() => {
      setAtticPhase('recall');
    }, 900);
  };

  const handleSelectAttic = (item) => {
    if (selectedAtticOption !== null) return;
    setSelectedAtticOption(item.id);
    const correct = item.id === vanishedItem.id;
    setIsAnswerCorrect(correct);
    handleAdvanceRound(correct);
  };

  // 3. Submit Option in Macro Mode
  const handleZoomOutMacro = () => {
    setMacroZoomLevel(prev => Math.max(1.0, prev - 0.8));
    playAudioCue('lens');
  };

  const handleSelectMacro = (item) => {
    if (selectedMacroOption !== null) return;
    setSelectedMacroOption(item.id);
    const correct = item.id === macroItem.id;
    setIsAnswerCorrect(correct);
    if (correct) {
      setMacroZoomLevel(1.0); // Full zoom out on correct
    }
    handleAdvanceRound(correct);
  };

  return (
    <GameWrapper
      gameId="image-recognition"
      gameTitle="Visual Discovery & Memory Lab"
      icon={Eye}
      difficulty={difficulty}
      setDifficulty={setDifficulty}
      instructions="Sharpen your observational skills across high-definition photographic scenes. Inspect fine textures with the brass magnifying loupe, detect vanishing items, or solve macro mysteries."
      spokenInstruction="Welcome to Visual Discovery. Observe the details, use your magnifying lens, and recognize the authentic objects to train your visual memory."
      isComplete={isComplete}
      score={score}
      onRestart={() => {
        setCurrentRound(1);
        setIsComplete(false);
        initRound();
      }}
    >
      {/* 1. Mode Switcher & Stats HUD */}
      <div className="space-y-4 mb-6">
        
        {/* Game Mode Pills */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-2xl bg-slate-100 dark:bg-[#142038] border border-slate-200 dark:border-[#223558]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-wide">
              Discovery Mode:
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full sm:w-auto">
            {MODES.map(mode => {
              const Icon = mode.icon;
              const isSelected = selectedModeId === mode.id;

              return (
                <button
                  key={mode.id}
                  onClick={() => setSelectedModeId(mode.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${
                    isSelected
                      ? 'bg-teal-600 text-white shadow-md ring-2 ring-teal-400/30'
                      : 'bg-white dark:bg-[#0c1527] text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-[#1c2c4e] border border-slate-200 dark:border-[#223558]'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <div>
                    <div className="leading-tight">{mode.title}</div>
                    <div className={`text-[10px] ${isSelected ? 'text-teal-100' : 'text-slate-400'}`}>
                      {mode.badge}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Round Progress & Streak Indicator */}
        <div className="flex items-center justify-between px-2 text-xs font-bold text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span>Round <strong className="text-teal-600 dark:text-teal-400 font-mono text-sm">{currentRound}</strong> of {totalRounds}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
            <span className="text-slate-400">{MODES.find(m => m.id === selectedModeId)?.title}</span>
          </div>

          {streak > 1 && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 text-xs font-bold animate-bounce">
              <span>🔥 {streak} Discovery Streak!</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. MODE 1: THE DETECTIVE'S LOUPE */}
      {selectedModeId === 'detective' && detectiveItem && (
        <div className="space-y-6">
          <div className="text-center max-w-lg mx-auto space-y-1">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              What Object is Concealed Behind the Lens?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Drag your mouse or finger across the image to reveal crystal-clear details with your loupe.
            </p>
          </div>

          {/* Interactive Loupe Canvas */}
          <div className="relative max-w-md mx-auto aspect-square rounded-3xl overflow-hidden border-4 border-slate-800 shadow-2xl bg-black select-none group">
            
            {/* The Main Blurred/Obscured Photographic View */}
            <div
              ref={imageContainerRef}
              onMouseMove={handleMouseMoveOverImage}
              onTouchMove={handleTouchMoveOverImage}
              onMouseLeave={() => setLoupePos(prev => ({ ...prev, active: false }))}
              className="relative w-full h-full cursor-crosshair"
            >
              <img
                src={detectiveItem.image}
                alt="Detective Subject"
                className="w-full h-full object-cover transition-all duration-300"
                style={{
                  filter: `blur(${lensBlur}px) saturate(0.85)`
                }}
              />

              {/* The Interactive Brass Loupe Lens Overlay */}
              {loupePos.active && lensBlur > 0 && (
                <div
                  className="absolute pointer-events-none w-36 h-36 rounded-full border-4 border-amber-400 shadow-2xl overflow-hidden -translate-x-1/2 -translate-y-1/2 ring-4 ring-black/40"
                  style={{
                    left: `${loupePos.x}%`,
                    top: `${loupePos.y}%`,
                    boxShadow: '0 0 35px rgba(251, 191, 36, 0.5), inset 0 0 20px rgba(0,0,0,0.4)'
                  }}
                >
                  {/* High-Resolution Sharp Zoom View Inside the Loupe */}
                  <div
                    className="w-full h-full"
                    style={{
                      backgroundImage: `url(${detectiveItem.image})`,
                      backgroundPosition: `${loupePos.x}% ${loupePos.y}%`,
                      backgroundSize: '300%',
                    }}
                  />
                  {/* Subtle Glass Reflection Shine */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent pointer-events-none" />
                </div>
              )}

              {/* Helpful Hint Overlay if loupe not moving */}
              {!loupePos.active && lensBlur > 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[1px] pointer-events-none">
                  <div className="px-4 py-2 rounded-2xl bg-slate-900/80 border border-white/20 text-white text-xs font-bold flex items-center gap-2 shadow-xl animate-pulse">
                    <Search className="w-4 h-4 text-amber-400" />
                    <span>Touch or move cursor to use Loupe</span>
                  </div>
                </div>
              )}
            </div>

            {/* Lens Sharpness Control Button */}
            {lensBlur > 0 && (
              <button
                onClick={handleSharpenLens}
                className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-amber-300 text-xs font-bold border border-amber-400/40 shadow-lg flex items-center gap-1.5 transition-all backdrop-blur-md active:scale-95"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Sharpen Lens (-5px)</span>
              </button>
            )}
          </div>

          {/* Multiple Choice Photographic Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
            {detectiveOptions.map(opt => {
              const isSelected = selectedDetectiveOption === opt.id;
              let style = 'bg-white dark:bg-[#142038] hover:bg-slate-50 dark:hover:bg-[#1a2846] border-slate-200 dark:border-[#223558] text-slate-800 dark:text-slate-100';

              if (isSelected) {
                if (isAnswerCorrect) {
                  style = 'bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-400/40 shadow-lg scale-102';
                } else {
                  style = 'bg-rose-500 text-white border-rose-600 ring-4 ring-rose-400/40 animate-shake';
                }
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectDetective(opt)}
                  disabled={selectedDetectiveOption !== null}
                  className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${style}`}
                >
                  <img
                    src={opt.image}
                    alt={opt.name}
                    className="w-12 h-12 rounded-xl object-cover shrink-0 border border-white/20"
                  />
                  <div className="overflow-hidden">
                    <div className="font-bold text-xs sm:text-sm truncate leading-tight">
                      {opt.name}
                    </div>
                    <div className="text-[11px] opacity-75 truncate mt-0.5">
                      {opt.category}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Correct Answer Memory Story Toast */}
          {isAnswerCorrect === true && (
            <div className="p-4 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs space-y-1.5 max-w-lg mx-auto animate-scale-up">
              <div className="flex items-center gap-1.5 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Splendid Recognition! It is the {detectiveItem.name}.</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                {detectiveItem.memoryStory}
              </p>
            </div>
          )}
        </div>
      )}

      {/* 3. MODE 2: THE NOSTALGIA ATTIC (WHAT VANISHED?) */}
      {selectedModeId === 'vanishing' && (
        <div className="space-y-6">
          <div className="text-center max-w-lg mx-auto space-y-1">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              {atticPhase === 'observe'
                ? 'Study The Cherished Keepsakes'
                : 'Which Beloved Item Vanished?'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {atticPhase === 'observe'
                ? 'Remember each object on the mahogany table. When ready, draw the curtain.'
                : 'One item was carefully put away. Identify which one was removed!'}
            </p>
          </div>

          {/* Tabletop Still Life */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-amber-950/20 to-amber-950/40 dark:from-[#070d19] dark:to-[#050912] border-4 border-amber-900/30 dark:border-[#223558] shadow-2xl max-w-xl mx-auto">
            {atticPhase === 'curtain' ? (
              <div className="py-24 text-center space-y-3 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-rose-900/60 border border-rose-500/40 mx-auto flex items-center justify-center animate-spin">
                  <Sparkles className="w-8 h-8 text-rose-300" />
                </div>
                <h4 className="font-bold text-sm text-amber-200">
                  Drawing the Velvet Curtain...
                </h4>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {(atticPhase === 'observe'
                  ? atticItems
                  : atticItems.filter(item => item.id !== vanishedItem.id)
                ).map(item => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-white/90 dark:bg-[#142038] border border-amber-800/20 dark:border-[#223558] shadow-md flex flex-col items-center text-center space-y-2 animate-scale-up"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full aspect-square rounded-xl object-cover shadow-inner"
                    />
                    <div className="font-bold text-xs text-slate-900 dark:text-white truncate max-w-full">
                      {item.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Button: Ready to Draw Curtain */}
          {atticPhase === 'observe' && (
            <div className="text-center">
              <button
                onClick={handleTriggerCurtain}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 to-teal-600 hover:from-amber-700 hover:to-teal-700 text-white font-black text-sm shadow-lg transition-all active:scale-95"
              >
                I Have Memorized The Table &rarr;
              </button>
            </div>
          )}

          {/* Recall Phase Options */}
          {atticPhase === 'recall' && (
            <div className="space-y-4 max-w-lg mx-auto">
              <span className="text-xs font-bold text-slate-400 block text-center uppercase tracking-wider">
                Select the Missing Object:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {atticOptions.map(opt => {
                  const isSelected = selectedAtticOption === opt.id;
                  let style = 'bg-white dark:bg-[#142038] hover:bg-slate-50 dark:hover:bg-[#1a2846] border-slate-200 dark:border-[#223558] text-slate-800 dark:text-slate-100';

                  if (isSelected) {
                    if (isAnswerCorrect) {
                      style = 'bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-400/40 shadow-lg';
                    } else {
                      style = 'bg-rose-500 text-white border-rose-600 ring-4 ring-rose-400/40';
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectAttic(opt)}
                      disabled={selectedAtticOption !== null}
                      className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${style}`}
                    >
                      <img
                        src={opt.image}
                        alt={opt.name}
                        className="w-12 h-12 rounded-xl object-cover shrink-0 border border-white/20"
                      />
                      <div className="overflow-hidden">
                        <div className="font-bold text-xs sm:text-sm truncate leading-tight">
                          {opt.name}
                        </div>
                        <div className="text-[11px] opacity-75 truncate mt-0.5">
                          {opt.category}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {isAnswerCorrect === true && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold text-center max-w-md mx-auto animate-fade-in">
              ✨ Brilliant observation! The {vanishedItem.name} was indeed the missing item.
            </div>
          )}
        </div>
      )}

      {/* 4. MODE 3: MACRO MYSTERY (EXTREME CLOSE-UP DETECTIVE) */}
      {selectedModeId === 'macro' && macroItem && (
        <div className="space-y-6">
          <div className="text-center max-w-lg mx-auto space-y-1">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              Macro Texture Detective
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Identify the natural object from this magnified surface texture, or tap Zoom Out for more perspective.
            </p>
          </div>

          {/* Macro Zoom Viewport */}
          <div className="relative max-w-md mx-auto aspect-square rounded-3xl overflow-hidden border-4 border-teal-500/40 shadow-2xl bg-black select-none">
            <div
              className="w-full h-full transition-all duration-500 ease-out"
              style={{
                backgroundImage: `url(${macroItem.image})`,
                backgroundPosition: 'center',
                backgroundSize: `${macroZoomLevel * 100}%`,
              }}
            />

            {/* Zoom Out Helper Button */}
            {macroZoomLevel > 1.0 && (
              <button
                onClick={handleZoomOutMacro}
                className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-teal-300 text-xs font-bold border border-teal-400/40 shadow-lg flex items-center gap-1.5 transition-all backdrop-blur-md active:scale-95"
              >
                <ZoomOut className="w-3.5 h-3.5" />
                <span>Step Back & Zoom Out</span>
              </button>
            )}

            {/* Current Zoom Level Badge */}
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white font-mono text-[11px] font-bold">
              {macroZoomLevel.toFixed(1)}× Magnified
            </div>
          </div>

          {/* Macro Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
            {macroOptions.map(opt => {
              const isSelected = selectedMacroOption === opt.id;
              let style = 'bg-white dark:bg-[#142038] hover:bg-slate-50 dark:hover:bg-[#1a2846] border-slate-200 dark:border-[#223558] text-slate-800 dark:text-slate-100';

              if (isSelected) {
                if (isAnswerCorrect) {
                  style = 'bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-400/40 shadow-lg';
                } else {
                  style = 'bg-rose-500 text-white border-rose-600 ring-4 ring-rose-400/40';
                }
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectMacro(opt)}
                  disabled={selectedMacroOption !== null}
                  className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${style}`}
                >
                  <img
                    src={opt.image}
                    alt={opt.name}
                    className="w-12 h-12 rounded-xl object-cover shrink-0 border border-white/20"
                  />
                  <div className="overflow-hidden">
                    <div className="font-bold text-xs sm:text-sm truncate leading-tight">
                      {opt.name}
                    </div>
                    <div className="text-[11px] opacity-75 truncate mt-0.5">
                      {opt.category}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {isAnswerCorrect === true && (
            <div className="p-4 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs space-y-1 max-w-lg mx-auto animate-scale-up">
              <div className="flex items-center gap-1.5 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Sharp Eye! That was {macroItem.name}.</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                {macroItem.funFact}
              </p>
            </div>
          )}
        </div>
      )}
    </GameWrapper>
  );
}
