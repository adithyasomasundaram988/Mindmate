import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Flower2,
  Bell,
  Eye,
  Footprints,
  FlaskConical,
  Puzzle,
  SpellCheck,
  Search,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useUserMode } from '../contexts/UserModeContext';

export const ALL_GAMES = [
  {
    id: 'memory-match',
    title: 'Memory Match',
    category: 'Memory',
    desc: 'Reveal and pair comforting everyday symbols at your own peaceful pace.',
    icon: Flower2,
    color: 'from-teal-500 to-teal-700',
    path: '/games/memory-match',
    recommendedFor: ['general', 'memoryFriendly'],
    difficulty: 'Gentle • Regular • Challenge',
  },
  {
    id: 'sequence-memory',
    title: 'Sequence Memory',
    category: 'Attention',
    desc: 'Listen and observe gentle colored bells chiming in musical harmony.',
    icon: Bell,
    color: 'from-amber-500 to-amber-700',
    path: '/games/sequence-memory',
    recommendedFor: ['focusTraining'],
    difficulty: 'Gentle • Regular • Challenge',
  },
  {
    id: 'image-recognition',
    title: 'Visual Discovery & Recognition Lab',
    category: 'Visual & Memory',
    desc: 'Explore HD nostalgic photography with an interactive brass magnifier loupe, vanishing memory attics, and macro textures.',
    icon: Eye,
    color: 'from-sky-500 to-sky-700',
    path: '/games/image-recognition',
    recommendedFor: ['memoryFriendly', 'focusTraining'],
    difficulty: 'Gentle • Regular • Challenge',
  },
  {
    id: 'maze',
    title: 'Garden Maze',
    category: 'Spatial',
    desc: 'Guide your friendly animal companion through the floral garden paths.',
    icon: Footprints,
    color: 'from-emerald-500 to-emerald-700',
    path: '/games/maze',
    recommendedFor: ['focusTraining'],
    difficulty: 'Gentle • Regular',
  },
  {
    id: 'word-scramble',
    title: 'Word Scramble',
    category: 'Language',
    desc: 'Unscramble heartwarming words with clues, hints, and letter shuffles.',
    icon: SpellCheck,
    color: 'from-fuchsia-500 to-fuchsia-700',
    path: '/games/word-scramble',
    recommendedFor: ['focusTraining', 'general'],
    difficulty: 'Easy • Medium • Hard',
  },
  {
    id: 'word-search',
    title: 'Word Search & Circle Words',
    category: 'Language',
    desc: 'Search letter grids to circle peaceful target words with glowing trails.',
    icon: Search,
    color: 'from-violet-500 to-violet-700',
    path: '/games/word-search',
    recommendedFor: ['general', 'calmRelax'],
    difficulty: 'Gentle • Regular • Challenge',
  },
  {
    id: 'test-tube-color',
    title: 'Test Tube Colour Sorting Lab',
    category: 'Sorting',
    desc: 'Strategic multi-color liquid sort puzzle with 5 difficulty tiers, up to 9 flasks, multi-pour mechanics, and +1 flask lifeline.',
    icon: FlaskConical,
    color: 'from-cyan-500 to-cyan-700',
    path: '/games/test-tube-color',
    recommendedFor: ['calmRelax'],
    difficulty: 'Gentle • Regular • Tough • Expert • Master',
  },
  {
    id: 'jigsaw-puzzle',
    title: 'Authentic Jigsaw Puzzle',
    desc: 'Assemble scenic photographic masterpieces with interlocking jigsaw tabs, ghost guide, and snap-to-grid.',
    icon: Puzzle,
    category: 'Visual',
    color: 'from-rose-500 to-rose-700',
    path: '/games/jigsaw-puzzle',
    recommendedFor: ['general', 'calmRelax'],
    difficulty: '4 • 9 • 16 Pieces',
  },
];

const CATEGORIES = ['All', 'Memory', 'Attention', 'Spatial', 'Language', 'Sorting', 'Visual'];

export default function GamesCatalog() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { activeMode } = useUserMode();
  const navigate = useNavigate();

  const filteredGames = ALL_GAMES.filter(game => {
    const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory;
    const matchesSearch =
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 text-xs font-bold">
          <Sparkles className="w-4 h-4" />
          <span>Full 8-Activity Cognitive Library</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Cognitive Activities & Puzzles
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          Eight approachable, non-punitive exercises designed for gentle mental stimulation, pattern recall, and joyful focus.
        </p>
      </div>

      {/* Search and Category Filters */}
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search activities by name or category (e.g. Memory, Words, Maze)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-[#142038] border border-slate-200 dark:border-[#223558] text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-xs"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-white dark:bg-[#142038] hover:bg-slate-100 dark:hover:bg-[#1c2c4e] border border-slate-200 dark:border-[#223558] text-slate-700 dark:text-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGames.map(game => {
          const Icon = game.icon;
          const isRecommended = game.recommendedFor.includes(activeMode.id);

          return (
            <div
              key={game.id}
              onClick={() => navigate(game.path)}
              className="cursor-pointer group p-6 rounded-3xl bg-white dark:bg-[#142038] hover:bg-slate-50/80 dark:hover:bg-[#1a2b4b] border border-slate-200 dark:border-[#223558] shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${game.color} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  {isRecommended && (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                      ★ Recommended
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
                  <span>{game.category}</span>
                  <span>•</span>
                  <span>{game.difficulty}</span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {game.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  {game.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-[#223558] flex items-center justify-between text-xs font-bold">
                <span className="text-slate-400">Playable Exercise</span>
                <span className="text-teal-600 dark:text-teal-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Play Now <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
