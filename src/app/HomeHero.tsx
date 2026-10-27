'use client';

import ModelHero from './ModelHero';
import CategoryGrid from './CategoryGrid';
import HomeSearch from './HomeSearch';
import HomeStart from './HomeStart';
import HomeIntro from './HomeIntro';
import HomeQuickLinks from './HomeQuickLinks';
import OwnerEssentials from './OwnerEssentials';
import HomeProblems from './HomeProblems';
import { useModelSelection } from './ModelSelectionContext';
import { findBody } from '../lib/body-styles';

export default function HomeHero() {
  const { bodyId, filters, clearSelection, setSelection } = useModelSelection();
  const body = findBody(bodyId);

  return (
    <div className="mx-auto w-full max-w-3xl">
      <HomeIntro />
      <ModelHero />
      {body && (
        <div data-testid="active-filters" role="region" aria-label="Aktywne filtry" className="mx-4 mb-3 rounded-lg border border-silver-600/30 bg-silver-950/30 px-3 py-2 text-sm text-neutral-300">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-neutral-400">Filtr:</span>
            <span className="inline-flex min-h-9 items-center rounded-full bg-silver-600 px-3 font-semibold text-neutral-950">{body.name}</span>
            {(['year', 'engine', 'drivetrain'] as const).map(key => filters[key] && (
              <button
                key={key}
                type="button"
                onClick={() => setSelection({ bodyId, filters: { ...filters, [key]: undefined } })}
                aria-label={`Usuń filtr ${key === 'year' ? 'rocznik' : key === 'engine' ? 'silnik' : 'napęd'}: ${filters[key]}`}
                className="inline-flex min-h-9 items-center gap-1 rounded-full border border-white/20 bg-white/5 px-3 text-white hover:border-silver-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-silver-500"
              >
                {key === 'drivetrain' ? filters[key]!.toUpperCase() : filters[key]} <span aria-hidden="true" className="text-silver-300">×</span>
              </button>
            ))}
            <button type="button" onClick={clearSelection} className="ml-auto inline-flex min-h-11 items-center px-2 text-sm font-semibold text-silver-300 underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-silver-500">Wyczyść</button>
          </div>
        </div>
      )}
      <HomeQuickLinks />
      <div className="pt-4"><HomeStart /></div>
      <OwnerEssentials />
      <HomeProblems />
      <div className="pt-1"><HomeSearch /></div>
      <CategoryGrid />
    </div>
  );
}
