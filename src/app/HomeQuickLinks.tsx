import Link from 'next/link';
import { IconTile, type CategoryIconName } from './ui/CategoryIcon';

const LINKS: { href: string; icon: CategoryIconName; label: string; testId?: string }[] = [
  { href: '/vin', icon: 'vin', label: 'Sprawdź VIN', testId: 'home-quick-vin' },
  { href: '/diagnoza', icon: 'diagnoza', label: 'Diagnoza', testId: 'home-diagnoza' },
  { href: '/usterki', icon: 'usterki', label: 'Usterki' },
  { href: '/diy', icon: 'diy', label: 'DIY' },
];

/** Mały rząd skrótów pod karuzelą: VIN, diagnoza, usterki, DIY — karuzela zostaje dominującym elementem. */
export default function HomeQuickLinks() {
  return (
    <nav aria-label="Szybkie skróty" className="px-4 pt-3">
      <ul className="grid grid-cols-4 gap-2" data-testid="home-main-entries">
        {LINKS.map(link => (
          <li key={link.href} style={{ maxWidth: 'none' }}>
            <Link href={link.href} data-testid={link.testId} className="flex h-full min-h-[4.5rem] flex-col items-center justify-center gap-1.5 rounded-2xl border border-white/15 bg-neutral-900 px-1 py-2 text-center transition hover:border-silver-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-silver-500">
              <IconTile name={link.icon} className="!h-8 !w-8 !rounded-lg" />
              <span className="text-xs font-bold leading-tight text-white">{link.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
