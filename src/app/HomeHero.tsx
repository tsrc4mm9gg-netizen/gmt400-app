'use client';

import ModelHero from './ModelHero';
import CategoryGrid from './CategoryGrid';
import HomeSearch from './HomeSearch';
import HomeStart from './HomeStart';
import HomeIntro from './HomeIntro';
import HomeQuickLinks from './HomeQuickLinks';
import HomeBuyerGuide from './HomeBuyerGuide';
import OwnerEssentials from './OwnerEssentials';
import HomeProblems from './HomeProblems';
import { useModelSelection } from './ModelSelectionContext';
import { findBody } from '../lib/body-styles';
import RecentlyViewed from './RecentlyViewed';
import HomeTorque from './HomeTorque';
import HomeFAQ from './HomeFAQ';
import SymptomSearch from './SymptomSearch';
import AffiliateBox from './ui/AffiliateBox';

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
      <HomeBuyerGuide />
      <SymptomSearch className="pb-1" />
      <RecentlyViewed />
      <div className="pt-4"><HomeStart /></div>
      <OwnerEssentials />
      <HomeProblems />
      <HomeTorque />
      <div className="pt-1"><HomeSearch /></div>
      <HomeFAQ />
      <CategoryGrid />
      <div className="mx-4">
        <AffiliateBox
          title="Popularne części i narzędzia"
          items={[
            { name: 'ACDelco PF52 — filtr oleju', search: 'ACDelco PF52' },
            { name: 'Skaner OBD2', search: 'OBD2 scanner' },
            { name: 'Klucz dynamometryczny', search: 'torque wrench' },
            { name: 'MANNOL Dexron III ATF', search: 'MANNOL Dexron III ATF' },
          ]}
        />
      </div>
      <div className="mx-4 my-6 rounded-xl border border-silver-500/40 bg-silver-950/40 px-4 py-4 text-center">
        <p className="text-sm text-neutral-300">
          Podoba Ci się GMT400.pl?
        </p>
        <a
          href="https://www.buymeacoffee.com/gmt400"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-2 rounded-full border border-silver-500/50 bg-silver-900/50 px-4 py-2 text-sm font-semibold text-silver-200 transition hover:border-silver-400 hover:bg-silver-800/60 hover:text-white"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" /></svg>
          Postaw kawę
        </a>
        <p className="mt-2 text-xs text-neutral-500">Pomaga utrzymać stronę</p>
      </div>
    </div>
  );
}
