import Link from 'next/link';
import { IconTile } from './ui/CategoryIcon';

const ITEMS = [
  { icon: 'gear' as const, title: '4L60-E', desc: 'Najczęstsza skrzynia', href: '/diagnoza?objaw=skrzynia' },
  { icon: 'key' as const, title: '6.5 TD', desc: 'Diesel — PMD, pompa', href: '/diagnoza?objaw=nie-odpala&silnik=diesel' },
  { icon: 'wave' as const, title: 'Vortec 5.7', desc: 'Uszczelki, CSFI', href: '/diagnoza?objaw=szarpie-gasnie' },
  { icon: 'brake' as const, title: 'ABS / hamulce', desc: 'Czujniki, moduł', href: '/diagnoza?objaw=hamulce' },
  { icon: 'lpg' as const, title: 'LPG', desc: 'Instalacja w GMT400', href: '/dla-wlasciciela/lpg' },
  { icon: 'import' as const, title: 'Import z USA', desc: 'Cło, VAT, akcyza', href: '/dla-wlasciciela/import' },
];

export default function HomePopular() {
  return (
    <section aria-labelledby="home-popular-title" className="px-4 pt-6">
      <h2 id="home-popular-title" className="text-xl font-bold text-white">Najczęściej szukane</h2>
      <ul className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {ITEMS.map(item => (
          <li key={item.title}>
            <Link href={item.href} className="flex h-full flex-col rounded-2xl border border-white/15 bg-neutral-900 p-3 transition hover:border-silver-500">
              <IconTile name={item.icon} className="!h-9 !w-9" />
              <span className="mt-2 text-sm font-bold text-white">{item.title}</span>
              <span className="mt-0.5 text-[11px] text-neutral-300">{item.desc}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
