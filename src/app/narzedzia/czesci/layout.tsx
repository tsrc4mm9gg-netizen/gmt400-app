import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const title = 'Informacje o częściach i katalogi — GMT400';
const description = 'Szukaj informacji o częściach według modelu, rocznika, silnika, skrzyni i napędu. Wpisy lokalne i odnośniki do katalogów nie potwierdzają pasowania.';
const url = 'https://www.gmt400.pl/narzedzia/czesci';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { type: 'website', locale: 'pl_PL', siteName: 'GMT400', title, description, url },
  twitter: { card: 'summary', title, description },
};

export default function PartsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
