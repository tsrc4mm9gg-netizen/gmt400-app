import Link from 'next/link';
const ITEMS = [
  { slug: 'lpg', icon: '⛽', title: 'LPG w GMT400', desc: 'Instalacja, zbiornik, koszty, przepisy' },
  { slug: 'import', icon: '🚢', title: 'Import i rejestracja z USA/UE', desc: 'Cło, VAT, akcyza, kalkulator' },
  { slug: 'swiatla-eu', icon: '💡', title: 'Światła na europejskie', desc: 'Części, schemat, badanie' },
  { slug: 'zolte-tablice', icon: '🪪', title: 'Żółte tablice', desc: 'Kryteria, procedura, koszty' },
];

/** Wyróżniona kategoria na stronie głównej: 4 poradniki dla właściciela w Polsce. */
export default function OwnerEssentials() {
  return (
    <section aria-labelledby="owner-essentials-title" data-testid="owner-essentials" className="relative z-10 mx-4 mb-6 rounded-2xl border-2 border-red-600/70 bg-gradient-to-b from-red-950/50 to-neutral-950 p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-red-300">Poradniki PL · każda liczba ze źródłem i datą</p>
      <h2 id="owner-essentials-title" className="mt-1 text-xl font-bold text-white">Najważniejsze dla właściciela w PL</h2>
      <ul className="mt-3 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
        {ITEMS.map(g => (
          <li key={g.slug}>
            <Link href={'/dla-wlasciciela/' + g.slug} className="group block h-full min-h-24 rounded-xl border border-white/15 bg-neutral-900 p-3 transition hover:border-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500">
              <span aria-hidden="true" className="text-xl">{g.icon}</span>
              <span className="mt-1 block font-semibold text-white">{g.title}</span>
              <span className="mt-1 block text-xs text-neutral-300">{g.desc}</span>
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/dla-wlasciciela" className="mt-3 flex min-h-11 items-center justify-center rounded-lg border border-red-600/50 text-sm font-semibold text-red-300 hover:bg-red-950/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500">Wszystkie poradniki PL →</Link>
    </section>
  );
}
