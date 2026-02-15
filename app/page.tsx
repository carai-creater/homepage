'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Scene } from '@/components/scene/Scene';
import { Header } from '@/components/Header';
import { ProjectList } from '@/components/ProjectList';
import { AlwaysChanging } from '@/components/AlwaysChanging';
import { useLanguage } from '@/contexts/LanguageContext';
import { getContent } from '@/lib/i18n/content';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { useUniverseStream } from '@/hooks/useUniverseStream';
import { UniverseStreamBar } from '@/components/UniverseStreamBar';
import { AIActivityFeed } from '@/components/AIActivityFeed';
import { AIBootStatus } from '@/components/AIBootStatus';
import { AITimeline } from '@/components/AITimeline';
import { CodeLivePanel } from '@/components/CodeLivePanel';
import { LiveClock } from '@/components/LiveClock';
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const { locale } = useLanguage();
  const sectionProgress = useScrollProgress();
  const { streamTick } = useUniverseStream();
  const heroRef = useRef<HTMLElement>(null);
  const originRef = useRef<HTMLElement>(null);

  const c = getContent(locale);

  useEffect(() => {
    const sections = [heroRef, originRef].filter(Boolean) as React.RefObject<HTMLElement>[];
    sections.forEach((ref) => {
      if (!ref.current) return;
      const el = ref.current.querySelector('.section-content');
      if (!el) return;
      gsap.fromTo(
        el,
        { opacity: 0.5, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 72%',
            end: 'top 35%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, [locale]);

  return (
    <>
      <Scene sectionProgress={sectionProgress} streamTick={streamTick} />
      <AIBootStatus />
      <AITimeline />
      <AIActivityFeed />
      <CodeLivePanel />
      <UniverseStreamBar />
      <Header />

      <main className="relative z-10 pb-24">
        {/* Hero: full-height with particle focus */}
        <section
          ref={heroRef}
          id="origin"
          className="min-h-screen flex flex-col items-center justify-center px-6 relative pt-20"
        >
          <div className="section-content text-center max-w-3xl mx-auto">
            <motion.h1
              className="font-display text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-readability-strong text-white"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              {c.hero.title}
            </motion.h1>
            <motion.p
              className="mt-10 font-sans font-normal text-lg md:text-xl text-amber-200/95 text-readability"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              {c.hero.tagline}
            </motion.p>
            <motion.p
              className="mt-4 font-display text-sm tracking-wide text-navy-400/90 text-readability"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              {c.hero.aiStatement}
            </motion.p>
            <LiveClock />
          </div>
        </section>

        {/* The Origin: Vision + Mission as cards */}
        <section
          ref={originRef}
          id="expansion"
          className="relative py-24 md:py-32 px-6"
        >
          <div className="max-w-5xl mx-auto">
            <h2 className="font-display text-sm tracking-[0.25em] uppercase text-navy-300 mb-10 text-readability flex items-center gap-2">
              <span className="inline-block w-4 h-4 border border-navy-400 rounded" aria-hidden />
              {c.vision.sectionLabel}
            </h2>
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              <div className="section-content rounded-xl bg-navy-900/60 backdrop-blur-sm p-8 md:p-10 border border-navy-700/30">
                <p className="font-display text-accent text-xs tracking-[0.2em] uppercase mb-4 text-readability font-medium">
                  {c.vision.title}
                </p>
                <p className="font-sans font-normal text-lg md:text-xl leading-[1.7] text-navy-100 text-readability">
                  {c.vision.body}
                </p>
                <Link
                  href="#singularity"
                  className="inline-block mt-6 font-display text-sm tracking-wide text-amber-400/90 hover:text-amber-300 transition-colors"
                >
                  {c.mission.title} →
                </Link>
              </div>
              <div id="singularity" className="rounded-xl bg-navy-900/60 backdrop-blur-sm p-8 md:p-10 border border-navy-700/30">
                <p className="font-display text-accent text-xs tracking-[0.2em] uppercase mb-4 text-readability font-medium">
                  {c.mission.title}
                </p>
                <p className="font-sans font-normal text-xl md:text-2xl leading-snug text-white text-readability-strong">
                  {c.mission.tagline}
                </p>
                <Link
                  href="#projects"
                  className="inline-block mt-6 font-display text-sm tracking-wide text-amber-400/90 hover:text-amber-300 transition-colors"
                >
                  {c.nav.products} →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* The Products */}
        <ProjectList />

        {/* Contact */}
        <section id="contact" className="relative py-24 md:py-32 px-6">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-display text-sm tracking-[0.25em] uppercase text-navy-300 mb-10 text-readability flex items-center gap-2">
              <span className="inline-block w-4 h-4 border border-navy-400 rounded" aria-hidden />
              {c.contact.title}
            </h2>
            <div className="rounded-xl bg-navy-900/60 backdrop-blur-sm p-8 md:p-10 border border-navy-700/30">
              <p className="font-sans text-navy-200 text-readability mb-4">
                {c.contact.inquiryMessage}
              </p>
              <p className="font-display text-xs tracking-wide text-navy-400 mb-8">
                {c.contact.builtWithRag}
              </p>
              <a
                href={c.contact.href}
                className="inline-block font-display text-sm font-medium px-6 py-3 rounded bg-amber-400/90 text-abyss hover:bg-amber-300 transition-colors"
              >
                {c.contact.cta}
              </a>
            </div>
          </div>
        </section>
        <AlwaysChanging />
      </main>
    </>
  );
}
