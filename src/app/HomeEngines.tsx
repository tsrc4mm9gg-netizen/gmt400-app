import Link from 'next/link';

const ENGINES = [
  { name: '5.7 Vortec (L31)', years: '1996–2000', note: 'Najpopularniejszy benzynowy', href: '/diagnoza?objaw=szarpie-gasnie&silnik=benzyna' },
  { name: '6.5 TD (L65/L56)', years: '1994–2000', note: 'Diesel — PMD, pompa', href: '/diagnoza?objaw=nie-odpala&silnik=diesel' },
  { name: '7.4 Vortec (L29)', years: '1996–2000', note: 'Duży V8, głównie 2500/3500', href: '/baza' },
  { name: '5.0 / 5.7 TBI', years: '1988–1995', note: 'Starsze wtryski', href: '/baza' },
];

export default function HomeEngines() {
  return (
    <section aria-labelledby="home-engines-title" className="px-4 pt-6">
      <h2 id="home-engines-title" className="text-xl font-bold text-white">Popularne silniki</h2>
      <ul className="mt-3 space-y-2">
        {ENGINES.map(engine => (
          <li key={engine.name}>
            <Link href={engine.href} className="flex items-center justify-between rounded-2xl border border-white/15 bg-neutral-900 p-3 transition hover:border-silver-500">
              <div>
                <span className="block text-sm font-bold text-white">{engine.name}</span>
                <span className="block text-[11px] text-neutral-300">{engine.years} · {engine.note}</span>
              </div>
              <span aria-hidden="true" className="text-silver-400">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
