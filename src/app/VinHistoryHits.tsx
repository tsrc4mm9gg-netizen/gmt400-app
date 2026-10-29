'use client';
/**
 * Jedna implementacja „Zdjęcia i historia tego VIN” — używana w /vin (zwijana sekcja, licznik po otwarciu)
 * i na /narzedzia/historia-vin (widok samej historii, licznik po kliknięciu „Sprawdź”).
 * Liczby wyłącznie z oficjalnego API NHTSA przez /api/vin-hits; pozostałe źródła to linki z „sprawdź”.
 * Nie pobieramy, nie proxujemy i nie wyświetlamy cudzych zdjęć.
 */
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { vinHistoryLinks, type VinHistoryLink } from '@/lib/vin-decode.mjs';
import { badgeText, NOT_COUNTABLE_REASON, sortByHits } from '@/lib/vin-hits.mjs';

export const linkCls = 'inline-flex min-h-11 items-center text-silver-400 underline break-words';
export const sectionCls = 'min-w-0 border border-white/10 bg-neutral-950';
export const summaryCls = 'flex min-h-12 cursor-pointer items-center justify-between gap-3 px-4 py-3 text-base font-semibold text-white hover:text-silver-300 [&::-webkit-details-marker]:hidden';
export const Chevron = () => <span aria-hidden="true" className="text-silver-400 transition group-open:rotate-90">›</span>;

type Hits = { state: 'idle' | 'loading' | 'error' } | { state: 'done'; counts: Record<string, number | null>; notes: Record<string, string>; models: string[]; label: string };

/** Wyniki przygotowane przez serwer (Historia VIN po zatwierdzeniu prośby) — wtedy nie ma własnego pobierania ani lokalnie liczonych linków. */
export type PreloadedHits = { links: VinHistoryLink[]; counts: Record<string, number | null>; notes: Record<string, string>; scope: { make: string; year: string; nhtsaModels?: string[] } | null };

export default function VinHistoryHits({ vin, variant = 'section', preloaded }: { vin: string; variant?: 'section' | 'page'; preloaded?: PreloadedHits }) {
  const [hits, setHits] = useState<Hits>(preloaded ? { state: 'done', counts: preloaded.counts, notes: preloaded.notes, models: preloaded.scope?.nhtsaModels ?? [], label: preloaded.scope ? `${preloaded.scope.year} ${preloaded.scope.make}` : '' } : { state: 'idle' });
  const started = useRef(!!preloaded);
  const load = () => {
    if (started.current) return;
    started.current = true;
    setHits({ state: 'loading' });
    fetch('/api/vin-hits', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ vin }), cache: 'no-store' })
      .then(r => (r.ok ? r.json() : Promise.reject(new Error('HTTP ' + r.status))))
      .then(d => setHits({ state: 'done', counts: d.counts ?? {}, notes: d.notes ?? {}, models: d.scope?.nhtsaModels ?? [], label: d.scope ? `${d.scope.year} ${d.scope.make}` : '' }))
      .catch(() => setHits({ state: 'error' }));
  };
  // Widok strony: użytkownik sam kliknął „Sprawdź historię”, więc liczymy od razu.
  useEffect(() => { if (variant === 'page') load(); }); // eslint-disable-line react-hooks/exhaustive-deps

  const links = preloaded?.links ?? vinHistoryLinks(vin);
  const countOf = (l: (typeof links)[number]) => (hits.state === 'done' && l.count ? hits.counts[l.count] : undefined);
  const ordered = hits.state === 'done' ? sortByHits(links, Object.fromEntries(links.map(l => [l.id, countOf(l)]))) : links;

  const content = (
    <>
      <p className="text-sm text-neutral-300">Linki otwierają wyszukiwanie w zewnętrznych serwisach. Nie pobieramy ani nie kopiujemy cudzych zdjęć i raportów — wyniki zależą od tych serwisów.</p>
      <p className="mt-2 text-xs text-neutral-400" data-testid="vin-hits-note">Liczba przed linkiem = rekordy w oficjalnej bazie NHTSA dla rocznika i modelu (nie tylko tego egzemplarza; akcje obejmują też kampanie na części i akcesoria pasujące do auta); <span className="text-neutral-500">0</span> = baza nic nie zwróciła. „sprawdź” = serwis nie podaje liczby bez captchy lub płatnego dostępu — otwórz link.</p>
      <ul className="mt-2 grid gap-x-4 sm:grid-cols-2" data-testid="vin-history-list">
        {ordered.map(l => {
          const c = countOf(l);
          const text = badgeText(c);
          const zero = text === '0';
          const loading = hits.state === 'loading' && l.count;
          const internal = l.href.startsWith('/');
          const badge = loading
            ? <span className="inline-flex h-7 w-16 shrink-0 animate-pulse items-center justify-center border border-white/10 bg-white/10 text-xs text-neutral-400" aria-label="liczę…">…</span>
            : text !== null
              ? <span className={`inline-flex h-7 w-16 shrink-0 items-center justify-center border text-sm font-bold tabular-nums ${zero ? 'border-white/15 text-neutral-500' : 'border-silver-500 bg-silver-600 text-neutral-950'}`} aria-label={`${text} ${zero ? '— brak rekordów' : 'rekordów'}`} data-testid={`vin-hit-${l.id}`}>{text}</span>
              : <span className="inline-flex h-7 w-16 shrink-0 items-center justify-center border border-dashed border-white/20 text-[11px] uppercase tracking-wide text-neutral-400" aria-label="liczba niedostępna — sprawdź w serwisie" data-testid={`vin-hit-${l.id}`}>{l.count && hits.state !== 'idle' ? '?' : 'sprawdź'}</span>;
          return (
            <li key={l.id} className={`flex min-w-0 items-center gap-3 ${zero ? 'opacity-60' : ''}`}>
              {badge}
              {internal
                ? <Link href={l.href} className={`${linkCls} min-w-0`}>{l.label}</Link>
                : <a href={l.href} target="_blank" rel="noopener noreferrer nofollow" className={`${linkCls} min-w-0`}>{l.label} ↗</a>}
            </li>
          );
        })}
      </ul>
      {hits.state === 'done' && hits.models.length > 0 && <p className="mt-2 text-xs text-neutral-400" data-testid="vin-hits-scope">NHTSA {hits.label}: zsumowano nazwy modelu {hits.models.join(', ')} (każda kampania/skarga liczona raz).</p>}
      {hits.state === 'done' && Object.values(hits.notes).length > 0 && <p className="mt-1 text-xs text-neutral-400">{[...new Set(Object.values(hits.notes))].join(' ')}</p>}
      {hits.state === 'error' && <p className="mt-2 text-xs text-neutral-400" role="status">Nie udało się pobrać liczników — to nie znaczy, że wyników nie ma.</p>}
      <details className="mt-2 text-xs text-neutral-400">
        <summary className="inline-flex min-h-11 cursor-pointer items-center text-neutral-300 underline">Dlaczego przy części linków nie ma liczby?</summary>
        <ul className="mt-1 list-disc space-y-1 pl-5">
          {[...new Set(links.filter(l => l.reason).map(l => l.reason as string))].map(r => <li key={r}>{links.filter(l => l.reason === r).map(l => l.label.split(' — ')[0].replace(/^Historia aukcji: |^Archiwum aukcji: /, '').replace(/ \(.*\)$/, '')).join(', ')}: {NOT_COUNTABLE_REASON[r]}</li>)}
        </ul>
      </details>
      {variant === 'page'
        ? <p className="mt-2 text-xs text-neutral-400">Rocznik, silnik, nadwozie, fabryka i kody RPO: <Link href="/vin" className="text-silver-400 underline">pełne dekodowanie w Sprawdź VIN</Link>.</p>
        : <p className="mt-2 text-xs text-neutral-400">Ta sama lista jako osobne narzędzie: <Link href="/narzedzia/historia-vin" className="text-silver-400 underline">Historia VIN</Link>.</p>}
    </>
  );

  if (variant === 'page') {
    return (
      <section className={sectionCls} data-testid="vin-history" aria-labelledby="vin-history-h">
        <h2 id="vin-history-h" className="border-b border-white/10 px-4 py-3 text-base font-semibold text-white">Zdjęcia i historia tego VIN</h2>
        <div className="p-4 pt-3">{content}</div>
      </section>
    );
  }
  return (
    <details className={`group ${sectionCls}`} data-testid="vin-history" onToggle={e => { if ((e.currentTarget as HTMLDetailsElement).open) load(); }}>
      <summary className={summaryCls}><span>Zdjęcia i historia tego VIN</span><Chevron /></summary>
      <div className="border-t border-white/10 p-4 pt-3">{content}</div>
    </details>
  );
}
