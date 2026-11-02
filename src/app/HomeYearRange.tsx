import Link from 'next/link';

const RANGES = [
  { label: '1988–1995', desc: 'OBD-I, TBI, ALDL', href: '/modele' },
  { label: '1996–2000', desc: 'OBD-II, Vortec, 16-pin', href: '/modele' },
  { label: 'Diesel 6.5 TD', desc: '1994–2000', href: '/diagnoza?objaw=nie-odpala&silnik=diesel' },
  { label: 'Vortec 5.7 / 7.4', desc: '1996–2000', href: '/diagnoza?objaw=szarpie-gasnie' },
];

export default function HomeYearRange() {
  return (
    <section aria-labelledby="home-years-title" className="px-4 pt-6">
      <h2 id="home-years-title" className="text-xl font-bold text-white">Roczniki i systemy</h2>
      <ul className="mt-3 grid grid-cols-2 gap-2.5">
        {RANGES.map(range => (
          <li key={range.label}>
            <Link href={range.href} className="flex h-full flex-col rounded-2xl border border-white/15 bg-neutral-900 p-3 transition hover:border-silver-500">
              <span className="text-sm font-bold text-white">{range.label}</span>
              <span className="mt-0.5 text-[11px] text-neutral-300">{range.desc}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
