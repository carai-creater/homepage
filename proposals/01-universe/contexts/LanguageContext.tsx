'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Locale } from '@/lib/i18n/content';

type LanguageContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  withScanline: (fn: () => void) => void;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [scanlineActive, setScanlineActive] = useState(false);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
  }, []);

  const toggleLocale = useCallback(() => {
    setLocaleState((prev) => (prev === 'ja' ? 'en' : 'ja'));
  }, []);

  const withScanline = useCallback((fn: () => void) => {
    setScanlineActive(true);
    fn();
    const t = setTimeout(() => {
      setScanlineActive(false);
    }, 450);
    return () => clearTimeout(t);
  }, []);

  return (
    <LanguageContext.Provider
      value={{ locale, setLocale, toggleLocale, withScanline }}
    >
      {children}
      {scanlineActive && (
        <div
          className="scanline-overlay scanline-active"
          aria-hidden
        />
      )}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
