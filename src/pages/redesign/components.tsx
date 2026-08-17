/* ============================================================
   Wingscript landing redesign — design-system primitives
   Faithful React ports of the handoff's DS components
   (Button, Tag, LiveDot, CueCard) plus a Lucide icon helper.
   Geometry/colors transcribed from the design-system bundle.
   ============================================================ */

import React, { useEffect, useState } from 'react';

/* ── Lucide icons (CDN, matching the design's own mechanism) ── */

export const Icon: React.FC<{ name: string; style?: React.CSSProperties }> = ({ name, style }) => (
  <i data-lucide={name} style={style} />
);

/** Injects the Lucide CDN once and swaps <i data-lucide> for SVGs at 1.5 stroke.
    Skips during react-snap prerender so the snapshot matches first client render. */
export function useLucide(): void {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (typeof navigator !== 'undefined' && /ReactSnap/i.test(navigator.userAgent)) return;
    const render = () => {
      const l = (window as unknown as { lucide?: { createIcons: (o: object) => void } }).lucide;
      if (l && l.createIcons) {
        try { l.createIcons({ attrs: { 'stroke-width': 1.5, 'aria-hidden': 'true' } }); } catch { /* noop */ }
      }
    };
    if ((window as unknown as { lucide?: unknown }).lucide) { render(); return; }
    const existing = document.querySelector('script[data-lucide-cdn]') as HTMLScriptElement | null;
    if (existing) { existing.addEventListener('load', render); return () => existing.removeEventListener('load', render); }
    const s = document.createElement('script');
    // Pinned: the live site must not track an unversioned third-party script
    s.src = 'https://unpkg.com/lucide@1.31.0';
    s.async = true;
    s.setAttribute('data-lucide-cdn', '');
    s.addEventListener('load', render);
    document.body.appendChild(s);
  }, []);
}

/* ── Button ── */

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'link';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  href?: string;
  target?: string;
  rel?: string;
  type?: 'button' | 'submit';
  onClick?: React.MouseEventHandler;
  style?: React.CSSProperties;
  ariaLabel?: string;
}

const BTN_SIZES: Record<ButtonSize, { padding: string; fontSize: number; radius: number; gap: number }> = {
  sm: { padding: '8px 14px', fontSize: 12.5, radius: 8, gap: 6 },
  md: { padding: '11px 20px', fontSize: 14, radius: 10, gap: 8 },
  lg: { padding: '14px 26px', fontSize: 15, radius: 12, gap: 8 },
};

export const Button: React.FC<ButtonProps> = ({
  children, variant = 'primary', size = 'md', disabled = false,
  href, target, rel, type = 'button', onClick, style = {}, ariaLabel,
}) => {
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);
  const [focus, setFocus] = useState(false);

  const s = BTN_SIZES[size];
  const variants: Record<ButtonVariant, React.CSSProperties> = {
    primary:   { background: hover ? 'var(--violet-600)' : 'var(--violet-500)', color: 'var(--white)', border: '1px solid transparent' },
    secondary: { background: 'var(--violet-50)', color: 'var(--violet-500)', border: '1px solid var(--violet-100)' },
    ghost:     { background: hover ? 'rgba(20,16,24,0.04)' : 'transparent', color: 'var(--ink-700)', border: '1px solid var(--border-default)' },
    link:      { background: 'transparent', color: 'var(--violet-500)', border: '1px solid transparent', padding: `${s.padding.split(' ')[0]} 8px` },
  };
  const v = variants[variant];
  const disabledStyle: React.CSSProperties = { background: 'var(--ink-100)', color: 'var(--ink-300)', border: '1px solid transparent', cursor: 'not-allowed' };

  const composed: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s.gap,
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: s.fontSize,
    lineHeight: 1,
    padding: (v as React.CSSProperties).padding || s.padding,
    borderRadius: s.radius,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    textDecoration: 'none',
    transition: 'background var(--duration-fast) var(--ease-standard), transform var(--duration-fast) var(--ease-lift)',
    transform: active && !disabled ? 'scale(var(--press-scale))' : 'scale(1)',
    boxShadow: focus && !disabled ? '0 0 0 3px var(--focus-ring)' : 'none',
    outline: 'none',
    ...(disabled ? disabledStyle : v),
    ...style,
  };

  const handlers = {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => { setHover(false); setActive(false); },
    onMouseDown: () => setActive(true),
    onMouseUp: () => setActive(false),
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
  };

  if (href && !disabled) {
    return (
      <a href={href} target={target} rel={rel} onClick={onClick} aria-label={ariaLabel} style={composed} {...handlers}>
        {children}
      </a>
    );
  }
  return (
    <button type={type} disabled={disabled} onClick={onClick} aria-label={ariaLabel} style={composed} {...handlers}>
      {children}
    </button>
  );
};

/* ── Tag ── */

type TagTone = 'violet' | 'sky' | 'ink' | 'file';

const TAG_TONES: Record<TagTone, { bg: string; fg: string }> = {
  violet: { bg: 'var(--violet-50)', fg: 'var(--violet-500)' },
  sky:    { bg: 'var(--info-100)', fg: 'var(--info-500)' },
  ink:    { bg: '#EFEDF4', fg: 'var(--ink-700)' },
  file:   { bg: '#EFEDF4', fg: 'var(--ink-500)' },
};

export const Tag: React.FC<{ children: React.ReactNode; tone?: TagTone; style?: React.CSSProperties }> = ({ children, tone = 'violet', style = {} }) => {
  const t = TAG_TONES[tone];
  const isFile = tone === 'file';
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      fontFamily: isFile ? 'var(--font-mono)' : 'var(--font-sans)',
      fontWeight: isFile ? 400 : 600,
      fontSize: 11,
      letterSpacing: isFile ? 0 : '0.08em',
      textTransform: isFile ? 'none' : 'uppercase',
      color: t.fg,
      background: t.bg,
      borderRadius: isFile ? 999 : 4,
      padding: '5px 9px',
      whiteSpace: 'nowrap',
      ...style,
    }}>{children}</span>
  );
};

/* ── LiveDot ── */

export const LiveDot: React.FC<{ size?: number; color?: string; pulse?: boolean; label?: string; style?: React.CSSProperties }> = ({
  size = 8, color = 'var(--sky-400)', pulse = true, label, style = {},
}) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9, ...style }}>
    <style>{`@keyframes ws-livedot{0%,100%{opacity:1}50%{opacity:0.45}}`}</style>
    <span style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: color,
      boxShadow: `0 0 0 ${Math.round(size / 2)}px rgba(90,180,255,0.2)`,
      animation: pulse ? 'ws-livedot 1.8s var(--ease-standard) infinite' : 'none',
      flex: 'none',
      display: 'inline-block',
    }} />
    {label && (
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--sky-300)' }}>{label}</span>
    )}
  </span>
);

/* ── CueCard ── the signature dark-glass live-call cue ── */

export const CueCard: React.FC<{
  label: string;
  children: React.ReactNode;
  source?: string;
  grounded?: boolean;
  accent?: 'violet' | 'sky';
  floating?: boolean;
  style?: React.CSSProperties;
}> = ({ label, children, source, grounded = true, accent = 'sky', floating = true, style = {} }) => {
  const stripe = accent === 'violet' ? 'var(--violet-400)' : 'var(--sky-400)';
  const labelColor = accent === 'violet' ? 'var(--violet-200)' : 'var(--sky-300)';
  return (
    <div style={{
      position: 'relative',
      background: floating ? 'var(--glass-bg)' : 'rgba(20,16,24,0.96)',
      backdropFilter: floating ? 'var(--glass-blur)' : 'none',
      WebkitBackdropFilter: floating ? 'var(--glass-blur)' : 'none',
      border: '1px solid var(--border-on-dark)',
      borderLeft: `3px solid ${stripe}`,
      borderRadius: 10,
      padding: '18px 20px',
      boxShadow: floating ? 'var(--elevation-hud)' : 'none',
      ...style,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: labelColor }}>{label}</span>
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, lineHeight: 1.6, color: 'var(--text-on-dark)', marginBottom: source || grounded ? 12 : 0 }}>{children}</div>
      {(source || grounded) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-mono)', fontSize: 10.5, color: '#8A8398' }}>
          {grounded && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#7DDDA0' }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--success-dot)' }} />
              grounded
            </span>
          )}
          {grounded && source && <span>·</span>}
          {source && <span>{source}</span>}
        </div>
      )}
    </div>
  );
};
