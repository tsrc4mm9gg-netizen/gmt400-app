import Link from 'next/link';

const ITEMS = [
  { title: 'Płyny i momenty', desc: 'Oleje, ATF, chłodnica, momenty dokręcania', href: '/baza' },
  { title: 'Kody OBD', desc: 'P0300, P0171 i inne — co oznacza i co sprawdzić', href: '/kody-obd' },
  { title: 'Schematy', desc: 'ALDL, OBD-II, bezpieczniki, masy', href: '/schematy' },
  { title: 'Poradnik kupującego', desc: 'Lista kontrolna przed zakupem', href: '/poradnik-kupujacego' },
];

export default function HomeMaintenance() {
  return (
    <section aria-labelledby="home-maint-title" className="px-4 pt-6">
      <h2 id="home-maint-title" className="text-xl font-bold text-white">Serwis i dokumentacja</h2>
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
