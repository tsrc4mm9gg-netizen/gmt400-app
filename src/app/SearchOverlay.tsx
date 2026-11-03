'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { prepareQuery, scoreDocument } from '@/lib/search-aliases.mjs';
import { knowledgeFit, type Fit } from '@/lib/my-car.mjs';
import { useStoredVehicleProfile } from '@/lib/vehicle-profile-store';
import { vehicleProfileShort, type VehicleProfile } from '@/lib/vehicle-profile';
import type { SearchGroup, SearchIndex, SearchIndexDoc } from '@/lib/search-index';

export const SEARCH_RECENT_KEY = 'gmt400_search_recent_v1';
export const SEARCH_SCOPE_KEY = 'gmt400_search_scope_v1';
const RECENT_MAX = 8;
const PER_GROUP = 5;
const GROUPS: { id: SearchGroup; label: string }[] = [
  { id: 'usterki', label: 'Usterki' },
  { id: 'diy', label: 'DIY / Porady' },
  { id: 'obd', label: 'Kody OBD' },
  { id: 'modele', label: 'Modele' },
  { id: 'poradniki', label: 'Poradniki' },
  { id: 'strony', label: 'Strony i narzędzia' },
];
const SUGGESTIONS = ['P0300', 'stuka', 'RPO', 'przegląd', 'nie odpala', 'LPG'];

/* ---------- indeks: jedno pobranie na kartę ---------- */
let indexPromise: Promise<SearchIndex> | null = null;
function loadIndex(): Promise<SearchIndex> {
  if (!indexPromise) {
    indexPromise = fetch('/api/search-index').then(async r => {
      if (!r.ok) throw new Error(String(r.status));
      const data = (await r.json()) as SearchIndex;
      if (!data || !Array.isArray(data.docs)) throw new Error('invalid');
      return data;
    });
    indexPromise.catch(() => { indexPromise = null; });
  }
  return indexPromise;
}
export function prefetchSearchIndex() { void loadIndex().catch(() => {}); }

/* ---------- localStorage (bezpiecznie, gdy pamięć zablokowana) ---------- */
const LOCAL_EVENT = 'gmt400-search-local';
function readLocal(key: string): string | null { try { return window.localStorage.getItem(key); } catch { return null; } }
function writeLocal(key: string, value: string | null) {
  try { if (value === null) window.localStorage.removeItem(key); else window.localStorage.setItem(key, value); } catch { /* tryb prywatny */ }
  window.dispatchEvent(new Event(LOCAL_EVENT));
}
function subscribeLocal(cb: () => void) {
  window.addEventListener(LOCAL_EVENT, cb); window.addEventListener('storage', cb);
  return () => { window.removeEventListener(LOCAL_EVENT, cb); window.removeEventListener('storage', cb); };
}
function useLocal(key: string) { return useSyncExternalStore(subscribeLocal, () => readLocal(key), () => null); }
function parseRecent(raw: string | null): string[] {
  try { const v = JSON.parse(raw ?? '[]'); return Array.isArray(v) ? v.filter((s): s is string => typeof s === 'string' && s.trim().length > 0).slice(0, RECENT_MAX) : []; } catch { return []; }
}
function saveRecent(query: string) {
  const q = query.trim().replace(/\s+/g, ' ');
  if (q.length < 2) return;
  const list = parseRecent(readLocal(SEARCH_RECENT_KEY)).filter(item => item.toLocaleLowerCase('pl') !== q.toLocaleLowerCase('pl'));
  writeLocal(SEARCH_RECENT_KEY, JSON.stringify([q, ...list].slice(0, RECENT_MAX)));
}

/* ---------- dopasowanie do auta: ta sama reguła co „Mój samochód” ---------- */
const FIT_RANK: Record<Fit, number> = { match: 0, general: 1, unknown: 2, outside: 3 };
function docFit(doc: SearchIndexDoc, profile: VehicleProfile | null, liters: string | undefined): Fit {
  if (!profile || doc.x) return 'general';
  return knowledgeFit({ Nazwa: doc.t, Lata: doc.y, Modele: doc.m, applicability: { model: doc.am ?? [], years: doc.ay ?? [] } }, profile, liters).fit;
}

export function profileLabel(profile: VehicleProfile | null): string {
  const short = vehicleProfileShort(profile);
  if (!short) return '';
  return [short, profile?.engine].filter(Boolean).join(' · ');
}

type Row = { doc: SearchIndexDoc; score: number; fit: Fit };

const ICON = { search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm9 16-4-4', close: 'M6 6l12 12M18 6 6 18', clock: 'M12 7v5l3 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z' };
const Icon = ({ d, className = 'h-5 w-5' }: { d: string; className?: string }) => <svg aria-hidden="true" viewBox="0 0 24 24" className={`${className} shrink-0`} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>;
const focusRing = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-silver-400';

export default function SearchOverlay({ onClose, initialQuery = '' }: { onClose: () => void; initialQuery?: string }) {
  const router = useRouter();
  const profile = useStoredVehicleProfile();
  const label = profileLabel(profile);
  const scopeRaw = useLocal(SEARCH_SCOPE_KEY);
  const scope: 'mine' | 'all' = label && scopeRaw !== 'all' ? 'mine' : 'all';
  const recent = parseRecent(useLocal(SEARCH_RECENT_KEY));
  const [query, setQuery] = useState(initialQuery);
  const [state, setState] = useState<{ status: 'loading' | 'ready' | 'error'; index: SearchIndex | null }>({ status: 'loading', index: null });
  const [attempt, setAttempt] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState<{ top: number; height: number } | null>(null);

  // Fokus od razu po zamontowaniu (iOS: klawiatura jest już otwarta dzięki polu-zastępcy w nagłówku).
  useLayoutEffect(() => { inputRef.current?.focus({ preventScroll: true }); }, []);

  useEffect(() => {
    let live = true;
    loadIndex().then(index => { if (live) setState({ status: 'ready', index }); }, () => { if (live) setState({ status: 'error', index: null }); });
    return () => { live = false; };
  }, [attempt]);

  // Blokada przewijania strony pod nakładką.
  useEffect(() => {
    const html = document.documentElement; const body = document.body;
    const prev = [html.style.overflow, body.style.overflow];
    html.style.overflow = 'hidden'; body.style.overflow = 'hidden';
    return () => { html.style.overflow = prev[0]; body.style.overflow = prev[1]; };
  }, []);

  // Klawiatura ekranowa (iOS/Android): dopasowanie do widocznej części ekranu.
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const update = () => setViewport(Math.abs(vv.height - window.innerHeight) < 1 && vv.offsetTop === 0 ? null : { top: vv.offsetTop, height: vv.height });
    update();
    vv.addEventListener('resize', update); vv.addEventListener('scroll', update);
    return () => { vv.removeEventListener('resize', update); vv.removeEventListener('scroll', update); };
  }, []);

  // Escape zamyka, Tab nie wychodzi poza okno.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); return; }
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const items = [...dialogRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input')].filter(el => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0]; const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const trimmed = query.trim();
  const prepared = useMemo(() => prepareQuery(trimmed), [trimmed]);
  const groups = useMemo(() => {
    const index = state.index;
    if (!index || prepared.normalized.length < 2 || !prepared.tokens.length) return [] as { id: SearchGroup; label: string; rows: Row[]; total: number }[];
    const liters = profile?.engine ? index.engines?.[profile.engine.toUpperCase()] : undefined;
    const seen = new Set<string>();
    const rows: Row[] = [];
    for (const doc of index.docs) {
      const key = `${doc.g}|${doc.u}`;
      if (seen.has(key)) continue;
      const score = scoreDocument(prepared, { title: doc.t, body: `${doc.t} ${doc.b}`, id: doc.k });
      if (!score) continue;
      seen.add(key);
      const fit = docFit(doc, profile, liters);
      if (scope === 'mine' && fit === 'outside') continue;
      rows.push({ doc, score, fit });
    }
    return GROUPS.map(group => {
      const list = rows.filter(r => r.doc.g === group.id).sort((a, b) => (scope === 'mine' ? FIT_RANK[a.fit] - FIT_RANK[b.fit] : 0) || b.score - a.score);
      return { ...group, rows: list.slice(0, PER_GROUP), total: list.length };
    }).filter(g => g.total > 0);
  }, [state.index, prepared, profile, scope]);

  const allHref = `/szukaj?q=${encodeURIComponent(trimmed)}`;
  const go = (href: string, remember = true) => { if (remember) saveRecent(trimmed); onClose(); router.push(href); };
  const total = groups.reduce((sum, g) => sum + g.total, 0);
  const style = viewport ? { top: viewport.top, height: viewport.height } : undefined;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Wyszukiwarka"
      data-testid="search-overlay"
      style={style}
      className="fixed inset-x-0 top-0 z-[120] flex h-dvh flex-col bg-neutral-950 text-white"
    >
      <form
        role="search"
        className="flex items-center gap-2 border-b border-white/10 bg-black px-3 py-2"
        onSubmit={event => { event.preventDefault(); if (trimmed.length) go(allHref); }}
      >
        <label htmlFor="search-overlay-input" className="sr-only">Szukaj kodu, objawu, części lub strony</label>
        <div className="flex min-h-11 min-w-0 flex-1 items-center gap-2 rounded-xl border border-silver-500/60 bg-neutral-900 px-3 focus-within:border-silver-300">
          <Icon d={ICON.search} className="h-5 w-5 text-silver-300" />
          <input
            ref={inputRef}
            id="search-overlay-input"
            data-testid="search-overlay-input"
            type="search"
            inputMode="search"
            enterKeyHint="search"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            autoFocus
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Szukaj kodu, objawu…"
            className="min-h-11 min-w-0 flex-1 bg-transparent text-base text-white placeholder:text-neutral-400 focus:outline-none"
          />
          {query && (
            <button type="button" onClick={() => { setQuery(''); inputRef.current?.focus(); }} aria-label="Wyczyść pole" className={`-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-lg text-neutral-300 hover:text-white ${focusRing}`}>
              <Icon d={ICON.close} className="h-4 w-4" />
            </button>
          )}
        </div>
        <button type="button" data-testid="search-overlay-close" onClick={onClose} className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl px-3 text-sm font-semibold text-silver-200 hover:bg-white/10 ${focusRing}`}>
          Zamknij
        </button>
      </form>

      {label && (
        <div data-testid="search-profile-chip" className="flex flex-wrap items-center gap-2 border-b border-white/10 px-3 py-2 text-sm">
          <span className="min-w-0 truncate text-silver-200">Dla: <strong className="font-semibold text-white">{label}</strong></span>
          <div role="group" aria-label="Zakres wyników" className="ml-auto inline-flex rounded-full border border-white/20 p-0.5">
            {(['mine', 'all'] as const).map(value => (
              <button
                key={value}
                type="button"
                data-testid={`search-scope-${value}`}
                aria-pressed={scope === value}
                onClick={() => writeLocal(SEARCH_SCOPE_KEY, value)}
                className={`min-h-11 rounded-full px-3 text-sm font-semibold transition ${focusRing} ${scope === value ? 'bg-silver-300 text-neutral-950' : 'text-silver-200 hover:bg-white/10'}`}
              >
                {value === 'mine' ? 'Dla mojego auta' : 'Pokaż wszystko'}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-8 pt-3" data-testid="search-overlay-results">
        {!trimmed || prepared.normalized.length < 2 ? (
          <div>
            {recent.length > 0 && (
              <section data-testid="search-recent" aria-labelledby="search-recent-title" className="mb-5">
                <div className="flex items-center justify-between gap-2">
                  <h2 id="search-recent-title" className="text-sm font-semibold uppercase tracking-wide text-neutral-400">Ostatnio szukane</h2>
                  <button type="button" data-testid="search-recent-clear" onClick={() => { writeLocal(SEARCH_RECENT_KEY, null); inputRef.current?.focus(); }} className={`min-h-11 rounded-lg px-3 text-sm text-silver-300 underline-offset-4 hover:underline ${focusRing}`}>Wyczyść</button>
                </div>
                <ul className="mt-1">
                  {recent.map(item => (
                    <li key={item}>
                      <button type="button" onClick={() => { setQuery(item); inputRef.current?.focus(); }} className={`flex min-h-11 w-full items-center gap-3 rounded-lg px-2 text-left text-base text-neutral-100 hover:bg-white/5 ${focusRing}`}>
                        <Icon d={ICON.clock} className="h-4 w-4 text-neutral-400" /><span className="min-w-0 truncate">{item}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-400">Spróbuj</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {SUGGESTIONS.map(item => (
                <button key={item} type="button" onClick={() => { setQuery(item); inputRef.current?.focus(); }} className={`min-h-11 rounded-full border border-white/15 bg-neutral-900 px-4 text-sm text-silver-100 hover:border-silver-400 ${focusRing}`}>{item}</button>
              ))}
            </div>
            <p className="mt-4 text-sm text-neutral-400">Kod OBD (np. P0300), objaw („stuka”, „nie odpala”), część albo nazwa narzędzia. Polskie znaki są opcjonalne.</p>
          </div>
        ) : state.status === 'loading' ? (
          <p role="status" className="py-6 text-center text-neutral-300">Ładuję wyniki…</p>
        ) : state.status === 'error' ? (
          <div role="alert" className="py-6 text-center">
            <p className="text-neutral-200">Nie udało się pobrać podpowiedzi.</p>
            <div className="mt-3 flex justify-center gap-2">
              <button type="button" onClick={() => { setState({ status: 'loading', index: null }); setAttempt(a => a + 1); }} className={`min-h-11 rounded-xl border border-white/20 px-4 text-sm font-semibold ${focusRing}`}>Spróbuj ponownie</button>
              <Link href={allHref} onClick={() => saveRecent(trimmed)} className={`inline-flex min-h-11 items-center rounded-xl bg-silver-300 px-4 text-sm font-semibold text-neutral-950 ${focusRing}`}>Szukaj na stronie wyników</Link>
            </div>
          </div>
        ) : (
          <div>
            {prepared.note && <p className="mb-3 rounded-lg border border-white/10 bg-neutral-900 p-3 text-sm text-neutral-300">{prepared.note}</p>}
            {state.index?.partial && <p className="mb-3 text-xs text-neutral-400">Baza wiedzy chwilowo niedostępna — pokazuję kody OBD, poradniki, modele i strony.</p>}
            <p role="status" className="sr-only">{total ? `${total} wyników` : 'Brak wyników'}</p>
            {total === 0 && (
              <p className="py-6 text-center text-neutral-300">Brak podpowiedzi dla „{trimmed}”. Naciśnij Enter, by szukać w całej bazie, albo spróbuj innego słowa.</p>
            )}
            {groups.map(group => (
              <section key={group.id} data-testid={`search-group-${group.id}`} aria-labelledby={`search-group-title-${group.id}`} className="mb-5">
                <h2 id={`search-group-title-${group.id}`} className="flex items-baseline justify-between gap-2 text-sm font-semibold uppercase tracking-wide text-neutral-400">
                  <span>{group.label}</span><span className="text-xs font-normal normal-case tracking-normal">{group.total > group.rows.length ? `${group.rows.length} z ${group.total}` : group.total}</span>
                </h2>
                <ul className="mt-1 divide-y divide-white/5">
                  {group.rows.map(({ doc, fit }) => (
                    <li key={doc.u}>
                      <Link
                        href={doc.u}
                        data-testid="search-result"
                        data-fit={fit}
                        onClick={event => { if (event.metaKey || event.ctrlKey || event.shiftKey) return; event.preventDefault(); go(doc.u); }}
                        className={`flex min-h-11 flex-col justify-center rounded-lg px-2 py-2 hover:bg-white/5 ${focusRing}`}
                      >
                        <span className="flex items-start gap-2">
                          <span className="min-w-0 flex-1 text-base font-medium leading-snug text-silver-100">{doc.t}</span>
                          {label && fit === 'match' && <span className="mt-0.5 shrink-0 rounded-full border border-silver-400/60 px-2 py-0.5 text-[11px] font-semibold text-silver-200">Pasuje</span>}
                          {label && fit === 'outside' && <span className="mt-0.5 shrink-0 rounded-full border border-white/15 px-2 py-0.5 text-[11px] text-neutral-400">Inne auto</span>}
                        </span>
                        {doc.s && <span className="mt-0.5 line-clamp-1 text-sm text-neutral-400">{doc.s}</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
            {trimmed.length >= 2 && (
              <Link href={allHref} data-testid="search-overlay-all" onClick={event => { event.preventDefault(); go(allHref); }} className={`mt-2 flex min-h-11 items-center justify-center rounded-xl border border-silver-500/50 px-4 text-sm font-semibold text-silver-100 hover:bg-white/5 ${focusRing}`}>
                Wszystkie wyniki dla „{trimmed}” →
              </Link>
            )}
            {label && scope === 'mine' && total > 0 && <p className="mt-3 text-xs text-neutral-400">Ukryto tylko materiały wyraźnie dla innego modelu lub rocznika. Sprawdź w swoim aucie.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
