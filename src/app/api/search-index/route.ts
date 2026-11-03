import { NextResponse } from 'next/server';
import { getListEntries, LIST_REVALIDATE_SECONDS } from '../../../lib/notion-entries';
import { buildSearchIndex } from '../../../lib/search-index';

// Lekki indeks do wyszukiwarki w nagłówku. Odświeżany co 15 min (ISR); bez Notion — kody OBD, poradniki, modele i strony (partial).
export const revalidate = 900;

export async function GET() {
  const entries = await getListEntries();
  const index = buildSearchIndex(entries);
  const maxAge = index.partial ? 60 : LIST_REVALIDATE_SECONDS;
  return NextResponse.json(index, { headers: { 'Cache-Control': `public, max-age=60, s-maxage=${maxAge}, stale-while-revalidate=86400` } });
}
