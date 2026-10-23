'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useModelSelection, type Filters } from './ModelSelectionContext';
import { BODY_STYLES, bodyYears, yearOptions } from '../lib/body-styles';
import { bodyImage } from '../lib/model-images';

const ENGINES = [
  { value: '4.3', label: '4.3 V6' },
  { value: '5.0', label: '5.0 V8' },
  { value: '5.7', label: '5.7 V8' },
  { value: '7.4', label: '7.4 V8' },
  { value: '6.2', label: '6.2 diesel' },
  { value: '6.5', label: '6.5 diesel' },
];

const selectClass = 'min-h-12 w-full rounded-lg border border-white/15 bg-neutral-900 px-2 text-base text-white focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-600/40';

export default function ModelHero() {
  const { bodyId, filters: ctxFilters, setSelection } = useModelSelection();
  const ctxIndex = BODY_STYLES.findIndex(b => b.id === bodyId);
  const [index, setIndex] = useState(ctxIndex >= 0 ? ctxIndex : 0);
  // Ref, nie stan: touchend musi widzieć start gestu nawet przed kolejnym renderem.
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Wybór zapisany w sesji (np. po powrocie z podstrony) wczytuje się po montażu.
  useEffect(() => {
    if (ctxIndex >= 0) setIndex(ctxIndex);
  }, [ctxIndex]);

  const body = BODY_STYLES[index];
  const filters: Filters = bodyId === body.id ? ctxFilters : {};
  const hasFilters = Boolean(filters.year || filters.engine || filters.drivetrain);
  const badge = filters.year || bodyYears(body);

  const go = (nextIndex: number) => {
    setIndex(nextIndex);
    setShowFilters(false);
    setSelection({ bodyId: BODY_STYLES[nextIndex].id, filters: {} });
  };
  const next = () => go((index + 1) % BODY_STYLES.length);
  const prev = () => go((index - 1 + BODY_STYLES.length) % BODY_STYLES.length);

  const handleTouchStart = (e: React.TouchEvent) => { touchStart.current = e.touches.length === 1 ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : null; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start || !e.changedTouches.length) return;
    const dx = start.x - e.changedTouches[0].clientX;
    const dy = start.y - e.changedTouches[0].clientY;
    // Tylko wyraźnie poziomy gest — przewijanie strony w pionie nie zmienia modelu.
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    if (dx > 0) next(); else prev();
  };
  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
  };
  useEffect(() => { setImageLoaded(false); }, [body.image]);

  const updateFilter = (key: keyof Filters, value: string) => {
    setSelection({ bodyId: body.id, filters: { ...filters, [key]: value || undefined } });
  };

  return (
    <section className="mx-auto w-full max-w-3xl px-4 pt-6 pb-2" aria-label="Wybór modelu">
      <div className="mb-4 text-center">
        <h1 className="text-4xl font-bold tracking-wider text-white">
          GMT<span className="text-red-600">400</span>
        </h1>
        <p className="mt-1 text-xs uppercase tracking-[0.25em] text-neutral-400">Encyklopedia · 1988–2000</p>
      </div>

      <div
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 shadow-2xl"
        role="group"
        aria-roledescription="karuzela"
        aria-label={`Model ${index + 1} z ${BODY_STYLES.length}: ${body.name}`}
        data-testid="model-carousel"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={() => { touchStart.current = null; }}
        onKeyDown={handleKey}
      >
        <div
          className="absolute left-3 top-3 z-10 rounded-md bg-red-600 px-2.5 py-1 text-sm font-bold text-white shadow"
          data-testid="year-badge"
          aria-live="polite"
        >
          {badge}
        </div>

        <div className="relative aspect-[16/9] w-full">
          {!imageLoaded && <div aria-hidden="true" className="absolute inset-0 animate-pulse bg-neutral-800" />}
          <Image
            onLoad={() => setImageLoaded(true)}
            key={body.image}
            src={bodyImage(body)}
            alt={`${body.name} (${bodyYears(body)})`}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
            priority={index === 0}
          />
        </div>

        <div className="flex items-center gap-2 border-t border-white/10 bg-neutral-950 px-2 py-3 text-white">
          <button type="button" onClick={prev} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/5 text-2xl text-white ring-1 ring-white/10 hover:bg-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500" aria-label="Poprzedni model">‹</button>
          <div className="min-w-0 flex-1 text-center">
            <h2 className="truncate text-xl font-bold sm:text-2xl">{body.name}</h2>
            <p className="text-sm text-neutral-300">
              {filters.year ? filters.year : bodyYears(body)}
              {filters.engine ? ` · ${ENGINES.find(e => e.value === filters.engine)?.label ?? filters.engine}` : ''}
              {filters.drivetrain ? ` · ${filters.drivetrain.toUpperCase()}` : ''}
            </p>
            {body.note && <p className="mt-0.5 text-xs text-neutral-400">{body.note}</p>}
          </div>
          <button type="button" onClick={next} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/5 text-2xl text-white ring-1 ring-white/10 hover:bg-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500" aria-label="Następny model">›</button>
        </div>
      </div>

      <div className="-mx-2 mt-1 flex justify-center">
        {BODY_STYLES.map((b, i) => (
          <button
            key={b.id}
            type="button"
            onClick={() => go(i)}
            className="flex h-11 w-10 items-center justify-center"
            aria-label={b.name}
            aria-current={i === index ? 'true' : undefined}
          >
            <span className={`block h-1.5 rounded-full transition-all ${i === index ? 'w-6 bg-red-600' : 'w-1.5 bg-white/30'}`} />
          </button>
        ))}
      </div>

      <Link
        href={`/modele/${body.id}`}
        className="mt-1 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-center border border-red-600/50 bg-red-600/10 text-sm font-semibold text-white hover:bg-red-600/25"
      >
        Strona modelu: {body.name} — lata, silniki, usterki, DIY <span aria-hidden="true" className="text-red-300">→</span>
      </Link>

      <button
        type="button"
        onClick={() => setShowFilters(!showFilters)}
        aria-expanded={showFilters}
        className="mt-3 min-h-12 w-full rounded-lg border border-white/15 bg-neutral-900 text-sm font-medium text-white hover:border-red-600/60"
      >
        {showFilters ? 'Ukryj doprecyzowanie' : 'Doprecyzuj: rocznik, silnik, napęd'}
      </button>

      {showFilters && (
        <div className="mt-3 space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <label className="sr-only" htmlFor="hero-year">Rocznik</label>
            <select id="hero-year" value={filters.year || ''} onChange={(e) => updateFilter('year', e.target.value)} className={selectClass}>
              <option value="">Rocznik</option>
              {yearOptions(body).map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <label className="sr-only" htmlFor="hero-engine">Silnik</label>
            <select id="hero-engine" value={filters.engine || ''} onChange={(e) => updateFilter('engine', e.target.value)} className={selectClass}>
              <option value="">Silnik</option>
              {ENGINES.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
            </select>
            <label className="sr-only" htmlFor="hero-drive">Napęd</label>
            <select id="hero-drive" value={filters.drivetrain || ''} onChange={(e) => updateFilter('drivetrain', e.target.value)} className={selectClass}>
              <option value="">Napęd</option>
              <option value="2wd">2WD</option>
              <option value="4wd">4WD</option>
            </select>
          </div>
          <p className="text-xs text-neutral-500">Wybór zawęża DIY, usterki i kody do tego modelu. Sprawdź w swoim aucie / manualu — GMT400 ma wiele wariantów (rocznik, GVWR, silnik, skrzynia, RPO).</p>
          {hasFilters && (
            <button
              type="button"
              onClick={() => setSelection({ bodyId: body.id, filters: {} })}
              className="min-h-11 w-full rounded-lg border border-red-600/40 bg-red-950/40 text-sm text-red-300"
            >
              Wyczyść doprecyzowanie
            </button>
          )}
        </div>
      )}
    </section>
  );
}
