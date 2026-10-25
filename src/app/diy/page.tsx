import type { Metadata } from 'next';
import Encyclopedia from '../Encyclopedia';

export const metadata: Metadata = {
  title: 'DIY — naprawy Tahoe, Suburban, Silverado (GMT400) krok po kroku',
  description: 'Poradniki DIY dla Tahoe, Suburban, Silverado i innych GMT400: obsługa, naprawy i wymiany krok po kroku. Sprawdź w swoim aucie / manualu.',
  alternates: { canonical: 'https://www.gmt400.pl/diy' },
};

export default function Page() {
  return <Encyclopedia initialTab="diy" />;
}
