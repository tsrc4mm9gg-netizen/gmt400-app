import type { Metadata } from 'next';
import Link from 'next/link';
import { GUIDES } from '../../lib/guides';
import Breadcrumbs from '../ui/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Najważniejsze dla właściciela w PL — poradniki GMT400',
  description: 'LPG, sprowadzenie i rejestracja z USA/UE, światła na europejskie i żółte tablice — poradniki dla właściciela GMT400 w Polsce, każda liczba ze źródłem i datą.',
  alternates: { canonical: 'https://www.gmt400.pl/dla-wlasciciela' },
};

export default function GuidesHub() {
  return (
    <div className="min-h-screen bg-neutral-950 px-5 py-8 pb-28 text-white">
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs items={[{ label: 'Poradniki PL' }]} />
        <header className="my-6">
          <p className="text-sm uppercase tracking-widest text-silver-300">Najważniejsze dla właściciela w PL</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Poradniki dla właściciela GMT400 w Polsce</h1>
          <p className="mt-4 text-lg leading-8 text-neutral-300">Cztery tematy, o które pytacie najczęściej. Każda kwota i przepis ma źródło z datą; rozbieżności i braki oznaczamy wprost. Przepisy się zmieniają — sprawdź w urzędzie.</p>
        </header>
        <ul className="grid gap-4 sm:grid-cols-2">
          {GUIDES.map(g => (
            <li key={g.slug}>
              <Link href={'/dla-wlasciciela/' + g.slug} className="block h-full rounded-xl border-2 border-silver-700/50 bg-neutral-900 p-5 hover:border-silver-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-silver-500">
                <h2 className="text-xl font-semibold">{g.short}</h2>
                <p className="mt-2 text-sm leading-6 text-neutral-300">{g.description}</p>
                <p className="mt-3 text-xs text-silver-300">Stan na: {g.asOf} · {g.years}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
