import type { Metadata } from 'next';
import Encyclopedia from '../Encyclopedia';

export const metadata: Metadata = {
  title: 'DIY — poradniki napraw GMT400',
  description: 'Poradniki DIY dla GMT400: obsługa, naprawy i wymiany krok po kroku. Sprawdź w swoim aucie / manualu.',
  alternates: { canonical: 'https://www.gmt400.pl/diy' },
};

export default function Page() {
  return <Encyclopedia initialTab="diy" />;
}
