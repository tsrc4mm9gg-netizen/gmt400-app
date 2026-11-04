'use client';
import Link from 'next/link';
import CollapsibleSection from './ui/CollapsibleSection';

const ITEMS = [
  { title: 'Momenty dokręcania', desc: '930 pozycji z instrukcji GM', href: '/momenty-dokrecania' },
  { title: 'Pojemności i płyny', desc: 'Oleje, ATF, chłodnica, zbiorniki', href: '/pojemnosci' },
  { title: 'Porady właściciela', desc: '4×4, przyczepa, opony, PassLock', href: '/porady-wlasciciela' },
  { title: 'Bezpieczniki', desc: 'Lokalizacje i wartości', href: '/schematy' },
];

export default function HomeTorque() {
  return (
    <CollapsibleSection
      title="Dane serwisowe"
      id="home-torque"
      defaultOpen={false}
    >
      <ul className="grid grid-cols-2 gap-2.5">
        {ITEMS.map(item => (
          <li key={item.title}>
            <Link href={item.href} className="flex h-full flex-col rounded-2xl border border-white/15 bg-neutral-900 p-3 transition hover:border-silver-500">
              <span className="text-sm font-bold text-white">{item.title}</span>
              <span className="mt-0.5 text-[11px] text-neutral-300">{item.desc}</span>
            </Link>
          </li>
        ))}
      </ul>
    </CollapsibleSection>
  );
}
