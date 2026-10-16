'use client';
import { useId, useState } from 'react';
import type { VehicleProfile } from './VehicleProfileProvider';
const LABELS = { relevant: 'Dla mojego auta', all: 'Wszystkie', within_scope: 'Zgodne z zakresem', general: 'Ogólne', unknown: 'Nieustalone', outside_scope: 'Poza zakresem' };
type Mode = keyof typeof LABELS;
export default function CompactVehicleFilterPanel({ profile, active, mode, counts, onModeChange }: { profile: VehicleProfile | null; active: boolean; mode: Mode; counts: Record<Mode, number>; onModeChange: (value: Mode) => void }) {
  const [expanded, setExpanded] = useState(false);
  const controls = useId();
  const button = (value: Mode) => <button key={value} type="button" aria-pressed={mode === value} onClick={() => onModeChange(value)} className="min-h-11 rounded-lg border px-3 py-2 text-sm" style={{ background: mode === value ? '#302b21' : '#171b20', borderColor: mode === value ? '#947442' : '#343a43', color: mode === value ? '#f2cf85' : '#d6dbe2' }}>{LABELS[value]} ({counts[value]})</button>;
  return <section aria-label="Filtrowanie według profilu auta" className="mb-5 rounded-xl border border-white/15 bg-neutral-950 p-3">
    <h3 className="text-xs font-medium text-neutral-400">Materiały według profilu auta</h3>
    <div className="mt-2 flex items-center gap-2"><div id="vehicle-profile-launcher" className="min-w-0 flex-1" />{active && <button type="button" aria-label="Filtry zaawansowane" aria-expanded={expanded} aria-controls={controls} onClick={() => setExpanded(value => !value)} className="min-h-11 shrink-0 rounded-lg border border-white/20 px-3 text-sm text-neutral-200">Filtry</button>}</div>
    {!active ? <p className="mt-2 text-xs text-neutral-400">Obecnie nie ograniczamy list według konfiguracji. Profil jest opcjonalny.</p> : <>
      <div className="mt-3 grid grid-cols-2 gap-2">{button('relevant')}{button('all')}</div>
      {mode === 'relevant' ? <p className="mt-2 text-xs leading-relaxed text-neutral-400">Pokazujemy materiały zgodne z profilem lub opisane jako ogólne. Materiały z nieustalonym zakresem znajdują się w „Nieustalone”.</p> : <p className="mt-2 text-xs text-neutral-400">Aktywny filtr: {LABELS[mode]}. Licznik dotyczy tej sekcji przed wyszukiwaniem.</p>}
      <div id={controls} hidden={!expanded} role="group" aria-label="Zaawansowane zakresy dopasowania" className="mt-3 border-t border-white/10 pt-3">
        <p className="mb-3 text-xs text-neutral-400">{[profile?.brand, profile?.model, profile?.year, profile?.engine, profile?.drive, profile?.transmission].filter(Boolean).join(' · ')}</p>
        <div className="grid grid-cols-2 gap-2">{(['within_scope','general','unknown','outside_scope'] as Mode[]).map(button)}</div>
        <p className="mt-3 text-xs leading-relaxed text-neutral-400">„Dla mojego auta” pokazuje wyłącznie zgodność z zakresem lub materiały ogólne. Brak metadanych to „Nieustalone”, nie potwierdzenie zgodności. Nie wyznaczamy kodu silnika ani skrzyni z samej pojemności.</p>
        <p className="mt-2 text-xs leading-relaxed text-neutral-400">Zgodność z zakresem nie potwierdza technicznej poprawności instrukcji. Statyczne części i specyfikacje nie są jeszcze filtrowane. Liczniki są obliczane przed wyszukiwaniem i dodatkowymi filtrami sekcji.</p>
      </div>
      {mode !== 'all' && counts[mode] === 0 && <div role="status" className="mt-3 text-sm text-neutral-300"><p>Brak materiałów w wybranym zakresie. Nie oznacza to pustej bazy.</p><div className="mt-2 flex flex-wrap gap-3"><button type="button" className="underline" onClick={() => onModeChange('general')}>Pokaż ogólne</button><button type="button" className="underline" onClick={() => onModeChange('unknown')}>Pokaż nieustalone</button><button type="button" className="underline" onClick={() => onModeChange('all')}>Wyczyść filtr profilu</button></div></div>}
    </>}
  </section>;
}
