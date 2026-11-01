import Link from 'next/link';
import { IconTile } from './ui/CategoryIcon';

const ITEMS = [
  { icon: 'lpg' as const, title: 'LPG', desc: 'Instalacja, zbiornik, koszty', href: '/dla-wlasciciela/lpg' },
  { icon: 'import' as const, title: 'Import z USA', desc: 'Cło, VAT, akcyza', href: '/dla-wlasciciela/import' },
  { icon: 'lights' as const, title: 'Światła EU', desc: 'Przeróbka na europejskie', href: '/dla-wlasciciela/swiatla-eu' },
  { icon: 'plate' as const, title: 'Żółte tablice', desc: 'Kryteria i procedura', href: '/dla-wlasciciela/zolte-tablice' },
];

export default function HomeOwner() {
  return (
    <section aria-labelledby="home-owner-title" className="px-4 pt-6">
      <h2 id="home-owner-title" className="text-xl font-bold text-white">Dla właściciela w Polsce</h2>
      <ul className="mt-3 grid grid-cols-2 gap-2.5">
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
      <Link href="/dla-wlasciciela" className="mt-3 flex min-h-11 items-center justify-center rounded-lg border border-silver-600/50 text-sm font-semibold text-silver-300 hover:bg-silver-950/40">
        Wszystkie poradniki PL →
      </Link>
    </section>
  );
}
