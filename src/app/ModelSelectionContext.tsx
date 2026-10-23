'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

export type Filters = {
  year?: string;
  engine?: string;
  drivetrain?: string;
};

export type Selection = {
  bodyId: string | null;
  filters: Filters;
};

type ContextValue = Selection & {
  setSelection: (s: Selection) => void;
  clearSelection: () => void;
};

const STORAGE_KEY = 'gmt400_model_selection';
const EMPTY: Selection = { bodyId: null, filters: {} };
const ModelSelectionContext = createContext<ContextValue | null>(null);

export function ModelSelectionProvider({ children }: { children: ReactNode }) {
  const [selection, setSelectionState] = useState<Selection>(EMPTY);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Selection;
        if (parsed && typeof parsed === 'object' && 'filters' in parsed) setSelectionState({ bodyId: parsed.bodyId ?? null, filters: parsed.filters ?? {} });
      }
    } catch {}
  }, []);

  const setSelection = useCallback((s: Selection) => {
    setSelectionState(s);
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {}
  }, []);

  const clearSelection = useCallback(() => setSelection(EMPTY), [setSelection]);

  return (
    <ModelSelectionContext.Provider value={{ ...selection, setSelection, clearSelection }}>
      {children}
    </ModelSelectionContext.Provider>
  );
}

export function useModelSelection() {
  const ctx = useContext(ModelSelectionContext);
  if (!ctx) throw new Error('useModelSelection must be used within ModelSelectionProvider');
  return ctx;
}
