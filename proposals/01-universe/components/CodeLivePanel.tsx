'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useCodeLive } from '@/contexts/CodeLiveContext';

const CODE_LINES = [
  'EXEC RENDER',
  'RELAY SYNC',
  'DRIVE CYCLE',
  'PULSE OUTPUT',
  'SIGNAL TICK',
  'PIPELINE FLUSH',
  'MOTOR RUN',
  'AXIS COMMIT',
  'CHANNEL RELAY',
  'LOAD METRICS',
  'CORE PATCH',
  'OUTPUT STREAM',
];

const CHAR_MS = 32;
const PAUSE_AFTER_LINE_MS = 220;

/** Panel where code appears to be typed live; on each line "run", notifies context so the page can react. */
export function CodeLivePanel() {
  const { execute } = useCodeLive();
  const [completed, setCompleted] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState('');
  const [lineIndex, setLineIndex] = useState(0);
  const [phase, setPhase] = useState<'typing' | 'paused'>('typing');
  const [justRan, setJustRan] = useState(false);
  const fullLine = useMemo(
    () => CODE_LINES[lineIndex % CODE_LINES.length],
    [lineIndex]
  );
  const fullLineRef = useRef(fullLine);
  fullLineRef.current = fullLine;

  // Type one character at a time
  useEffect(() => {
    if (phase !== 'typing') return;
    if (currentLine.length >= fullLineRef.current.length) {
      setPhase('paused');
      const line = fullLineRef.current;
      execute(line);
      setJustRan(true);
      const tRun = setTimeout(() => setJustRan(false), 500);
      const t = setTimeout(() => {
        setCompleted((c) => [...c.slice(-4), fullLineRef.current]);
        setCurrentLine('');
        setLineIndex((i) => i + 1);
        setPhase('typing');
      }, PAUSE_AFTER_LINE_MS);
      return () => { clearTimeout(t); clearTimeout(tRun); };
    }
    const id = setTimeout(() => {
      setCurrentLine(fullLineRef.current.slice(0, currentLine.length + 1));
    }, CHAR_MS);
    return () => clearTimeout(id);
  }, [phase, currentLine, fullLine, execute, lineIndex]);

  const visibleLines = [...completed, currentLine];
  const displayLines = visibleLines.slice(-5);

  return (
    <div
      className="fixed bottom-[5.5rem] left-4 z-30 w-52 rounded-none border-2 border-navy-600 bg-navy-950/98 font-mono text-[9px] overflow-hidden hidden md:block"
      aria-live="polite"
      role="status"
      aria-label="Exec stream"
    >
      <div className={`flex items-center gap-1.5 px-2 py-1 border-b-2 border-navy-600 transition-all duration-200 ${justRan ? 'bg-amber-950/60' : 'bg-navy-900/90'}`}>
        <span className={`inline-block w-1 h-1 rounded-none ${justRan ? 'bg-amber-400 animate-pulse' : 'bg-cyan-500'}`} style={{ animationDuration: '0.8s' }} />
        <span className={`font-mono text-[8px] font-bold uppercase tracking-[0.2em] ${justRan ? 'text-amber-400' : 'text-cyan-400'}`}>
          {justRan ? 'EXEC' : 'STREAM'}
        </span>
      </div>
      <div className="px-2 py-1.5 min-h-[5.5rem] text-navy-300">
        {displayLines.map((line, i) => (
          <div key={`${line}-${i}-${lineIndex}`} className="flex items-center gap-1 font-mono uppercase tracking-wider">
            <span className="text-navy-600 select-none">&gt;</span>
            <span className={i === displayLines.length - 1 ? 'text-amber-300/90' : 'text-navy-400'}>{line}</span>
            {i === displayLines.length - 1 && line.length < fullLine.length && (
              <span className="inline-block w-1.5 h-2.5 bg-amber-400 animate-pulse" style={{ animationDuration: '0.5s' }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
