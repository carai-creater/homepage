'use client';

import Link from 'next/link';
import { Header } from '@/components/Header';
import { AlwaysChanging } from '@/components/AlwaysChanging';
import { useLanguage } from '@/contexts/LanguageContext';
import { getContent } from '@/lib/i18n/content';

export default function VisionPage() {
  const { locale } = useLanguage();
  const v = getContent(locale).visionPage;

  return (
    <>
      <Header />
      <main className="relative z-10 min-h-screen pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="font-display text-xs tracking-[0.2em] uppercase text-navy-400 mb-6 text-readability">
            {v.title}
          </p>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white text-readability-strong leading-tight mb-8">
            {v.heading}
          </h1>
          <p className="font-sans font-normal text-lg md:text-xl leading-[1.8] text-navy-100 text-readability mb-16">
            {v.intro}
          </p>

          <div className="space-y-14">
            {v.sections.map((section, i) => (
              <section key={i}>
                <h2 className="font-display text-accent text-sm tracking-widest uppercase mb-4 text-readability font-medium">
                  {section.title}
                </h2>
                <p className="font-sans font-normal text-base md:text-lg leading-[1.75] text-navy-200 text-readability">
                  {section.body}
                </p>
              </section>
            ))}
          </div>

          <Link
            href="/"
            className="inline-block mt-16 font-display text-sm tracking-wide text-amber-400/90 hover:text-amber-300 transition-colors"
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
