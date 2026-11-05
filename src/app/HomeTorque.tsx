'use client';
import Link from 'next/link';

const ITEMS = [
  { title: 'Momenty dokręcania', desc: '930 pozycji z instrukcji GM', href: '/momenty-dokrecania' },
  { title: 'Pojemności i płyny', desc: 'Oleje, ATF, chłodnica, zbiorniki', href: '/pojemnosci' },
  { title: 'Porady właściciela', desc: '4×4, przyczepa, opony, PassLock', href: '/porady-wlasciciela' },
  { title: 'Bezpieczniki', desc: 'Lokalizacje i wartości', href: '/schematy' },
];

export default function HomeTorque() {
  return (
    <div data-testid="home-torque">
      <ul className="grid grid-cols-2 gap-2.5">
        {ITEMS.map(item => (
          <li key={item.title}>
            <Link href={item.href} className="flex h-full min-h-11 flex-col rounded-2xl border border-white/15 bg-neutral-900 p-3 transition hover:border-silver-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-silver-500">
              <span className="text-sm font-bold text-white">{item.title}</span>
              <span className="mt-0.5 text-[11px] text-neutral-300">{item.desc}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
