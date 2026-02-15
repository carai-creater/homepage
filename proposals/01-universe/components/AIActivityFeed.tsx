'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getContent } from '@/lib/i18n/content';

/** Mechanic-style relay/signal messages. */
const EXCHANGE_MESSAGES = [
  'A→B PULSE',
  'B→A ACK',
  'RELAY SYNC',
  'SIGNAL OK',
  'A→B DRIVE',
  'B→A OUTPUT',
  'CHANNEL OPEN',
  'PIPELINE TICK',
  'A→B CYCLE',
  'B→A RELAY',
  'MOTOR RUN',
  'AXIS FEED',
  'A→B LOAD',
  'B→A RPM',
  'CORE ACTIVE',
];

const ROTATE_MS = 450;

/** Visible "AI exchange" bar: two lines of relay traffic + agents — strong "AI is running" feel. */
export function AIActivityFeed() {
  const { locale } = useLanguage();
  const c = getContent(locale).aiActivity;
  const [index, setIndex] = useState(0);

  const shuffled = useMemo(() => {
    const arr = [...EXCHANGE_MESSAGES];
    let seed = Math.floor(Date.now() / 10000);
    for (let i = arr.length - 1; i > 0; i--) {
      seed = (seed * 9301 + 49297) % 233280;
      const j = Math.floor((seed / 233280) * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % shuffled.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [shuffled.length]);

  const current = shuffled[index];
  const previous = shuffled[(index - 1 + shuffled.length) % shuffled.length];

  return (
    <div
      className="fixed left-0 right-0 z-20 flex items-center gap-4 px-4 py-2.5 bg-navy-950/98 border-t-2 border-navy-600 font-mono"
      style={{ bottom: '2.5rem' }}
      aria-live="polite"
      role="status"
      aria-label={c.label}
    >
      <span className="inline-flex items-center gap-1 shrink-0 px-2 py-0.5 rounded-none border border-amber-500/50 bg-navy-900">
        <span className="inline-block w-1 h-1 rounded-none bg-amber-400 animate-pulse" style={{ animationDuration: '0.5s' }} />
        <span className="font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-amber-400">
          ON
        </span>
      </span>
      <span className="font-mono text-[9px] uppercase tracking-wider text-navy-500 shrink-0">
        {c.label}
      </span>
      <div className="flex items-center gap-1.5 min-w-0 flex-1">
        <span className="font-mono text-[9px] text-amber-400 shrink-0 uppercase">{c.agentA}</span>
        <span className="flex items-center shrink-0" aria-hidden>
          <span className="w-4 h-px bg-navy-500" />
          <span className="inline-block w-1 h-1 rounded-none bg-amber-400 animate-pulse mx-0.5" style={{ animationDuration: '0.4s' }} />
          <span className="w-4 h-px bg-navy-500" />
        </span>
        <span className="font-mono text-[9px] text-cyan-400 shrink-0 uppercase">{c.agentB}</span>
      </div>
      <div className="flex flex-col gap-0.5 min-w-0 max-w-[200px] sm:max-w-[240px]">
        <span
          className="font-mono text-[9px] text-amber-300 truncate uppercase tracking-wider"
          key={`cur-${index}`}
        >
          {current}
        </span>
        <span className="font-mono text-[8px] text-navy-500 truncate uppercase tracking-wider">
          {previous}
        </span>
      </div>
    </div>
  );
}
