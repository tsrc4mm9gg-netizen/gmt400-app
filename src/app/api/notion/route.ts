import { NextResponse } from 'next/server';
import { notionFetch } from '../../../lib/notion-fetch';
import { withoutSuperseded } from '../../../lib/superseded.mjs';
const DATABASE_ID = '746973771d604f1e8276502851176af2';
function getRichText(prop: any): string {
  if (!prop?.rich_text) return '';
  return prop.rich_text.map((t: any) => t.plain_text || '').join('');
}
function getValues(prop: any): string[] {
  if (!prop) return [];
  if (Array.isArray(prop.multi_select)) return prop.multi_select.map((v: any) => v.name).filter((v: unknown): v is string => typeof v === 'string' && v.trim().length > 0);
  if (typeof prop.select?.name === 'string') return [prop.select.name];
  const text = getRichText(prop).trim();
  return text ? text.split(/[;\n]+/).map(value => value.trim()).filter(Boolean) : [];
}
export async function GET() {
  const token = process.env.NOTION_TOKEN;
  if (!token) return NextResponse.json({ error: 'Brak NOTION_TOKEN' }, { status: 500 });
  try {
    let allResults: any[] = [];
    let startCursor: string | undefined;
    let hasMore = true;
    const seenCursors = new Set<string>();
    while (hasMore) {
      const body: any = { page_size: 100 };
      if (startCursor) body.start_cursor = startCursor;
      // Ponawianie przy 429/5xx (limit Notion ~3 zapytania/s); kompletna lista albo błąd — nigdy częściowa.
      const res = await notionFetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, { token, method: 'POST', body: JSON.stringify(body), revalidate: 300, timeoutMs: 15000 });
      if (!res.ok) return NextResponse.json({ error: 'Nie udało się pobrać kompletnej bazy Notion.' }, { status: 502 });
      const data = await res.json();
      if (!Array.isArray(data.results) || typeof data.has_more !== 'boolean') return NextResponse.json({ error: 'Nieprawidłowa odpowiedź Notion. Nie zwracamy częściowej listy.' }, { status: 502 });
      allResults = allResults.concat(data.results);
      hasMore = data.has_more;
      if (hasMore) {
        const next = data.next_cursor;
        if (typeof next !== 'string' || !next || seenCursors.has(next)) return NextResponse.json({ error: 'Nieprawidłowa paginacja Notion. Nie zwracamy częściowej listy.' }, { status: 502 });
        seenCursors.add(next);
        startCursor = next;
      }
    }
    // Wpisy oznaczone „Do usunięcia – zastąpione przez …” zostają w Notion do przeglądu, ale nie trafiają na stronę.
    const results = withoutSuperseded(allResults.map((page: any) => {
      const props = page.properties || {};
      return {
        Nazwa: props.Nazwa?.title?.map((part: any) => part.plain_text || '').join('') || getRichText(props.Nazwa),
        Typ: props.Typ?.select?.name || '',
        Model: props.Model?.select?.name || '',
        Modele: getValues(props.Modele),
        Opis: getRichText(props.Opis),
        Objawy: getRichText(props.Objawy),
        Rozwiązanie: getRichText(props['Rozwiązanie']),
        Lata: getRichText(props.Lata),
        id: page.id,
        applicability: { brand: getValues(props.Marka), model: getValues(props.Model), years: getValues(props.Lata), engine: getValues(props.Silnik), drive: getValues(props['Napęd']), transmission: getValues(props.Skrzynia) },
      };
    }));
    return NextResponse.json({ results, count: results.length, complete: true });
  } catch {
    return NextResponse.json({ error: 'Błąd pobierania kompletnej bazy Notion.' }, { status: 502 });
  }
}
