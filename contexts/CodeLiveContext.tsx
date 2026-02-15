'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

type CodeLiveContextType = {
  lastExecuted: string | null;
  execute: (line: string) => void;
};

const CodeLiveContext = createContext<CodeLiveContextType | null>(null);

export function CodeLiveProvider({ children }: { children: React.ReactNode }) {
  const [lastExecuted, setLastExecuted] = useState<string | null>(null);

  const execute = useCallback((line: string) => {
    setLastExecuted(line);
    setTimeout(() => setLastExecuted(null), 3200);
  }, []);

  return (
    <CodeLiveContext.Provider value={{ lastExecuted, execute }}>
      {children}
    </CodeLiveContext.Provider>
  );
}

export function useCodeLive() {
  const ctx = useContext(CodeLiveContext);
  if (!ctx) return { lastExecuted: null, execute: (_: string) => {} };
  return ctx;
}
