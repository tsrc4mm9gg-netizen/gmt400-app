'use client';

import { useState } from 'react';
import Link from 'next/link';
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

const QUICK_ACTIONS = [
  { href: '/diagnoza', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', label: 'Diagnoza', desc: 'Sprawdź objawy' },
  { href: '/diy', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z', label: 'DIY', desc: 'Naprawy krok po kroku' },
  { href: '/vin', icon: 'M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z', label: 'VIN', desc: 'Dekoder VIN' },
  { href: '/dla-wlasciciela', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', label: 'Poradniki', desc: 'LPG, import, światła' },
];

function AccordionSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mx-4 mb-2 rounded-xl border border-white/10 bg-neutral-900">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <span className="font-medium text-silver-200">{title}</span>
        <svg className={`h-5 w-5 text-neutral-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="border-t border-white/10 px-4 py-3">{children}</div>}
    </div>
  );
}

export default function HomeHero() {
  const { bodyId, filters, clearSelection, setSelection } = useModelSelection();
  const body = findBody(bodyId);

  return (
    <div className="mx-auto w-full max-w-3xl pb-28">
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

      <div className="mx-4 mb-4">
        <form action="/szukaj" method="get" className="relative">
          <svg className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            name="q"
            placeholder="Wpisz problem lub część..."
            className="w-full rounded-xl border border-white/10 bg-neutral-900 py-3 pl-10 pr-4 text-white placeholder-neutral-500 focus:border-silver-500 focus:outline-none"
          />
        </form>
      </div>

      <div className="mx-4 mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {QUICK_ACTIONS.map(action => (
          <Link
            key={action.href}
            href={action.href}
            className="flex flex-col items-center rounded-xl border border-white/10 bg-neutral-900 p-4 text-center hover:border-silver-500/50"
          >
            <svg className="mb-2 h-6 w-6 text-silver-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={action.icon} />
            </svg>
            <span className="font-medium text-silver-200">{action.label}</span>
            <span className="mt-1 text-xs text-neutral-400">{action.desc}</span>
          </Link>
        ))}
      </div>

      <RecentlyViewed />

      <AccordionSection title="Najczęstsze problemy">
        <HomeProblems />
      </AccordionSection>

      <AccordionSection title="Dane serwisowe">
        <HomeTorque />
        <HomeStart />
      </AccordionSection>

      <AccordionSection title="Poradniki PL">
        <OwnerEssentials />
        <HomeBuyerGuide />
      </AccordionSection>

      <AccordionSection title="Więcej">
        <CategoryGrid />
        <HomeQuickLinks />
        <HomeSearch />
        <HomeFAQ />
      </AccordionSection>

      <div className="mx-4 mt-4">
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

      <div className="mx-4 my-6 rounded-xl border border-amber-500/50 bg-amber-950/40 px-4 py-4 text-center">
        <p className="text-sm text-neutral-300">
          Podoba Ci się GMT400.pl?
        </p>
        <a
          href="https://www.buymeacoffee.com/gmt400"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-2 rounded-full border border-amber-500/60 bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-500 hover:border-amber-400"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" /></svg>
          Postaw kawę
        </a>
        <p className="mt-2 text-xs text-neutral-500">Pomaga utrzymać stronę</p>
      </div>
    </div>
  );
}
