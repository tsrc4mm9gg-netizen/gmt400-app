'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { VehicleMatchBadge } from './VehicleMaterialFilter';
import { useSearchSession } from '../lib/search-session';
import SearchExcerpt from './SearchExcerpt';
import type { Applicability } from '../lib/vehicle-compatibility';
type Entry = { Nazwa: string; Typ: string; Model: string; Opis?: string; Objawy?: string; Rozwiązanie?: string; Lata?: string; id?: string; applicability?: Applicability };
const normalize = (text: string) => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/g, 'l').replace(/\b(skrzynia automatyczna|automatyczna skrzynia|automat)\b/g, 'automat').replace(/\s+/g, ' ').trim();
export default function GlobalSearch({ items, onClose }: { items: Entry[]; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const { query, updateQuery, ready, storageAvailable } = useSearchSession();
  const [selected, setSelected] = useState<Entry | null>(null);
  useEffect(() => { const el = dialog.current; el?.showModal(); return () => { el?.close(); }; }, []);
  useEffect(() => { if (!selected && ready) input.current?.focus(); }, [selected, ready]);
  const clearQuery = () => { updateQuery(''); input.current?.focus(); };
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
    <div className="flex justify-between gap-4"><h2 id="global-search-title" className="text-xl text-amber-400">Szukaj w bazie wiedzy</h2><button type="button" className="min-h-11 min-w-11 rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400" onClick={() => dialog.current?.close()} aria-label="Zamknij wyszukiwarkę">×</button></div>
    {selected ? <article className="mt-4 space-y-4">
      <button type="button" className="min-h-11 rounded text-amber-400 underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400" onClick={() => setSelected(null)}>Wróć do wyników</button>
      <p className="text-sm text-neutral-400">{selected.Typ} · {selected.Model} {selected.Lata}</p>
      <h3 className="text-xl">{selected.Nazwa}</h3><VehicleMatchBadge item={selected} />
      {selected.id && <a className="inline-block text-amber-400 underline" href={'/baza/' + encodeURIComponent(selected.id)}>Otwórz stronę materiału — stały link</a>}
      {selected.Opis && <section><h4>Opis</h4><p className="whitespace-pre-line text-neutral-300">{selected.Opis}</p></section>}
      {selected.Objawy && <section><h4>Objawy</h4><p className="whitespace-pre-line text-neutral-300">{selected.Objawy}</p></section>}
      {selected.Rozwiązanie && <section><h4>Rozwiązanie</h4><p className="whitespace-pre-line text-neutral-300">{selected.Rozwiązanie}</p></section>}
      {!selected.Opis && !selected.Objawy && !selected.Rozwiązanie && <p>Wpis nie zawiera dodatkowej treści.</p>}
    </article> : <>
      <label htmlFor="global-search-query" className="mt-4 block text-sm">Szukaj w bazie</label>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <input ref={input} id="global-search-query" autoFocus disabled={!ready} type="search" maxLength={120} value={query} onChange={event => updateQuery(event.target.value)} aria-describedby="global-search-scope global-search-memory" placeholder="Kod OBD, objaw lub nazwa materiału…" className="min-h-11 min-w-0 w-full flex-1 basis-48 rounded border border-white/20 bg-neutral-900 p-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400" />
        {query.length > 0 && <button type="button" onClick={clearQuery} className="min-h-11 rounded border border-white/20 px-3 py-2 text-neutral-200 underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400">Wyczyść frazę</button>}
      </div>
      <p id="global-search-scope" className="mt-2 text-xs text-neutral-400">Przeszukujemy załadowane wpisy Notion: tytuły, typy, modele, lata, opisy, objawy i rozwiązania. Statyczne tabele części i specyfikacji nie są jeszcze indeksowane. Wyniki nie są ukrywane przez filtr profilu.</p>
      <p id="global-search-memory" className="mt-2 text-xs text-neutral-400">{storageAvailable === false ? 'Pamięć sesji jest niedostępna. Wyszukiwanie działa, ale zapamiętanie lub usunięcie zapisanej frazy może się nie udać.' : 'Fraza jest zapamiętywana w tej zakładce na czas sesji. Wyczyść ją przyciskiem „Wyczyść frazę”. Ten mechanizm nie wysyła frazy do Notion.'}</p>
      {!items.length ? <p role="status" className="mt-4">Brak załadowanych treści. Nie można jeszcze ocenić wyników wyszukiwania.</p> : !ready ? <p role="status" className="mt-4">Przywracanie wyszukiwania…</p> : normalize(query).length < 2 ? <p role="status" className="mt-4">Wpisz co najmniej dwa znaki.</p> : <>
        <p role="status" className="my-3">Znaleziono: {results.length}{results.length > 50 ? ' — pokazujemy pierwsze 50; doprecyzuj wyszukiwanie.' : ''}</p>
        {!results.length && <div className="my-3 rounded border border-white/10 bg-neutral-900/40 p-3"><p className="break-words">Brak wyników dla „{query.trim()}”.</p><p className="mt-2 text-sm text-neutral-300">Spróbuj krótszej frazy lub kodu. To wynik tylko dla załadowanych wpisów Notion, nie całej zawartości strony. Profil auta nie ogranicza tej listy.</p></div>}
        <ul className="space-y-3">{results.slice(0, 50).map(({ item, index }) => <li key={item.id || index} className="rounded border border-white/10 p-3">
          <p className="text-xs text-neutral-400">{item.Typ} · {item.Model} {item.Lata}</p>
          <button type="button" className="mt-1 text-left font-semibold text-amber-400 underline" onClick={() => setSelected(item)}>{item.Nazwa}</button>
          <SearchExcerpt item={item} query={query} />
          <VehicleMatchBadge item={item} />
        </li>)}</ul>
      </>}
    </>}
  </dialog>;
}
