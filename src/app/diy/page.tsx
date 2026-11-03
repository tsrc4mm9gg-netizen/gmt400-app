import type { Metadata } from 'next';
import Encyclopedia from '../Encyclopedia';
import JsonLd from '../ui/JsonLd';
import { getListEntries, itemListJsonLd } from '../../lib/notion-entries';

export const metadata: Metadata = {
  title: 'DIY GMT400 — naprawy Tahoe, Suburban, Silverado krok po kroku',
  description: 'Poradniki DIY dla Chevrolet Tahoe, Suburban, Silverado i GMC GMT400 (1988–2000). Wymiany, obsługa i naprawy z listą narzędzi i części. Sprawdź w swoim aucie.',
  alternates: { canonical: 'https://www.gmt400.pl/diy' },
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    siteName: 'GMT400',
    url: 'https://www.gmt400.pl/diy',
    title: 'DIY GMT400 — naprawy krok po kroku',
    description: 'Instrukcje napraw i wymian dla Tahoe, Suburban, Silverado i innych GMT400.',
  },
};

// ISR: lista jest w HTML od pierwszego żądania (dla wyszukiwarek), odświeżana co 15 min. Gdy Notion nie odpowiada, strona pobiera dane w przeglądarce.
export const revalidate = 900;

export default async function Page() {
  const items = await getListEntries();
  const list = (items ?? []).filter(entry => entry.Typ === 'Porada');
  return <>
    <Encyclopedia initialTab="diy" initialItems={items} />
    {list.length > 0 && <JsonLd data={itemListJsonLd('Poradniki DIY GMT400', 'https://www.gmt400.pl/diy', list)} />}
  </>;
}
