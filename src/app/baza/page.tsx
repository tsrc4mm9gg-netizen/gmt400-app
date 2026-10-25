import type { Metadata } from 'next';
import Encyclopedia from '../Encyclopedia';
import { getListEntries } from '../../lib/notion-entries';

export const metadata: Metadata = {
  title: 'Baza wiedzy',
  description: 'Wszystkie sekcje encyklopedii GMT400: modele, usterki, kody, DIY, VIN/RPO, części, serwis i więcej.',
  alternates: { canonical: 'https://www.gmt400.pl/baza' },
};

// ISR (15 min): domyślna zakładka „Modele” jest w HTML; gdy Notion nie odpowiada, strona pobiera dane w przeglądarce.
export const revalidate = 900;

export default async function BazaPage() {
  return <Encyclopedia initialItems={await getListEntries()} />;
}
