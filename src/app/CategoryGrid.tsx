'use client';

import Link from 'next/link';

const CATEGORIES = [
  { href: '/baza?typ=Porada', icon: '🛠️', title: 'DIY', desc: 'Poradniki i instrukcje' },
  { href: '/baza?typ=Usterka', icon: '⚠️', title: 'Usterki', desc: 'Typowe problemy i naprawy' },
  { href: '/schematy', icon: '🔌', title: 'Schematy', desc: 'Instalacje i układy' },
  { href: '/kody-obd', icon: '📡', title: 'Kody OBD', desc: 'Diagnostyka i błędy' },
  { href: '/narzedzia', icon: '💧', title: 'Płyny', desc: 'Specyfikacje i wymiany' },
  { href: '/baza?typ=Model', icon: '🚚', title: 'Modele', desc: 'Warianty i lata produkcji' },
];

export default function CategoryGrid() {
  return (
    <section className="px-4 pb-24">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-neutral-500">Kategorie</h2>
      <div className="grid grid-cols-2 gap-3">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.href}
            href={cat.href}
            className="group rounded-xl border border-white/10 bg-neutral-900 p-4 transition hover:border-red-600/50 hover:bg-neutral-800"
          >
            <div className="mb-2 text-2xl">{cat.icon}</div>
            <div className="font-semibold text-white">{cat.title}</div>
            <div className="mt-1 text-xs text-neutral-400">{cat.desc}</div>
            <div className="mt-3 h-px w-8 bg-red-600 transition-all group-hover:w-12" />
          </Link>
        ))}
      </div>
    </section>
  );
}
