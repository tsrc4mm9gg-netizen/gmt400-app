import type { Metadata } from 'next';
import Encyclopedia from '../Encyclopedia';

export const metadata: Metadata = {
  title: 'Modele GMT400',
  description: 'Katalog modeli GMT400: C/K, Sierra, Tahoe, Yukon, Suburban, Blazer — rodziny, odmiany i roczniki.',
  alternates: { canonical: 'https://www.gmt400.pl/modele' },
};

export default function Page() {
  return <Encyclopedia initialTab="modele" />;
}
