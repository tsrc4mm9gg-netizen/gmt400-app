import { NextResponse } from 'next/server';

const DATABASE_ID = '746973771d604f1e8276502851176af2';

export async function GET() {
  const token = process.env.NOTION_TOKEN;
  if (!token) {
    return NextResponse.json({ error: 'Brak NOTION_TOKEN' }, { status: 500 });
  }

  try {
    const res = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ page_size: 100 }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: 'Notion API error', details: err }, { status: res.status });
    }

    const data = await res.json();

    const results = (data.results || []).map((page: any) => {
      const props = page.properties;
      return {
        Nazwa: props.Nazwa?.title?.[0]?.plain_text || '',
        Typ: props.Typ?.select?.name || '',
        Model: props.Model?.select?.name || '',
        Opis: props.Opis?.rich_text?.[0]?.plain_text || '',
        Objawy: props.Objawy?.rich_text?.[0]?.plain_text || '',
        Rozwiązanie: props['Rozwiązanie']?.rich_text?.[0]?.plain_text || '',
        Lata: props.Lata?.rich_text?.[0]?.plain_text || '',
      };
    });

    return NextResponse.json({ results });
  } catch (e: any) {
    return NextResponse.json({ error: 'Błąd pobierania z Notion', details: e.message }, { status: 500 });
  }
}
