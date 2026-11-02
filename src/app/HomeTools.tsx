import Link from 'next/link';
import { IconTile } from './ui/CategoryIcon';

const TOOLS = [
  { icon: 'vin' as const, title: 'Dekoder VIN', desc: 'Rocznik, silnik, fabryka, RPO', href: '/vin' },
  { icon: 'search' as const, title: 'Diagnoza objawów', desc: 'Wybierz problem i sprawdź przyczyny', href: '/diagnoza' },
  { icon: 'car' as const, title: 'Mój samochód', desc: 'Profil auta filtruje listy', href: '/moj-samochod' },
  { icon: 'wrench' as const, title: 'DIY', desc: 'Instrukcje napraw krok po kroku', href: '/diy' },
];

export default function HomeTools() {
  return (
    <section aria-labelledby="home-tools-title" className="px-4 pt-6">
      <h2 id="home-tools-title" className="text-xl font-bold text-white">Narzędzia</h2>
      <ul className="mt-3 grid grid-cols-2 gap-2.5">
        {TOOLS.map(tool => (
          <li key={tool.title}>
            <Link href={tool.href} className="flex h-full flex-col rounded-2xl border border-white/15 bg-neutral-900 p-3 transition hover:border-silver-500">
              <IconTile name={tool.icon} className="!h-9 !w-9" />
              <span className="mt-2 text-sm font-bold text-white">{tool.title}</span>
              <span className="mt-0.5 text-[11px] text-neutral-300">{tool.desc}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
