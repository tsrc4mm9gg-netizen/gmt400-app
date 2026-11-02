import Link from 'next/link';

const LINKS = [
  { label: 'Modele', href: '/modele' },
  { label: 'Usterki', href: '/usterki' },
  { label: 'DIY', href: '/diy' },
  { label: 'VIN', href: '/vin' },
  { label: 'Kody OBD', href: '/kody-obd' },
  { label: 'Schematy', href: '/schematy' },
  { label: 'Diagnoza', href: '/diagnoza' },
  { label: 'Dla właściciela', href: '/dla-wlasciciela' },
];

export default function HomeLinks() {
  return (
    <section aria-labelledby="home-links-title" className="px-4 pt-6">
      <h2 id="home-links-title" className="text-xl font-bold text-white">Wszystkie sekcje</h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {LINKS.map(link => (
          <li key={link.href}>
            <Link href={link.href} className="inline-flex min-h-10 items-center rounded-full border border-white/15 bg-neutral-900 px-4 text-sm font-semibold text-silver-300 transition hover:border-silver-500">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
