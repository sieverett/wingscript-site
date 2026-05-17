// demo-engine.tsx — minimal animation framework for the product demo.
// Provides: Easing, animate, Sprite/useSprite, Stage (auto-playing, no controls).

import React from "react";

// ── Easing functions ──────────────────────────────────────────────────────────
export const Easing = {
  linear: (t: number) => t,
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => (--t) * t * t + 1,
  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeOutBack: (t: number) => {
    const c1 = 1.70158, c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

export function animate({
  from = 0, to = 1, start = 0, end = 1, ease = Easing.easeInOutCubic,
}: { from?: number; to?: number; start?: number; end?: number; ease?: (t: number) => number }) {
  return (t: number) => {
    if (t <= start) return from;
    if (t >= end) return to;
    const local = (t - start) / (end - start);
    return from + (to - from) * ease(local);
  };
}

// ── Timeline context ──────────────────────────────────────────────────────────
interface TimelineCtx { time: number; duration: number; playing: boolean }
const TimelineContext = React.createContext<TimelineCtx>({ time: 0, duration: 10, playing: false });
export const useTime = () => React.useContext(TimelineContext).time;
export const useTimeline = () => React.useContext(TimelineContext);

// ── Sprite ────────────────────────────────────────────────────────────────────
interface SpriteCtx { localTime: number; progress: number; duration: number; visible: boolean }
const SpriteContext = React.createContext<SpriteCtx>({ localTime: 0, progress: 0, duration: 0, visible: false });
export const useSprite = () => React.useContext(SpriteContext);

export function Sprite({ start = 0, end = Infinity, children }: {
  start?: number; end?: number; children: React.ReactNode;
}) {
  const { time } = useTimeline();
  const visible = time >= start && time <= end;
  if (!visible) return null;

  const duration = end - start;
  const localTime = Math.max(0, time - start);
  const progress = duration > 0 && isFinite(duration) ? clamp(localTime / duration, 0, 1) : 0;

  return (
    <SpriteContext.Provider value={{ localTime, progress, duration, visible }}>
      {children}
    </SpriteContext.Provider>
  );
}

// ── Stage (autoplay, loop, no playback bar) ───────────────────────────────────
export function Stage({ width = 1280, height = 800, duration = 28, background = "#0B0D10", children }: {
  width?: number; height?: number; duration?: number; background?: string; children: React.ReactNode;
}) {
  const [time, setTime] = React.useState(0);
  const [scale, setScale] = React.useState(1);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const rafRef = React.useRef<number | null>(null);
  const lastTsRef = React.useRef<number | null>(null);

  // Auto-scale to fit container
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const s = Math.min(el.clientWidth / width, el.clientHeight / height);
      setScale(Math.max(0.05, s));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [width, height]);

  // Animation loop
  React.useEffect(() => {
    const step = (ts: number) => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;
      setTime(t => {
        let next = t + dt;
        if (next >= duration) next = next % duration;
        return next;
      });
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); lastTsRef.current = null; };
  }, [duration]);

  const ctxValue = React.useMemo(() => ({ time, duration, playing: true }), [time, duration]);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
      <div style={{
        width, height, background, position: "absolute",
        top: "50%", left: "50%",
        transform: `translate(-50%, -50%) scale(${scale})`,
        transformOrigin: "center",
        overflow: "hidden",
      }}>
        <TimelineContext.Provider value={ctxValue}>
          {children}
        </TimelineContext.Provider>
      </div>
    </div>
  );
}
