'use client';

import Link from 'next/link';
import ModelHero from './ModelHero';
import CategoryGrid from './CategoryGrid';
import HomeSearch from './HomeSearch';
import OwnerEssentials from './OwnerEssentials';
import { useModelSelection } from './ModelSelectionContext';
import { findBody } from '../lib/body-styles';

export default function HomeHero() {
  const { bodyId, filters, clearSelection, setSelection } = useModelSelection();
  const body = findBody(bodyId);

  return (
    <div className="mx-auto w-full max-w-3xl">
      <Link href="/vin" data-testid="home-vin-cta" className="mx-4 mb-3 mt-3 flex min-h-12 items-center justify-between gap-3 rounded-lg border border-red-600/50 bg-red-950/40 px-4 py-2 text-white transition hover:border-red-500 hover:bg-red-900/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500">
        <span className="min-w-0"><span className="block text-base font-bold">Sprawdź swój VIN</span><span className="block text-xs text-neutral-300">Rocznik, silnik, nadwozie i fabryka z 17 znaków — plus kody RPO</span></span>
        <span aria-hidden="true" className="shrink-0 text-xl text-red-400">›</span>
      </Link>
      <ModelHero />
      {body && (
        <div data-testid="active-filters" role="region" aria-label="Aktywne filtry" className="mx-4 mb-3 rounded-lg border border-red-600/30 bg-red-950/30 px-3 py-2 text-sm text-neutral-300">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-neutral-400">Filtr:</span>
            <span className="inline-flex min-h-9 items-center rounded-full bg-red-600 px-3 font-semibold text-white">{body.name}</span>
            {(['year', 'engine', 'drivetrain'] as const).map(key => filters[key] && (
              <button
                key={key}
                type="button"
                onClick={() => setSelection({ bodyId, filters: { ...filters, [key]: undefined } })}
                aria-label={`Usuń filtr ${key === 'year' ? 'rocznik' : key === 'engine' ? 'silnik' : 'napęd'}: ${filters[key]}`}
                className="inline-flex min-h-9 items-center gap-1 rounded-full border border-white/20 bg-white/5 px-3 text-white hover:border-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
              >
                {key === 'drivetrain' ? filters[key]!.toUpperCase() : filters[key]} <span aria-hidden="true" className="text-red-300">×</span>
              </button>
            ))}
            <button type="button" onClick={clearSelection} className="ml-auto inline-flex min-h-11 items-center px-2 text-sm font-semibold text-red-300 underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500">Wyczyść</button>
          </div>
        </div>
      )}
      <HomeSearch />
      <OwnerEssentials />
      <CategoryGrid />
    </div>
  );
}
