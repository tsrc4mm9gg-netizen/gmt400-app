import Link from 'next/link';

const links = [
  { href: '/', label: 'Strona główna' },
  { href: '/baza', label: 'Baza wiedzy' },
  { href: '/kody-obd', label: 'Kody OBD' },
  { href: '/szukaj', label: 'Szukaj' },
];

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-black text-neutral-300">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <nav aria-label="Nawigacja w stopce">
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="rounded text-amber-400 underline-offset-4 transition-colors hover:text-amber-300 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="mt-5 max-w-3xl text-xs leading-relaxed text-neutral-400">
          Materiały w serwisie mają charakter pomocniczy i nie zastępują dokumentacji serwisowej,
          instrukcji producenta ani diagnozy wykwalifikowanego mechanika.
        </p>
      </div>
    </footer>
  );
}
