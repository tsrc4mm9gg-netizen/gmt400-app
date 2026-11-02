import Link from 'next/link';

const ITEMS = [
  { title: 'Przed zakupem', desc: 'Lista kontrolna: rdza, rama, skrzynia', href: '/poradnik-kupujacego' },
  { title: 'Bezpieczeństwo DIY', desc: 'Podstawowe zasady przed naprawą', href: '/diy' },
  { title: 'Homologacja', desc: 'Badanie techniczne i dokumenty', href: '/dla-wlasciciela/homologacja' },
  { title: 'Przeglądy', desc: 'Interwały i typowe usterki', href: '/dla-wlasciciela/przeglady' },
];

export default function HomeSafety() {
  return (
    <section aria-labelledby="home-safety-title" className="px-4 pt-6">
      <h2 id="home-safety-title" className="text-xl font-bold text-white">Bezpieczeństwo i serwis</h2>
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
