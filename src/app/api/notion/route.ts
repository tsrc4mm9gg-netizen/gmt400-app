import { NextResponse } from 'next/server';

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
  if (!token) {
    return NextResponse.json({ error: 'Brak NOTION_TOKEN' }, { status: 500 });
  }

  try {
    let allResults: any[] = [];
    let startCursor: string | undefined = undefined;
    let hasMore = true;

    while (hasMore && allResults.length < 500) {
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
        Opis: getRichText(props.Opis),
        Objawy: getRichText(props.Objawy),
        Rozwiązanie: getRichText(props['Rozwiązanie']),
        Lata: getRichText(props.Lata),
        id: page.id,
        applicability: {
          brand: getValues(props.Marka),
          model: getValues(props.Model),
          years: getValues(props.Lata),
          engine: getValues(props.Silnik),
          drive: getValues(props['Napęd']),
          transmission: getValues(props.Skrzynia),
        },
      };
    });

    return NextResponse.json({ results, count: results.length });
  } catch (e: any) {
    return NextResponse.json({ error: 'Błąd pobierania z Notion', details: e.message }, { status: 500 });
  }
}
