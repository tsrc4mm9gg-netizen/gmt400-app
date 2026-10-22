'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const popularLinks = [
  { href: '/kody-obd/p0300', label: 'Kod P0300' },
  { href: '/szukaj?q=4L60E', label: '4L60E' },
  { href: '/kody-obd', label: 'Wszystkie kody OBD' },
  { href: '/szukaj', label: 'Szukaj materiałów' },
  { href: '/baza', label: 'Baza wiedzy' },
];

export default function HomeHero() {
  const pathname = usePathname();

  if (pathname !== '/') return null;

  return (
    <section aria-labelledby="home-hero-title" className="relative overflow-hidden border-b border-amber-400/20 bg-gradient-to-b from-neutral-950 via-black to-black">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/70 to-transparent" />
      <div className="mx-auto max-w-6xl px-4 pb-10 pt-24">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
          Chevrolet C/K · Tahoe · Suburban · GMC
        </p>
        <h1 id="home-hero-title" className="mt-3 text-5xl font-bold tracking-wide text-white sm:text-6xl">
          GMT<span className="text-amber-400">400</span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-neutral-300">
          Encyklopedia wiedzy dla właścicieli pojazdów GMT400 z lat 1988–2000: kody OBD, usterki,
          porady serwisowe i narzędzia diagnostyczne.
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Link href="/kody-obd" className="inline-flex min-h-11 items-center rounded-md bg-amber-400 px-5 py-3 font-semibold text-black underline-offset-4 transition hover:bg-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400">Kody OBD</Link>
          <Link href="/szukaj" className="inline-flex min-h-11 items-center rounded-md border border-amber-400 px-5 py-3 font-semibold text-amber-400 underline-offset-4 transition hover:bg-amber-400 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400">Szukaj</Link>
          <Link href="/baza" className="inline-flex min-h-11 items-center rounded-md border border-white/20 px-5 py-3 font-semibold text-neutral-100 underline-offset-4 transition hover:border-amber-400 hover:text-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400">Baza wiedzy</Link>
        </div>

        <div className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-400">Popularne</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {popularLinks.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="inline-flex min-h-11 items-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-neutral-200 underline-offset-4 transition hover:border-amber-400 hover:text-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400">{label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
