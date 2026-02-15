'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getContent } from '@/lib/i18n/content';
import {
  getDailySeed,
  shuffleWithSeed,
  getStartIndex,
  getEvolutionLabel,
} from '@/lib/evolution';

const ROTATE_MS = 2800;
const EVOLUTION_DATA_URL = '/data/evolution.json';

export function AlwaysChanging() {
  const { locale } = useLanguage();
  const c = getContent(locale);
  const { main, aiLine, phrases: staticPhrases } = c.alwaysChange;
  const continuousLine = c.continuous.line;
  const [extraPhrases, setExtraPhrases] = useState<string[]>([]);

  useEffect(() => {
    fetch(EVOLUTION_DATA_URL)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { phrases?: Record<string, string[]> } | null) => {
        const list = data?.phrases?.[locale];
        if (list?.length) setExtraPhrases(list);
      })
      .catch(() => {});
  }, [locale]);

  const phrases = useMemo(
    () => [...staticPhrases, ...extraPhrases],
    [staticPhrases, extraPhrases]
  );

  const { shuffledPhrases, startIndex } = useMemo(() => {
    const seed = getDailySeed();
    const shuffled = shuffleWithSeed(phrases, seed);
    const start = getStartIndex(shuffled.length, seed);
    return { shuffledPhrases: shuffled, startIndex: start };
  }, [phrases, locale]);

  const [index, setIndex] = useState(startIndex);
  const [evolutionLabel, setEvolutionLabel] = useState('');

  useEffect(() => {
    setIndex(startIndex);
  }, [startIndex]);

  useEffect(() => {
    setEvolutionLabel(getEvolutionLabel(locale));
  }, [locale]);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % shuffledPhrases.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [shuffledPhrases.length]);

  return (
    <footer className="relative py-12 px-6 border-t border-navy-800/50">
      <div className="max-w-3xl mx-auto text-center">
        <p className="font-sans font-normal text-navy-300 text-readability text-sm md:text-base">
          {main}
        </p>
        <p
          className="font-display text-amber-400/90 text-sm md:text-base mt-2 tracking-wide animate-fade-in"
          key={index}
          aria-live="polite"
        >
          {shuffledPhrases[index]}
        </p>
        <p className="font-display text-navy-400/80 text-xs md:text-sm mt-4 tracking-wide">
          {aiLine}
        </p>
        <p className="font-sans text-navy-400/70 text-xs mt-3 max-w-xl mx-auto text-readability">
          {continuousLine}
        </p>
        {evolutionLabel && (
          <p
            className="font-display text-navy-500/70 text-xs mt-5 tracking-widest uppercase"
            aria-label="Evolution status"
          >
            {evolutionLabel}
          </p>
        )}
      </div>
    </footer>
  );
}
