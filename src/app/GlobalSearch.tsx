'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { VehicleMatchBadge } from './VehicleMaterialFilter';
import type { Applicability } from '../lib/vehicle-compatibility';
type Entry = { Nazwa: string; Typ: string; Model: string; Opis?: string; Objawy?: string; Rozwiązanie?: string; Lata?: string; id?: string; applicability?: Applicability };
const normalize = (text: string) => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/g, 'l').replace(/\b(skrzynia automatyczna|automatyczna skrzynia|automat)\b/g, 'automat').replace(/\s+/g, ' ').trim();
export default function GlobalSearch({ items, onClose }: { items: Entry[]; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Entry | null>(null);
  useEffect(() => { const el = dialog.current; el?.showModal(); return () => { el?.close(); }; }, []);
  const results = useMemo(() => {
    const normalized = normalize(query);
    if (normalized.length < 2) return [];
    const tokens = normalized.split(/[^a-z0-9]+/).filter(token => token.length > 1 && !['na', 'do', 'sie'].includes(token));
    if (!tokens.length) return [];
    return items.map((item, index) => {
      const title = normalize(item.Nazwa);
      const text = normalize([item.Nazwa, item.Typ, item.Model, item.Lata, item.Opis, item.Objawy, item.Rozwiązanie].filter(Boolean).join(' '));
      const score = tokens.every(token => text.includes(token)) ? tokens.reduce((sum, token) => sum + (title.includes(token) ? 10 : 1), 0) + (title === normalized ? 100 : 0) : 0;
      return { item, index, score };
    }).filter(result => result.score > 0).sort((a, b) => b.score - a.score || a.index - b.index);
  }, [items, query]);
  return <dialog ref={dialog} onClose={onClose} aria-labelledby="global-search-title" className="m-auto w-[90vw] max-w-3xl max-h-[85dvh] overflow-y-auto rounded-xl border border-amber-400 bg-neutral-950 p-5 text-white backdrop:bg-black/80">
    <div className="flex justify-between gap-4"><h2 id="global-search-title" className="text-xl text-amber-400">Szukaj w bazie wiedzy</h2><button type="button" onClick={() => dialog.current?.close()} aria-label="Zamknij wyszukiwarkę">×</button></div>
    {selected ? <article className="mt-4 space-y-4">
      <button type="button" className="text-amber-400 underline" onClick={() => setSelected(null)}>Wróć do wyników</button>
      <p className="text-sm text-neutral-400">{selected.Typ} · {selected.Model} {selected.Lata}</p>
      <h3 className="text-xl">{selected.Nazwa}</h3><VehicleMatchBadge item={selected} />
      {selected.Opis && <section><h4>Opis</h4><p className="whitespace-pre-line text-neutral-300">{selected.Opis}</p></section>}
      {selected.Objawy && <section><h4>Objawy</h4><p className="whitespace-pre-line text-neutral-300">{selected.Objawy}</p></section>}
      {selected.Rozwiązanie && <section><h4>Rozwiązanie</h4><p className="whitespace-pre-line text-neutral-300">{selected.Rozwiązanie}</p></section>}
      {!selected.Opis && !selected.Objawy && !selected.Rozwiązanie && <p>Wpis nie zawiera dodatkowej treści.</p>}
    </article> : <>
      <label htmlFor="global-search-query" className="mt-4 block text-sm">Szukaj w bazie</label>
      <input id="global-search-query" autoFocus type="search" maxLength={120} value={query} onChange={event => setQuery(event.target.value)} placeholder="Kod OBD, objaw, nazwa lub numer części…" className="mt-2 w-full rounded border border-white/20 bg-neutral-900 p-3" />
      <p className="mt-2 text-xs text-neutral-400">Przeszukujemy załadowane wpisy Notion: tytuły, opisy, objawy i rozwiązania. Statyczne tabele części i specyfikacji nie są jeszcze indeksowane. Wyniki nie są ukrywane przez filtr profilu.</p>
      {!items.length ? <p role="status" className="mt-4">Brak załadowanych treści. Nie można jeszcze ocenić wyników wyszukiwania.</p> : normalize(query).length < 2 ? <p className="mt-4">Wpisz co najmniej dwa znaki.</p> : <>
        <p role="status" className="my-3">Znaleziono: {results.length}{results.length > 50 ? ' — pokazujemy pierwsze 50; doprecyzuj wyszukiwanie.' : ''}</p>
        {!results.length && <p>Brak pasujących wpisów w załadowanej bazie. Spróbuj krótszej frazy lub kodu.</p>}
        <ul className="space-y-3">{results.slice(0, 50).map(({ item, index }) => <li key={item.id || index} className="rounded border border-white/10 p-3">
          <p className="text-xs text-neutral-400">{item.Typ} · {item.Model} {item.Lata}</p>
          <button type="button" className="mt-1 text-left font-semibold text-amber-400 underline" onClick={() => setSelected(item)}>{item.Nazwa}</button>
          <p className="mt-1 text-sm text-neutral-300">{(item.Opis || item.Objawy || item.Rozwiązanie || '').slice(0, 200)}</p>
          <VehicleMatchBadge item={item} />
        </li>)}</ul>
      </>}
    </>}
  </dialog>;
}
