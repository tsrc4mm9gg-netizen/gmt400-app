import Link from 'next/link';
import { IconTile } from './ui/CategoryIcon';

const ACTIONS = [
  { icon: 'search' as const, title: 'Szukaj', desc: 'Wyszukaj usterkę, DIY lub kod', href: '/szukaj' },
  { icon: 'brake' as const, title: 'Hamulce', desc: 'ABS, klocki, tarcze', href: '/diagnoza?objaw=hamulce' },
  { icon: 'snow' as const, title: 'Klima', desc: 'Sprężarka, nagrzewnica', href: '/diagnoza?objaw=klima-ogrzewanie' },
  { icon: 'thermo' as const, title: 'Przegrzewanie', desc: 'Chłodnica, termostat', href: '/diagnoza?objaw=przegrzewanie' },
];

export default function HomeQuickActions() {
  return (
    <section aria-labelledby="home-actions-title" className="px-4 pt-6">
      <h2 id="home-actions-title" className="text-xl font-bold text-white">Szybkie akcje</h2>
      <ul className="mt-3 grid grid-cols-2 gap-2.5">
        {ACTIONS.map(action => (
          <li key={action.title}>
            <Link href={action.href} className="flex h-full flex-col rounded-2xl border border-white/15 bg-neutral-900 p-3 transition hover:border-silver-500">
              <IconTile name={action.icon} className="!h-9 !w-9" />
              <span className="mt-2 text-sm font-bold text-white">{action.title}</span>
              <span className="mt-0.5 text-[11px] text-neutral-300">{action.desc}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
