'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useModelSelection, type Filters } from './ModelSelectionContext';
import { BODY_STYLES, bodyYears, yearOptions } from '../lib/body-styles';

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
  const [touchStart, setTouchStart] = useState(0);
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

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart - e.changedTouches[0].clientX;
    if (diff > 50) next();
    if (diff < -50) prev();
  };

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
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="absolute left-3 top-3 z-10 rounded-md bg-red-600 px-2.5 py-1 text-sm font-bold text-white shadow"
          data-testid="year-badge"
          aria-live="polite"
        >
          {badge}
        </div>

        <div className="relative aspect-[16/9] w-full">
          <Image
            key={body.image}
            src={body.image}
            alt={`${body.name} (${bodyYears(body)})`}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
            priority={index === 0}
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h2 className="text-xl font-bold sm:text-2xl">{body.name}</h2>
          <p className="text-sm text-neutral-300">
            {filters.year ? filters.year : bodyYears(body)}
            {filters.engine ? ` · ${ENGINES.find(e => e.value === filters.engine)?.label ?? filters.engine}` : ''}
            {filters.drivetrain ? ` · ${filters.drivetrain.toUpperCase()}` : ''}
          </p>
          {body.note && <p className="mt-0.5 text-xs text-neutral-400">{body.note}</p>}
        </div>

        <button onClick={prev} className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-2xl text-white" aria-label="Poprzedni model">‹</button>
        <button onClick={next} className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-2xl text-white" aria-label="Następny model">›</button>
      </div>

      <div className="mt-3 flex justify-center gap-1.5">
        {BODY_STYLES.map((b, i) => (
          <button
            key={b.id}
            onClick={() => go(i)}
            className="flex h-6 items-center"
            aria-label={b.name}
            aria-current={i === index ? 'true' : undefined}
          >
            <span className={`block h-1.5 rounded-full transition-all ${i === index ? 'w-6 bg-red-600' : 'w-1.5 bg-white/30'}`} />
          </button>
        ))}
      </div>

      <button
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
