import { NextResponse } from 'next/server';
import { fetchAllEntries, isStrictNotionBuild, NotionIncompleteError } from '../../../lib/notion-entries';

// Statyczny JSON generowany w buildzie (fallback dla klienta, gdy lista nie trafiła do HTML). Bez ISR/rewalidacji w runtime.
export const dynamic = 'force-static';
export const revalidate = false;

export async function GET() {
  const token = process.env.NOTION_TOKEN;
  if (!token) return NextResponse.json({ error: 'Brak NOTION_TOKEN' }, { status: 500 });
  try {
    const results = await fetchAllEntries(token);
    return NextResponse.json({ results, count: results.length, complete: true });
  } catch (error) {
    // Na buildzie Vercel nie zamrażamy błędu 502 jako statycznej odpowiedzi — build ma się przerwać.
    if (isStrictNotionBuild()) throw error;
    const message = error instanceof NotionIncompleteError ? error.message : 'Błąd pobierania kompletnej bazy Notion.';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
