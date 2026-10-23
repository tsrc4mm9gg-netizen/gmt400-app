'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Strona główna' },
  { href: '/baza', label: 'Baza wiedzy' },
  { href: '/kody-obd', label: 'Kody OBD' },
];

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="border-b border-white/10 bg-black/95 text-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link
          href="/"
          className="rounded text-lg font-bold text-red-500 underline-offset-4 transition-colors hover:text-red-400 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500"
        >
          GMT400
        </Link>

        <nav aria-label="Nawigacja główna">
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            {links.map(({ href, label }) => {
              const active = isActive(pathname, href);

              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? 'page' : undefined}
                    className={`rounded px-2 py-1 underline-offset-4 transition-colors hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500 ${
                      active ? 'font-semibold text-red-400' : 'text-neutral-200 hover:text-red-300'
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
            <li>
              <Link
                href="/szukaj"
                aria-current={isActive(pathname, '/szukaj') ? 'page' : undefined}
                className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-red-600 px-6 py-2 text-base font-bold text-white shadow-lg shadow-red-600/40 ring-1 ring-red-400/40 transition hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
                Szukaj
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
