'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const QUICK_LINKS = [
  { href: '/vin', label: 'VIN', icon: 'VIN' },
  { href: '/narzedzia/rpo', label: 'RPO', icon: 'RPO' },
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
      className="sticky top-14 z-30 min-w-0 border-b border-white/10 bg-neutral-950/95 backdrop-blur-md lg:hidden"
    >
      <ul className="flex min-w-0 flex-wrap items-center justify-center gap-1 px-2 py-1">
        {QUICK_LINKS.map(({ href, label }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <li key={href} className="min-w-0 max-w-full">
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`flex min-h-11 min-w-11 max-w-full items-center justify-center rounded-full px-3 text-xs font-medium break-words transition motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-silver-300 ${
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
