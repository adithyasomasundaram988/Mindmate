import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Heart, Shield, HelpCircle, ExternalLink } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-white dark:bg-[#0c1527] border-t border-slate-200 dark:border-[#223558] text-slate-600 dark:text-slate-400 py-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Disclaimer Box */}
        <div className="mb-10 p-5 rounded-2xl bg-teal-50/60 dark:bg-[#111d35] border border-teal-200/60 dark:border-[#223558] text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <div className="flex items-start gap-3">
            <Heart className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-teal-900 dark:text-teal-200 block mb-1">
                Mindmate Cognitive Wellness Notice
              </span>
              Mindmate is a supportive cognitive-wellness, memory-assistance, and caregiver-support platform. Mindmate does not claim to diagnose, treat, prevent, or cure dementia, Alzheimer's, or any medical condition. It is designed as an approachable, low-pressure cognitive companion and not as a medical device or substitute for professional clinical care.
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 to-sky-500 flex items-center justify-center text-white">
                <Brain className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-slate-900 dark:text-white">Mindmate</span>
            </div>
            <p className="text-xs leading-relaxed">
              Every memory matters. Empowering seniors with warmth, accessibility, and peace of mind.
            </p>
            <div className="text-xs text-teal-600 dark:text-teal-400 font-medium">
              Cognitive Wellness & Caregiver Support
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/patient" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Patient Dashboard</Link></li>
              <li><Link to="/caregiver" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Caregiver Insights</Link></li>
              <li><Link to="/games" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Cognitive Activity Library (8 Games)</Link></li>
              <li><Link to="/garden" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Memory Garden</Link></li>
              <li><Link to="/relaxation" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Calm & Relaxation</Link></li>
            </ul>
          </div>

          {/* Accessibility & Safety */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Accessibility & Safety
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/settings" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">High Contrast & Text Size</Link></li>
              <li><Link to="/settings" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Voice Guidance Preferences</Link></li>
              <li><Link to="/settings" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Session & Break Timers</Link></li>
              <li><Link to="/settings" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Password Security Rules</Link></li>
            </ul>
          </div>

          {/* Support & Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Help Desk
            </h4>
            <p className="text-xs mb-3">
              Need assistance or want to learn how to play a game?
            </p>
            <Link
              to="/help"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#162544] dark:hover:bg-[#1c2c4e] text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              Visit Help Desk
            </Link>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-[#223558] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Mindmate. Every memory matters. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with accessible design, Web Speech API & local privacy.
          </p>
        </div>

      </div>
    </footer>
  );
}
