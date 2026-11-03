import type { Metadata } from 'next';
import Link from 'next/link';
import JsonLd from '../ui/JsonLd';
import { DIAG_GUIDES } from '../../lib/diagnosis-guides';
import DiagnozaTool from './DiagnozaTool';
import { getListEntries } from '../../lib/notion-entries';
import { buildMeta } from '../../lib/diagnosis-meta';
import { SYMPTOMS } from '../../lib/diagnosis';

export const metadata: Metadata = {
  title: 'Diagnoza objawów GMT400 — nie odpala, szarpie, Check Engine | Tahoe, Suburban',
  description: 'Wybierz objaw (nie odpala, szarpie, wycieki, skrzynia 4L60-E, hamulce, klima, przegrzewanie). Odpowiedz na 1–2 pytania i zobacz możliwe przyczyny z linkami do usterek i DIY dla GMT400.',
  alternates: { canonical: 'https://www.gmt400.pl/diagnoza' },
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    siteName: 'GMT400',
    url: 'https://www.gmt400.pl/diagnoza',
    title: 'Diagnoza objawów GMT400',
    description: 'Szybka diagnoza problemów Tahoe, Suburban, Silverado i innych GMT400.',
  },
};

// ISR: wpisy użyte w narzędziu są w HTML od pierwszego żądania; gdy Notion nie odpowiada, narzędzie pobiera je w przeglądarce.
export const revalidate = 900;

export default async function Page() {
  const entries = await getListEntries();
  const meta = entries ? buildMeta(entries) : null;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Objawy w diagnozie GMT400',
    url: 'https://www.gmt400.pl/diagnoza',
    numberOfItems: SYMPTOMS.length,
    itemListElement: SYMPTOMS.map((s, i) => ({ '@type': 'ListItem', position: i + 1, name: s.label })),
  };
  return <>
    <DiagnozaTool initialMeta={meta} />
    <section data-testid="diag-guides" aria-labelledby="poradniki-gm" className="mx-auto w-full max-w-5xl px-4 pb-28">
      <h2 id="poradniki-gm" className="text-xl font-semibold text-white">Poradniki diagnostyczne z instrukcji GM</h2>
      <p className="mt-1 max-w-prose text-sm text-neutral-300">Typowe odczyty testera, hałasy, olej, pasek, detonacja i falowanie — kolejność kontroli według instrukcji serwisowych, opisana własnymi słowami, ze stronami źródła.</p>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {DIAG_GUIDES.map(g => <li key={g.slug}><Link href={`/diagnoza/${g.slug}`} className="flex min-h-11 flex-col justify-center rounded-xl border border-neutral-800 bg-neutral-900/60 px-4 py-3 text-sm text-silver-100 hover:border-silver-500 focus-visible:outline-2 focus-visible:outline-silver-500"><span className="font-semibold">{g.title}</span></Link></li>)}
      </ul>
    </section>
    <JsonLd data={jsonLd} />
  </>;
}
