import type { Metadata } from 'next';
import Encyclopedia from '../Encyclopedia';
import JsonLd from '../ui/JsonLd';
import { getListEntries, itemListJsonLd } from '../../lib/notion-entries';

export const metadata: Metadata = {
  title: 'Modele GMT400 — Tahoe, Suburban, Silverado, Sierra, Yukon, Blazer (1988–2000)',
  description: 'Katalog modeli Chevrolet i GMC GMT400: Tahoe, Suburban, Silverado, Sierra, Yukon, Blazer, C/K. Rodziny, odmiany, roczniki i typowe konfiguracje.',
  alternates: { canonical: 'https://www.gmt400.pl/modele' },
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    siteName: 'GMT400',
    url: 'https://www.gmt400.pl/modele',
    title: 'Modele GMT400',
    description: 'Tahoe, Suburban, Silverado i inne modele GMT400 1988–2000.',
  },
};

// ISR: lista jest w HTML od pierwszego żądania (dla wyszukiwarek), odświeżana co 15 min. Gdy Notion nie odpowiada, strona pobiera dane w przeglądarce.
export const revalidate = 900;

export default async function Page() {
  const items = await getListEntries();
  const list = (items ?? []).filter(entry => entry.Typ === 'Model');
  return <>
    <Encyclopedia initialTab="modele" initialItems={items} />
    {list.length > 0 && <JsonLd data={itemListJsonLd('Modele GMT400', 'https://www.gmt400.pl/modele', list)} />}
  </>;
}
