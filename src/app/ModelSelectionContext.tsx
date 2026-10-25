'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { useStoredVehicleProfile } from '@/lib/vehicle-profile-store';
import { BODY_STYLES } from '@/lib/body-styles';

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

function profileToSelection(profile: ReturnType<typeof useStoredVehicleProfile>): Selection | null {
  if (!profile?.model) return null;
  const model = profile.model.toLowerCase();
  let bodyId: string | null = null;
  if (model.includes('tahoe') && model.includes('4')) bodyId = 'tahoe-4d';
  else if (model.includes('tahoe') || model.includes('blazer')) bodyId = 'tahoe-2d';
  else if (model.includes('suburban')) bodyId = 'suburban';
  else if (model.includes('yukon')) bodyId = 'yukon';
  else if (model.includes('sierra')) bodyId = 'sierra';
  else if (model.includes('dually') || model.includes('3500')) bodyId = 'dually';
  else if (model.includes('extended') || model.includes('ext')) bodyId = 'ck-ext';
  else if (model.includes('k1500') || model.includes('4x4')) bodyId = 'k1500';
  else if (model.includes('c1500') || model.includes('regular')) bodyId = 'ck-reg';
  if (!bodyId || !BODY_STYLES.some(b => b.id === bodyId)) return null;
  const filters: Filters = {};
  if (profile.year) filters.year = profile.year;
  if (profile.engine) filters.engine = profile.engine.replace(/[^0-9.]/g, '').slice(0, 4) || undefined;
  if (profile.drive) filters.drivetrain = profile.drive.toLowerCase() as '2wd' | '4wd';
  return { bodyId, filters };
}

export function ModelSelectionProvider({ children }: { children: ReactNode }) {
  const [selection, setSelectionState] = useState<Selection>(EMPTY);
  const profile = useStoredVehicleProfile();

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Selection;
        if (parsed && typeof parsed === 'object' && 'filters' in parsed) {
          setSelectionState({ bodyId: parsed.bodyId ?? null, filters: parsed.filters ?? {} });
          return;
        }
      }
    } catch {}
    const fromProfile = profileToSelection(profile);
    if (fromProfile) setSelectionState(fromProfile);
  }, [profile]);

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
