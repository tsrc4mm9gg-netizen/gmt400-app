import type { Metadata } from 'next';
import Encyclopedia from '../Encyclopedia';

export const metadata: Metadata = {
  title: 'Usterki i diagnostyka GMT400',
  description: 'Typowe usterki GMT400: objawy, przyczyny i rozwiązania z zakresem modeli i roczników.',
  alternates: { canonical: 'https://www.gmt400.pl/usterki' },
};

export default function Page() {
  return <Encyclopedia initialTab="usterki" />;
}
