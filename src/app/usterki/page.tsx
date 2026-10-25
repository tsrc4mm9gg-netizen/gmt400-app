import type { Metadata } from 'next';
import Encyclopedia from '../Encyclopedia';

export const metadata: Metadata = {
  title: 'Usterki Tahoe, Suburban, Silverado (GMT400) — objawy i naprawa',
  description: 'Typowe usterki Tahoe, Suburban, Silverado, Sierra i Yukona (GMT400, 1988–2000): objawy, przyczyny i rozwiązania z zakresem modeli i roczników.',
  alternates: { canonical: 'https://www.gmt400.pl/usterki' },
};

export default function Page() {
  return <Encyclopedia initialTab="usterki" />;
}
