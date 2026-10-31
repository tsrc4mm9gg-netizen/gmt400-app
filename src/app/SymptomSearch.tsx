'use client';
import { useCallback, useDeferredValue, useEffect, useId, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { buildSymptomIndex, searchSymptoms, termLabels, type SymptomEntry } from '../lib/symptom-search.mjs';

type Entry = SymptomEntry & { id: string };
type Status = 'idle' | 'loading' | 'ready' | 'error';

function isEntry(value: unknown): value is Entry {
  if (!value || typeof value !== 'object') return false;
  const r = value as Record<string, unknown>;
  return typeof r.id === 'string' && typeof r.Nazwa === 'string' && (r.Typ === 'Usterka' || r.Typ === 'Porada');
}

const EXAMPLES = ['stuka przy hamowaniu', 'piszczy przy hamowaniu', 'nie odpala', 'grzeje się', 'szarpie', 'dymi'];

/**
 * „Co się dzieje z moim autem?” — wyszukiwarka objawów. Indeks w przeglądarce (dane z /api/notion pobierane
 * dopiero po wejściu w pole, chyba że rodzic poda wpisy). Wyniki na żywo: usterki + powiązane porady DIY.
 */
export default function SymptomSearch({ entries, headingLevel = 2, className = '', padded = true }: { entries?: readonly unknown[]; headingLevel?: 2 | 3; className?: string; padded?: boolean }) {
  const inputId = useId();
  const [query, setQuery] = useState('');
  const deferred = useDeferredValue(query);
  const [own, setOwn] = useState<Entry[]>([]);
  const [status, setStatus] = useState<Status>(entries ? 'ready' : 'idle');
  const started = useRef(false);

  const load = useCallback(() => {
    if (entries || started.current) return;
    started.current = true;
    setStatus('loading');
    void fetch('/api/notion').then(async res => {
      if (!res.ok) throw new Error('HTTP');
      const data: unknown = await res.json();
      const list = data && typeof data === 'object' && 'results' in data && Array.isArray(data.results) ? data.results : null;
      if (!list) throw new Error('Invalid');
      setOwn(list.filter(isEntry));
      setStatus('ready');
    }).catch(() => { started.current = false; setStatus('error'); });
  }, [entries]);

  useEffect(() => { if (entries) setStatus('ready'); }, [entries]);

  const source = useMemo(() => (entries ? entries.filter(isEntry) : own), [entries, own]);
  const index = useMemo(() => buildSymptomIndex(source), [source]);
  const result = useMemo(() => searchSymptoms(index, deferred), [index, deferred]);
  const q = deferred.trim();
  const showResults = q.length >= 3;
  const empty = status === 'ready' && showResults && !result.faults.length && !result.diy.length;
  const Heading = headingLevel === 2 ? 'h2' : 'h3';

  return (
    <section aria-labelledby={`${inputId}-title`} data-testid="symptom-search" className={`${padded ? 'px-4 pt-5' : ''} ${className}`}>
      <Heading id={`${inputId}-title`} className="text-xl font-bold text-white">Co się dzieje z moim autem?</Heading>
      <p className="mt-0.5 text-xs text-neutral-300">Opisz objaw własnymi słowami — pokażemy pasujące usterki i porady DIY z bazy.</p>
      <form role="search" onSubmit={e => e.preventDefault()} className="mt-3">
        <label htmlFor={inputId} className="sr-only">Opisz objaw</label>
        <input
          id={inputId}
          type="search"
          inputMode="search"
          enterKeyHint="search"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          maxLength={120}
          value={query}
          onFocus={load}
          onChange={e => { load(); setQuery(e.target.value); }}
          placeholder="Opisz objaw, np. stuka przy hamowaniu"
          aria-describedby={`${inputId}-status`}
          data-testid="symptom-input"
          className="min-h-12 w-full rounded-xl border-2 border-silver-600 bg-neutral-900 px-4 py-3 text-base text-white placeholder:text-neutral-500 focus:border-silver-500 focus:outline-none focus:ring-2 focus:ring-silver-600/40"
        />
      </form>
      {!q && (
        <ul className="mt-2 flex flex-wrap gap-2" aria-label="Przykładowe objawy">
          {EXAMPLES.map(ex => (
            <li key={ex} style={{ maxWidth: 'none' }}>
              <button type="button" onClick={() => { load(); setQuery(ex); }} className="inline-flex min-h-11 items-center rounded-full border border-white/15 bg-white/5 px-3 text-sm text-neutral-200 hover:border-silver-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-silver-500">{ex}</button>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-2 text-xs text-neutral-400">Wolisz pytania krok po kroku? <Link href="/diagnoza" className="inline-flex min-h-11 items-center font-semibold text-silver-300 underline">Diagnoza objawów</Link></p>
      <div id={`${inputId}-status`} aria-live="polite" className="mt-3">
        {showResults && status === 'loading' && <p className="text-sm text-neutral-300">Wczytuję bazę usterek…</p>}
        {showResults && status === 'error' && (
          <p className="text-sm text-neutral-300">Nie udało się wczytać bazy. <button type="button" onClick={load} className="min-h-11 font-semibold text-silver-300 underline">Spróbuj ponownie</button> albo przejdź do <Link href="/usterki" className="font-semibold text-silver-300 underline">listy usterek</Link>.</p>
        )}
        {status === 'ready' && showResults && !empty && (
          <div data-testid="symptom-results">
            {result.terms.length > 0 && <p className="text-xs text-neutral-400">Szukam: {termLabels(result.terms).join(' · ')}</p>}
            {result.faults.length > 0 && <ResultList title="Możliwe usterki" items={result.faults as Entry[]} testId="symptom-faults" />}
            {result.diy.length > 0 && <ResultList title="Powiązane porady DIY" items={result.diy as Entry[]} testId="symptom-diy" />}
            <p className="mt-2 text-[11px] text-neutral-400">To podpowiedzi z bazy, nie diagnoza — sprawdź w swoim aucie i w manualu.</p>
          </div>
        )}
        {empty && (
          <p data-testid="symptom-empty" className="rounded-xl border border-white/15 bg-neutral-900 p-3 text-sm text-neutral-200">
            Nic nie pasuje do „{q}”. Spróbuj opisać objaw inaczej (np. „pisk”, „dymi”, „nie odpala”) albo przejrzyj <Link href="/usterki" className="font-semibold text-silver-300 underline">wszystkie usterki</Link>.
          </p>
        )}
      </div>
    </section>
  );
}

function ResultList({ title, items, testId }: { title: string; items: Entry[]; testId: string }) {
  return (
    <div className="mt-2">
      <h3 className="text-sm font-semibold text-neutral-200">{title}</h3>
      <ul className="mt-1 space-y-1.5" data-testid={testId}>
        {items.map(e => (
          <li key={e.id} style={{ maxWidth: 'none' }}>
            <Link href={`/baza/${encodeURIComponent(e.id)}`} className="flex min-h-11 items-center rounded-xl border border-white/10 bg-neutral-900 px-3 py-2 text-sm leading-snug text-white hover:border-silver-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-silver-500">
              <span className="line-clamp-2">{e.Nazwa}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
