'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { buildKnowledgeIndex, getKnowledgeEntries, searchKnowledge, type KnowledgeEntry } from '../../lib/knowledge-index';
import { prepareQuery } from '../../lib/search-aliases.mjs';
import RandomCodeLink from './random-code-link';
import Breadcrumbs from '../ui/Breadcrumbs';
import ModelThumb from '../ModelThumb';
import { bodyForEntry } from '../../lib/model-images';

type Entry = KnowledgeEntry;
const PAGE_SIZE = 50;
const guideExamples = ['tahoe lpg', 'akcyza auto z usa', 'czerwone kierunkowskazy usa', 'żółte tablice', 'suburban spalanie'];
const queryExamples = ['P0300', '4L60E', 'EGR', 'MAF', 'EVAP', 'O2 sensor', 'fuel trim', 'idle air control'];

function isEntry(value: unknown): value is Entry {
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  return typeof record.id === 'string' && typeof record.Nazwa === 'string' && ['Opis', 'Objawy', 'Rozwiązanie', 'Model', 'Typ'].every(key => record[key] === undefined || typeof record[key] === 'string');
}

export default function SearchPage({ query }: { query: string }) {
  const [items, setItems] = useState<Entry[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => { if (active) { setStatus('error'); controller.abort(); } }, 15000);
    void fetch('/api/notion', { signal: controller.signal }).then(async response => {
      if (!response.ok) throw new Error('HTTP');
      const data: unknown = await response.json();
      if (!data || typeof data !== 'object' || !('results' in data) || !Array.isArray(data.results)) throw new Error('Invalid response');
      if (active) { setItems(data.results.filter(isEntry)); setStatus('ready'); }
    }).catch(() => { if (active) setStatus('error'); }).finally(() => window.clearTimeout(timeout));
    return () => { active = false; window.clearTimeout(timeout); controller.abort(); };
  }, []);

  const index = useMemo(() => buildKnowledgeIndex(getKnowledgeEntries(items)), [items]);
  const results = useMemo(() => searchKnowledge(index, query), [index, query]);
  const gapNote = useMemo(() => prepareQuery(query).note, [query]);
  const normalizedQuery = query.trim();
  const [shown, setShown] = useState({ query, count: PAGE_SIZE });
  const visibleCount = shown.query === query ? shown.count : PAGE_SIZE;
  const visibleResults = results.slice(0, visibleCount);
  const hasMore = results.length > visibleResults.length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 text-white">
      <Breadcrumbs items={[{ label: 'Szukaj' }]} />

      <h1 className="text-3xl font-bold">Szukaj w bazie wiedzy</h1>

      <form action="/szukaj" method="get" role="search" className="my-6">
        <label htmlFor="page-search" className="mb-2 block text-sm font-medium text-neutral-300">
          Kod, objaw lub nazwa materiału
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            key={query}
            id="page-search"
            name="q"
            type="search"
            inputMode="search"
            enterKeyHint="search"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            maxLength={120}
            defaultValue={query}
            placeholder="Szukaj kodu lub systemu, np. P0300"
            className="min-h-14 flex-1 rounded-xl border-2 border-red-600 bg-neutral-900 px-4 py-3 text-lg text-white placeholder:text-neutral-500 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-600/40"
          />
          <button
            type="submit"
            className="min-h-14 rounded-xl bg-red-600 px-8 text-lg font-semibold text-white shadow-lg shadow-red-600/30 transition hover:bg-red-500"
          >
            Szukaj
          </button>
        </div>
        <div className="mt-3">
          <RandomCodeLink />
        </div>
      </form>

      <section aria-labelledby="search-examples-title" className="mb-6 rounded-xl border border-white/10 bg-neutral-900 p-4">
        <h2 id="search-examples-title" className="text-lg font-semibold text-red-400">Popularne hasła</h2>
        <p className="mt-1 text-sm text-neutral-400">Wybierz hasło, aby zawęzić wyniki.</p>
        <ul className="mt-3 flex flex-wrap gap-2" data-testid="search-examples">
          {[...guideExamples, ...queryExamples].map(example => (
            <li key={example}>
              <Link
                href={`/szukaj?q=${encodeURIComponent(example)}`}
                className="inline-flex min-h-11 items-center rounded-lg border border-white/15 bg-neutral-950 px-4 py-2 text-red-300 transition hover:border-red-600 hover:text-white"
              >
                {example}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <p className="mb-4 text-sm text-neutral-400">
        Baza OBD i materiały Notion. Ten widok pokazuje wszystkie auta, bez filtra profilu. Rozumiemy też potoczne frazy i nazwy modeli („tahoe lpg”, „auto z usa”); dla pozostałych fraz wielowyrazowych wymagane są wszystkie słowa. Powiązanie z hasłem nie potwierdza zastosowania kodu w konkretnym aucie.
      </p>

      {normalizedQuery && (
        <p role="status" aria-live="polite" data-testid="search-status" className="mb-4">
          Wyświetlanie {results.length} wyników dla: <strong className="text-neutral-200">{normalizedQuery}</strong>.{' '}
          {status === 'loading' ? 'Trwa pobieranie dodatkowych materiałów Notion.' : status === 'error' ? 'Nie udało się pobrać materiałów Notion w wymaganym czasie lub wystąpił błąd. Wyniki obejmują tylko bazę OBD.' : 'Materiały Notion załadowane.'}
          {results.length > PAGE_SIZE && (hasMore ? ` Pokazujemy ${visibleResults.length} z ${results.length}.` : ` Pokazujemy wszystkie ${results.length}.`)}
        </p>
      )}

      {normalizedQuery && gapNote && (
        <p data-testid="search-gap-note" className="mb-4 rounded-lg border border-red-600/60 bg-red-950/30 p-3 text-sm text-neutral-200">{gapNote}</p>
      )}

      {!normalizedQuery ? (
        <p className="text-neutral-400">Wpisz frazę lub wybierz popularne hasło, aby zobaczyć wyniki.</p>
      ) : (
        <>
          <ul className="space-y-4 [overflow-wrap:anywhere]">
            {visibleResults.map(result => {
              const obdCode = result.id?.startsWith('obd:') ? result.id.slice(4) : undefined;
              const isGuide = result.Typ === 'Poradnik';
              const body = obdCode || isGuide ? null : bodyForEntry(result);
              return (
                <li key={result.id} className="rounded-xl border border-white/10 bg-neutral-900/50 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg">
                      <Link
                        href={result.href || (result.id ? `/baza/${encodeURIComponent(result.id)}` : '/')}
                        className="inline-flex min-h-11 items-center text-red-300 hover:text-white"
                      >
                        {result.Nazwa}
                      </Link>
                    </h2>
                    {obdCode && <span className="rounded bg-red-600 px-2 py-0.5 text-xs font-semibold text-white">Kod OBD</span>}
                    {isGuide && <span className="rounded bg-red-600 px-2 py-0.5 text-xs font-semibold text-white">Poradnik</span>}
                  </div>
                  {body && <div className="mt-2"><ModelThumb body={body} /></div>}
                  <p className="mt-2 text-neutral-300">{(result.Opis || result.Objawy || '').slice(0, 250)}</p>
                  {obdCode && (
                    <Link href={`/kody-obd/${obdCode.toLowerCase()}`} className="mt-1 inline-flex min-h-11 items-center text-red-400 hover:text-white">
                      Otwórz kartę kodu {obdCode}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
          {hasMore && (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                data-testid="search-more"
                onClick={() => setShown({ query, count: visibleCount + PAGE_SIZE })}
                className="min-h-12 rounded-xl border-2 border-red-600 bg-neutral-900 px-6 text-base font-semibold text-red-200 transition hover:bg-red-950/50 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              >
                Pokaż więcej wyników
              </button>
            </div>
          )}
          {status === 'loading' && !results.length && (
            <ul aria-hidden="true" data-testid="search-skeleton" className="space-y-4">
              {[0, 1, 2].map(i => <li key={i} className="h-28 animate-pulse rounded-xl border border-white/10 bg-neutral-900/60" />)}
            </ul>
          )}
          {status !== 'loading' && !results.length && (
            <div data-testid="search-empty" className="rounded-xl border border-white/10 bg-neutral-900/60 p-4 text-neutral-300">
              <p>Brak wyników dla „{normalizedQuery}”. Spróbuj krótszej frazy albo popularnego hasła, np. P0300, EGR lub 4L60E. Polskie znaki nie są wymagane (np. „sprzeglo” = „sprzęgło”).</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link href="/szukaj" className="inline-flex min-h-11 items-center rounded-lg border border-red-600/50 px-4 font-semibold text-red-300 hover:bg-red-950/40">Wyczyść wyszukiwanie</Link>
                <Link href="/kody-obd" className="inline-flex min-h-11 items-center rounded-lg border border-white/15 px-4 text-neutral-200 hover:border-red-600">Lista kodów OBD</Link>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
