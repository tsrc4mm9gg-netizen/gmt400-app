'use client';
import { useEffect, useMemo, useState } from 'react';
import RelatedMaterials from './RelatedMaterials';
import { useVehicleProfile } from './VehicleProfileProvider';
import { getRelatedMaterials, type KnowledgeEntry } from '../lib/related-materials';
import { matchVehicle, type MatchResult } from '../lib/vehicle-compatibility';

type LoadState = { status: 'loading' | 'error' | 'ready'; items: KnowledgeEntry[] };
const EMPTY = { brand: [], model: [], years: [], engine: [], drive: [], transmission: [] };
function validEntry(value: unknown): value is KnowledgeEntry {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  if (typeof item.id !== 'string' || !/^(?:[a-f0-9]{32}|[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})$/i.test(item.id)) return false;
  if (!['Nazwa', 'Typ', 'Model'].every(key => typeof item[key] === 'string')) return false;
  if (!['Opis', 'Objawy', 'Rozwiązanie', 'Lata'].every(key => item[key] === undefined || typeof item[key] === 'string')) return false;
  if (item.applicability !== undefined) {
    if (!item.applicability || typeof item.applicability !== 'object') return false;
    const applicability = item.applicability as Record<string, unknown>;
    if (!Object.keys(EMPTY).every(key => Array.isArray(applicability[key]) && (applicability[key] as unknown[]).every(part => typeof part === 'string'))) return false;
  }
  return true;
}
export default function RelatedMaterialSuggestions({ current }: { current: KnowledgeEntry }) {
  const { profile, ready } = useVehicleProfile();
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<LoadState>({ status: 'loading', items: [] });
  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000);
    setState({ status: 'loading', items: [] });
    async function load() {
      try {
        const response = await fetch('/api/notion', { signal: controller.signal });
        if (!response.ok) throw new Error('Related materials unavailable');
        const body = await response.json();
        if (body.complete !== true || !Array.isArray(body.results) || !body.results.every(validEntry)) throw new Error('Incomplete or invalid material list');
        if (active) setState({ status: 'ready', items: body.results });
      } catch {
        if (active) setState({ status: 'error', items: [] });
      } finally { clearTimeout(timer); }
    }
    void load();
    return () => { active = false; clearTimeout(timer); controller.abort(); };
  }, [current.id, attempt]);
  const items = useMemo(() => {
    if (state.status !== 'ready' || !ready) return [];
    const matches = new Map<string, MatchResult>();
    if (profile) for (const item of state.items) if (item.id) matches.set(item.id, matchVehicle(profile, item.applicability || EMPTY));
    return getRelatedMaterials(current, state.items, matches);
  }, [current, state, profile, ready]);
  if (state.status === 'ready' && ready && items.length) return <RelatedMaterials items={items} />;
  return <section aria-label="Powiązane materiały" className="mt-6 rounded border border-white/15 p-4">
    <h2 className="text-lg text-red-400">Powiązane materiały</h2>
    {state.status === 'error' ? <>
      <p role="status" className="mt-3 text-neutral-300">Nie udało się pobrać propozycji. Treść instrukcji pozostaje dostępna.</p>
      <button type="button" onClick={() => { setState({ status: 'loading', items: [] }); setAttempt(value => value + 1); }} className="mt-3 min-h-11 rounded border border-white/30 px-4 py-2 text-red-400">Spróbuj ponownie</button>
    </> : <p role="status" className="mt-3 text-neutral-300">{state.status === 'loading' || !ready ? 'Ładowanie powiązanych materiałów…' : 'Nie znaleziono powiązanych materiałów według obecnych reguł. Nie oznacza to braku innych przydatnych informacji w bazie.'}</p>}
  </section>;
}
