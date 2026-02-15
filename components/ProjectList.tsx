'use client';

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '@/contexts/LanguageContext';
import { getContent } from '@/lib/i18n/content';

gsap.registerPlugin(ScrollTrigger);

export function ProjectList() {
  const { locale } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const c = getContent(locale).projects;

  useEffect(() => {
    if (!sectionRef.current || !titleRef.current) return;
    gsap.fromTo(
      titleRef.current,
      { opacity: 0.7, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 78%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }, [locale]);

  useEffect(() => {
    const cards = cardsRef.current?.querySelectorAll('[data-project-card]');
    if (!cards?.length) return;
    cards.forEach((el, i) => {
      gsap.fromTo(
        el,
        { opacity: 0.6, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: i * 0.05,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, [locale]);

  return (
    <section
      ref={sectionRef}
      id={c.sectionId}
      className="relative py-24 md:py-32 px-6"
    >
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display text-sm tracking-[0.25em] uppercase text-navy-300 mb-4 text-readability flex items-center gap-2">
          <span className="inline-block w-4 h-4 border border-navy-400 rounded" aria-hidden />
          {c.sectionLabel}
        </h2>
        <p
          ref={titleRef}
          className="font-display text-2xl md:text-3xl font-bold text-accent leading-tight mb-3 text-readability-strong"
        >
          {c.title}
        </p>
        <p className="font-sans font-normal text-navy-200 text-base md:text-lg max-w-xl mb-14 text-readability leading-relaxed">
          {c.subtitle}
        </p>

        <div ref={cardsRef} className="space-y-8">
          {c.items.map((project) => (
            <motion.a
              key={project.id}
              href={`#${project.id}`}
              data-project-card
              className="block group py-2 transition-colors"
            >
              <span className="block font-display text-xl md:text-3xl font-bold text-navy-50 group-hover:text-white transition-colors text-readability mb-1">
                {project.name}.
              </span>
              <span className="block font-sans font-normal text-base md:text-lg text-navy-200 group-hover:text-navy-100 transition-colors text-readability">
                {project.tagline}
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
