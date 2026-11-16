import React, { useState } from 'react';
import {
  Shield,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Settings,
  HelpCircle,
  Activity,
  Heart,
  TrendingUp,
  Sliders,
  Calendar,
  Lock,
  MessageSquare,
  Plus,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useActivity } from '../contexts/ActivityContext';
import { useUserMode } from '../contexts/UserModeContext';

export default function CaregiverDashboard() {
  const { user } = useAuth();
  const {
    history,
    streak,
    totalCompleted,
    activeSessionSeconds,
    sessionThresholds,
    setSessionThresholds,
    resetSessionTimer
  } = useActivity();
  const { activeMode, modes, setMode } = useUserMode();

  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem('mindmate_caregiver_notes');
      if (saved) return JSON.parse(saved);
      return [
        {
          id: 'note-1',
          date: '2026-10-12',
          text: 'Eleanor thoroughly enjoyed the Garden Maze and Word Search games this morning.',
        },
        {
          id: 'note-2',
          date: '2026-10-11',
          text: 'Took a relaxing 5-minute deep breathing break after Memory Match.',
        }
      ];
    } catch {
      return [];
    }
  });

  const [newNoteText, setNewNoteText] = useState('');
  const [thresholdEdit, setThresholdEdit] = useState({
    checkInMinutes: sessionThresholds.checkInMinutes,
    breakMinutes: sessionThresholds.breakMinutes,
    extendedMinutes: sessionThresholds.extendedMinutes,
  });
  const [saveThresholdsMsg, setSaveThresholdsMsg] = useState(false);

  const activeMinutes = Math.floor(activeSessionSeconds / 60);

  // Status indicator
  let statusColor = 'bg-emerald-500';
  let statusBadge = 'Comfortable (Within Threshold)';
  let statusText = 'Activity duration is well within the healthy, comfortable session target.';

  if (activeMinutes >= sessionThresholds.extendedMinutes) {
    statusColor = 'bg-rose-500';
    statusBadge = 'Break Strongly Recommended';
    statusText = `Session has surpassed ${sessionThresholds.extendedMinutes} minutes. A peaceful break is suggested to prevent eye strain.`;
  } else if (activeMinutes >= sessionThresholds.checkInMinutes) {
    statusColor = 'bg-amber-500';
    statusBadge = 'Check-in Threshold Reached';
    statusText = `Session is at ${activeMinutes} minutes. A gentle pause check-in reminder has been prepared.`;
  }

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    const newNote = {
      id: `note-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      text: newNoteText.trim(),
    };
    const updated = [newNote, ...notes];
    setNotes(updated);
    setNewNoteText('');
    try {
      localStorage.setItem('mindmate_caregiver_notes', JSON.stringify(updated));
    } catch (err) {
      console.warn(err);
    }
  };

  const handleSaveThresholds = () => {
    setSessionThresholds(thresholdEdit);
    setSaveThresholdsMsg(true);
    setTimeout(() => setSaveThresholdsMsg(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#142038] border border-slate-200 dark:border-[#223558] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 dark:bg-[#162544] dark:text-sky-300">
              Caregiver Portal
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Linked Patient: <strong className="text-slate-800 dark:text-slate-200">Eleanor Vance</strong>
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Caregiver Wellness Overview
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mt-1 leading-relaxed">
            Supportive, non-intrusive monitoring of daily engagement, cognitive activity participation, and rest intervals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={resetSessionTimer}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-[#1c2c4e] dark:hover:bg-[#253963] text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
            title="Reset current session timer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Timer
          </button>
        </div>
      </div>

      {/* Live Session Status Indicator Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#142038] border border-slate-200 dark:border-[#223558] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <span className={`w-4 h-4 rounded-full ${statusColor} animate-pulse shrink-0`}></span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Live Session Status: {statusBadge}
            </h3>
          </div>
          <div className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            Current Session: <strong className="text-slate-900 dark:text-white">{activeMinutes} minutes</strong>
          </div>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
          {statusText}
        </p>

        {/* Progress bar of session thresholds */}
        <div className="space-y-1.5">
          <div className="h-3 w-full bg-slate-100 dark:bg-[#0c1527] rounded-full overflow-hidden flex">
            <div
              className={`h-full ${statusColor} transition-all duration-500`}
              style={{ width: `${Math.min(100, (activeMinutes / sessionThresholds.extendedMinutes) * 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-semibold text-slate-400">
            <span>0m (Start)</span>
            <span>Check-in ({sessionThresholds.checkInMinutes}m)</span>
            <span>Break ({sessionThresholds.breakMinutes}m)</span>
            <span>Limit ({sessionThresholds.extendedMinutes}m)</span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="p-6 rounded-3xl bg-white dark:bg-[#142038] border border-slate-200 dark:border-[#223558] shadow-xs">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
            Active Patient Mode
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mb-2">
            {activeMode.name}
          </div>
          <p className="text-xs text-teal-600 dark:text-teal-400 font-semibold">
            {activeMode.badge}
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#142038] border border-slate-200 dark:border-[#223558] shadow-xs">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
            Participation Streak
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mb-2">
            {streak} Days
          </div>
          <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
            Consistent Engagement
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#142038] border border-slate-200 dark:border-[#223558] shadow-xs">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
            Completed Activities
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mb-2">
            {totalCompleted} Activities
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            Recorded in Local Storage
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#142038] border border-slate-200 dark:border-[#223558] shadow-xs">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
            Recommended Next Step
          </span>
          <div className="text-xl font-bold text-slate-900 dark:text-white mb-1">
            {activeMinutes >= 30 ? 'Rest Suggested' : 'Memory Match'}
          </div>
          <p className="text-xs text-slate-400">
            Based on active fatigue checks
          </p>
        </div>

      </div>

      {/* Two Column Section: Configuration & Activity Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Session Thresholds Configuration */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#142038] border border-slate-200 dark:border-[#223558] shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <Sliders className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Session Reminder Thresholds
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Configure how many active minutes trigger gentle check-ins and break notifications for your loved one.
          </p>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                <span>Gentle Check-in:</span>
                <span>{thresholdEdit.checkInMinutes} minutes</span>
              </div>
              <input
                type="range"
                min="10"
                max="30"
                value={thresholdEdit.checkInMinutes}
                onChange={(e) => setThresholdEdit({ ...thresholdEdit, checkInMinutes: Number(e.target.value) })}
                className="w-full accent-teal-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                <span>Break Recommendation:</span>
                <span>{thresholdEdit.breakMinutes} minutes</span>
              </div>
              <input
                type="range"
                min="20"
                max="45"
                value={thresholdEdit.breakMinutes}
                onChange={(e) => setThresholdEdit({ ...thresholdEdit, breakMinutes: Number(e.target.value) })}
                className="w-full accent-teal-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                <span>Extended Session Alert:</span>
                <span>{thresholdEdit.extendedMinutes} minutes</span>
              </div>
              <input
                type="range"
                min="35"
                max="60"
                value={thresholdEdit.extendedMinutes}
                onChange={(e) => setThresholdEdit({ ...thresholdEdit, extendedMinutes: Number(e.target.value) })}
                className="w-full accent-teal-600 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveThresholds}
              className="px-5 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all"
            >
              Save Reminder Thresholds
            </button>
            {saveThresholdsMsg && (
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                ✓ Saved successfully
              </span>
            )}
          </div>
        </div>

        {/* Remote Mode Recommendation */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#142038] border border-slate-200 dark:border-[#223558] shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5 text-rose-500" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Set Patient Mode Recommendation
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            You can recommend an active mode based on how Eleanor is feeling today:
          </p>

          <div className="grid grid-cols-2 gap-3">
            {modes.map(m => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  activeMode.id === m.id
                    ? 'bg-teal-50 dark:bg-[#162544] border-teal-500 ring-2 ring-teal-400'
                    : 'bg-slate-50 dark:bg-[#0c1527] border-slate-200 dark:border-[#223558] hover:bg-slate-100'
                }`}
              >
                <div className="font-bold text-xs text-slate-900 dark:text-white mb-0.5">
                  {m.name}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  {m.badge}
                </div>
              </button>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0c1527] text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Changing the recommended mode automatically adjusts default game difficulties and hint displays on Eleanor's dashboard.
          </div>
        </div>

      </div>

      {/* Activity History Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#142038] border border-slate-200 dark:border-[#223558] shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Recent Activity History Log
            </h3>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            Total Logged: {history.length}
          </span>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-8 text-sm text-slate-400">
            No completed activities recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-slate-200 dark:border-[#223558] text-slate-400 font-bold uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-3">Date & Time</th>
                  <th className="py-3 px-3">Activity</th>
                  <th className="py-3 px-3">Difficulty</th>
                  <th className="py-3 px-3">Duration</th>
                  <th className="py-3 px-3">Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#223558]/60 text-slate-700 dark:text-slate-200">
                {history.slice(0, 8).map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-[#162544]/50">
                    <td className="py-3 px-3 text-slate-500 dark:text-slate-400">
                      {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                      {item.gameTitle || item.gameId}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-[#1c2c4e] text-slate-600 dark:text-slate-300">
                        {item.difficulty || 'Regular'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500 dark:text-slate-400">
                      {item.durationSec ? `${Math.round(item.durationSec / 60)} min` : '1 min'}
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Caregiver Observation Notes */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#142038] border border-slate-200 dark:border-[#223558] shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Caregiver Supportive Observation Notes
          </h3>
        </div>

        <form onSubmit={handleAddNote} className="flex gap-3">
          <input
            type="text"
            placeholder="Record an observation (e.g. 'Eleanor had a lovely time matching teacup cards...')"
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
            className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#0c1527] border border-slate-200 dark:border-[#223558] text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button
            type="submit"
            className="flex items-center gap-1.5 px-5 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add Note
          </button>
        </form>

        <div className="space-y-3">
          {notes.map(note => (
            <div
              key={note.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0c1527] border border-slate-200 dark:border-[#223558] text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <span className="text-slate-800 dark:text-slate-200 font-medium">
                {note.text}
              </span>
              <span className="text-slate-400 text-xs shrink-0 font-semibold">
                {note.date}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Transparent Privacy Notice Box */}
      <div className="p-6 rounded-3xl bg-slate-100 dark:bg-[#111d35] border border-slate-200 dark:border-[#223558] text-xs text-slate-600 dark:text-slate-400 flex items-start gap-3">
        <Lock className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
        <div>
          <strong className="text-slate-800 dark:text-slate-200 block mb-1">
            Local Data Architecture & Privacy Transparency
          </strong>
          In this prototype, activity logs and preferences are stored exclusively on this local device using browser LocalStorage. No patient health metrics, medical records, or passwords are transmitted to external servers. In a clinical production deployment, encrypted HIPAA-compliant database synchronization would be established.
        </div>
      </div>

    </div>
  );
}
