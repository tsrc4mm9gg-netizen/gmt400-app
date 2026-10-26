import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAnyGuide } from '../../../lib/guides';
import GuideView from '../GuideView';

const guide = getAnyGuide('przeglady')!;
export const metadata: Metadata = {
  title: guide.seoTitle ?? guide.title,
  description: guide.seoDescription ?? guide.description,
  openGraph: { type: 'article', locale: 'pl_PL', siteName: 'GMT400', title: guide.seoTitle ?? guide.title, description: guide.seoDescription ?? guide.description, url: 'https://www.gmt400.pl/dla-wlasciciela/przeglady' },
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://www.gmt400.pl/dla-wlasciciela/przeglady' },
};
export default function Page() {
  if (guide.draft) notFound();
  return <GuideView guide={guide} />;
}
