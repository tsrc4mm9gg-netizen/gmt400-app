'use client';
import NotionUnavailable from './NotionUnavailable';

export default function EntryError({ reset }: { reset: () => void }) {
  return <NotionUnavailable retry={reset} />;
}
