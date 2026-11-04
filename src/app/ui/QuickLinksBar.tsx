'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const QUICK_LINKS = [
  { href: '/vin', label: 'VIN', icon: 'VIN' },
  { href: '/diagnoza', label: 'Diagnoza', icon: 'D' },
  { href: '/usterki', label: 'Usterki', icon: 'U' },
  { href: '/diy', label: 'DIY', icon: 'DIY' },
  { href: '/eksploatacja', label: 'Części', icon: 'C' },
];

export default function QuickLinksBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Szybkie linki"
      className="sticky top-14 z-30 border-b border-white/10 bg-neutral-950/95 backdrop-blur-md lg:hidden"
    >
      <ul className="flex items-center justify-around px-2 py-1">
        {QUICK_LINKS.map(({ href, label }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <li key={href}>
              <Link
                href={href}
                className={`flex min-h-10 items-center rounded-full px-3 text-xs font-medium transition ${
                  active
                    ? 'bg-silver-600 text-neutral-950'
                    : 'text-neutral-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
