'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { buildKnowledgeIndex, getKnowledgeEntries, searchKnowledge, type KnowledgeEntry } from '../lib/knowledge-index';
import { matchVehicle, type Applicability } from '../lib/vehicle-compatibility';
import { useVehicleProfile } from './VehicleProfileProvider';
import { useSearchSession } from '../lib/search-session';
import { VehicleMatchBadge } from './VehicleMaterialFilter';
import SearchExcerpt from './SearchExcerpt';

type Entry = KnowledgeEntry;
const normalize = (text: string) => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/g, 'l').replace(/\s+/g, ' ').trim();
const focusClass = 'min-h-11 rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500';

export default function GlobalSearch({ items, onClose }: { items: Entry[]; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const { query, updateQuery, ready, storageAvailable } = useSearchSession();
  const { profile, ready: profileReady } = useVehicleProfile();
  const [vehicleOnly, setVehicleOnly] = useState(false);
  const [selected, setSelected] = useState<Entry | null>(null);
  const [limit, setLimit] = useState(50);
  const index = useMemo(() => buildKnowledgeIndex(getKnowledgeEntries(items)), [items]);
  useEffect(() => { const element = dialog.current; const previous = document.activeElement; element?.showModal(); return () => { element?.close(); if (previous instanceof HTMLElement) previous.focus(); }; }, []);
  useEffect(() => { if (ready && !selected) input.current?.focus(); }, [ready, selected]);
  useEffect(() => { setLimit(50); }, [query, vehicleOnly, profile]);
  const results = useMemo(() => {
    return searchKnowledge(index, query).filter(item => {
      if (vehicleOnly && profileReady && profile && item.applicability) {
        const selection = { ...profile, model: profile.platform || profile.model };
        if (matchVehicle(selection, item.applicability).status === 'outside_scope') return false;
      }
      return true;
    });
  }, [index, query, vehicleOnly, profileReady, profile]);
  const visible = results.slice(0, limit);
  const groups = [
    { title: 'Kody błędów', rows: visible.filter(row => normalize(row.Typ).includes('kod')) },
    { title: 'Usterki i objawy', rows: visible.filter(row => normalize(row.Typ).includes('usterk')) },
    { title: 'Porady i pozostałe materiały', rows: visible.filter(row => !/kod|usterk/.test(normalize(row.Typ))) }
  ];
  return <dialog ref={dialog} onClose={onClose} aria-labelledby="global-search-title" className="m-auto w-[90vw] max-w-3xl max-h-[85dvh] overflow-y-auto rounded-xl border border-red-600 bg-neutral-950 p-5 text-white backdrop:bg-black/80">
    <header className="flex items-start justify-between gap-4"><h2 id="global-search-title" className="text-xl text-red-400">Szukaj w bazie wiedzy</h2><button type="button" className={`${focusClass} min-w-11`} onClick={() => dialog.current?.close()} aria-label="Zamknij wyszukiwarkę">×</button></header>
    {selected ? <article className="mt-4 space-y-4">
      <button type="button" className={`${focusClass} text-red-400 underline`} onClick={() => setSelected(null)}>Wróć do wyników</button>
      <h3 className="text-xl">{selected.Nazwa}</h3><VehicleMatchBadge item={selected} />
      {selected.id && <a href={`/baza/${encodeURIComponent(selected.id)}`} className={`${focusClass} inline-flex items-center text-red-400 underline`}>Otwórz stronę materiału</a>}
      {selected.Opis && <section><h4>Opis</h4><p className="whitespace-pre-line text-neutral-300">{selected.Opis}</p></section>}
      {selected.Objawy && <section><h4>Objawy</h4><p className="whitespace-pre-line text-neutral-300">{selected.Objawy}</p></section>}
      {selected.Rozwiązanie && <section><h4>Rozwiązanie</h4><p className="whitespace-pre-line text-neutral-300">{selected.Rozwiązanie}</p></section>}
    </article> : <>
      <label htmlFor="global-search-query" className="mt-4 block">Kod, objaw lub nazwa materiału</label>
      <div className="mt-2 flex flex-wrap gap-2"><input ref={input} id="global-search-query" type="search" maxLength={120} disabled={!ready} autoComplete="off" spellCheck={false} enterKeyHint="search" value={query} onChange={event => updateQuery(event.target.value)} aria-describedby="global-search-scope" className={`${focusClass} min-w-0 flex-1 basis-48 border border-white/20 bg-neutral-900 p-3`} />{query && <button type="button" className={`${focusClass} border border-white/20 px-3 underline`} onClick={() => { updateQuery(''); input.current?.focus(); }}>Wyczyść frazę</button>}</div>
      <label className="mt-3 flex min-h-11 items-center gap-2"><input type="checkbox" checked={vehicleOnly} disabled={!profileReady || !profile} onChange={event => setVehicleOnly(event.target.checked)} className="size-5 accent-red-600" />Tylko moje auto</label>
      <p id="global-search-scope" className="mt-2 text-sm text-neutral-400">Przeszukujemy bazę kodów OBD oraz załadowane materiały Notion. Filtr ukrywa wyłącznie materiały jednoznacznie poza zakresem auta. Nieustalona zgodność pozostaje widoczna i nie oznacza potwierdzonego dopasowania.</p>
      <details className="mt-2 text-sm text-neutral-400"><summary className="cursor-pointer">Zakres wyszukiwania i pamięć</summary><p className="mt-2">Statyczne tabele części i specyfikacji nie są indeksowane. {storageAvailable === false ? 'Pamięć sesji jest niedostępna.' : 'Fraza jest zapamiętywana w tej zakładce na czas sesji; usuń ją przyciskiem Wyczyść frazę.'}</p></details>
      <p role="status" aria-live="polite" className="my-4">{!ready ? 'Przywracanie wyszukiwania…' : normalize(query).length < 2 ? 'Wpisz co najmniej dwa znaki.' : `Znaleziono: ${results.length}`}</p>
      {ready && normalize(query).length >= 2 && !results.length && <p className="rounded border border-white/20 p-4">Brak wyników. Spróbuj krótszej frazy{vehicleOnly ? ' lub wyłącz filtr auta' : ''}.</p>}
      {groups.map(({ title, rows }, index) => rows.length > 0 && <section key={title} aria-labelledby={`search-group-${index}`} className="mt-5"><h3 id={`search-group-${index}`} className="text-lg text-red-400">{title}</h3><ul className="mt-2 space-y-3">{rows.map((item, itemIndex) => <li key={item.href || item.id || itemIndex} className="rounded border border-white/10 p-3"><p className="text-xs text-neutral-400">{item.Typ}</p>{item.href ? <a href={item.href} className={`${focusClass} inline-flex items-center text-red-400 underline`}>{item.Nazwa}</a> : <button type="button" onClick={() => setSelected(item)} className={`${focusClass} text-left text-red-400 underline`}>{item.Nazwa}</button>}<SearchExcerpt item={item} query={query} />{item.href ? <p className="mt-2 text-xs text-neutral-400">{item.Typ === 'Poradnik' ? 'Poradnik — każda liczba ma źródło i datę; przepisy się zmieniają, sprawdź w urzędzie.' : 'Ogólne znaczenie kodu — zastosowanie i procedurę sprawdź dla konkretnego pojazdu.'}</p> : <VehicleMatchBadge item={item} />}</li>)}</ul></section>)}
      {results.length > limit && <button type="button" onClick={() => setLimit(value => value + 50)} className={`${focusClass} mt-4 w-full border border-red-600 p-3 text-red-400`}>Pokaż więcej wyników</button>}
    </>}
  </dialog>;
}
