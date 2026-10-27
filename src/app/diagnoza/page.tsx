import type { Metadata } from 'next';
import JsonLd from '../ui/JsonLd';
import DiagnozaTool from './DiagnozaTool';
import { getListEntries } from '../../lib/notion-entries';
import { buildMeta } from '../../lib/diagnosis-meta';
import { SYMPTOMS } from '../../lib/diagnosis';

export const metadata: Metadata = {
  title: 'Co się dzieje z moim autem? Diagnoza objawów GMT400 — Tahoe, Suburban, Silverado',
  description: 'Wybierz objaw (nie odpala, szarpie, Check Engine, wycieki, hałasy, hamulce, skrzynia, klima, elektryka, przegrzewanie, dymienie), odpowiedz na 1–2 pytania i zobacz możliwe przyczyny z linkami do usterek i poradników GMT400.',
  alternates: { canonical: 'https://www.gmt400.pl/diagnoza' },
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
    <JsonLd data={jsonLd} />
  </>;
}
