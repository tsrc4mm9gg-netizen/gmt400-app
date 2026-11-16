import { NextResponse } from 'next/server';
import { getListEntries, LIST_REVALIDATE_SECONDS } from '../../../lib/notion-entries';
import { buildSearchIndex } from '../../../lib/search-index';

// Lekki indeks do wyszukiwarki w nagłówku. Generowany statycznie w buildzie (bez ISR); bez Notion — kody OBD, poradniki, modele i strony (partial).
export const dynamic = 'force-static';
export const revalidate = false;

export async function GET() {
  const entries = await getListEntries();
  const index = buildSearchIndex(entries);
  const maxAge = index.partial ? 60 : LIST_REVALIDATE_SECONDS;
  return NextResponse.json(index, { headers: { 'Cache-Control': `public, max-age=60, s-maxage=${maxAge}, stale-while-revalidate=86400` } });
}
