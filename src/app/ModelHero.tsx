'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useModelSelection, type Filters } from './ModelSelectionContext';
import { BODY_STYLES, bodyYears, yearOptions } from '../lib/body-styles';
import { bodyImage } from '../lib/model-images';

// Linia podłogi (dół opon) jako ułamek wysokości zdjęcia — do odbicia na podłodze studia.
const FLOOR: Record<string, number> = { 'tahoe-4d': 0.76, 'tahoe-2d': 0.76, suburban: 0.76, yukon: 0.76, 'ck-reg': 0.82, 'ck-ext': 0.795, k1500: 0.755, sierra: 0.728, dually: 0.733 };
// Zdjęcia 3:2 w ramce 16:9 (object-cover) tracą ~8% góry i dołu.
const floorPercent = (id: string) => `${((((FLOOR[id] ?? 0.75) - 0.0809) / 0.8382) * 100).toFixed(1)}%`;

const ENGINES = [
  { value: '4.3', label: '4.3 V6' },
  { value: '5.0', label: '5.0 V8' },
  { value: '5.7', label: '5.7 V8' },
  { value: '7.4', label: '7.4 V8' },
  { value: '6.2', label: '6.2 diesel' },
  { value: '6.5', label: '6.5 diesel' },
];

const selectClass = 'min-h-12 w-full rounded-lg border border-white/15 bg-neutral-900 px-2 text-base text-white focus:border-silver-500 focus:outline-none focus:ring-2 focus:ring-silver-600/40';

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
    <section className="mx-auto w-full max-w-3xl px-4 pt-2 pb-2" aria-label="Wybór modelu">
      <div className="mb-3">
        <h2 className="text-xl font-bold text-white">Wybierz model</h2>
        <p className="text-xs text-neutral-400">Przesuń lub użyj strzałek — wybór zawęża usterki, DIY i kody do Twojego nadwozia.</p>
      </div>

      <div
        className="relative overflow-hidden rounded-3xl border border-white/20 bg-neutral-950 shadow-2xl"
        role="group"
        aria-roledescription="karuzela"
        aria-label={`Model ${index + 1} z ${BODY_STYLES.length}: ${body.name}`}
        data-testid="model-carousel"
        style={{ touchAction: 'pan-y' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={() => { touchStart.current = null; }}
        onKeyDown={handleKey}
      >
        <div className="studio relative aspect-[16/9] w-full" style={{ ['--floor' as string]: floorPercent(body.id) }}>
          {!imageLoaded && <div aria-hidden="true" className="absolute inset-0 animate-pulse bg-neutral-800" />}
          <div className="studio-reflection studio-slide" aria-hidden="true" key={`r-${body.image}`}>
            <Image src={bodyImage(body)} alt="" fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" />
          </div>
          <Image
            key={body.image}
            onLoad={() => setImageLoaded(true)}
            src={bodyImage(body)}
            alt={`${body.name} (${bodyYears(body)})`}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="studio-slide object-cover"
            priority={index === 0}
          />

          <div
            className="absolute left-3 top-3 z-10 rounded-full border border-white/25 bg-black/55 px-3 py-1 text-sm font-semibold text-white backdrop-blur"
            data-testid="year-badge"
            aria-live="polite"
          >
            {badge}
          </div>

          <button type="button" onClick={prev} className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/70 text-2xl text-white backdrop-blur hover:bg-black/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-silver-500" aria-label="Poprzedni model">‹</button>
          <button type="button" onClick={next} className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/70 text-2xl text-white backdrop-blur hover:bg-black/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-silver-500" aria-label="Następny model">›</button>

          <div className="absolute inset-x-0 bottom-0 z-10 flex justify-center">
            {BODY_STYLES.map((b, i) => (
              <button
                key={b.id}
                type="button"
                onClick={() => go(i)}
                className="flex h-9 w-6 items-center justify-center"
                aria-label={b.name}
                aria-current={i === index ? 'true' : undefined}
              >
                <span className={`block h-1.5 rounded-full transition-all ${i === index ? 'w-5 bg-white' : 'w-1.5 bg-white/40'}`} />
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 bg-neutral-950 px-3 py-3 text-center text-white">
          <h3 className="truncate text-xl font-bold sm:text-2xl">{body.name}</h3>
          <p className="text-sm text-neutral-300">
            {filters.year ? filters.year : bodyYears(body)}
            {filters.engine ? ` · ${ENGINES.find(e => e.value === filters.engine)?.label ?? filters.engine}` : ''}
            {filters.drivetrain ? ` · ${filters.drivetrain.toUpperCase()}` : ''}
          </p>
          {body.note && <p className="mt-0.5 text-xs text-neutral-400">{body.note}</p>}
          {body.credit && (
            <p className="mt-1 text-[11px] leading-snug text-neutral-500" data-testid="photo-credit">
              Zdjęcie: {body.credit.author}, {body.credit.licenseUrl ? <a href={body.credit.licenseUrl} target="_blank" rel="noopener noreferrer" className="underline">{body.credit.license}</a> : body.credit.license}, <a href={body.credit.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline">Wikimedia Commons</a> ({body.credit.changes})
            </p>
          )}
        </div>
      </div>

      <Link
        href={`/modele/${body.id}`}
        className="mt-1 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-center border border-silver-600/50 bg-silver-600/10 text-sm font-semibold text-white hover:bg-silver-600/25"
      >
        Strona modelu: {body.name} — lata, silniki, usterki, DIY <span aria-hidden="true" className="text-silver-300">→</span>
      </Link>

      <button
        type="button"
        onClick={() => setShowFilters(!showFilters)}
        aria-expanded={showFilters}
        className="mt-3 min-h-12 w-full rounded-lg border border-white/15 bg-neutral-900 text-sm font-medium text-white hover:border-silver-600/60"
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
              className="min-h-11 w-full rounded-lg border border-silver-600/40 bg-silver-950/40 text-sm text-silver-300"
            >
              Wyczyść doprecyzowanie
            </button>
          )}
        </div>
      )}
    </section>
  );
}
