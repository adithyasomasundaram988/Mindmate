import React, { useEffect, useState, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export default function AmbientGlow() {
  const { reducedMotion, isDark, activeColorTheme } = useTheme();
  const [pointer, setPointer] = useState({ x: -200, y: -200 });
  const [isVisible, setIsVisible] = useState(false);
  const rafRef = useRef(null);

  useEffect(() => {
    // If reduced motion is active or device lacks fine pointer (e.g. mobile touch only)
    if (reducedMotion || window.matchMedia('(pointer: coarse)').matches) {
      setIsVisible(false);
      return;
    }

    const handlePointerMove = (e) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setPointer({ x: e.clientX, y: e.clientY });
        if (!isVisible) setIsVisible(true);
      });
    };

    const handlePointerLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseleave', handlePointerLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reducedMotion]);

  if (reducedMotion || !isVisible) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-500 overflow-hidden"
      style={{ opacity: isVisible ? 1 : 0 }}
      aria-hidden="true"
    >
      <div
        className="absolute rounded-full filter blur-[80px] pointer-events-none transition-transform duration-75 will-change-transform"
        style={{
          width: '420px',
          height: '420px',
          transform: `translate3d(${pointer.x - 210}px, ${pointer.y - 210}px, 0)`,
          background: isDark
            ? `radial-gradient(circle, ${activeColorTheme?.glow1 || 'rgba(14, 165, 233, 0.14)'} 0%, ${activeColorTheme?.glow2 || 'rgba(99, 102, 241, 0.09)'} 45%, transparent 75%)`
            : `radial-gradient(circle, ${activeColorTheme?.glow1 || 'rgba(13, 148, 136, 0.10)'} 0%, ${activeColorTheme?.glow2 || 'rgba(56, 189, 248, 0.06)'} 50%, transparent 80%)`,
        }}
      />
    </div>
  );
}
