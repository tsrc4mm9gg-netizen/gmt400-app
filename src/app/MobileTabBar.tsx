'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CategoryIcon, type CategoryIconName } from './ui/CategoryIcon';
import { useStoredVehicleProfile } from '@/lib/vehicle-profile-store';
import { vehicleProfileShort } from '@/lib/vehicle-profile';

/** Dolny pasek nawigacji tylko na telefonie (< md). „Moje auto” prowadzi do istniejącego profilu/wyboru auta (/moj-samochod). */
const TABS: { href: string; label: string; icon: CategoryIconName; match: (p: string) => boolean }[] = [
  { href: '/', label: 'Start', icon: 'home', match: p => p === '/' },
  { href: '/szukaj', label: 'Szukaj', icon: 'search', match: p => p.startsWith('/szukaj') },
  { href: '/moj-samochod', label: 'Moje auto', icon: 'car', match: p => p.startsWith('/moj-samochod') },
  { href: '/usterki', label: 'Usterki', icon: 'usterki', match: p => p.startsWith('/usterki') || p.startsWith('/diagnoza') },
  { href: '/diy', label: 'DIY', icon: 'diy', match: p => p.startsWith('/diy') },
];

export default function MobileTabBar() {
  const pathname = usePathname() || '/';
  const profile = useStoredVehicleProfile();
  const shortLabel = vehicleProfileShort(profile);
  const saved = !!profile && !!shortLabel;
  return (
    <nav
      aria-label="Dolny pasek nawigacji"
      data-testid="mobile-tabbar"
      className="mobile-tabbar fixed inset-x-0 bottom-0 z-[95] border-t border-white/10 bg-[linear-gradient(180deg,rgba(28,28,31,0.97),rgba(6,6,7,0.98))] backdrop-blur-md md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <ul className="mx-auto grid max-w-lg grid-cols-5">
        {TABS.map(tab => {
          const active = tab.match(pathname);
          const carSaved = tab.icon === 'car' && saved;
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                data-testid={`tab-${tab.href === '/' ? 'start' : tab.href.slice(1)}`}
                aria-current={active ? 'page' : undefined}
                aria-label={carSaved ? `Moje auto: ${shortLabel} (zapisane)` : undefined}
                data-saved={tab.icon === 'car' ? (saved ? 'true' : 'false') : undefined}
                className={`relative flex h-16 min-w-11 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold leading-tight transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-silver-500 ${active ? 'text-white' : carSaved ? 'text-silver-200 hover:text-white' : 'text-neutral-400 hover:text-silver-200'}`}
              >
                <span aria-hidden="true" className={`relative inline-flex h-8 w-12 items-center justify-center rounded-full transition ${active ? 'bg-[linear-gradient(180deg,#3a3a40,#1c1c1f)] ring-1 ring-silver-400/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]' : carSaved ? 'ring-1 ring-silver-500/40' : ''}`}>
                  <CategoryIcon name={tab.icon} className="h-[22px] w-[22px]" />
                  {carSaved ? <span data-testid="tab-car-dot" className="absolute right-2 top-1 h-2 w-2 rounded-full bg-silver-200 ring-2 ring-neutral-900" /> : null}
                </span>
                <span>{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
