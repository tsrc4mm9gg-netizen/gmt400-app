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
          className="rounded font-semibold text-amber-400 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400"
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
                    className={`rounded px-2 py-1 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400 ${
                      active ? 'font-semibold text-amber-400' : 'text-neutral-200'
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
                className="inline-flex min-h-11 items-center rounded-md border border-amber-400 px-3 py-2 font-semibold text-amber-400 underline-offset-4 hover:bg-amber-400 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400"
              >
                Szukaj
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
