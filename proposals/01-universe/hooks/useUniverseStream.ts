'use client';

import { useState, useEffect } from 'react';

/** Real-time "universe stream" tick + live time + countdown to next tick for urgency. */
export function useUniverseStream() {
  const [streamTick, setStreamTick] = useState(0);
  const [liveTime, setLiveTime] = useState<Date>(() => new Date());
  const [countdown, setCountdown] = useState(1.0);

  useEffect(() => {
    const idMs = setInterval(() => {
      setLiveTime(new Date());
      setCountdown((c) => {
        const next = c - 0.1;
        if (next <= 0) return 1.0;
        return Math.round(next * 10) / 10;
      });
    }, 100);
    return () => clearInterval(idMs);
  }, []);

  useEffect(() => {
    const idSec = setInterval(() => {
      setStreamTick((t) => t + 1);
      setCountdown(1.0);
    }, 1000);
    return () => clearInterval(idSec);
  }, []);

  // Real-time "working AI" count: deterministic variation 12–18 per second for live feel
  const aiCount = 12 + (streamTick % 7);
  // Cumulative "ops" that always goes up — reinforces "AI is working"
  const opsCount = 8000 + streamTick * 4 + Math.floor(streamTick / 10) * 7;

  return { streamTick, liveTime, countdown, aiCount, opsCount };
}
