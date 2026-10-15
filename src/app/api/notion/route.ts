import { NextResponse } from 'next/server';

const DATABASE_ID = '746973771d604f1e8276502851176af2';

export async function GET() {
  const token = process.env.NOTION_TOKEN;
  if (!token) {
    return NextResponse.json({ error: 'Brak NOTION_TOKEN' }, { status: 500 });
  }

  try {
    let allResults: any[] = [];
    let startCursor: string | undefined = undefined;
    let hasMore = true;

    while (hasMore && allResults.length < 300) {
      const body: any = { page_size: 100 };
      if (startCursor) body.start_cursor = startCursor;

      const res = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.text();
        return NextResponse.json({ error: 'Notion API error', details: err }, { status: 500 });
      }

      const data = await res.json();
      allResults = allResults.concat(data.results || []);
      hasMore = data.has_more;
      startCursor = data.next_cursor;
    }

    const results = allResults.map((page: any) => {
      const props = page.properties || {};
      return {
        Nazwa: props.Nazwa?.title?.[0]?.plain_text || props.Nazwa?.rich_text?.[0]?.plain_text || '',
        Typ: props.Typ?.select?.name || '',
        Model: props.Model?.select?.name || '',
        Opis: props.Opis?.rich_text?.[0]?.plain_text || '',
        Objawy: props.Objawy?.rich_text?.[0]?.plain_text || '',
        Rozwiązanie: props['Rozwiązanie']?.rich_text?.[0]?.plain_text || '',
        Lata: props.Lata?.rich_text?.[0]?.plain_text || '',
      };
    });

    return NextResponse.json({ results, count: results.length });
  } catch (e: any) {
    return NextResponse.json({ error: 'Błąd pobierania z Notion', details: e.message }, { status: 500 });
  }
}
