'use client';

import Link from 'next/link';
import { Header } from '@/components/Header';
import { AlwaysChanging } from '@/components/AlwaysChanging';
import { useLanguage } from '@/contexts/LanguageContext';
import { getContent } from '@/lib/i18n/content';

export default function AboutPage() {
  const { locale } = useLanguage();
  const c = getContent(locale).about;

  return (
    <>
      <Header />
      <main className="relative z-10 min-h-screen pt-28 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          <p className="font-display text-xs tracking-[0.2em] uppercase text-navy-400 mb-4 text-readability">
            {c.title}
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white text-readability-strong mb-2">
            {c.name}
          </h1>
          <p className="font-display text-lg text-amber-400/90 mb-10 text-readability">
            {c.role}
          </p>
          <p className="font-sans font-normal text-lg md:text-xl leading-[1.8] text-navy-100 text-readability mb-12">
            {c.bio}
          </p>
          <ul className="space-y-2">
            {c.values.map((value) => (
              <li
                key={value}
                className="font-display text-sm tracking-wide text-navy-300 text-readability"
              >
                — {value}
              </li>
            ))}
          </ul>
          <Link
            href="/"
            className="inline-block mt-14 font-display text-sm tracking-wide text-amber-400/90 hover:text-amber-300 transition-colors"
          >
            ← {getContent(locale).nav.home}
          </Link>
        </div>
        <AlwaysChanging />
      </main>
      <div className="fixed inset-0 -z-10 bg-navy-950" />
    </>
  );
}
