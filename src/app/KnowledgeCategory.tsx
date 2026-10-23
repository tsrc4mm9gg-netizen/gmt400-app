'use client';
import { useEffect, useMemo, useState } from 'react';
import { useVehicleMaterialFilter, VehicleMatchBadge } from './VehicleMaterialFilter';
import RelatedMaterials from './RelatedMaterials';
import { getRelatedMaterials } from '../lib/related-materials';
import type { Applicability, MatchResult } from '../lib/vehicle-compatibility';
type Entry = { id?: string; Nazwa: string; Typ: string; Model: string; Lata?: string; Opis?: string; Objawy?: string; Rozwiązanie?: string; applicability?: Applicability };
const LINKS = [['modele', 'Modele'], ['usterki', 'Usterki'], ['kody-obd', 'Kody OBD'], ['poradniki', 'Poradniki'], ['schematy', 'Schematy']];
const normalize = (text: string) => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/g, 'l');
export default function KnowledgeCategory({ section }: { section: string }) {
  const [items, setItems] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [query, setQuery] = useState('');
  const targetType = section === 'modele' ? 'Model' : section === 'usterki' ? 'Usterka' : section === 'kody-obd' ? 'Kod błędu' : 'Porada';
  const { visibleItems, panel } = useVehicleMaterialFilter(items, section === 'modele' ? ['Model'] : [targetType]);
  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 25000);
    setLoading(true); setError('');
    fetch('/api/notion', { signal: controller.signal }).then(async response => {
      if (!response.ok) throw new Error('Pobranie bazy nie powiodło się.');
      const data = await response.json();
      if (!Array.isArray(data.results) || data.error || data.complete === false) throw new Error('Nieprawidłowa odpowiedź bazy.');
      const valid = data.results.filter((item: any) => typeof item?.Nazwa === 'string' && typeof item?.Typ === 'string' && typeof item?.Model === 'string');
      if (valid.length !== data.results.length) throw new Error('Część wpisów ma nieprawidłowy format. Nie pokazujemy niepełnej listy.');
      if (active) setItems(valid);
    }).catch(() => { if (active) { setItems([]); setError('Nie udało się pobrać treści. To nie oznacza braku materiałów w bazie.'); } })
      .finally(() => { clearTimeout(timer); if (active) setLoading(false); });
    return () => { active = false; clearTimeout(timer); controller.abort(); };
  }, [attempt]);
  const belongs = (item: Entry) => {
    if (section === 'modele') return item.Typ === 'Model';
    if (section === 'usterki') return item.Typ === 'Usterka';
    if (section === 'kody-obd') return item.Typ === 'Kod błędu';
    if (section === 'poradniki') return item.Typ === 'Porada';
    return item.Typ === 'Porada' && ['schemat', 'masa', 'punkt'].some(term => normalize(item.Nazwa).includes(term));
  };
  const categoryTotal = items.filter(belongs).length;
  const matchingCategory = useMemo(() => items.filter(belongs), [items, section]);
  const { visibleItems: profileVisible, panel: profilePanel } = useVehicleMaterialFilter(matchingCategory, section === 'modele' ? ['Model'] : [targetType]);
  const results = useMemo(() => profileVisible.filter(item => normalize([item.Nazwa, item.Opis, item.Objawy, item.Rozwiązanie, item.Model, item.Lata].filter(Boolean).join(' ')).includes(normalize(query.trim()))), [profileVisible, query]);
  const matches = useMemo(() => new Map<string, MatchResult>(items.filter(item => item.id && item.applicability).map(item => [item.id as string, { status: 'unknown', reasons: [] } as MatchResult])), [items]);
  const related = useMemo(() => results.length ? getRelatedMaterials(results[0], items, matches) : [], [results, items, matches]);
  useEffect(() => { setQuery(''); }, [section]);
  return <div className="mt-6 space-y-5">
    <nav aria-label="Kategorie bazy wiedzy" className="flex flex-wrap gap-3">{LINKS.map(([path, title]) => <a key={path} href={'/' + path} aria-current={section === path ? 'page' : undefined} className={'inline-flex min-h-11 items-center rounded-sm px-2 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-500 ' + (section === path ? 'font-semibold text-red-400' : 'text-neutral-300 hover:text-neutral-100')}>{title}</a>)}</nav>
    <p className="text-xs text-neutral-400">Listy pobieramy w przeglądarce z kompletnej bazy. Osobne strony wpisów pokazują pola i zawartość materiału Notion.</p>
    {loading ? <p role="status">Ładowanie materiałów…</p> : error ? <div role="alert"><p>{error}</p><button type="button" onClick={() => setAttempt(n => n + 1)} className="mt-3 rounded bg-red-600 px-4 py-2 text-white">Ponów pobieranie</button></div> : <>
      {profilePanel}
      <label htmlFor="category-query" className="block">Szukaj w tej kategorii</label>
      <input id="category-query" type="search" maxLength={120} value={query} onChange={event => setQuery(event.target.value)} className="w-full rounded border border-white/20 bg-neutral-900 p-3" />
      <p role="status">Widoczne: {results.length}. Materiały tej kategorii przed filtrowaniem: {categoryTotal}.</p>
      {!categoryTotal ? <p>W pobranej bazie nie ma wpisów tej kategorii.</p> : !results.length ? <div><p>Brak wyników przy obecnych ustawieniach. Sprawdź filtr profilu albo wyszukiwaną frazę.</p><button type="button" className="mt-2 underline" onClick={() => setQuery('')}>Wyczyść frazę wyszukiwania</button></div> : <ul className="space-y-4">{results.map((item, index) => <li key={item.id || index} className="rounded-lg border border-white/10 bg-neutral-900/40 p-4 sm:p-5">
        <p className="text-xs text-neutral-400">{item.Typ} · {item.Model} {item.Lata}</p>
        <h2 className="mt-1 text-xl font-semibold text-neutral-100">{item.id ? <a className="inline-flex min-h-11 items-center rounded-sm underline decoration-neutral-500 underline-offset-4 hover:text-red-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-500" href={'/baza/' + encodeURIComponent(item.id)}>{item.Nazwa}</a> : item.Nazwa}</h2>
        <VehicleMatchBadge item={item} />
        <p className="mt-2 text-sm text-neutral-300">{(item.Opis || item.Objawy || item.Rozwiązanie || '').slice(0, 280)}</p>
        {!item.id && <p className="text-xs text-neutral-500">Brak identyfikatora potrzebnego do stałego odnośnika.</p>}
      </li>)}</ul>}
      <RelatedMaterials items={related} />
    </>}
  </div>;
}
