import React, { useState } from 'react';
import {
  HelpCircle,
  Mail,
  Phone,
  Clock,
  ChevronDown,
  ChevronUp,
  Send,
  CheckCircle2,
  AlertCircle,
  FileText,
  LifeBuoy
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const FAQS = [
  {
    category: 'Getting Started',
    q: 'What is Mindmate and how does it work?',
    a: 'Mindmate is an approachable, supportive cognitive-wellness and caregiver-support platform. It offers gentle memory exercises, visual puzzles, and peaceful relaxation activities designed with warmth and high readability for older adults, along with transparent session insights for caregivers.'
  },
  {
    category: 'Games & Puzzles',
    q: 'How do the games work and can I take breaks?',
    a: 'Every game has clear instructions, a "Listen" button for spoken guidance, and adjustable difficulty levels (Gentle, Regular, Challenge). There are zero penalties for mistakes or taking your time. You can exit, replay, or pause whenever you wish.'
  },
  {
    category: 'Languages & Speech',
    q: 'How do I change the language or hear spoken instructions?',
    a: 'You can tap the Globe icon in the top navigation at any time to choose from all 13 supported languages. When Voice Guidance is active, tapping the "Listen" button beside any activity will read the instructions aloud in your selected language whenever your device browser has a matching speech engine installed.'
  },
  {
    category: 'Caregiver Tools',
    q: 'What information does the Caregiver Mode show?',
    a: 'Caregiver Mode provides transparent, respectful participation summaries: active play time today, completed activities, current streaks, and live session status alerts (Green, Yellow, and Alert thresholds). All data stays stored safely on this local device.'
  },
  {
    category: 'Themes & Visuals',
    q: 'How do I switch between Day and Night mode?',
    a: 'Tap the Sun or Moon icon in the top navigation bar. Mindmate uses a mild, comfortable navy blue palette in dark mode for both Patient and Caregiver screens, preserving gentle contrast without glaring brightness.'
  },
  {
    category: 'Security & Passwords',
    q: 'What are the password security requirements?',
    a: 'For safety, passwords must contain at least 8 characters, with at least one uppercase letter (A-Z), one lowercase letter (a-z), one number (0-9), and one special symbol (!@#$%^&*).'
  },
];

export default function HelpDesk() {
  const { t } = useLanguage();
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Support ticket form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'General Question',
    message: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setFormError('Please complete all required fields before submitting.');
      return;
    }
    setFormError('');

    // Save ticket locally
    const ticket = {
      id: `ticket-${Date.now()}`,
      date: new Date().toISOString(),
      ...formData,
    };

    try {
      const existing = JSON.parse(localStorage.getItem('mindmate_support_tickets') || '[]');
      localStorage.setItem('mindmate_support_tickets', JSON.stringify([ticket, ...existing]));
    } catch {
      // ignore
    }

    setFormSubmitted(true);
    setFormData({ name: '', email: '', category: 'General Question', message: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 text-xs font-bold">
          <LifeBuoy className="w-4 h-4" />
          <span>Support & Help Center</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white">
          Help Desk & Knowledge Base
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          Frequently asked questions, game guidance, accessibility tips, and configurable support request options.
        </p>
      </div>

      {/* Configurable Contact Information Box */}
      <div className="p-8 rounded-3xl bg-white dark:bg-[#142038] border border-slate-200 dark:border-[#223558] shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Mail className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Support Contact Details
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
          Genuine, configurable contact parameters provided for the project owner. In this demonstration, contact parameters are configured in the system constants:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0c1527] border border-slate-200 dark:border-[#223558]">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Support Email
            </span>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              support@mindmate.app
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              (Configurable in deployment setup)
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0c1527] border border-slate-200 dark:border-[#223558]">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Support Helpline
            </span>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              Contact details to be configured
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              (Project Owner Integration Point)
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0c1527] border border-slate-200 dark:border-[#223558]">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Active Hours
            </span>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              Mon – Fri, 9:00 AM – 6:00 PM IST
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              SIH 2026 Prototype Hours
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: FAQs & Support Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* FAQs Accordion */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>

          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white dark:bg-[#142038] border border-slate-200 dark:border-[#223558] overflow-hidden shadow-xs transition-colors"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-800 dark:text-slate-100 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  <span className="text-sm sm:text-base">{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-5 h-5 shrink-0" /> : <ChevronDown className="w-5 h-5 shrink-0" />}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-[#223558]/50 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support Request Form */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#142038] border border-slate-200 dark:border-[#223558] shadow-sm space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
              Submit a Support Inquiry
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Need assistance or want to suggest a new game or regional language?
            </p>
          </div>

          {formSubmitted && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 space-y-1 animate-fade-in">
              <strong className="flex items-center gap-1.5 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" /> Request Logged Successfully
              </strong>
              <p>
                Prototype Notice: Your inquiry has been safely saved in your local browser storage. In production, this directly notifies the configured project support team.
              </p>
            </div>
          )}

          {formError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-200 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Eleanor Vance"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0c1527] border border-slate-200 dark:border-[#223558] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                Contact Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. eleanor@mindmate.demo"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0c1527] border border-slate-200 dark:border-[#223558] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0c1527] border border-slate-200 dark:border-[#223558] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option>General Question</option>
                <option>Game How-To</option>
                <option>Voice Guidance / Audio</option>
                <option>Language / Translation</option>
                <option>Caregiver Monitoring</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                Message *
              </label>
              <textarea
                required
                rows="4"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="How can we assist you today?"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0c1527] border border-slate-200 dark:border-[#223558] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Submit Request
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
