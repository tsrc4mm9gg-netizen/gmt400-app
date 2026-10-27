import Link from 'next/link';
import { getGuide } from '../lib/guides';
import { IconTile, type CategoryIconName } from './ui/CategoryIcon';
const ALL_ITEMS: { slug: string; icon: CategoryIconName; title: string; desc: string }[] = [
  { slug: 'lpg', icon: 'lpg', title: 'LPG w GMT400', desc: 'Instalacja, zbiornik, koszty, przepisy' },
  { slug: 'import', icon: 'import', title: 'Import i rejestracja', desc: 'Cło, VAT, akcyza, kalkulator' },
  { slug: 'swiatla-eu', icon: 'lights', title: 'Światła na europejskie', desc: 'Części, schemat, badanie' },
  { slug: 'zolte-tablice', icon: 'plate', title: 'Żółte tablice', desc: 'Kryteria, procedura, koszty' },
  { slug: 'homologacja', icon: 'homologacja', title: 'Homologacja', desc: 'Badanie techniczne, dokumenty' },
  { slug: 'przeglady', icon: 'przeglady', title: 'Przeglądy', desc: 'Interwały, typowe usterki PL' },
];

/** Tylko opublikowane poradniki (szkice ukryte). */
const ITEMS = ALL_ITEMS.filter(item => getGuide(item.slug));

/** Wyróżniona kategoria na stronie głównej: poradniki dla właściciela w Polsce. */
export default function OwnerEssentials() {
  return (
    <section aria-labelledby="owner-essentials-title" data-testid="owner-essentials" className="relative z-10 mx-4 mb-5 mt-5 rounded-2xl border-2 border-silver-600/70 bg-gradient-to-b from-silver-950/50 to-neutral-950 p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-silver-300">Poradniki PL · liczby ze źródłem i datą</p>
      <h2 id="owner-essentials-title" className="mt-1 text-xl font-bold text-white">Najważniejsze dla właściciela w PL</h2>
      <ul className="mt-3 grid grid-cols-2 gap-3">
        {ITEMS.map(g => (
          <li key={g.slug}>
            <Link href={'/dla-wlasciciela/' + g.slug} className="group block h-full min-h-24 rounded-2xl border border-white/15 bg-neutral-900 p-3 transition hover:border-silver-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-silver-500">
              <IconTile name={g.icon} className="!h-10 !w-10" />
              <span className="mt-2 block font-semibold text-white">{g.title}</span>
              <span className="mt-1 block text-xs text-neutral-300">{g.desc}</span>
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/dla-wlasciciela" className="mt-3 flex min-h-11 items-center justify-center rounded-lg border border-silver-600/50 text-sm font-semibold text-silver-300 hover:bg-silver-950/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-silver-500">Wszystkie poradniki PL →</Link>
    </section>
  );
}
