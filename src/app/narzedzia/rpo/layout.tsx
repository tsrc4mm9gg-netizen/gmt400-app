import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const title = 'Kody RPO — dekoder wyposażenia GMT400';
const description = 'Sprawdź znaczenie kodów RPO z naklejki SPID, wyszukuj wyposażenie i porównuj zastosowanie z dokumentami GM dla modelu i rocznika.';
const url = 'https://www.gmt400.pl/narzedzia/rpo';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { type: 'website', locale: 'pl_PL', siteName: 'GMT400', title, description, url },
  twitter: { card: 'summary', title, description },
};

export default function RpoLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
