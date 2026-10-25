import type { Metadata } from 'next';
import Encyclopedia from '../Encyclopedia';
import JsonLd from '../ui/JsonLd';
import { getListEntries, itemListJsonLd } from '../../lib/notion-entries';

export const metadata: Metadata = {
  title: 'DIY — naprawy Tahoe, Suburban, Silverado (GMT400) krok po kroku',
  description: 'Poradniki DIY dla Tahoe, Suburban, Silverado i innych GMT400: obsługa, naprawy i wymiany krok po kroku. Sprawdź w swoim aucie / manualu.',
  alternates: { canonical: 'https://www.gmt400.pl/diy' },
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
