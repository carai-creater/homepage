'use client';

import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useScrollProgress() {
  const [sectionProgress, setSectionProgress] = useState(0);

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        setSectionProgress(self.progress);
      },
    });
    return () => trigger.kill();
  }, []);

  return sectionProgress;
}
