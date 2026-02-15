'use client';

import { useState, useEffect, useMemo } from 'react';

/** Simulated live task log — so visitors "see" AI working. */
const TASK_LINES = [
  '[render] frame',
  '[sync] checkpoint',
  '[inference] step',
  '[heartbeat] sent',
  '[parse] chunk',
  '[embed] batch',
  '[stream] token',
  '[cache] hit',
  '[model] forward',
  '[api] 200',
  '[queue] pop',
  '[gpu] busy',
  '[memory] ok',
  '[latency] 12ms',
  '[job] done',
  '[retry] 0',
  '[load] 0.4',
  '[thread] active',
];

const LINES_VISIBLE = 5;
const ROTATE_MS = 600;

/** Fixed panel: live scrolling "task log" so AI at work is visible. */
export function AIWorkLog() {
  const [offset, setOffset] = useState(0);

  const shuffled = useMemo(() => {
    const arr = [...TASK_LINES];
    let seed = Math.floor(Date.now() / 5000);
    for (let i = arr.length - 1; i > 0; i--) {
      seed = (seed * 9301 + 49297) % 233280;
      const j = Math.floor((seed / 233280) * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setOffset((o) => (o + 1) % shuffled.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [shuffled.length]);

  return (
    <div
      className="fixed top-20 right-4 z-30 w-40 rounded border border-amber-500/20 bg-abyss/90 backdrop-blur-sm px-2.5 py-1.5 font-mono text-[9px] tracking-wide hidden sm:block"
      aria-live="polite"
      role="status"
      aria-label="AI task log"
    >
      <div className="flex items-center gap-1.5 mb-1.5 pb-1 border-b border-amber-500/20">
        <span className="inline-block w-1 h-1 rounded-full bg-emerald-400 animate-pulse" style={{ animationDuration: '0.7s' }} />
        <span className="text-amber-500/90 uppercase tracking-widest">Tasks</span>
      </div>
      <div className="flex flex-col gap-0.5 min-h-[4.5rem]">
        {Array.from({ length: LINES_VISIBLE }).map((_, i) => {
          const idx = (offset + i) % shuffled.length;
          return (
            <span
              key={`${idx}-${i}`}
              className="text-amber-400/80 truncate tabular-nums"
            >
              {shuffled[idx]}
            </span>
          );
        })}
      </div>
    </div>
  );
}
