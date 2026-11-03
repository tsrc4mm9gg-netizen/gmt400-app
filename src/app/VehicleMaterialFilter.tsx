'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useVehicleProfile } from './VehicleProfileProvider';
import CompactVehicleFilterPanel from './CompactVehicleFilterPanel';
import { matchVehicle, type Applicability } from '../lib/vehicle-compatibility';
import { fitsProfileExplicitly } from '../lib/profile-fit';
const EMPTY: Applicability = { brand: [], model: [], years: [], engine: [], drive: [], transmission: [] };
const LABELS = { relevant: 'Dla mojego auta', all: 'Wszystkie', within_scope: 'Zgodne z zakresem', general: 'Ogólne', unknown: 'Nieustalone', outside_scope: 'Poza zakresem' };
type Mode = keyof typeof LABELS;
type Material = { Typ?: string; applicability?: Applicability };
const SUPPORTED = new Set(['Usterka', 'Kod błędu', 'Porada', 'Model']);
export function VehicleMatchBadge({ item }: { item: Material }) {
  const { profile, ready } = useVehicleProfile();
  if (!ready || !profile) return null;
  const match = matchVehicle(profile, item.applicability || EMPTY);
  const fits = fitsProfileExplicitly(profile, item.applicability);
  // Wpis wprost zgodny z autem: sama plakietka (bez „Nieustalone” z powodu pustej marki w metadanych).
  if (fits) return <span data-testid="profile-fit-badge" className="my-1 inline-flex items-center gap-1 rounded-full border border-silver-300/50 bg-neutral-800 px-2 py-0.5 text-xs font-semibold text-silver-100"><span aria-hidden="true">✓</span>pasuje do Twojego auta</span>;
  return <details className="my-2 text-xs text-neutral-400"><summary className="cursor-pointer text-silver-400">{LABELS[match.status]}</summary><ul className="mt-1 list-disc pl-4">{match.reasons.map(reason => <li key={reason}>{reason}</li>)}</ul></details>;
}
export function useVehicleMaterialFilter<T extends Material>(items: T[], scopeTypes?: string[]) {
  const { profile, ready } = useVehicleProfile();
  const [mode, setMode] = useState<Mode>('relevant');
  const scopeKey = scopeTypes?.join('|') || '';
  const active = ready && profile !== null;
  useEffect(() => { setMode('relevant'); }, [profile, scopeKey]);
  const evaluated = useMemo(() => {
    const scope = scopeKey ? new Set(scopeKey.split('|')) : null;
    return items.filter(item => SUPPORTED.has(item.Typ || '') && (!scope || scope.has(item.Typ || ''))).map(item => ({ item, match: profile ? matchVehicle(profile, item.applicability || EMPTY) : null }));
  }, [items, profile, scopeKey]);
  const counts = useMemo(() => {
    const output: Record<Mode, number> = { relevant: 0, all: evaluated.length, within_scope: 0, general: 0, unknown: 0, outside_scope: 0 };
    for (const row of evaluated) if (row.match) output[row.match.status]++;
    // relevant = confirmed + general + unknown (so content does not disappear)
    output.relevant = output.within_scope + output.general + output.unknown;
    return output;
  }, [evaluated]);
  const visibleItems = useMemo(() => {
    if (!active || mode === 'all') return items;
    const scoped = new Set(evaluated.map(row => row.item));
    const allowed = new Set(evaluated.filter(row => 
      mode === 'relevant' 
        ? row.match?.status === 'within_scope' || row.match?.status === 'general' || row.match?.status === 'unknown'
        : row.match?.status === mode
    ).map(row => row.item));
    return items.filter(item => !scoped.has(item) || allowed.has(item));
  }, [items, active, mode, evaluated]);
  // Z zapisanym autem: wpisy wprost zgodne (model/silnik/napęd/skrzynia) na górę; kolejność reszty bez zmian, nic dodatkowo nie znika.
  const fitting = useMemo(() => new Set(active && profile ? evaluated.filter(row => fitsProfileExplicitly(profile, row.item.applicability)).map(row => row.item) : []), [active, profile, evaluated]);
  const sortedItems = useMemo(() => fitting.size ? [...visibleItems].sort((a, b) => Number(fitting.has(b)) - Number(fitting.has(a))) : visibleItems, [visibleItems, fitting]);
  const panel = <CompactVehicleFilterPanel profile={profile} active={active} scoped={Boolean(scopeKey)} mode={mode} counts={counts} fitting={fitting.size} onModeChange={setMode} />;
  const resetMode = useCallback(() => setMode('relevant'), []);
  const showAllMode = useCallback(() => setMode('all'), []);
  /** profileNarrowing: filtr profilu auta faktycznie zawęża listę (profil zapisany i tryb inny niż „Wszystkie”). */
  return { visibleItems: sortedItems, panel, profileNarrowing: active && mode !== 'all', profileModeChanged: active && mode !== 'relevant', resetMode, showAllMode };
}
