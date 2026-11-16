import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Unlock, ShieldCheck, CheckCircle2, Sparkles, LogOut, ShieldAlert } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function LogoutModal() {
  const { isLoggingOut, logoutStep, user } = useAuth();
  const navigate = useNavigate();
  const audioCtxRef = useRef(null);

  // Web Audio Synthesizer for satisfying futuristic power-down & vault lock sound
  useEffect(() => {
    if (!isLoggingOut) return;

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;

      // 1. Descending futuristic de-authorization sweep
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(600, now);
      osc1.frequency.exponentialRampToValueAtTime(120, now + 0.6);
      gain1.gain.setValueAtTime(0.09, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.6);

      // 2. Deep resonance pulse
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(320, now + 0.2);
      osc2.frequency.exponentialRampToValueAtTime(80, now + 0.8);
      gain2.gain.setValueAtTime(0.08, now + 0.2);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.2);
      osc2.stop(now + 0.8);

      // 3. Crisp mechanical lock snap at 0.9s
      const oscLock = ctx.createOscillator();
      const gainLock = ctx.createGain();
      oscLock.type = 'sawtooth';
      oscLock.frequency.setValueAtTime(880, now + 0.9);
      oscLock.frequency.exponentialRampToValueAtTime(140, now + 0.98);
      gainLock.gain.setValueAtTime(0.12, now + 0.9);
      gainLock.gain.exponentialRampToValueAtTime(0.001, now + 0.98);
      oscLock.connect(gainLock);
      gainLock.connect(ctx.destination);
      oscLock.start(now + 0.9);
      oscLock.stop(now + 0.98);
    } catch (e) {
      // Audio fallback gracefully handled
    }
  }, [isLoggingOut]);

  if (!isLoggingOut) return null;

  const userName = user?.name || 'Explorer';
  const userRole = user?.role === 'caregiver' ? 'Caregiver' : 'Patient';

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-[#060814]/85 backdrop-blur-2xl animate-fade-in select-none">
      {/* Background Cyber Mesh Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-rose-500/20 via-indigo-500/20 to-teal-500/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Center 3D Vault Termination Card */}
      <div
        className="relative w-full max-w-md rounded-[32px] bg-slate-900/90 border border-white/20 p-8 sm:p-10 shadow-2xl backdrop-blur-3xl text-center overflow-hidden animate-scale-up"
        style={{
          boxShadow: '0 30px 80px -15px rgba(0, 0, 0, 0.9), 0 0 50px -10px rgba(244, 63, 94, 0.35)',
        }}
      >
        {/* Animated Top Neon Accent Bar */}
        <div className="absolute top-0 left-[15%] right-[15%] h-[2.5px] rounded-full bg-gradient-to-r from-rose-500 via-amber-400 to-indigo-500 shadow-[0_0_20px_rgba(244,63,94,0.8)]" />

        {/* Dynamic Holographic Vault Icon */}
        <div className="relative w-24 h-24 mx-auto mb-6 grid place-items-center">
          {/* Outer Breathing Energy Halo */}
          <div
            className={`absolute inset-[-6px] rounded-full blur-xl transition-all duration-700 ${
              logoutStep >= 2
                ? 'bg-rose-500/50 shadow-[0_0_40px_rgba(244,63,94,0.6)]'
                : 'bg-indigo-500/40 shadow-[0_0_30px_rgba(99,102,241,0.5)]'
            }`}
          />

          {/* Rotating Laser Reticle */}
          <div className="absolute inset-0 rounded-full border border-dashed border-white/30 animate-spin" style={{ animationDuration: '8s' }} />

          {/* Icon Box */}
          <div
            className={`relative w-full h-full rounded-full grid place-items-center border-2 transition-all duration-500 ${
              logoutStep >= 2
                ? 'bg-rose-950/80 border-rose-500 text-rose-300'
                : 'bg-slate-950/80 border-indigo-400 text-indigo-300'
            }`}
          >
            {logoutStep >= 2 ? (
              <Lock className="w-10 h-10 stroke-[2.2] animate-bounce" />
            ) : (
              <Unlock className="w-10 h-10 stroke-[2.2]" />
            )}
          </div>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold mb-3 tracking-wide">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <span>SESSION TERMINATION IN PROGRESS</span>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-black text-white tracking-tight mb-1">
          {logoutStep >= 3 ? 'Session Safely Locked' : 'Closing Secure Session'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mb-6 font-normal">
          Goodbye, <strong className="text-white">{userName}</strong> ({userRole}). Your memories and wellness records have been sealed.
        </p>

        {/* Animated Progress Track */}
        <div className="w-full h-2 rounded-full bg-slate-950/80 border border-white/10 p-0.5 overflow-hidden mb-6">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-rose-500 to-emerald-400 transition-all duration-500 ease-out shadow-[0_0_12px_rgba(244,63,94,0.7)]"
            style={{
              width: logoutStep === 1 ? '35%' : logoutStep === 2 ? '75%' : '100%',
            }}
          />
        </div>

        {/* Cyber Step Checklist */}
        <div className="space-y-2.5 text-left text-xs bg-slate-950/60 border border-white/10 rounded-2xl p-4 font-mono">
          <div className="flex items-center justify-between">
            <span className={logoutStep >= 1 ? 'text-slate-200' : 'text-slate-500'}>
              [1/3] Revoking biometric & auth tokens...
            </span>
            {logoutStep >= 1 ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-slate-600" />
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className={logoutStep >= 2 ? 'text-slate-200' : 'text-slate-500'}>
              [2/3] Wiping encrypted session storage...
            </span>
            {logoutStep >= 2 ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-slate-600" />
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className={logoutStep >= 3 ? 'text-emerald-300 font-bold' : 'text-slate-500'}>
              [3/3] Session locked. Redirecting to login...
            </span>
            {logoutStep >= 3 ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-slate-600" />
            )}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Zero-Knowledge Multi-Factor Security Protocol</span>
        </div>
      </div>
    </div>
  );
}
