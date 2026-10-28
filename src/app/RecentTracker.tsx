'use client';

import { useEffect } from 'react';
import { trackRecent } from '@/lib/recent-viewed';

/** Zapisuje otwarty wpis/model w localStorage (tylko w tej przeglądarce). Nic nie renderuje. */
export default function RecentTracker({ id, title, href, type }: { id: string; title: string; href: string; type: string }) {
  useEffect(() => { trackRecent({ id, title, href, type }); }, [id, title, href, type]);
  return null;
}
