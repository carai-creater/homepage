/**
 * Evolution system: daily seed and shuffle for "常に進化するHP"
 * Same day = same order; new day = new order. Content can feel different each day.
 */

export function getDailySeed(): number {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const d = now.getDate();
  return y * 10000 + m * 100 + d;
}

export function shuffleWithSeed<T>(array: T[], seed: number): T[] {
  const out = [...array];
  let s = seed;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function getStartIndex(length: number, seed: number): number {
  return Math.abs(seed) % length;
}

const LOCALE_TO_DATE_OPTIONS: Record<string, { locale: string; suffix: string }> = {
  ja: { locale: 'ja-JP', suffix: '更新中' },
  en: { locale: 'en-US', suffix: 'Evolving' },
  zh: { locale: 'zh-CN', suffix: '进化中' },
  ko: { locale: 'ko-KR', suffix: '진화 중' },
  es: { locale: 'es-ES', suffix: 'Evolucionando' },
  fr: { locale: 'fr-FR', suffix: 'En évolution' },
  de: { locale: 'de-DE', suffix: 'Entwicklung' },
  pt: { locale: 'pt-BR', suffix: 'Evoluindo' },
  it: { locale: 'it-IT', suffix: 'In evoluzione' },
  th: { locale: 'th-TH', suffix: 'กำลังพัฒนา' },
  vi: { locale: 'vi-VN', suffix: 'Đang phát triển' },
  id: { locale: 'id-ID', suffix: 'Berkembang' },
  ms: { locale: 'ms-MY', suffix: 'Sedang berkembang' },
  ar: { locale: 'ar-EG', suffix: 'قيد التطور' },
  ru: { locale: 'ru-RU', suffix: 'Развитие' },
  hi: { locale: 'hi-IN', suffix: 'विकास' },
  tr: { locale: 'tr-TR', suffix: 'Gelişiyor' },
  pl: { locale: 'pl-PL', suffix: 'Ewolucja' },
  nl: { locale: 'nl-NL', suffix: 'In ontwikkeling' },
  sv: { locale: 'sv-SE', suffix: 'Evolverar' },
};

export function getEvolutionLabel(locale: string): string {
  const now = new Date();
  const opt = LOCALE_TO_DATE_OPTIONS[locale];
  if (locale === 'ja') {
    const y = now.getFullYear();
    const m = now.getMonth() + 1;
    const d = now.getDate();
    return `${y}年${m}月${d}日 · 更新中`;
  }
  const localeStr = opt?.locale ?? 'en-US';
  const suffix = opt?.suffix ?? 'Evolving';
  const date = now.toLocaleDateString(localeStr, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  return `${suffix} · ${date}`;
}
