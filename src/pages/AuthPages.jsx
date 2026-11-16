import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AuthPages() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signIn, register, user, triggerLogout } = useAuth();

  // Active view: 'signin' | 'signup' | 'reset' | 'otp' | 'success'
  const [view, setView] = useState(searchParams.get('mode') === 'register' ? 'signup' : 'signin');
  const [theme, setTheme] = useState('nebula');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [domainPillsVisible, setDomainPillsVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [termsAgreed, setTermsAgreed] = useState(true);

  // Status & Loaders
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', icon: '✨' });
  const [toastTimer, setToastTimer] = useState(null);
  const [shaking, setShaking] = useState(false);

  // OTP state
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(45);
  const [otpCanResend, setOtpCanResend] = useState(false);

  // Biometrics modal
  const [biometricsOpen, setBiometricsOpen] = useState(false);
  const [biometricsStatus, setBiometricsStatus] = useState('Scanning hardware security key or FaceID...');

  // Success dashboard & Workspace redirect
  const [successUser, setSuccessUser] = useState('Alex Vance');
  const [sessionToken, setSessionToken] = useState('NEXUS-8F21-994A');
  const [ytCountdown, setYtCountdown] = useState(3);
  const [ytRedirectPaused, setYtRedirectPaused] = useState(false);

  // Canvas Refs
  const particleCanvasRef = useRef(null);
  const confettiCanvasRef = useRef(null);
  const cardRef = useRef(null);
  const otpInputRefs = useRef([]);

  // Audio Context Ref
  const audioCtxRef = useRef(null);

  // 1. Audio Synthesizer (Web Audio API)
  const playSound = (type) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) audioCtxRef.current = new AudioContext();
      }
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;
      if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'tab') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(660, now + 0.08);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'success') {
        const freqs = [523.25, 659.25, 783.99, 1046.50];
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.06);
          gain.gain.setValueAtTime(0.08, now + idx * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.6);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.06);
          osc.stop(now + idx * 0.06 + 0.6);
        });
      } else if (type === 'error') {
        [220, 180].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, now + idx * 0.09);
          gain.gain.setValueAtTime(0.05, now + idx * 0.09);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.08);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.09);
          osc.stop(now + idx * 0.09 + 0.08);
        });
      } else if (type === 'scan') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.linearRampToValueAtTime(1200, now + 0.35);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
      }
    } catch (e) {
      // Audio fallback
    }
  };

  const showNotification = (message, icon = '✨') => {
    setToast({ show: true, message, icon });
    if (toastTimer) clearTimeout(toastTimer);
    const t = setTimeout(() => {
      setToast({ show: false, message: '', icon: '✨' });
    }, 3200);
    setToastTimer(t);
  };

  // 2. Interactive Particles Background
  useEffect(() => {
    const canvas = particleCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const mouse = { x: -1000, y: -1000, radius: 140 };
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.size = Math.random() * 2 + 0.6;
        this.baseAlpha = Math.random() * 0.45 + 0.15;
        this.alpha = this.baseAlpha;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = 1 - dist / mouse.radius;
          this.x -= (dx / dist) * force * 2.5;
          this.y -= (dy / dist) * force * 2.5;
          this.alpha = Math.min(1, this.baseAlpha + 0.5);
        } else {
          this.alpha = this.baseAlpha;
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(165, 180, 252, ${this.alpha})`;
        ctx.fill();
      }
    }

    const count = Math.min(Math.floor((width * height) / 12000), 90);
    const particles = Array.from({ length: count }, () => new Particle());

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            const alpha = (1 - dist / 110) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(129, 140, 248, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // 3. 3D Tilt Card & Spotlight
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    let isHovered = false;

    const onEnter = () => { isHovered = true; };
    const onLeave = () => {
      isHovered = false;
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
    };

    const onMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      if (isHovered) {
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5.5;
        const rotateY = ((x - centerX) / centerX) * 5.5;
        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.008, 1.008, 1.008)`;
      }
    };

    card.addEventListener('mouseenter', onEnter);
    card.addEventListener('mouseleave', onLeave);
    window.addEventListener('mousemove', onMove);

    return () => {
      card.removeEventListener('mouseenter', onEnter);
      card.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  // 4. Confetti Explosion
  const triggerConfetti = () => {
    const canvas = confettiCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class ConfettiPiece {
      constructor() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 12 + 4;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed - 5;
        this.gravity = 0.35;
        this.drag = 0.98;
        this.size = Math.random() * 7 + 4;
        const colors = ['#6366f1', '#06b6d4', '#a855f7', '#10b981', '#f59e0b', '#ffffff'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.rotation = Math.random() * 360;
        this.rotSpeed = (Math.random() - 0.5) * 10;
        this.alpha = 1;
      }
      update() {
        this.vx *= this.drag;
        this.vy = (this.vy + this.gravity) * this.drag;
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotSpeed;
        this.alpha -= 0.009;
      }
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.7);
        ctx.restore();
      }
    }

    let pieces = Array.from({ length: 110 }, () => new ConfettiPiece());
    let reqId;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach((p) => {
        p.update();
        p.draw();
      });
      pieces = pieces.filter((p) => p.alpha > 0);
      if (pieces.length > 0) {
        reqId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
    render();
  };

  // 5. Mindmate countdown redirect
  useEffect(() => {
    let interval;
    if (view === 'success' && !ytRedirectPaused) {
      interval = setInterval(() => {
        setYtCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            navigate('/patient');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [view, ytRedirectPaused, navigate]);

  // Dynamic Password Strength
  const getPasswordStrength = (pwd) => {
    const hasLength = pwd.length >= 8;
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[^A-Za-z0-9]/.test(pwd);
    const score = [hasLength, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
    return { hasLength, hasUpper, hasNumber, hasSpecial, score };
  };
  const pwdStats = getPasswordStrength(password);

  // Time Greeting
  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Form error shake
  const triggerError = (msg) => {
    playSound('error');
    showNotification(msg, '⚠️');
    setShaking(true);
    setTimeout(() => setShaking(false), 500);
  };

  // Handlers
  const handleSignIn = (e) => {
    e.preventDefault();
    if (!email || !password) {
      triggerError('Please fill in both email and password');
      return;
    }
    playSound('click');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      playSound('success');
      const uName = email.split('@')[0];
      setSuccessUser(uName);
      setSessionToken('NEXUS-' + Math.random().toString(36).substring(2, 7).toUpperCase() + '-AUTH');
      setView('success');
      showNotification('Authentication Verified! Welcome.', '🚀');
      triggerConfetti();
      try { signIn(email, password); } catch (_) {}
    }, 1200);
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      triggerError('Please complete all required fields');
      return;
    }
    if (password.length < 6) {
      triggerError('Password must be at least 6 characters');
      return;
    }
    playSound('click');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setView('otp');
      showNotification('Verification code sent to your email', '✉️');
    }, 1100);
  };

  const handleQuickFill = () => {
    playSound('click');
    setEmail('alex@nexus.ai');
    setPassword('Quantum#2026');
    showNotification('Demo credentials autofilled!', '⚡');
  };

  const handleSocialAuth = (provider) => {
    playSound('click');
    showNotification(`Connecting to ${provider} OAuth...`, '⚡');
    setTimeout(() => {
      playSound('success');
      setSuccessUser(`${provider} User`);
      setView('success');
      triggerConfetti();
    }, 900);
  };

  const handleBiometrics = () => {
    setBiometricsOpen(true);
    setBiometricsStatus('Scanning hardware security key or FaceID...');
    playSound('scan');
    setTimeout(() => {
      setBiometricsStatus('Biometric match verified! Logging in...');
      playSound('success');
      setTimeout(() => {
        setBiometricsOpen(false);
        setSuccessUser('Biometric User');
        setView('success');
        showNotification('Passkey Verified via Secure Enclave', '🛡️');
        triggerConfetti();
      }, 700);
    }, 2000);
  };

  return (
    <div
      data-theme={theme}
      className="min-h-screen w-full flex flex-col justify-center items-center py-10 px-4 relative overflow-x-hidden font-sans transition-colors duration-500 bg-[#060814] text-[#f8fafc]"
      style={{
        '--bg-base': theme === 'gold' ? '#0a0a08' : theme === 'cyber' ? '#030a08' : theme === 'amethyst' ? '#0d0614' : '#060814',
        '--accent-primary': theme === 'gold' ? '#f59e0b' : theme === 'cyber' ? '#10b981' : theme === 'amethyst' ? '#d946ef' : '#6366f1',
        '--accent-secondary': theme === 'gold' ? '#fbbf24' : theme === 'cyber' ? '#06b6d4' : theme === 'amethyst' ? '#8b5cf6' : '#06b6d4',
        '--accent-gradient': theme === 'gold' 
          ? 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #f97316 100%)' 
          : theme === 'cyber' 
          ? 'linear-gradient(135deg, #10b981 0%, #06b6d4 60%, #34d399 100%)' 
          : theme === 'amethyst' 
          ? 'linear-gradient(135deg, #d946ef 0%, #8b5cf6 50%, #ec4899 100%)' 
          : 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #06b6d4 100%)',
      }}
    >
      {/* Background Canvases */}
      <canvas ref={particleCanvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0" />
      <canvas ref={confettiCanvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-50" />

      {/* Ambient Radial Mesh Overlays */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full blur-[100px] pointer-events-none z-0 opacity-40 bg-[radial-gradient(circle,_var(--accent-primary)_0%,_transparent_70%)]" />

      {/* Top Controls Bar */}
      <header className="fixed top-5 w-[calc(100%-40px)] max-w-6xl flex justify-between items-center z-30 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-3 bg-slate-900/60 border border-white/10 px-4 py-2 rounded-full backdrop-blur-xl shadow-lg">
          <div className="w-7 h-7 rounded-lg grid place-items-center shadow-md text-white font-black text-xs" style={{ background: 'var(--accent-gradient)' }}>
            ⚡
          </div>
          <span className="font-extrabold text-sm tracking-tight text-white">NEXUS ID</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-indigo-300 font-semibold">v3.4 PRO</span>
        </div>

        <div className="pointer-events-auto flex items-center gap-3">
          {/* Themes Palette */}
          <div className="flex items-center gap-1.5 bg-slate-900/60 border border-white/10 p-1.5 rounded-full backdrop-blur-xl">
            {[
              { id: 'nebula', bg: 'linear-gradient(135deg, #6366f1, #06b6d4)' },
              { id: 'gold', bg: 'linear-gradient(135deg, #f59e0b, #fbbf24)' },
              { id: 'cyber', bg: 'linear-gradient(135deg, #10b981, #06b6d4)' },
              { id: 'amethyst', bg: 'linear-gradient(135deg, #d946ef, #8b5cf6)' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTheme(t.id);
                  playSound('tab');
                  showNotification(`Switched to ${t.id.toUpperCase()} theme`, '🎨');
                }}
                className={`w-5 h-5 rounded-full transition-transform ${theme === t.id ? 'ring-2 ring-white scale-110 shadow-md' : 'opacity-70 hover:opacity-100 hover:scale-105'}`}
                style={{ background: t.bg }}
                title={t.id}
              />
            ))}
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              showNotification(soundEnabled ? 'Audio muted' : 'Audio activated', soundEnabled ? '🔇' : '🔊');
            }}
            className="w-10 h-10 rounded-xl bg-slate-900/60 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white backdrop-blur-xl transition-all"
            title={soundEnabled ? 'Sound ON' : 'Sound MUTED'}
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
        </div>
      </header>

      {/* Main 3D Card Container */}
      <main className="w-full max-w-[480px] my-14 relative z-10" style={{ perspective: 1200 }}>
        {/* Floating Badges */}
        <div className="hidden sm:flex absolute -top-5 -left-4 items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs font-medium text-slate-300 backdrop-blur-xl shadow-xl pointer-events-none z-20">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>128-bit Quantum SSL Active</span>
        </div>
        <div className="hidden sm:flex absolute -bottom-4 -right-3 items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs font-medium text-slate-300 backdrop-blur-xl shadow-xl pointer-events-none z-20">
          <span>🛡️</span>
          <span>Zero Knowledge Auth</span>
        </div>

        {/* The 3D Glass Card */}
        <div
          ref={cardRef}
          className={`relative rounded-[28px] border border-white/15 bg-slate-900/70 p-8 sm:p-10 backdrop-blur-2xl shadow-2xl transition-all duration-200 overflow-hidden ${
            shaking ? 'animate-bounce border-rose-500' : ''
          }`}
          style={{
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 40px -10px rgba(99, 102, 241, 0.2)',
          }}
        >
          {/* Card Accent Top Bar */}
          <div className="absolute top-0 left-[15%] right-[15%] h-[2px] rounded-full" style={{ background: 'var(--accent-gradient)' }} />

          {/* Card Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto mb-4 relative grid place-items-center">
              <div className="absolute inset-[-4px] rounded-2xl blur-md opacity-70" style={{ background: 'var(--accent-gradient)' }} />
              <div className="relative w-full h-full bg-slate-900 border border-white/20 rounded-2xl grid place-items-center text-white font-black text-xl">
                ⚛️
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-indigo-300 border border-white/10 mb-2">
              <span>✨</span>
              <span>{getGreeting()}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {view === 'signin' && 'Access Console'}
              {view === 'signup' && 'Create Nexus ID'}
              {view === 'reset' && 'Reset Access'}
              {view === 'otp' && 'Security Check'}
              {view === 'success' && 'Authorized'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {view === 'signin' && 'Authenticate to unlock your synchronized workspace'}
              {view === 'signup' && 'Set up your cloud access credentials in seconds'}
              {view === 'reset' && 'Enter your email to verify identity and restore access'}
              {view === 'otp' && 'Two-factor authentication code required'}
              {view === 'success' && 'Connected to Mindmate • Entering Workspace...'}
            </p>
          </div>

          {/* Navigation Tab Slider (Sign In vs Sign Up) */}
          {(view === 'signin' || view === 'signup') && (
            <div className="relative flex bg-slate-950/60 border border-white/10 p-1 rounded-2xl mb-5">
              <div
                className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl transition-transform duration-300 shadow-md"
                style={{
                  background: 'var(--accent-gradient)',
                  transform: view === 'signup' ? 'translateX(100%)' : 'translateX(0%)',
                  left: '4px',
                }}
              />
              <button
                type="button"
                onClick={() => {
                  setView('signin');
                  playSound('tab');
                }}
                className={`flex-1 py-2 text-xs sm:text-sm font-bold relative z-10 transition-colors ${view === 'signin' ? 'text-white' : 'text-slate-400'}`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setView('signup');
                  playSound('tab');
                }}
                className={`flex-1 py-2 text-xs sm:text-sm font-bold relative z-10 transition-colors ${view === 'signup' ? 'text-white' : 'text-slate-400'}`}
              >
                Create Account
              </button>
            </div>
          )}

          {/* Quick Demo Autofill Button */}
          {view === 'signin' && (
            <div className="flex justify-center mb-4">
              <button
                type="button"
                onClick={handleQuickFill}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-dashed border-white/20 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all transform hover:-translate-y-0.5"
              >
                <span>⚡</span>
                <span>Fill Demo Credentials (alex@nexus.ai)</span>
              </button>
            </div>
          )}

          {/* Social OAuth Buttons */}
          {(view === 'signin' || view === 'signup') && (
            <div className="mb-5">
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { name: 'Google', icon: '🌐' },
                  { name: 'Apple', icon: '🍎' },
                  { name: 'GitHub', icon: '🐙' },
                ].map((s) => (
                  <button
                    key={s.name}
                    type="button"
                    onClick={() => handleSocialAuth(s.name)}
                    className="flex items-center justify-center gap-2 py-2.5 px-2 rounded-xl bg-slate-950/60 border border-white/10 hover:border-white/25 text-xs font-bold text-slate-200 hover:text-white hover:-translate-y-0.5 transition-all shadow-sm"
                  >
                    <span>{s.icon}</span>
                    <span>{s.name}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 my-4 text-[11px] text-slate-500 uppercase tracking-widest">
                <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                <span>or continue with email</span>
                <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />
              </div>
            </div>
          )}

          {/* VIEW 1: SIGN IN */}
          {view === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Email or Username</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">✉️</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setDomainPillsVisible(true)}
                    onBlur={() => setTimeout(() => setDomainPillsVisible(false), 200)}
                    placeholder="name@company.com"
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-950/70 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm text-white placeholder-slate-500 outline-none transition-all"
                  />
                </div>
                {/* Domain Pills */}
                {domainPillsVisible && (
                  <div className="flex gap-1.5 mt-2 overflow-x-auto pb-1">
                    {['@gmail.com', '@nexus.ai', '@outlook.com', '@icloud.com'].map((dom) => (
                      <button
                        key={dom}
                        type="button"
                        onClick={() => {
                          const base = email.includes('@') ? email.split('@')[0] : email || 'alex';
                          setEmail(base + dom);
                        }}
                        className="text-[11px] px-2.5 py-0.5 rounded-lg bg-white/10 border border-white/10 text-slate-300 hover:text-white hover:bg-indigo-600 transition-all whitespace-nowrap"
                      >
                        {dom}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-300">Password</label>
                  {capsLockActive && <span className="text-[11px] font-bold text-amber-400">⚠️ Caps Lock is ON</span>}
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">🔒</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => setCapsLockActive(e.getModifierState && e.getModifierState('CapsLock'))}
                    onKeyUp={(e) => setCapsLockActive(e.getModifierState && e.getModifierState('CapsLock'))}
                    placeholder="••••••••••••"
                    className="w-full h-11 pl-10 pr-10 rounded-xl bg-slate-950/70 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm text-white placeholder-slate-500 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? '👁️' : '🕶️'}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs text-slate-400">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded bg-slate-950 border-white/20 text-indigo-600 focus:ring-0"
                  />
                  <span>Remember for 30 days</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setView('reset');
                    playSound('tab');
                  }}
                  className="hover:underline text-indigo-400 font-semibold"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-xl text-white font-bold text-sm tracking-wide shadow-lg flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 transition-all overflow-hidden relative"
                style={{ background: 'var(--accent-gradient)' }}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In & Enter Dashboard →</span>
                  </>
                )}
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={handleBiometrics}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  <span>🧬</span>
                  <span>Or authenticate with Passkey / FaceID</span>
                </button>
              </div>
            </form>
          )}

          {/* VIEW 2: CREATE ACCOUNT */}
          {view === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Full Name</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">👤</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Vance"
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-950/70 border border-white/10 focus:border-indigo-500 focus:ring-2 text-sm text-white placeholder-slate-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Work Email</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">✉️</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@nexus.ai"
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-950/70 border border-white/10 focus:border-indigo-500 focus:ring-2 text-sm text-white placeholder-slate-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">🔒</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create strong password"
                    className="w-full h-11 pl-10 pr-10 rounded-xl bg-slate-950/70 border border-white/10 focus:border-indigo-500 focus:ring-2 text-sm text-white placeholder-slate-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? '👁️' : '🕶️'}
                  </button>
                </div>

                {/* Password Strength Meter */}
                <div className="mt-3">
                  <div className="grid grid-cols-4 gap-1.5 mb-1.5">
                    {[1, 2, 3, 4].map((barIdx) => {
                      const colors = ['#ef4444', '#f59e0b', '#06b6d4', '#10b981'];
                      const active = pwdStats.score >= barIdx;
                      return (
                        <div
                          key={barIdx}
                          className="h-1 rounded-full transition-all duration-300"
                          style={{
                            backgroundColor: active ? colors[pwdStats.score - 1] : 'rgba(255,255,255,0.1)',
                          }}
                        />
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Security Level:</span>
                    <span className="font-bold" style={{ color: ['#ef4444', '#f59e0b', '#06b6d4', '#10b981'][pwdStats.score - 1] || '#94a3b8' }}>
                      {['Weak', 'Fair', 'Strong', 'Unbreakable 🛡️'][pwdStats.score - 1] || 'Enter password'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 mt-2 text-[11px] text-slate-400">
                    <span className={pwdStats.hasLength ? 'text-emerald-400 font-bold' : ''}>• 8+ characters</span>
                    <span className={pwdStats.hasUpper ? 'text-emerald-400 font-bold' : ''}>• Uppercase letter</span>
                    <span className={pwdStats.hasNumber ? 'text-emerald-400 font-bold' : ''}>• Number (0-9)</span>
                    <span className={pwdStats.hasSpecial ? 'text-emerald-400 font-bold' : ''}>• Special symbol</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
                <input
                  type="checkbox"
                  checked={termsAgreed}
                  onChange={(e) => setTermsAgreed(e.target.checked)}
                  className="rounded bg-slate-950 border-white/20 text-indigo-600"
                />
                <span>I agree to the <a href="#" className="underline">Terms</a> & <a href="#" className="underline">Privacy</a></span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-xl text-white font-bold text-sm tracking-wide shadow-lg flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 transition-all overflow-hidden"
                style={{ background: 'var(--accent-gradient)' }}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create Free Account</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* VIEW 3: RESET PASSWORD */}
          {view === 'reset' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Registered Account Email</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">✉️</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@nexus.ai"
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-950/70 border border-white/10 focus:border-indigo-500 focus:ring-2 text-sm text-white placeholder-slate-500 outline-none"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!email) {
                    triggerError('Please enter your email');
                    return;
                  }
                  playSound('click');
                  setIsLoading(true);
                  setTimeout(() => {
                    setIsLoading(false);
                    setView('otp');
                    showNotification(`Security code sent to ${email}`, '🔐');
                  }, 1000);
                }}
                className="w-full h-12 rounded-xl text-white font-bold text-sm tracking-wide shadow-lg flex items-center justify-center gap-2"
                style={{ background: 'var(--accent-gradient)' }}
              >
                {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Send Security Recovery Code'}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setView('signin');
                    playSound('tab');
                  }}
                  className="text-xs text-indigo-400 font-semibold hover:underline"
                >
                  ← Back to Sign In
                </button>
              </div>
            </div>
          )}

          {/* VIEW 4: OTP 6-DIGIT VERIFICATION */}
          {view === 'otp' && (
            <div className="space-y-5 text-center">
              <p className="text-xs text-slate-400">
                Enter the 6-digit code sent to <strong className="text-white">{email || 'alex@nexus.ai'}</strong>
              </p>

              <div className="flex justify-center gap-2">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (otpInputRefs.current[idx] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const val = e.target.value;
                      const next = [...otpDigits];
                      next[idx] = val;
                      setOtpDigits(next);
                      playSound('click');
                      if (val && idx < 5) otpInputRefs.current[idx + 1]?.focus();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !otpDigits[idx] && idx > 0) {
                        otpInputRefs.current[idx - 1]?.focus();
                      }
                    }}
                    className="w-11 h-14 text-center font-mono font-bold text-lg rounded-xl bg-slate-950/70 border border-white/15 focus:border-indigo-500 focus:ring-2 text-white outline-none"
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  playSound('click');
                  setIsLoading(true);
                  setTimeout(() => {
                    setIsLoading(false);
                    playSound('success');
                    setSuccessUser(email.split('@')[0] || 'Alex Vance');
                    setView('success');
                    triggerConfetti();
                    showNotification('Identity confirmed! Access granted.', '🎉');
                  }, 1100);
                }}
                className="w-full h-12 rounded-xl text-white font-bold text-sm tracking-wide shadow-lg flex items-center justify-center gap-2"
                style={{ background: 'var(--accent-gradient)' }}
              >
                {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Verify & Authorize'}
              </button>

              <div className="flex justify-between items-center text-xs text-slate-400 pt-1">
                <span>Resend in <strong>45s</strong></span>
                <button type="button" onClick={() => showNotification('New 6-digit code dispatched', '✉️')} className="hover:underline text-indigo-400">
                  Resend Code
                </button>
              </div>
            </div>
          )}

          {/* VIEW 5: SUCCESS DASHBOARD & MINDMATE REDIRECT */}
          {view === 'success' && (
            <div className="text-center space-y-4 animate-scale-up">
              <div className="relative w-20 h-20 mx-auto">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                  alt="User Avatar"
                  className="w-full h-full rounded-full border-2 border-indigo-500 object-cover shadow-xl"
                />
                <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-900 grid place-items-center text-white text-xs font-black">
                  ✓
                </span>
              </div>

              <div>
                <h2 className="text-xl font-bold text-white">Welcome, {successUser}!</h2>
                <p className="text-xs text-slate-400">Session authenticated via Multi-Factor Edge Gate</p>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 font-mono text-xs text-slate-300">
                <span>🔒</span>
                <span>TOKEN: <strong>{sessionToken}</strong></span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2 text-left">
                <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Access</div>
                  <div className="text-xs font-bold text-cyan-400">Admin</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Latency</div>
                  <div className="text-xs font-bold text-emerald-400">18ms</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Security</div>
                  <div className="text-xs font-bold text-indigo-400">Grade A+</div>
                </div>
              </div>

              {/* Mindmate Platform Connected Banner */}
              <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-center space-y-2.5">
                <div className="flex items-center justify-center gap-2 text-sm font-bold text-teal-300">
                  <span className="text-teal-400 text-lg">🌸</span>
                  <span>Mindmate Platform Connected</span>
                </div>
                <div className="text-xs text-slate-300">
                  Entering your Mindmate workspace in <strong className="text-teal-400 font-mono text-sm">{ytCountdown}</strong>s...
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 transition-all duration-1000 rounded-full"
                    style={{ width: `${((3 - ytCountdown) / 3) * 100}%` }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <button
                type="button"
                onClick={() => navigate('/patient')}
                className="w-full h-12 rounded-xl text-white font-bold text-sm tracking-wide shadow-lg flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 transition-all"
              >
                <span>Enter Mindmate Workspace Now 🌸</span>
                <span>→</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/caregiver')}
                className="w-full h-11 rounded-xl text-slate-200 font-bold text-xs tracking-wide bg-slate-800/80 hover:bg-slate-700 border border-white/10 transition-all"
              >
                <span>Open Caregiver Dashboard 🛡️</span>
              </button>

              <div className="flex justify-center items-center gap-4 text-xs pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setYtRedirectPaused(!ytRedirectPaused);
                    showNotification(ytRedirectPaused ? 'Auto-redirect resumed' : 'Auto-redirect paused', ytRedirectPaused ? '▶️' : '⏸️');
                  }}
                  className="text-slate-400 hover:text-white underline"
                >
                  {ytRedirectPaused ? '▶ Resume Auto-Redirect' : 'Pause Auto-Redirect'}
                </button>
                <span className="text-slate-600">•</span>
                <button
                  type="button"
                  onClick={() => {
                    setYtRedirectPaused(true);
                    triggerLogout(() => setView('signin'));
                  }}
                  className="text-rose-400 hover:text-rose-300 font-bold underline"
                >
                  Sign Out & Terminate Session
                </button>
              </div>
            </div>
          )}

          {/* Card Footer */}
          <footer className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <span>🔒</span>
              <span>End-to-end encrypted</span>
            </div>
            <div className="flex gap-2.5">
              <a href="#" className="hover:text-slate-300">Privacy</a>
              <span>•</span>
              <a href="#" className="hover:text-slate-300">Terms</a>
              <span>•</span>
              <a href="#" className="hover:text-slate-300">Help</a>
            </div>
          </footer>
        </div>
      </main>

      {/* Biometrics Modal Simulation */}
      {biometricsOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md grid place-items-center z-50 p-4 animate-fade-in">
          <div className="w-full max-w-sm bg-slate-900/90 border border-indigo-500/40 rounded-3xl p-8 text-center shadow-2xl relative">
            <div className="relative w-24 h-24 mx-auto mb-5 rounded-full border-2 border-indigo-500 bg-indigo-500/10 grid place-items-center overflow-hidden shadow-inner">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 shadow-[0_0_12px_#fff] animate-bounce" />
              <span className="text-4xl text-indigo-400">🧬</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Biometric Passkey Scan</h3>
            <p className="text-xs text-slate-400 mb-6">{biometricsStatus}</p>
            <button
              type="button"
              onClick={() => setBiometricsOpen(false)}
              className="px-6 py-2 rounded-xl bg-white/10 text-xs font-bold text-slate-300 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-900/90 border border-indigo-500 px-5 py-2.5 rounded-full shadow-2xl backdrop-blur-xl text-white text-xs font-semibold z-50 animate-scale-up">
          <span>{toast.icon}</span>
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
