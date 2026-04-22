/**
 * KpiCard — Premium Redesign
 * ─────────────────────────────────────────────────────────────────────────────
 * Design decisions:
 *  1. Glassmorphism layer  — white bg + border-white/80 + multi-layer shadow
 *     with a per-color glow at low opacity for depth without noise.
 *  2. Gradient icon container — soft radial-style gradient (from/to Tailwind
 *     pairs) + ring glow matching the color variant.
 *  3. Hero value typography — text-3xl font-black + per-color text gradient
 *     via bg-clip-text trick; fade-in via CSS animation on mount.
 *  4. Decorative sparkline — 6 static bars (heights from a fixed array) at
 *     card bottom, purely visual, no data/props needed.
 *  5. Hover micro-interaction — card lifts (-translate-y-0.5), shadow deepens,
 *     icon container scales up slightly.
 *  6. Top accent line — 3 px gradient bar matching the color pair.
 *  7. Color system — each `color` prop maps to a premium gradient pair plus
 *     a matching glow/shadow color.
 * ─────────────────────────────────────────────────────────────────────────────
 * Props (unchanged): { title, value, subtitle, icon, color }
 */

import React, { useEffect, useRef } from 'react';

// ── Color config ──────────────────────────────────────────────────────────────
const colorConfig = {
  indigo: {
    gradient:   'from-indigo-500 to-violet-600',
    glow:       'shadow-indigo-200',
    textFrom:   '#6366f1',
    textTo:     '#7c3aed',
    barColor:   'bg-indigo-400',
    ringColor:  'ring-indigo-200',
  },
  red: {
    gradient:   'from-rose-500 to-red-600',
    glow:       'shadow-rose-200',
    textFrom:   '#f43f5e',
    textTo:     '#dc2626',
    barColor:   'bg-rose-400',
    ringColor:  'ring-rose-200',
  },
  green: {
    gradient:   'from-emerald-500 to-teal-600',
    glow:       'shadow-emerald-200',
    textFrom:   '#10b981',
    textTo:     '#0d9488',
    barColor:   'bg-emerald-400',
    ringColor:  'ring-emerald-200',
  },
  blue: {
    gradient:   'from-blue-500 to-cyan-600',
    glow:       'shadow-blue-200',
    textFrom:   '#2784c1',
    textTo:     '#0891b2',
    barColor:   'bg-blue-400',
    ringColor:  'ring-blue-200',
  },
  yellow: {
    gradient:   'from-amber-400 to-orange-500',
    glow:       'shadow-amber-200',
    textFrom:   '#f59e0b',
    textTo:     '#f97316',
    barColor:   'bg-amber-400',
    ringColor:  'ring-amber-200',
  },
  purple: {
    gradient:   'from-purple-500 to-fuchsia-600',
    glow:       'shadow-purple-200',
    textFrom:   '#a855f7',
    textTo:     '#c026d3',
    barColor:   'bg-purple-400',
    ringColor:  'ring-purple-200',
  },
  teal: {
    gradient:   'from-teal-500 to-cyan-600',
    glow:       'shadow-teal-200',
    textFrom:   '#14b8a6',
    textTo:     '#0891b2',
    barColor:   'bg-teal-400',
    ringColor:  'ring-teal-200',
  },
  // legacy fallbacks
  navy: {
    gradient:   'from-[#0B1F3A] to-blue-900',
    glow:       'shadow-blue-900/20',
    textFrom:   '#0B1F3A',
    textTo:     '#1e3a5f',
    barColor:   'bg-blue-900',
    ringColor:  'ring-blue-900/20',
  },
  gold: {
    gradient:   'from-amber-400 to-yellow-500',
    glow:       'shadow-amber-200',
    textFrom:   '#C9A84C',
    textTo:     '#f59e0b',
    barColor:   'bg-amber-400',
    ringColor:  'ring-amber-200',
  },
};

const FALLBACK = colorConfig.blue;

// Decorative sparkline bar heights (purely visual, no data)
const SPARK_HEIGHTS = [40, 65, 45, 80, 55, 90];

const KpiCard = ({ title, value, subtitle, icon, color }) => {
  const cfg = colorConfig[color] || FALLBACK;
  const valueRef = useRef(null);

  // Fade-in + slide-up animation on mount
  useEffect(() => {
    const el = valueRef.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(8px)';
    const raf = requestAnimationFrame(() => {
      el.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return (
    <div
      className={`
        relative flex flex-col justify-between
        bg-white
        border border-gray-100
        rounded-2xl p-5 overflow-hidden
        shadow-lg shadow-gray-200/50
        transition-shadow duration-200
      `}
    >
      {/* ── Top accent line with enhanced gradient ─────────────────────── */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${cfg.gradient} opacity-90`} />

      {/* ── Decorative background pattern ──────────────────────────────── */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
        <div className={`absolute inset-0 bg-gradient-to-br ${cfg.gradient} rounded-full blur-2xl`} />
      </div>

      {/* ── Main row: text left, icon right ─────────────────────────────── */}
      <div className="flex items-start justify-between gap-3 mt-1 relative z-10">

        {/* Left: title + value + subtitle */}
        <div className="flex flex-col min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 truncate mb-1">
            {title}
          </p>

          {/* Hero value with enhanced text gradient and shadow */}
          <p
            ref={valueRef}
            className="text-4xl font-black tracking-tight leading-none mb-1"
            style={{
              background: `linear-gradient(135deg, ${cfg.textFrom}, ${cfg.textTo})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
            }}
          >
            {value ?? '—'}
          </p>

          {subtitle && (
            <p className="text-[11px] font-medium text-gray-500 truncate">{subtitle}</p>
          )}
        </div>

        {/* Right: enhanced gradient icon container with glow */}
        <div
          className={`
            flex-shrink-0
            bg-gradient-to-br ${cfg.gradient}
            ring-2 ${cfg.ringColor}
            rounded-xl p-3.5 text-white
            shadow-lg
          `}
          style={{
            boxShadow: `0 8px 16px -4px ${cfg.textFrom}40, 0 4px 8px -2px ${cfg.textFrom}20`,
          }}
        >
          <span className="text-[24px] leading-none flex items-center justify-center">
            {icon}
          </span>
        </div>
      </div>

      {/* ── Enhanced decorative sparkline with gradient ──────────────────── */}
      <div className="flex items-end gap-[3px] mt-5 h-7 relative z-10">
        {SPARK_HEIGHTS.map((h, i) => (
          <div
            key={i}
            className={`flex-1 rounded-t-sm bg-gradient-to-t ${cfg.gradient} opacity-20`}
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
};

export default KpiCard;
