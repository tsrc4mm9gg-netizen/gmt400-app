'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

type Filters = {
  year?: string;
  engine?: string;
  drivetrain?: string;
};

type Selection = {
  bodyId: string | null;
  filters: Filters;
};

type ContextValue = Selection & {
  setSelection: (s: Selection) => void;
};

const ModelSelectionContext = createContext<ContextValue | null>(null);

export function ModelSelectionProvider({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState<Selection>({ bodyId: null, filters: {} });

  return (
    <ModelSelectionContext.Provider value={{ ...selection, setSelection }}>
      {children}
    </ModelSelectionContext.Provider>
  );
}

export function useModelSelection() {
  const ctx = useContext(ModelSelectionContext);
  if (!ctx) throw new Error('useModelSelection must be used within ModelSelectionProvider');
  return ctx;
}
