import { NextResponse } from 'next/server';
import { fetchAllEntries, NotionIncompleteError } from '../../../lib/notion-entries';

export async function GET() {
  const token = process.env.NOTION_TOKEN;
  if (!token) return NextResponse.json({ error: 'Brak NOTION_TOKEN' }, { status: 500 });
  try {
    const results = await fetchAllEntries(token, 300);
    return NextResponse.json({ results, count: results.length, complete: true });
  } catch (error) {
    const message = error instanceof NotionIncompleteError ? error.message : 'Błąd pobierania kompletnej bazy Notion.';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
