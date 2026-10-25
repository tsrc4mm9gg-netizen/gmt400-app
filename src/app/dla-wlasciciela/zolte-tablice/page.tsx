import type { Metadata } from 'next';
import { getGuide } from '../../../lib/guides';
import GuideView from '../GuideView';

const guide = getGuide('zolte-tablice')!;
export const metadata: Metadata = {
  title: guide.seoTitle ?? guide.title,
  description: guide.seoDescription ?? guide.description,
  openGraph: { type: 'article', locale: 'pl_PL', siteName: 'GMT400', title: guide.seoTitle ?? guide.title, description: guide.seoDescription ?? guide.description, url: 'https://www.gmt400.pl/dla-wlasciciela/zolte-tablice' },
  alternates: { canonical: 'https://www.gmt400.pl/dla-wlasciciela/zolte-tablice' },
};
export default function Page() { return <GuideView guide={guide} />; }
