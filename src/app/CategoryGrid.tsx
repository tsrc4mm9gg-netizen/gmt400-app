import Link from 'next/link';

const CATEGORIES = [
  { href: '/modele', icon: '🚚', title: 'Modele', desc: 'Warianty i roczniki' },
  { href: '/kody-obd', icon: '📡', title: 'Kody OBD', desc: 'OBD-I 88–95 / OBD-II 96+' },
  { href: '/schematy', icon: '🔌', title: 'Schematy', desc: 'Złącza i układy' },
  { href: '/narzedzia', icon: '🔧', title: 'Narzędzia', desc: 'RPO, VIN, kalkulatory' },
];

export default function CategoryGrid() {
  return (
    <section className="relative z-10 px-4 pb-10" aria-labelledby="categories-title">
      <h2 id="categories-title" className="mb-3 text-xs font-semibold uppercase tracking-widest text-neutral-400">Więcej</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.href}
            href={cat.href}
            className="group relative z-10 block min-h-28 rounded-xl border border-white/10 bg-neutral-900 p-4 transition hover:border-silver-600/50 hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-silver-500"
          >
            <div className="mb-2 text-2xl" aria-hidden="true">{cat.icon}</div>
            <div className="font-semibold text-white">{cat.title}</div>
            <div className="mt-1 text-xs text-neutral-400">{cat.desc}</div>
            <div className="mt-3 h-px w-8 bg-silver-600 transition-all group-hover:w-12" />
          </Link>
        ))}
      </div>
      <Link href="/baza" className="mt-4 flex min-h-12 items-center justify-center rounded-xl border border-silver-600/40 text-sm font-semibold text-silver-300 hover:bg-silver-950/30">
        Wszystkie sekcje bazy wiedzy →
      </Link>
    </section>
  );
}
