import Link from 'next/link';
import { IconTile } from './ui/CategoryIcon';

const STEPS = [
  { icon: 'car' as const, title: 'Ustaw profil auta', desc: 'Rocznik, model, silnik — listy będą bardziej trafne', href: '/moj-samochod' },
  { icon: 'search' as const, title: 'Opisz objaw', desc: 'Wyszukaj problem lub użyj diagnozy krok po kroku', href: '/diagnoza' },
  { icon: 'wrench' as const, title: 'Znajdź procedurę', desc: 'DIY z listą narzędzi i części', href: '/diy' },
  { icon: 'vin' as const, title: 'Sprawdź VIN', desc: 'Rocznik, silnik, fabryka i kody RPO', href: '/vin' },
];

export default function HomeQuickStart() {
  return (
    <section aria-labelledby="quick-start-title" className="px-4 pt-6">
      <h2 id="quick-start-title" className="text-xl font-bold text-white">Od czego zacząć</h2>
      <p className="mt-0.5 text-xs text-neutral-300">Cztery szybkie kroki, gdy dopiero poznajesz auto lub szukasz pomocy.</p>
      <ul className="mt-3 grid grid-cols-2 gap-2.5">
        {STEPS.map(step => (
          <li key={step.title}>
            <Link href={step.href} className="flex h-full flex-col rounded-2xl border border-white/15 bg-neutral-900 p-3 transition hover:border-silver-500">
              <IconTile name={step.icon} className="!h-9 !w-9" />
              <span className="mt-2 text-sm font-bold text-white">{step.title}</span>
              <span className="mt-0.5 text-[11px] text-neutral-300">{step.desc}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
