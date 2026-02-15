'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getContent } from '@/lib/i18n/content';

const BOOT_STEPS = ['initializing', 'coreLoaded', 'operational'] as const;
const STEP_DELAY_MS = 700;

const LIVE_STATUSES = ['CYCLE', 'RELAY', 'PULSE', 'DRIVE', 'SIGNAL', 'OUTPUT'] as const;
const STATUS_ROTATE_MS = 1200;

/** Boot log sequence then persistent "SYSTEM ONLINE" + cycling status — reinforces "AI is running". */
export function AIBootStatus() {
  const { locale } = useLanguage();
  const boot = getContent(locale).aiBoot;
  const [step, setStep] = useState(0);
  const [bootDone, setBootDone] = useState(false);
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    if (step >= BOOT_STEPS.length) {
      const t = setTimeout(() => setBootDone(true), STEP_DELAY_MS);
      return () => clearTimeout(t);
    }
    const id = setTimeout(() => setStep((s) => s + 1), STEP_DELAY_MS);
    return () => clearTimeout(id);
  }, [step]);

  useEffect(() => {
    if (!bootDone) return;
    const id = setInterval(() => setStatusIndex((i) => (i + 1) % LIVE_STATUSES.length), STATUS_ROTATE_MS);
    return () => clearInterval(id);
  }, [bootDone]);

  return (
    <div
      className="fixed top-20 left-4 z-30 flex flex-col gap-0.5 font-mono text-[9px] tracking-[0.15em]"
      aria-live="polite"
      role="status"
      aria-label="System status"
    >
      {!bootDone ? (
        <>
          {step > 0 && (
            <span className="text-navy-500 uppercase">{boot.initializing}</span>
          )}
          {step > 1 && (
            <span className="text-cyan-400/90 uppercase">{boot.coreLoaded}</span>
          )}
          {step > 2 && (
            <span className="text-amber-400/90 uppercase">{boot.operational}</span>
          )}
        </>
      ) : (
        <>
          <span
            className="ai-system-glow inline-flex items-center gap-1.5 text-amber-400 font-bold uppercase tracking-[0.2em]"
          >
            <span className="inline-block w-1 h-1 rounded-none bg-amber-400 animate-pulse" style={{ animationDuration: '1s' }} />
            {boot.systemOnline}
          </span>
          <span
            key={statusIndex}
            className="text-navy-400 uppercase tracking-wider"
          >
            [{LIVE_STATUSES[statusIndex]}]
          </span>
        </>
      )}
    </div>
  );
}
