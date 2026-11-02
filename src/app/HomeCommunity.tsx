import Link from 'next/link';

const ITEMS = [
  { title: 'Najczęstsze usterki', desc: 'Objawy i co sprawdzić najpierw', href: '/usterki' },
  { title: 'Kody błędów', desc: 'OBD-I i OBD-II dla GMT400', href: '/kody-obd' },
  { title: 'Schematy elektryczne', desc: 'Bezpieczniki, masy, ALDL', href: '/schematy' },
  { title: 'Baza wiedzy', desc: 'Wszystkie wpisy w jednym miejscu', href: '/baza' },
];

export default function HomeCommunity() {
  return (
    <section aria-labelledby="home-community-title" className="px-4 pt-6">
      <h2 id="home-community-title" className="text-xl font-bold text-white">Baza i diagnostyka</h2>
      <ul className="mt-3 grid grid-cols-2 gap-2.5">
        {ITEMS.map(item => (
          <li key={item.title}>
            <Link href={item.href} className="flex h-full flex-col rounded-2xl border border-white/15 bg-neutral-900 p-3 transition hover:border-silver-500">
              <span className="text-sm font-bold text-white">{item.title}</span>
              <span className="mt-0.5 text-[11px] text-neutral-300">{item.desc}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
