'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { getContent, SUPPORTED_LOCALES } from '@/lib/i18n/content';
import { Locale } from '@/lib/i18n/content';

export function Header() {
  const { locale, setLocale, withScanline } = useLanguage();
  const nav = getContent(locale).nav;
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleLang = (next: Locale) => {
    if (next === locale) return;
    withScanline(() => setLocale(next));
    setOpen(false);
  };

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 md:px-8">
      <Link
        href="/"
        className="font-display text-xl font-bold text-white text-readability hover:text-navy-100 transition-colors"
      >
        CRAai
      </Link>
      <div className="flex items-center gap-4 md:gap-8">
        <nav className="flex items-center gap-5 md:gap-8" aria-label="Main">
          <Link
            href="/about"
            className="font-display text-sm tracking-wide text-navy-200 hover:text-white transition-colors text-readability"
          >
            {nav.about}
          </Link>
          <Link
            href="/vision"
            className="font-display text-sm tracking-wide text-navy-200 hover:text-white transition-colors text-readability"
          >
            {nav.vision}
          </Link>
          <Link
            href="/#singularity"
            className="font-display text-sm tracking-wide text-navy-200 hover:text-white transition-colors text-readability"
          >
            {nav.mission}
          </Link>
          <Link
            href="/#projects"
            className="font-display text-sm tracking-wide text-navy-200 hover:text-white transition-colors text-readability"
          >
            {nav.products}
          </Link>
          <Link
            href="/#contact"
            className="font-display text-sm font-medium tracking-wide px-4 py-2 rounded bg-amber-400/90 text-abyss hover:bg-amber-300 transition-colors"
          >
            {nav.contact}
          </Link>
        </nav>
        <div className="relative" ref={ref}>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="font-display text-xs tracking-wider uppercase px-3 py-1.5 rounded bg-navy-800/80 text-navy-200 hover:text-white border border-navy-600/50 hover:border-navy-500 transition-colors flex items-center gap-1.5"
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-label="Select language"
          >
            {SUPPORTED_LOCALES.find((l) => l.code === locale)?.name ?? locale}
            <span className="text-navy-400" aria-hidden>▾</span>
          </button>
          {open && (
            <ul
              className="absolute top-full right-0 mt-1 py-1 min-w-[10rem] max-h-[70vh] overflow-y-auto rounded bg-abyss border border-navy-600/50 shadow-xl z-50 font-display text-xs"
              role="listbox"
            >
              {SUPPORTED_LOCALES.map(({ code, name }) => (
                <li key={code} role="option" aria-selected={locale === code}>
                  <button
                    type="button"
                    onClick={() => handleLang(code)}
                    className={`w-full text-left px-4 py-2.5 tracking-wide transition-colors ${
                      locale === code
                        ? 'bg-navy-600 text-amber-300'
                        : 'text-navy-200 hover:bg-navy-800 hover:text-white'
                    }`}
                  >
                    {name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </header>
  );
}
