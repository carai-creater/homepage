'use client';

import { useState, useEffect, useRef } from 'react';
import { useUniverseStream } from '@/hooks/useUniverseStream';
import { useCodeLive } from '@/contexts/CodeLiveContext';

const EVENT_LABELS = [
  'PULSE',
  'RELAY',
  'CYCLE',
  'SIGNAL',
  'DRIVE',
  'TICK',
  'CORE→RELAY',
  'OUTPUT',
  'PIPELINE',
  'MOTOR',
  'SYNC',
  'CHANNEL',
  'LOAD',
  'RPM',
  'AXIS',
];

const MAX_EVENTS = 10;
const NEW_EVENT_INTERVAL_MS = 850;

function formatTime(d: Date) {
  return d.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

/** Flowing timeline of AI events — makes "AI is working" obvious at a glance. */
export function AITimeline() {
  const { liveTime } = useUniverseStream();
  const { lastExecuted } = useCodeLive();
  const [events, setEvents] = useState<{ id: number; time: Date; label: string }[]>([]);
  const [newFlash, setNewFlash] = useState(false);
  const idRef = useRef(0);
  const prevExecutedRef = useRef<string | null>(null);

  // Add event from code execution
  useEffect(() => {
    if (!lastExecuted || lastExecuted === prevExecutedRef.current) return;
    prevExecutedRef.current = lastExecuted;
    setEvents((prev) => {
      const next = [{ id: ++idRef.current, time: new Date(), label: lastExecuted }, ...prev];
      return next.slice(0, MAX_EVENTS);
    });
    setNewFlash(true);
  }, [lastExecuted]);

  // Add event on interval (live timeline flow)
  useEffect(() => {
    const id = setInterval(() => {
      const label = EVENT_LABELS[Math.floor(Math.random() * EVENT_LABELS.length)];
      setEvents((prev) => {
        const next = [{ id: ++idRef.current, time: new Date(), label }, ...prev];
        return next.slice(0, MAX_EVENTS);
      });
      setNewFlash(true);
    }, NEW_EVENT_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!newFlash) return;
    const t = setTimeout(() => setNewFlash(false), 350);
    return () => clearTimeout(t);
  }, [newFlash]);

  return (
    <div
      className={`fixed top-[4.5rem] right-4 z-30 w-72 sm:w-80 rounded-none border-2 overflow-hidden block font-mono transition-colors duration-150 ${newFlash ? 'border-amber-500/70 bg-amber-950/30' : 'border-navy-600 bg-navy-950/98 shadow-[inset_0_0_0_1px_rgba(251,191,36,0.2)]'}`}
      aria-live="polite"
      role="status"
      aria-label="Event log"
    >
      <div className="flex items-center gap-2 px-3 py-2 border-b-2 border-navy-600 bg-navy-900/90">
        <span className="inline-block w-1.5 h-1.5 rounded-none bg-amber-400 animate-pulse" style={{ animationDuration: '0.6s' }} />
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400">
          EVENT LOG
        </span>
        <span className="ml-auto font-mono text-[8px] text-navy-400 uppercase tracking-widest">SYS</span>
      </div>
      <div className="relative py-2 pl-3 pr-2 min-h-[10rem] max-h-[18rem] overflow-y-auto overflow-x-hidden">
        <span
          className="absolute left-[0.35rem] top-2 bottom-2 w-px bg-navy-600"
          aria-hidden
        />
        <ul className="flex flex-col gap-1">
          {events.length === 0 ? (
            <li className="font-mono text-[10px] text-navy-500 pl-4 tracking-wide">
              [{formatTime(liveTime)}] STANDBY
            </li>
          ) : (
            events.map((ev, i) => (
              <li
                key={ev.id}
                className={`flex items-baseline gap-2 font-mono pl-4 relative transition-colors duration-200 ${i === 0 ? 'text-amber-300 text-[10px]' : 'text-navy-400 text-[9px]'}`}
              >
                <span className={`absolute left-0 top-[0.35rem] w-1.5 h-1.5 rounded-none ${i === 0 ? 'bg-amber-400' : 'bg-navy-500'}`} aria-hidden />
                <span className="tabular-nums shrink-0 text-navy-500">[{formatTime(ev.time)}]</span>
                <span className="truncate uppercase tracking-wider">{ev.label}</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
