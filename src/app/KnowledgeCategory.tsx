'use client';
import { useEffect, useMemo, useState } from 'react';
import { useVehicleMaterialFilter, VehicleMatchBadge } from './VehicleMaterialFilter';
import type { Applicability } from '../lib/vehicle-compatibility';
type Entry = { id?: string; Nazwa: string; Typ: string; Model: string; Lata?: string; Opis?: string; Objawy?: string; Rozwiązanie?: string; applicability?: Applicability };
const LINKS = [['modele', 'Modele'], ['usterki', 'Usterki'], ['kody-obd', 'Kody OBD'], ['poradniki', 'Poradniki'], ['schematy', 'Schematy']];
const normalize = (text: string) => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/g, 'l');
export default function KnowledgeCategory({ section }: { section: string }) {
  const [items, setItems] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [query, setQuery] = useState('');
  const { visibleItems, panel } = useVehicleMaterialFilter(items);
  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 25000);
    setLoading(true); setError('');
    fetch('/api/notion', { signal: controller.signal }).then(async response => {
      if (!response.ok) throw new Error('Pobranie bazy nie powiodło się.');
      const data = await response.json();
      if (!Array.isArray(data.results) || data.error) throw new Error('Nieprawidłowa odpowiedź bazy.');
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
  const results = useMemo(() => visibleItems.filter(belongs).filter(item => normalize([item.Nazwa, item.Opis, item.Objawy, item.Rozwiązanie, item.Model, item.Lata].filter(Boolean).join(' ')).includes(normalize(query.trim()))), [visibleItems, section, query]);
  return <div className="mt-6 space-y-5">
    <nav aria-label="Kategorie bazy wiedzy" className="flex flex-wrap gap-3">{LINKS.map(([path, title]) => <a key={path} href={'/' + path} aria-current={section === path ? 'page' : undefined} className={section === path ? 'text-amber-400 underline' : 'text-neutral-300 underline'}>{title}</a>)}</nav>
    <p className="text-xs text-neutral-400">Listy pobieramy w przeglądarce z obecnego API. Osobne strony wpisów renderują treść na serwerze.</p>
    {loading ? <p role="status">Ładowanie materiałów…</p> : error ? <div role="alert"><p>{error}</p><button type="button" onClick={() => setAttempt(n => n + 1)} className="mt-3 rounded bg-amber-400 px-4 py-2 text-black">Ponów pobieranie</button></div> : <>
      {section !== 'modele' && panel}
      <label htmlFor="category-query" className="block">Szukaj w tej kategorii</label>
      <input id="category-query" type="search" maxLength={120} value={query} onChange={event => setQuery(event.target.value)} className="w-full rounded border border-white/20 bg-neutral-900 p-3" />
      <p role="status">Widoczne: {results.length}. Materiały tej kategorii przed filtrowaniem: {categoryTotal}.</p>
      {!categoryTotal ? <p>W pobranej bazie nie ma wpisów tej kategorii.</p> : !results.length ? <div><p>Brak wyników przy obecnych ustawieniach. Sprawdź również wybrany filtr profilu.</p><button type="button" className="mt-2 underline" onClick={() => setQuery('')}>Wyczyść frazę wyszukiwania</button></div> : <ul className="space-y-4">{results.map((item, index) => <li key={item.id || index} className="rounded border border-white/15 p-4">
        <p className="text-xs text-neutral-400">{item.Typ} · {item.Model} {item.Lata}</p>
        <h2 className="mt-1 text-xl text-amber-400">{item.id ? <a className="underline" href={'/baza/' + encodeURIComponent(item.id)}>{item.Nazwa}</a> : item.Nazwa}</h2>
        <VehicleMatchBadge item={item} />
        <p className="mt-2 text-sm text-neutral-300">{(item.Opis || item.Objawy || item.Rozwiązanie || '').slice(0, 280)}</p>
        {!item.id && <p className="text-xs text-neutral-500">Brak identyfikatora potrzebnego do stałego odnośnika.</p>}
      </li>)}</ul>}
    </>}
  </div>;
}
