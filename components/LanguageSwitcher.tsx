'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Locale } from '@/lib/i18n/content';
import { content } from '@/lib/i18n/content';

export function LanguageSwitcher() {
  const { locale, setLocale, withScanline } = useLanguage();

  const handleClick = (next: Locale) => {
    if (next === locale) return;
    withScanline(() => setLocale(next));
  };

  return (
    <nav
      className="fixed top-6 right-6 z-50 flex gap-2 font-display text-sm font-medium tracking-widest uppercase text-readability"
      aria-label="Language"
    >
      <button
        type="button"
        onClick={() => handleClick('ja')}
        className={`px-3 py-1.5 rounded transition-colors ${
          locale === 'ja'
            ? 'bg-accent text-abyss'
            : 'text-navy-200 hover:text-navy-50'
        }`}
      >
        {content.ja.nav.langJa}
      </button>
      <button
        type="button"
        onClick={() => handleClick('en')}
        className={`px-3 py-1.5 rounded transition-colors ${
          locale === 'en'
            ? 'bg-accent text-abyss'
            : 'text-navy-200 hover:text-navy-50'
        }`}
      >
        {content.en.nav.langEn}
      </button>
    </nav>
  );
}
