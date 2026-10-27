'use client';
import { useEffect, useMemo, useState } from 'react';
import { useVehicleProfile } from './VehicleProfileProvider';
import CompactVehicleFilterPanel from './CompactVehicleFilterPanel';
import { matchVehicle, type Applicability } from '../lib/vehicle-compatibility';
const EMPTY: Applicability = { brand: [], model: [], years: [], engine: [], drive: [], transmission: [] };
const LABELS = { relevant: 'Dla mojego auta', all: 'Wszystkie', within_scope: 'Zgodne z zakresem', general: 'Ogólne', unknown: 'Nieustalone', outside_scope: 'Poza zakresem' };
type Mode = keyof typeof LABELS;
type Material = { Typ?: string; applicability?: Applicability };
const SUPPORTED = new Set(['Usterka', 'Kod błędu', 'Porada', 'Model']);
export function VehicleMatchBadge({ item }: { item: Material }) {
  const { profile, ready } = useVehicleProfile();
  if (!ready || !profile) return null;
  const match = matchVehicle(profile, item.applicability || EMPTY);
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
  const panel = <CompactVehicleFilterPanel profile={profile} active={active} mode={mode} counts={counts} onModeChange={setMode} />;
  return { visibleItems, panel };
}
