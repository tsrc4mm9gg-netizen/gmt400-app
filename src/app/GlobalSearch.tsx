'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { VehicleMatchBadge } from './VehicleMaterialFilter';
import { useSearchSession } from '../lib/search-session';
import { useVehicleProfile } from './VehicleProfileProvider';
import SearchExcerpt from './SearchExcerpt';
import type { Applicability } from '../lib/vehicle-compatibility';

type Entry = {
  Nazwa: string;
  Typ: string;
  Model: string;
  Opis?: string;
  Objawy?: string;
  Rozwiązanie?: string;
  Lata?: string;
  id?: string;
  applicability?: Applicability;
};

type SearchResult = { item: Entry; index: number; score: number };
type ResultGroup = 'best' | 'issues' | 'codes' | 'guides' | 'other';

const PAGE_SIZE = 50;
const GROUP_LABELS: Record<ResultGroup, string> = {
  best: 'Najlepsze trafienia',
  issues: 'Usterki i objawy',
  codes: 'Kody błędów',
  guides: 'Porady i modele',
  other: 'Pozostałe materiały'
};
const GROUP_ORDER: ResultGroup[] = ['best', 'issues', 'codes', 'guides', 'other'];

const normalize = (text: string) => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/g, 'l').replace(/\b(skrzynia automatyczna|automatyczna skrzynia|automat)\b/g, 'automat').replace(/\s+/g, ' ').trim();
const obdCode = (value: string): string[] => value.match(/\bp[0-9]{4}\b/g) || [];

function groupFor(item: Entry, score: number): ResultGroup {
  const type = normalize(item.Typ || '');
  if (score >= 20) return 'best';
  if (type.includes('kod')) return 'codes';
  if (type.includes('usterk') || type.includes('objaw')) return 'issues';
  if (type.includes('porad') || type.includes('model')) return 'guides';
  return 'other';
}

export default function GlobalSearch({ items, onClose }: { items: Entry[]; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const { query, updateQuery, ready, storageAvailable } = useSearchSession();
  const { profile, ready: profileReady } = useVehicleProfile();
  const [selected, setSelected] = useState<Entry | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);
  const [vehicleOnly, setVehicleOnly] = useState<boolean>(false);

  useEffect(() => { const el = dialog.current; el?.showModal(); return () => { el?.close(); }; }, []);
  useEffect(() => { if (!selected && ready) input.current?.focus(); }, [selected, ready]);
  useEffect(() => { setVisibleCount(PAGE_SIZE); }, [query, items, vehicleOnly]);

  const clearQuery = () => { updateQuery(''); input.current?.focus(); };

  const results = useMemo<SearchResult[]>(() => {
    const normalized = normalize(query);
    if (normalized.length < 2) return [];
    const tokens = normalized.split(/[^a-z0-9]+/).filter(token => token.length > 1 && !['na', 'do', 'sie'].includes(token));
    if (!tokens.length) return [];
    const queryCodes = obdCode(normalized);
    const seen = new Set<string>();

    return items.map((item, index): SearchResult => {
      const title = normalize(item.Nazwa);
      const text = normalize([item.Nazwa, item.Typ, item.Model, item.Lata, item.Opis, item.Objawy, item.Rozwiązanie].filter(Boolean).join(' '));
      const itemCodes = obdCode(text);
      let score = 0;

      if (tokens.every(token => text.includes(token))) {
        score = tokens.reduce((sum, token) => sum + (title.includes(token) ? 10 : 1), 0);
        if (title === normalized) score += 100;
      }

      if (queryCodes.length) {
        const matchedCodes = queryCodes.filter(code => itemCodes.includes(code));
        if (matchedCodes.length) score += 40 + matchedCodes.length * 10;
      }

      return { item, index, score };
    }).filter(result => {
      if (result.score <= 0) return false;
      if (vehicleOnly && profileReady && profile) {
        const applicability = result.item.applicability;
        if (applicability) {
          const brandOk = !applicability.brand?.length || applicability.brand.some(value => normalize(value) === normalize(profile.brand));
          const modelOk = !applicability.model?.length || applicability.model.some(value => normalize(value) === normalize(profile.model));
          const driveOk = !applicability.drive?.length || applicability.drive.some(value => normalize(value) === normalize(profile.drive));
          if (!brandOk || !modelOk || !driveOk) return false;
        }
      }
      if (!result.item.id) return true;
      if (seen.has(result.item.id)) return false;
      seen.add(result.item.id);
      return true;
    }).sort((a, b) => b.score - a.score || a.index - b.index);
  }, [items, query, vehicleOnly, profile, profileReady]);

  const grouped = useMemo<Array<{ group: ResultGroup; results: SearchResult[] }>>(() => {
    const output = new Map<ResultGroup, SearchResult[]>();
    for (const result of results) {
      const group = groupFor(result.item, result.score);
      const current = output.get(group) || [];
      current.push(result);
      output.set(group, current);
    }
    return GROUP_ORDER.filter(group => output.has(group)).map(group => ({ group, results: output.get(group) || [] }));
  }, [results]);

  const visibleResults = useMemo<SearchResult[]>(() => results.slice(0, visibleCount), [results, visibleCount]);
  const hasMore = results.length > visibleResults.length;
  const suggestions = useMemo<string[]>(() => {
    if (normalize(query).length < 2) return [];
    return [...new Set(results.slice(0, 8).map(result => result.item.Nazwa))];
  }, [results, query]);

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
        <input ref={input} id="global-search-query" autoFocus disabled={!ready} type="search" maxLength={120} autoComplete="off" spellCheck={false} enterKeyHint="search" value={query} onChange={event => updateQuery(event.target.value)} aria-describedby="global-search-scope global-search-memory" placeholder="Kod OBD, objaw lub nazwa materiału…" className="min-h-11 min-w-0 w-full flex-1 basis-48 rounded border border-white/20 bg-neutral-900 p-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400" />
        {query.length > 0 && <button type="button" onClick={clearQuery} className="min-h-11 rounded border border-white/20 px-3 py-2 text-neutral-200 underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400">Wyczyść frazę</button>}
      </div>
      {suggestions.length > 0 && <ul aria-label="Podpowiedzi" className="mt-2 flex flex-wrap gap-2">{suggestions.map(suggestion => <li key={suggestion}><button type="button" onClick={() => updateQuery(suggestion)} className="min-h-9 rounded-full border border-white/20 px-3 py-1 text-sm text-neutral-200">{suggestion}</button></li>)}</ul>}
      <div className="mt-3 flex items-center gap-3">
        <label className="flex min-h-11 items-center gap-2 text-sm">
          <input type="checkbox" checked={vehicleOnly} disabled={!profile} onChange={event => setVehicleOnly(event.target.checked)} className="size-5 accent-amber-400" />
          Tylko moje auto
        </label>
        {!profile && <span className="text-xs text-neutral-400">Ustaw profil auta, aby użyć tego filtra.</span>}
      </div>
      <p id="global-search-scope" className="mt-2 text-xs text-neutral-400">Przeszukujemy załadowane wpisy Notion: tytuły, typy, modele, lata, opisy, objawy i rozwiązania. Kody OBD są wyróżniane w wynikach. Statyczne tabele części i specyfikacji nie są jeszcze indeksowane.</p>
      <p id="global-search-memory" className="mt-2 text-xs text-neutral-400">{storageAvailable === false ? 'Pamięć sesji jest niedostępna. Wyszukiwanie działa, ale zapamiętanie lub usunięcie zapisanej frazy może się nie udać.' : 'Fraza jest zapamiętywana w tej zakładce na czas sesji. Wyczyść ją przyciskiem „Wyczyść frazę”. Ten mechanizm nie wysyła frazy do Notion.'}</p>
      {!items.length ? <p role="status" aria-live="polite" className="mt-4">Brak załadowanych treści. Nie można jeszcze ocenić wyników wyszukiwania.</p> : !ready ? <p role="status" aria-live="polite" className="mt-4">Przywracanie wyszukiwania…</p> : normalize(query).length < 2 ? <p role="status" aria-live="polite" className="mt-4">Wpisz co najmniej dwa znaki.</p> : <>
        <p role="status" aria-live="polite" className="my-3">Znaleziono: {results.length}{hasMore ? ` — pokazujemy ${visibleResults.length} z ${results.length}.` : results.length > PAGE_SIZE ? ` — pokazujemy wszystkie ${results.length}.` : ''}</p>
        {!results.length && <div className="my-3 rounded border border-white/10 bg-neutral-900/40 p-3"><p className="break-words">Brak wyników dla „{query.trim()}”.</p><p className="mt-2 text-sm text-neutral-300">Spróbuj krótszej frazy lub kodu. {vehicleOnly ? 'Filtr „Tylko moje auto” może ograniczać wyniki — wyłącz go, aby zobaczyć wszystkie materiały.' : 'To wynik dla załadowanych wpisów Notion.'}</p></div>}
        <div className="space-y-5">{grouped.map(({ group, results: groupResults }) => {
          const visibleGroupResults = groupResults.filter(result => visibleResults.some(visible => visible.item === result.item && visible.index === result.index));
          if (!visibleGroupResults.length) return null;
          return <section key={group} aria-labelledby={`search-group-${group}`}>
            <h3 id={`search-group-${group}`} className="text-sm font-semibold uppercase tracking-wide text-neutral-400">{GROUP_LABELS[group]}</h3>
            <ul className="mt-2 space-y-3">{visibleGroupResults.map(({ item, index }) => <li key={item.id || index} className="rounded border border-white/10 p-3">
              <p className="text-xs text-neutral-400">{item.Typ} · {item.Model} {item.Lata}</p>
              <button type="button" className="mt-1 text-left font-semibold text-amber-400 underline" onClick={() => setSelected(item)}>{item.Nazwa}</button>
              <SearchExcerpt item={item} query={query} />
              <VehicleMatchBadge item={item} />
            </li>)}</ul>
          </section>;
        })}</div>
        {hasMore && <button type="button" className="mt-4 min-h-11 w-full rounded border border-amber-400 px-4 py-2 text-amber-400 underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400" onClick={() => setVisibleCount(count => count + PAGE_SIZE)}>Pokaż więcej wyników</button>}
      </>}
    </>}
  </dialog>;
}
