import React, { useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export default function NeuralHeroVisual() {
  const canvasRef = useRef(null);
  const { isDark, reducedMotion } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const dpr = window.devicePixelRatio || 1;
    const width = 480;
    const height = 440;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Neural nodes arranged in a stylized organic brain silhouette
    const baseNodes = [
      // Left hemisphere
      { x: 240, y: 110, vx: 0.1, vy: 0.1 },
      { x: 190, y: 130, vx: -0.1, vy: 0.15 },
      { x: 140, y: 170, vx: 0.12, vy: -0.1 },
      { x: 120, y: 230, vx: -0.15, vy: 0.08 },
      { x: 135, y: 290, vx: 0.1, vy: 0.12 },
      { x: 180, y: 340, vx: -0.08, vy: -0.1 },
      { x: 230, y: 360, vx: 0.1, vy: 0.05 },
      { x: 200, y: 200, vx: 0.05, vy: 0.1 },
      { x: 170, y: 250, vx: -0.1, vy: -0.05 },
      { x: 215, y: 280, vx: 0.1, vy: -0.08 },

      // Right hemisphere
      { x: 290, y: 130, vx: 0.1, vy: -0.15 },
      { x: 340, y: 170, vx: -0.12, vy: 0.1 },
      { x: 360, y: 230, vx: 0.15, vy: -0.08 },
      { x: 345, y: 290, vx: -0.1, vy: -0.12 },
      { x: 300, y: 340, vx: 0.08, vy: 0.1 },
      { x: 250, y: 360, vx: -0.1, vy: -0.05 },
      { x: 280, y: 200, vx: -0.05, vy: -0.1 },
      { x: 310, y: 250, vx: 0.1, vy: 0.05 },
      { x: 265, y: 280, vx: -0.1, vy: 0.08 },

      // Central core / heart
      { x: 240, y: 180, vx: 0.06, vy: -0.06 },
      { x: 240, y: 240, vx: -0.05, vy: 0.05 },
      { x: 240, y: 310, vx: 0.07, vy: -0.04 },
    ];

    const nodes = baseNodes.map((n, i) => ({
      ...n,
      origX: n.x,
      origY: n.y,
      radius: i % 3 === 0 ? 4.5 : i % 2 === 0 ? 3.5 : 2.5,
      pulse: Math.random() * Math.PI * 2,
    }));

    let pulseTime = 0;
    let mouse = { x: -1000, y: -1000 };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouse = { x: -1000, y: -1000 };
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      pulseTime += 0.025;

      // Update nodes
      nodes.forEach((node) => {
        if (!reducedMotion) {
          node.x += node.vx;
          node.y += node.vy;

          // Gentle spring return to origin
          const dx = node.x - node.origX;
          const dy = node.y - node.origY;
          if (Math.abs(dx) > 12) node.vx *= -1;
          if (Math.abs(dy) > 12) node.vy *= -1;

          // Interactive subtle repel from mouse
          const mdx = node.x - mouse.x;
          const mdy = node.y - mouse.y;
          const dist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (dist < 80) {
            const force = (80 - dist) / 80;
            node.x += (mdx / dist) * force * 1.5;
            node.y += (mdy / dist) * force * 1.5;
          }
        }
      });

      // Draw synaptic connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 95) {
            const alpha = (1 - dist / 95) * (isDark ? 0.35 : 0.25);
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);

            const gradient = ctx.createLinearGradient(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
            if (isDark) {
              gradient.addColorStop(0, `rgba(56, 189, 248, ${alpha})`);
              gradient.addColorStop(0.5, `rgba(13, 148, 136, ${alpha * 1.2})`);
              gradient.addColorStop(1, `rgba(168, 85, 247, ${alpha})`);
            } else {
              gradient.addColorStop(0, `rgba(13, 148, 136, ${alpha})`);
              gradient.addColorStop(1, `rgba(2, 132, 199, ${alpha})`);
            }
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1.2;
            ctx.stroke();

            // Occasional traveling synaptic action potential
            const synProgress = (pulseTime + i * 0.4) % 1;
            if (i % 2 === 0 && !reducedMotion) {
              const px = nodes[i].x + (nodes[j].x - nodes[i].x) * synProgress;
              const py = nodes[i].y + (nodes[j].y - nodes[i].y) * synProgress;
              ctx.beginPath();
              ctx.arc(px, py, 1.8, 0, Math.PI * 2);
              ctx.fillStyle = isDark ? '#38bdf8' : '#0d9488';
              ctx.shadowColor = isDark ? '#38bdf8' : '#0d9488';
              ctx.shadowBlur = 6;
              ctx.fill();
              ctx.shadowBlur = 0;
            }
          }
        }
      }

      // Draw nodes
      nodes.forEach((node, i) => {
        const glow = Math.sin(pulseTime * 2 + i) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);

        if (i % 4 === 0) {
          ctx.fillStyle = isDark ? '#38bdf8' : '#0284c7'; // Sky
        } else if (i % 4 === 1) {
          ctx.fillStyle = isDark ? '#2dd4bf' : '#0d9488'; // Teal
        } else if (i % 4 === 2) {
          ctx.fillStyle = isDark ? '#c084fc' : '#9333ea'; // Violet
        } else {
          ctx.fillStyle = isDark ? '#f472b6' : '#e11d48'; // Rose
        }

        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = isDark ? 8 * glow : 4;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Outer delicate halo ring
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + 3 * glow, 0, Math.PI * 2);
        ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.2)' : 'rgba(13, 148, 136, 0.15)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      if (!reducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isDark, reducedMotion]);

  return (
    <div className="relative flex items-center justify-center select-none">
      {/* Background soft ambient gradient ring */}
      <div className="absolute w-80 h-80 rounded-full bg-gradient-to-tr from-teal-500/10 via-sky-500/15 to-indigo-500/10 blur-3xl -z-10 animate-pulse" />
      <canvas
        ref={canvasRef}
        style={{ width: '480px', height: '440px' }}
        className="max-w-full h-auto cursor-crosshair rounded-3xl"
        aria-label="Interactive neural synaptic cognitive illustration"
      />
    </div>
  );
}
