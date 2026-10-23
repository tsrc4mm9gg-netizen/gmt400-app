import type { Metadata } from 'next';
import Encyclopedia from '../Encyclopedia';

export const metadata: Metadata = {
  title: 'Baza wiedzy',
  description: 'Wszystkie sekcje encyklopedii GMT400: modele, usterki, kody, DIY, VIN/RPO, części, serwis i więcej.',
  alternates: { canonical: 'https://www.gmt400.pl/baza' },
};

export default function BazaPage() {
  return <Encyclopedia />;
}
