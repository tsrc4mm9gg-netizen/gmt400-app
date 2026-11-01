'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useStoredVehicleProfile } from '@/lib/vehicle-profile-store';
import { vehicleProfileShort } from '@/lib/vehicle-profile';
import GlobalSearch from './GlobalSearch';

const links = [
  { href: '/', label: 'Strona główna' },
  { href: '/vin', label: 'Sprawdź VIN' },
  { href: '/modele', label: 'Modele' },
  { href: '/dla-wlasciciela', label: 'Dla właściciela' },
  { href: '/baza', label: 'Baza wiedzy' },
  { href: '/kody-obd', label: 'Kody OBD' },
  { href: '/schematy', label: 'Schematy' },
  { href: '/moj-samochod', label: 'Mój samochód' },
];

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

function CarBadge({ active }: { active: boolean }) {
  const profile = useStoredVehicleProfile();
  const short = vehicleProfileShort(profile);
  const saved = !!profile && !!short;
  return (
    <Link
      href="/moj-samochod"
      data-testid="header-car-badge"
      data-state={saved ? 'saved' : 'empty'}
      aria-label={saved ? `Mój samochód: ${profile.brand} ${profile.model}${profile.year ? ' ' + profile.year : ''}` : 'Dodaj profil auta (filtr pojazdu)'}
      aria-current={active ? 'page' : undefined}
      className={`inline-flex min-h-12 min-w-12 max-w-[11rem] items-center lg:shrink-0 justify-center lg:max-w-[14rem] gap-2 rounded-full border-2 px-3 text-sm font-bold sm:px-4 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-silver-500 sm:max-w-[18rem] lg:order-2 ${saved ? 'border-silver-400 bg-silver-900/60 text-silver-50 hover:border-silver-300 hover:bg-silver-800/70' : 'border-silver-500/50 bg-neutral-900 text-silver-100 hover:border-silver-400 hover:bg-neutral-800'}`}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 16v-4l1.6-4.2A2 2 0 0 1 8.5 6.5h7a2 2 0 0 1 1.9 1.3L19 12v4M3.5 16h17M7 16v2M17 16v2" /><circle cx="8" cy="13.5" r=".6" /><circle cx="16" cy="13.5" r=".6" /></svg>
      <span className="min-w-0 truncate lg:hidden xl:inline">{saved ? short : 'Dodaj auto'}</span>
    </Link>
  );
}

export default function SiteHeader() {
  const pathname = usePathname();
  const [showSearch, setShowSearch] = useState(false);

  const search = (
    <button
      type="button"
      data-testid="header-search"
      onClick={() => setShowSearch(true)}
      className="inline-flex min-h-12 min-w-12 shrink-0 items-center gap-2 rounded-xl bg-silver-600 px-3 py-2 text-base font-bold text-neutral-950 shadow-lg shadow-silver-600/40 ring-1 ring-silver-400/40 transition hover:bg-silver-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-silver-500 sm:px-6 lg:px-4 xl:px-6"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
      Szukaj
    </button>
  );

  return (
    <>
      <header data-testid="site-header" className="contents lg:sticky lg:top-0 lg:z-40 lg:block lg:border-b lg:border-white/10 lg:bg-black/95 lg:backdrop-blur-md">
        <div className="contents lg:mx-auto lg:flex lg:max-w-7xl lg:flex-nowrap lg:items-center lg:justify-between lg:gap-x-3 lg:px-4 lg:py-3">
          <div data-testid="site-header-bar" className="sticky top-0 z-40 flex items-center justify-between gap-x-2 border-b border-white/10 bg-black/95 px-4 py-1 text-white backdrop-blur-md lg:contents">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center rounded text-lg font-bold text-silver-500 underline-offset-4 transition-colors hover:text-silver-400 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-silver-500"
            >
              GMT400
            </Link>
            <CarBadge active={isActive(pathname, '/moj-samochod')} />
            <div className="lg:order-3">{search}</div>
          </div>

          <nav aria-label="Nawigacja główna" className="w-full overflow-x-auto border-b border-white/10 bg-black/95 px-2 text-white lg:w-auto lg:flex-1 lg:overflow-visible lg:border-0 lg:bg-transparent lg:px-0">
            <ul className="flex items-center gap-x-1 whitespace-nowrap text-sm lg:justify-end lg:gap-x-1 xl:gap-x-2">
              {links.map(({ href, label }) => {
                const active = isActive(pathname, href);
                return (
                  <li key={href} className={href === '/' ? 'hidden md:block lg:hidden 2xl:block' : href === '/moj-samochod' ? 'hidden md:block' : undefined}>
                    <Link
                      href={href}
                      aria-current={active ? 'page' : undefined}
                      className={`inline-flex min-h-11 items-center rounded px-2 underline-offset-4 transition-colors hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-silver-500 ${
                        active ? 'font-semibold text-silver-400' : 'text-neutral-200 hover:text-silver-300'
                      }`}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </header>
      {showSearch && <GlobalSearch items={[]} onClose={() => setShowSearch(false)} />}
    </>
  );
}
