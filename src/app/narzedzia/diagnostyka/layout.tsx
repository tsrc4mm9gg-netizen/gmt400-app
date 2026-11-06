import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const title = 'Kody błędów — wyszukiwarka diagnostyczna GMT400';
const description = 'Wyszukaj kod błędu lub objaw. Sprawdź opis, możliwe przyczyny i pierwsze czynności diagnostyczne dla GMT400.';
const url = 'https://www.gmt400.pl/narzedzia/diagnostyka';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { type: 'website', locale: 'pl_PL', siteName: 'GMT400', title, description, url },
  twitter: { card: 'summary', title, description },
};

export default function DiagnosticsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
