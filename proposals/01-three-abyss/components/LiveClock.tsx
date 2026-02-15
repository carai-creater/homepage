'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { getContent } from '@/lib/i18n/content';
import { useUniverseStream } from '@/hooks/useUniverseStream';

const LOCALE_TO_TIME: Record<string, string> = {
  ja: 'ja-JP', en: 'en-US', zh: 'zh-CN', ko: 'ko-KR', es: 'es-ES', fr: 'fr-FR',
  de: 'de-DE', pt: 'pt-BR', it: 'it-IT', th: 'th-TH',
};

function formatTime(d: Date, locale: string) {
  const bcp = LOCALE_TO_TIME[locale] ?? 'en-US';
  return d.toLocaleTimeString(bcp, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

/** Prominent live clock + countdown for urgency. */
export function LiveClock() {
  const { locale } = useLanguage();
  const { liveTime, countdown } = useUniverseStream();
  const u = getContent(locale).universe;

  return (
    <div className="mt-8 flex flex-col items-center gap-2 font-mono" role="timer" aria-live="polite">
      <span className="text-[9px] uppercase tracking-[0.25em] text-navy-500">
        {u.now}
      </span>
      <time
        dateTime={liveTime.toISOString()}
        className="font-mono text-3xl md:text-4xl lg:text-5xl font-bold tabular-nums text-amber-400 tracking-wider"
      >
        {formatTime(liveTime, locale)}
      </time>
      <span className="text-[10px] text-navy-500 tabular-nums uppercase tracking-wider">
        SYNC <span className="text-amber-500 font-bold">{countdown.toFixed(1)}s</span>
      </span>
    </div>
  );
}
