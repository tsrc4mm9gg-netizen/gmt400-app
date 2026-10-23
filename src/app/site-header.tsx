'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStoredVehicleProfile } from '@/lib/vehicle-profile-store';
import { vehicleProfileShort } from '@/lib/vehicle-profile';

const links = [
  { href: '/', label: 'Strona główna' },
  { href: '/modele', label: 'Modele' },
  { href: '/baza', label: 'Baza wiedzy' },
  { href: '/kody-obd', label: 'Kody OBD' },
  { href: '/schematy', label: 'Schematy' },
  { href: '/moj-samochod', label: 'Mój samochód' },
];

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Mała plakietka z zapisanym autem (tylko po hydratacji — serwer renderuje pustą). */
function CarBadge({ active }: { active: boolean }) {
  const profile = useStoredVehicleProfile();
  const short = vehicleProfileShort(profile);
  if (!profile || !short) return null;
  return (
    <Link
      href="/moj-samochod"
      data-testid="header-car-badge"
      aria-label={`Mój samochód: ${profile.brand} ${profile.model}${profile.year ? ' ' + profile.year : ''}`}
      aria-current={active ? 'page' : undefined}
      className="inline-flex min-h-11 max-w-[10.5rem] min-w-0 items-center gap-2 rounded-full border border-red-600/60 bg-red-950/40 px-3 text-sm font-semibold text-red-100 transition hover:border-red-500 hover:bg-red-900/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500 sm:max-w-[16rem] md:order-2"
    >
      <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.9)]" />
      <span className="truncate">{short}</span>
    </Link>
  );
}

export default function SiteHeader() {
  const pathname = usePathname();

  const search = (
    <Link
      href="/szukaj"
      aria-current={isActive(pathname, '/szukaj') ? 'page' : undefined}
      className="inline-flex min-h-11 min-w-11 shrink-0 items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-base font-bold text-white shadow-lg shadow-red-600/40 ring-1 ring-red-400/40 transition hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500 sm:px-6"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
      Szukaj
    </Link>
  );

  return (
    <header className="border-b border-white/10 bg-black/95 text-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-3 gap-y-1 px-4 py-2 md:flex-nowrap md:py-3">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded text-lg font-bold text-red-500 underline-offset-4 transition-colors hover:text-red-400 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500"
        >
          GMT400
        </Link>
        <CarBadge active={isActive(pathname, '/moj-samochod')} />
        <div className="md:order-3">{search}</div>

        <nav aria-label="Nawigacja główna" className="-mx-4 w-[calc(100%+2rem)] overflow-x-auto px-2 md:mx-0 md:w-auto md:flex-1 md:overflow-visible md:px-0">
          <ul className="flex items-center gap-x-1 whitespace-nowrap text-sm md:justify-end md:gap-x-2">
            {links.map(({ href, label }) => {
              const active = isActive(pathname, href);

              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? 'page' : undefined}
                    className={`inline-flex min-h-11 items-center rounded px-2 underline-offset-4 transition-colors hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500 ${
                      active ? 'font-semibold text-red-400' : 'text-neutral-200 hover:text-red-300'
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
