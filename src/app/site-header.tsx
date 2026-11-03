'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStoredVehicleProfile } from '@/lib/vehicle-profile-store';
import { vehicleProfileShort } from '@/lib/vehicle-profile';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';

// Nakładka ładowana dopiero przy pierwszym użyciu (nagłówek jest na każdej stronie).
const loadOverlay = () => import('./SearchOverlay');
const SearchOverlay = dynamic(loadOverlay, { ssr: false });
const prefetchSearch = () => { void loadOverlay().then(m => m.prefetchSearchIndex()).catch(() => {}); };

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

/** Stały dostęp do profilu auta: z zapisanym autem — plakietka z nazwą, bez profilu — przycisk „Dodaj auto”. Zawsze ≥ 44 px. */
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

  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const proxyRef = useRef<HTMLInputElement>(null);
  const openSearch = useCallback(() => {
    // iOS otwiera klawiaturę tylko przy fokusie w tym samym geście — najpierw pole-zastępca, potem pole w nakładce.
    proxyRef.current?.focus({ preventScroll: true });
    prefetchSearch();
    setOpen(true);
  }, []);
  const closeSearch = useCallback(() => { setOpen(false); requestAnimationFrame(() => triggerRef.current?.focus({ preventScroll: true })); }, []);
  // Zmiana strony zamyka wyszukiwarkę.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) { setLastPath(pathname); setOpen(false); }
  // Skrót klawiaturowy „/” (poza polami tekstowymi).
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return;
      event.preventDefault();
      openSearch();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [openSearch]);

  const search = (
    <>
      <button
        ref={triggerRef}
        type="button"
        data-testid="header-search"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Szukaj kodu, objawu, części lub strony"
        onClick={openSearch}
        onPointerDown={prefetchSearch}
        onMouseEnter={prefetchSearch}
        onFocus={prefetchSearch}
        className="flex min-h-11 w-full min-w-11 items-center gap-2 rounded-xl border border-silver-500/60 bg-neutral-900 px-3 text-left text-sm text-neutral-300 shadow-inner transition hover:border-silver-400 hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-silver-500 lg:w-11 lg:justify-center lg:px-0 xl:w-auto xl:px-3"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-silver-300" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
        <span className="min-w-0 truncate lg:hidden">Szukaj kodu, objawu…</span>
        {/* Od 1280 px krótki napis — pełne pole razem z plakietką auta i menu nie mieści się w jednym rzędzie (nagłówek ma stałą szerokość). */}
        <span aria-hidden="true" className="hidden xl:inline">Szukaj</span>
      </button>
      <input ref={proxyRef} type="text" tabIndex={-1} aria-hidden="true" data-search-focus-proxy="" className="pointer-events-none fixed left-0 top-0 h-px w-px opacity-0" style={{ fontSize: 16 }} readOnly={false} />
      {open && <SearchOverlay onClose={closeSearch} />}
    </>
  );

  return (
    <header data-testid="site-header" className="contents lg:sticky lg:top-0 lg:z-40 lg:block lg:border-b lg:border-white/10 lg:bg-black/95 lg:backdrop-blur-md">
      <div className="contents lg:mx-auto lg:flex lg:max-w-7xl lg:flex-nowrap lg:items-center lg:justify-between lg:gap-x-3 lg:px-4 lg:py-3">
        {/* Na telefonie (< md) „Strona główna” i „Mój samochód” są w dolnym pasku, więc nie dublujemy ich w rzędzie menu. Mobile/tablet: górny pasek (logo, auto, szukaj) jest „przyklejony”, a rząd z menu przewija się razem ze stroną. Od lg całość to jeden przyklejony pasek. */}
        <div data-testid="site-header-bar" className="sticky top-0 z-40 flex items-center justify-between gap-x-2 border-b border-white/10 bg-black/95 px-4 py-1 text-white backdrop-blur-md lg:contents">
          <Link
            href="/"
            className="inline-flex min-h-11 shrink-0 items-center rounded text-lg font-bold text-silver-500 underline-offset-4 transition-colors hover:text-silver-400 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-silver-500"
          >
            GMT400
          </Link>
          <CarBadge active={isActive(pathname, '/moj-samochod')} />
          <div className="min-w-0 flex-1 lg:order-3 lg:flex-none">{search}</div>
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
                    className={`inline-flex min-h-11 items-center rounded-full px-3 underline-offset-4 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-silver-500 ${
                      active
                          ? 'bg-silver-600/20 font-semibold text-silver-200 ring-1 ring-silver-500/50'
                          : 'text-neutral-200 hover:bg-white/5 hover:text-silver-300'
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
  );
}
