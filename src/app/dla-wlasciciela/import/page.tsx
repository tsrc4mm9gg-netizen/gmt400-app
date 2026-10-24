import type { Metadata } from 'next';
import { getGuide } from '../../../lib/guides';
import GuideView from '../GuideView';

const guide = getGuide('import')!;
export const metadata: Metadata = {
  title: guide.title,
  description: guide.description,
  alternates: { canonical: 'https://www.gmt400.pl/dla-wlasciciela/import' },
};
export default function Page() { return <GuideView guide={guide} />; }
