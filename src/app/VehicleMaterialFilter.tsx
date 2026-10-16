'use client';
import { useMemo, useState } from 'react';
import { useVehicleProfile } from './VehicleProfileProvider';
import { matchVehicle, type Applicability, type MatchResult } from '../lib/vehicle-compatibility';

const EMPTY: Applicability = { brand: [], model: [], years: [], engine: [], drive: [], transmission: [] };
const LABELS = { all: 'Wszystkie', within_scope: 'Zgodne z zakresem', general: 'Ogólne', unknown: 'Nieustalone', outside_scope: 'Poza zakresem' };
type Mode = keyof typeof LABELS;
type Material = { Typ?: string; applicability?: Applicability };
const SUPPORTED = new Set(['Usterka', 'Kod błędu', 'Porada']);
export function VehicleMatchBadge({ item }: { item: Material }) {
  const { profile, ready } = useVehicleProfile();
  if (!ready || !profile) return null;
  const match = matchVehicle(profile, item.applicability || EMPTY);
  return <details className="my-2 text-xs text-neutral-400"><summary className="cursor-pointer text-amber-400">{LABELS[match.status]}</summary><ul className="mt-1 list-disc pl-4">{match.reasons.map(reason => <li key={reason}>{reason}</li>)}</ul></details>;
}
export function useVehicleMaterialFilter<T extends Material>(items: T[]) {
  const { profile, ready } = useVehicleProfile();
  const [mode, setMode] = useState<Mode>('all');
  const active = ready && profile !== null;
  const evaluated = useMemo(() => items.filter(item => SUPPORTED.has(item.Typ || '')).map(item => ({ item, match: profile ? matchVehicle(profile, item.applicability || EMPTY) : null })), [items, profile]);
  const counts = useMemo(() => {
    const output: Record<Mode, number> = { all: evaluated.length, within_scope: 0, general: 0, unknown: 0, outside_scope: 0 };
    for (const row of evaluated) if (row.match) output[row.match.status]++;
    return output;
  }, [evaluated]);
  const visibleItems = useMemo(() => {
    if (!active || mode === 'all') return items;
    const allowed = new Set(evaluated.filter(row => row.match?.status === mode).map(row => row.item));
    return items.filter(item => !SUPPORTED.has(item.Typ || '') || allowed.has(item));
  }, [items, active, mode, evaluated]);
  const panel = <section className="mb-6 rounded-lg border border-amber-400/30 bg-neutral-950 p-4" aria-label="Filtrowanie według profilu auta">
    <h3 className="font-semibold text-amber-400">Materiały według profilu auta</h3>
    {!active ? <p className="mt-2 text-sm text-neutral-400">Ustaw profil auta przyciskiem w lewym dolnym rogu. Obecnie nie ograniczamy list według konfiguracji.</p> : <>
      <p className="mt-2 text-sm">{[profile?.brand, profile?.model, profile?.year, profile?.engine, profile?.drive, profile?.transmission].filter(Boolean).join(' · ')}</p>
      <div className="mt-3 flex flex-wrap gap-2">{(Object.keys(LABELS) as Mode[]).map(value => <button key={value} type="button" aria-pressed={mode === value} onClick={() => setMode(value)} className={`rounded px-3 py-2 text-sm ${mode === value ? 'bg-amber-400 text-black' : 'bg-neutral-800 text-white'}`}>{LABELS[value]} ({counts[value]})</button>)}</div>
      <p className="mt-2 text-xs text-neutral-400">Liczniki obejmują wszystkie usterki, kody OBD i porady z pobranej bazy, przed wyszukiwaniem i pozostałymi filtrami sekcji. Schematy korzystają z tej samej listy porad. Statyczne części i specyfikacje nie są objęte tym filtrem.</p>
      <p className="mt-2 text-xs text-neutral-400">Zgodność z metadanymi nie oznacza weryfikacji technicznej. Nieuzupełnione dane mają status „Nieustalone”.</p>
      {mode !== 'all' && counts[mode] === 0 && <div role="status" className="mt-3 space-y-2"><p>Brak materiałów w wybranym zakresie. Możesz pokazać materiały ogólne lub o nieustalonym dopasowaniu.</p><div className="flex flex-wrap gap-3"><button type="button" className="underline" onClick={() => setMode('general')}>Pokaż ogólne</button><button type="button" className="underline" onClick={() => setMode('unknown')}>Pokaż nieustalone</button><button type="button" className="underline" onClick={() => setMode('all')}>Wyczyść filtr profilu</button></div></div>}
    </>}
  </section>;
  return { visibleItems, panel };
}
