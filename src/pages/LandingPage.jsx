import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Brain,
  Heart,
  Shield,
  Sparkles,
  Flower2,
  Volume2,
  Eye,
  CheckCircle2,
  ArrowRight,
  Sun,
  Moon,
  Clock,
  Puzzle,
  Globe,
  Wind,
  Trees,
  Search,
  SpellCheck,
  Compass,
  Footprints,
  Type,
  FlaskConical,
  MessageSquareHeart,
  ListOrdered,
  Layers,
  ChevronRight,
  Play
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useUserMode } from '../contexts/UserModeContext';
import NeuralHeroVisual from '../components/NeuralHeroVisual';
import { ALL_GAMES } from './GamesCatalog';

export default function LandingPage() {
  const { t } = useLanguage();
  const { switchRole } = useAuth();
  const { modes } = useUserMode();
  const navigate = useNavigate();

  // Mini Interactive Preview State for Hero section
  const [activePreviewGame, setActivePreviewGame] = useState(ALL_GAMES[0]);

  const handlePatientDemo = () => {
    switchRole('patient');
    navigate('/patient');
  };

  const handleCaregiverDemo = () => {
    switchRole('caregiver');
    navigate('/caregiver');
  };

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      
      {/* 1. Hero Section */}
      <section className="relative pt-10 sm:pt-20 pb-16 overflow-hidden">
        {/* Subtle background ambient gradient glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-cyan-500/10 via-teal-500/10 to-indigo-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Product Badge (No SIH) */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/25 text-teal-800 dark:text-teal-300 text-xs sm:text-sm font-bold shadow-xs">
                <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>Cognitive Wellness & Caregiver Support Platform</span>
              </div>

              {/* Bold Required Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.12]">
                A Brighter Mind,{' '}
                <span className="bg-gradient-to-r from-teal-600 via-cyan-500 to-indigo-600 bg-clip-text text-transparent">
                  One Moment at a Time.
                </span>
              </h1>

              {/* Required Supporting Text */}
              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Mindmate offers gentle cognitive activities, relaxation, and caregiver support designed with warmth, accessibility, and dignity for older adults.
              </p>

              {/* Required Primary, Secondary, and Separate Caregiver CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                {/* Primary CTA */}
                <Link
                  to="/games"
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-extrabold text-base shadow-lg shadow-teal-600/25 transition-all transform active:scale-95"
                >
                  <Sparkles className="w-5 h-5 text-cyan-200" />
                  <span>Explore Cognitive Games</span>
                </Link>

                {/* Secondary CTA */}
                <button
                  onClick={handlePatientDemo}
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 dark:bg-[#142038] dark:hover:bg-[#1c2c4e] border-2 border-slate-200 dark:border-[#223558] text-slate-900 dark:text-white font-bold text-base shadow-xs transition-all transform active:scale-95"
                >
                  <Heart className="w-5 h-5 text-rose-500 fill-rose-500/20" />
                  <span>Enter Patient Mode</span>
                </button>
              </div>

              {/* Clearly visible separate Enter Caregiver Mode option */}
              <div className="pt-2 flex items-center justify-center lg:justify-start gap-4 text-xs font-semibold">
                <span className="text-slate-400">Are you supporting a loved one?</span>
                <button
                  onClick={handleCaregiverDemo}
                  className="text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-extrabold flex items-center gap-1 group transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  <span>Enter Caregiver Mode</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </div>

            {/* Right Hero Visual: Interactive Synaptic Neural Visual */}
            <div className="lg:col-span-5 flex justify-center">
              <NeuralHeroVisual />
            </div>

          </div>
        </div>
      </section>

      {/* 2. Interactive Previews of Available Games */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Interactive Library</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
              Explore All 8 Cognitive Exercises
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              From memory matching and word finding to soothing color sorting—every activity is genuinely playable.
            </p>
          </div>
          <Link
            to="/games"
            className="inline-flex items-center gap-1 text-sm font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700"
          >
            <span>View All 8 Games</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Interactive Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ALL_GAMES.slice(0, 8).map(game => {
            const Icon = game.icon;
            return (
              <div
                key={game.id}
                onClick={() => navigate(game.path)}
                className="group cursor-pointer p-6 rounded-3xl bg-white dark:bg-[#142038] hover:bg-slate-50 dark:hover:bg-[#192847] border border-slate-200 dark:border-[#223558] shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-13 h-13 rounded-2xl bg-gradient-to-tr ${game.color} text-white flex items-center justify-center shadow-md mb-4 group-hover:scale-105 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 block mb-1">
                    {game.category}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {game.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                    {game.desc}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 dark:border-[#223558] flex items-center justify-between text-xs font-bold text-teal-600 dark:text-teal-400">
                  <span>Play Activity</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Patient-Friendly Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-rose-500/5 via-teal-500/5 to-indigo-500/5 border border-slate-200 dark:border-[#223558] space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              Senior Accessibility & Comfort
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
              Gentle Design Tailored for Older Adults
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Mindmate prioritizes stress-free engagement over high-pressure timers or intimidating rankings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-[#142038] border border-slate-200 dark:border-[#223558] shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <Volume2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Spoken Voice Guidance
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Clear voice instructions available on every activity with senior-tuned speech rate controls and regional language support.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#142038] border border-slate-200 dark:border-[#223558] shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Zero Pressure Pacing
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Take as long as you like. Hints, shuffles, undos, and replays are always available with no point deductions or penalties.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#142038] border border-slate-200 dark:border-[#223558] shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Trees className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Living Memory Garden
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Watch an uplifting visual garden sprout flowers and shade trees as you complete daily cognitive activities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Caregiver Dashboard & Progress Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-extrabold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              Caregiver Support & Peace of Mind
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
              Transparent, Respectful Family Insights
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Caregivers can review participation trends, configure fatigue check-in reminders, and log supportive observations without invading privacy.
            </p>
            <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-200">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                <span>Live session fatigue alerts (Comfortable, Check-in, Break Suggestion)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                <span>Configurable break thresholds (18m, 30m, 45m targets)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                <span>Caregiver observation diary to record moments of joy</span>
              </li>
            </ul>
            <div className="pt-2">
              <button
                onClick={handleCaregiverDemo}
                className="px-6 py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md transition-all active:scale-95 flex items-center gap-2"
              >
                <Shield className="w-4 h-4" />
                <span>Open Caregiver Portal</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#142038] border border-slate-200 dark:border-[#223558] shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#223558]">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Live Caregiver Telemetry Preview
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0c1527] border border-slate-200 dark:border-[#223558]">
                <span className="text-[11px] font-bold text-slate-400">Current Session</span>
                <div className="text-xl font-black text-slate-900 dark:text-white mt-1">14 mins</div>
                <span className="text-[10px] text-emerald-600 font-semibold">● Within target</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0c1527] border border-slate-200 dark:border-[#223558]">
                <span className="text-[11px] font-bold text-slate-400">Streak Record</span>
                <div className="text-xl font-black text-slate-900 dark:text-white mt-1">4 Days</div>
                <span className="text-[10px] text-amber-600 font-semibold">Consistent habit</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-[#111d35] border border-teal-200 dark:border-[#223558] text-xs text-slate-700 dark:text-slate-300">
              <strong className="block text-teal-900 dark:text-teal-200 mb-1">
                Caregiver Note:
              </strong>
              "Eleanor thoroughly enjoyed the Garden Maze and Word Scramble exercises today. Took a peaceful breathing pause after 15 minutes."
            </div>
          </div>
        </div>
      </section>

      {/* 5. Calm & Relaxation Hub Feature */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#142038] border border-slate-200 dark:border-[#223558] shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Mindfulness & Rest
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
              Restorative Calm Whenever You Need It
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Enjoy realistic, comfortable guided breathing circles (Coherent 4-4, Gentle Flow, Box Breathing, and Sleep) alongside synthesized ambient soundscapes with intelligent audio ducking.
            </p>
            <Link
              to="/relaxation"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all active:scale-95"
            >
              <Wind className="w-4 h-4" />
              <span>Explore Relaxation Hub</span>
            </Link>
          </div>

          <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr from-teal-500 via-indigo-500 to-sky-400 flex flex-col items-center justify-center text-white shadow-xl shadow-indigo-500/20 animate-pulse">
            <Wind className="w-12 h-12 mb-2" />
            <span className="text-xs uppercase font-extrabold tracking-widest text-white/80">
              Mindful Breathing
            </span>
            <span className="text-2xl font-black">Peace</span>
          </div>
        </div>
      </section>

      {/* 6. 13-Language Multilingual & Accessibility Support */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-teal-600 dark:text-teal-400">
            Inclusivity Across India
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Available in 13 Indian Languages
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
            English, Assamese, Meitei, Bodo, Mizo, Khasi, Garo, Kokborok, Hindi, Tamil, Telugu, Kannada, and Malayalam.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-4xl mx-auto">
          {[
            'English', 'অসমীয়া', 'ꯃꯩꯇꯩꯂꯣꯟ', 'बर\'', 'Mizo ṭawng', 'Ka Ktien Khasi',
            'A·chik', 'Kokborok', 'हिन्दी', 'தமிழ்', 'తెలుగు', 'ಕನ್ನಡ', 'മലയാളം'
          ].map(langName => (
            <span
              key={langName}
              className="px-4 py-2 rounded-2xl bg-white dark:bg-[#142038] border border-slate-200 dark:border-[#223558] text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 shadow-xs"
            >
              {langName}
            </span>
          ))}
        </div>
      </section>

    </div>
  );
}
