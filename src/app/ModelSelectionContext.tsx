'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { useStoredVehicleProfile } from '@/lib/vehicle-profile-store';
import { BODY_STYLES } from '@/lib/body-styles';
import { ENGINES as ENGINE_SPECS } from '@/lib/verified-specs';

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

// Profil trzyma kod RPO silnika (np. L31), a filtr modelu — pojemność (np. 5.7). Mapowanie wg zweryfikowanej tabeli silników.
function engineDisplacement(engine: string): string | undefined {
  const code = engine.trim().toUpperCase();
  const spec = ENGINE_SPECS.find(e => e.rpo.toUpperCase().split(/[^A-Z0-9]+/).includes(code));
  const source = spec ? spec.name : engine;
  return source.match(/\b\d\.\d\b/)?.[0];
}

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
  if (profile.engine) filters.engine = engineDisplacement(profile.engine);
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
    // Bez wyboru z sesji wybór podąża za aktywnym autem (zmiana auta w garażu, usunięcie auta).
    setSelectionState(profileToSelection(profile) ?? EMPTY);
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
