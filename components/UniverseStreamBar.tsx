'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCodeLive } from '@/contexts/CodeLiveContext';
import { getContent } from '@/lib/i18n/content';
import { useUniverseStream } from '@/hooks/useUniverseStream';

const LOCALE_TO_TIME: Record<string, string> = {
  ja: 'ja-JP', en: 'en-US', zh: 'zh-CN', ko: 'ko-KR', es: 'es-ES', fr: 'fr-FR',
  de: 'de-DE', pt: 'pt-BR', it: 'it-IT', th: 'th-TH', vi: 'vi-VN', id: 'id-ID',
  ms: 'ms-MY', ar: 'ar-EG', ru: 'ru-RU', hi: 'hi-IN', tr: 'tr-TR',
  pl: 'pl-PL', nl: 'nl-NL', sv: 'sv-SE',
};

function formatLiveTime(d: Date, locale: string) {
  const bcp = LOCALE_TO_TIME[locale] ?? 'en-US';
  return d.toLocaleTimeString(bcp, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

/** Bar that shows processing status + live clock + countdown — urgency and 24/7. */
export function UniverseStreamBar() {
  const { locale } = useLanguage();
  const { lastExecuted } = useCodeLive();
  const { liveTime, countdown, aiCount, streamTick, opsCount } = useUniverseStream();
  const c = getContent(locale);
  const u = c.universe;
  const cont = c.continuous;
  const boot = c.aiBoot;
  const [justApplied, setJustApplied] = useState(false);

  useEffect(() => {
    if (!lastExecuted) return;
    setJustApplied(true);
    const t = setTimeout(() => setJustApplied(false), 1800);
    return () => clearTimeout(t);
  }, [lastExecuted]);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-20 flex items-center justify-between gap-4 px-4 py-2 border-t-2 font-mono transition-all duration-300 ${justApplied ? 'border-cyan-500/70 bg-navy-950/98' : 'border-navy-600 bg-abyss/98'}`}
      aria-live="polite"
      role="status"
    >
      <span className="flex items-center gap-2 shrink-0">
        <span className="inline-flex items-center gap-2 px-2 py-1 rounded-none border border-amber-500/50 bg-navy-900">
          <span className="inline-block w-1 h-1 rounded-none bg-amber-400 animate-pulse" style={{ animationDuration: '1s' }} />
          <span className="font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-amber-400">
            {boot.aiActive}
          </span>
          <span className="w-px h-3 bg-navy-600" aria-hidden />
          <span className="font-mono text-[9px] tabular-nums uppercase tracking-wider text-navy-400" aria-live="polite">
            {boot.aiCountLabel}: <span className="text-amber-400 font-bold">{aiCount}</span>
          </span>
        </span>
        <span className="font-mono text-[8px] text-navy-500 tabular-nums uppercase hidden sm:inline">
          OPS: <span className="text-amber-400/90 font-bold">{opsCount}</span>
        </span>
        {lastExecuted && (
          <span className="font-mono text-[8px] text-cyan-400 truncate max-w-[100px] sm:max-w-[160px] uppercase tracking-wider" title={lastExecuted}>
            EXEC: {lastExecuted}
          </span>
        )}
      </span>
      <div className="flex items-center gap-3 shrink-0">
        <span className="font-mono text-xs md:text-sm font-bold text-amber-400 tabular-nums tracking-wider">
          <span className="text-amber-500/90 mr-1.5">{u.live}</span>
          {formatLiveTime(liveTime, locale)}
        </span>
        <span className="font-mono text-[9px] text-navy-500 tabular-nums uppercase">
          SYNC <span className="text-amber-500 font-bold">{countdown.toFixed(1)}s</span>
        </span>
      </div>
      <span className="flex items-center gap-2 shrink-0">
        <CoreBusyIndicator streamTick={streamTick} />
        <ActivityMeter streamTick={streamTick} />
        <span className="flex items-center gap-1.5 font-mono text-[9px] text-navy-400 uppercase tracking-wider">
          <span className="inline-block w-1 h-1 rounded-none bg-amber-400 animate-pulse" aria-hidden />
          {cont.running} · {cont.since}
        </span>
      </span>
    </div>
  );
}

/** 4 cores that light up in sequence — AI busy. */
function CoreBusyIndicator({ streamTick }: { streamTick: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-hidden>
      {[0, 1, 2, 3].map((i) => {
        const on = (streamTick + i) % 4 === 0 || (streamTick + i) % 4 === 1;
        return (
          <span
            key={i}
            className={`w-1.5 h-1.5 rounded-none transition-colors duration-150 ${on ? 'bg-amber-400' : 'bg-navy-600'}`}
            title={`Core ${i + 1}`}
          />
        );
      })}
    </span>
  );
}

/** Segmented load display — mechanic gauge look. */
function ActivityMeter({ streamTick }: { streamTick: number }) {
  const segments = 8;
  return (
    <span className="flex items-end gap-px h-3" aria-hidden>
      {Array.from({ length: segments }).map((_, i) => {
        const phase = (streamTick + i * 2) % 5;
        const h = 0.3 + (0.7 * phase) / 4;
        const on = h > 0.5;
        return (
          <span
            key={i}
            className={`w-1 rounded-none transition-all duration-150 ${on ? 'bg-amber-500' : 'bg-navy-600'}`}
            style={{ height: `${Math.max(25, h * 100)}%`, minHeight: 4 }}
          />
        );
      })}
    </span>
  );
}
