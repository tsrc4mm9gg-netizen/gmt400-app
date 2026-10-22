'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useModelSelection } from './ModelSelectionContext';

type BodyStyle = {
  id: string;
  name: string;
  image: string;
  years: string;
};

const BODY_STYLES: BodyStyle[] = [
  { id: 'tahoe-4d', name: 'Tahoe 4-drzwi', image: '/tahoe-4d-green.jpg', years: '1995–2000' },
  { id: 'tahoe-2d', name: 'Tahoe / Blazer 2-drzwi', image: '/tahoe-2d-red.jpg', years: '1992–1999' },
  { id: 'suburban', name: 'Suburban', image: '/suburban-beige.jpg', years: '1992–1999' },
  { id: 'yukon', name: 'GMC Yukon', image: '/yukon-white.jpg', years: '1992–2000' },
  { id: 'ck-reg', name: 'C/K Regular Cab', image: '/ck-reg.jpg', years: '1988–1998' },
  { id: 'ck-ext', name: 'C/K Extended Cab', image: '/ck-ext.jpg', years: '1988–1998' },
  { id: 'k1500', name: 'K1500 4x4', image: '/k1500-black.jpg', years: '1988–1998' },
  { id: 'sierra', name: 'GMC Sierra', image: '/sierra-burgundy.jpg', years: '1988–1998' },
  { id: 'dually', name: 'C/K 3500 Dually', image: '/ck-3500-dually.jpg', years: '1988–2002' },
];

type Filters = {
  year?: string;
  engine?: string;
  drivetrain?: string;
};

export default function ModelHero() {
  const { setSelection } = useModelSelection();
  const [index, setIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [filters, setFilters] = useState<Filters>({});
  const [showFilters, setShowFilters] = useState(false);

  const body = BODY_STYLES[index];
  const displayYear = filters.year || body.years.split('–')[0];

  const emit = (bodyId: string | null, f: Filters) => {
    setSelection({ bodyId, filters: f });
  };

  const next = () => {
    const nextIndex = (index + 1) % BODY_STYLES.length;
    setIndex(nextIndex);
    setFilters({});
    setShowFilters(false);
    emit(BODY_STYLES[nextIndex].id, {});
  };

  const prev = () => {
    const prevIndex = (index - 1 + BODY_STYLES.length) % BODY_STYLES.length;
    setIndex(prevIndex);
    setFilters({});
    setShowFilters(false);
    emit(BODY_STYLES[prevIndex].id, {});
  };

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart - e.changedTouches[0].clientX;
    if (diff > 50) next();
    if (diff < -50) prev();
  };

  const updateFilter = (key: keyof Filters, value: string) => {
    const nextFilters = { ...filters, [key]: value || undefined };
    setFilters(nextFilters);
    emit(body.id, nextFilters);
  };

  return (
    <section className="px-4 pt-6 pb-2">
      <div className="mb-4 text-center">
        <h1 className="text-4xl font-bold tracking-wider text-white">
          GMT<span className="text-red-600">400</span>
        </h1>
        <p className="mt-1 text-xs uppercase tracking-[0.25em] text-neutral-400">Encyklopedia</p>
      </div>

      <div
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 shadow-2xl"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="absolute left-3 top-3 z-10 rounded bg-red-600 px-2 py-0.5 text-xs font-semibold text-white">
          {displayYear}
        </div>

        <div className="relative aspect-[16/9] w-full">
          <Image src={body.image} alt={body.name} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h2 className="text-xl font-bold">{body.name}</h2>
          <p className="text-sm text-neutral-300">
            {filters.year ? filters.year : body.years}
            {filters.engine ? ` · ${filters.engine}` : ''}
            {filters.drivetrain ? ` · ${filters.drivetrain.toUpperCase()}` : ''}
          </p>
        </div>

        <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white" aria-label="Poprzedni">‹</button>
        <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white" aria-label="Następny">›</button>
      </div>

      <div className="mt-3 flex justify-center gap-1.5">
        {BODY_STYLES.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setIndex(i);
              setFilters({});
              setShowFilters(false);
              emit(BODY_STYLES[i].id, {});
            }}
            className={`h-1.5 rounded-full transition-all ${i === index ? 'w-6 bg-red-600' : 'w-1.5 bg-white/30'}`}
            aria-label={`Model ${i + 1}`}
          />
        ))}
      </div>

      <button
        onClick={() => setShowFilters(!showFilters)}
        className="mt-4 w-full rounded-lg border border-white/15 bg-neutral-900 py-2.5 text-sm font-medium text-white"
      >
        {showFilters ? 'Ukryj doprecyzowanie' : 'Doprecyzuj: rocznik, silnik, napęd'}
      </button>

      {showFilters && (
        <div className="mt-3 grid grid-cols-3 gap-2">
          <select
            value={filters.year || ''}
            onChange={(e) => updateFilter('year', e.target.value)}
            className="rounded-md border border-white/15 bg-neutral-900 px-2 py-2 text-sm text-white"
          >
            <option value="">Rocznik</option>
            {['1988','1989','1990','1991','1992','1993','1994','1995','1996','1997','1998','1999','2000'].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <select
            value={filters.engine || ''}
            onChange={(e) => updateFilter('engine', e.target.value)}
            className="rounded-md border border-white/15 bg-neutral-900 px-2 py-2 text-sm text-white"
          >
            <option value="">Silnik</option>
            <option value="4.3">4.3L</option>
            <option value="5.0">5.0L</option>
            <option value="5.7">5.7L</option>
            <option value="6.5">6.5L diesel</option>
            <option value="7.4">7.4L</option>
          </select>
          <select
            value={filters.drivetrain || ''}
            onChange={(e) => updateFilter('drivetrain', e.target.value)}
            className="rounded-md border border-white/15 bg-neutral-900 px-2 py-2 text-sm text-white"
          >
            <option value="">Napęd</option>
            <option value="2wd">2WD</option>
            <option value="4wd">4WD</option>
          </select>
        </div>
      )}
    </section>
  );
}
