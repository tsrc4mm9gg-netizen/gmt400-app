import { NextRequest, NextResponse } from 'next/server';

const DAMAGE_TERMS = ['wypadek', 'szkoda', 'uszkodz', 'salvage', 'damage', 'accident', 'crash', 'kolizja', 'szkodowy', 'total loss', 'po szkodzie'];
const AUCTION_TERMS = ['copart', 'iaai', 'aukcja', 'auction', 'salvage auction', 'bidfax', 'autoauction'];
const LISTING_TERMS = ['olx', 'otomoto', 'allegro', 'craigslist', 'facebook marketplace', 'ogłoszenie', 'listing', 'for sale', 'sprzedaż', 'sprzedam'];

function classify(text: string) {
  const lower = text.toLowerCase();
  if (DAMAGE_TERMS.some((term) => lower.includes(term))) return 'damage';
  if (AUCTION_TERMS.some((term) => lower.includes(term))) return 'auction';
  if (LISTING_TERMS.some((term) => lower.includes(term))) return 'listing';
  return 'other';
}

export async function POST(request: NextRequest) {
  let vin = '';
  try {
    const body = await request.json();
    vin = String(body?.vin || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  } catch {
    return NextResponse.json({ error: 'Nieprawidłowe żądanie.' }, { status: 400 });
  }

  if (vin.length !== 17) {
    return NextResponse.json({ error: 'VIN musi mieć dokładnie 17 znaków.' }, { status: 400 });
  }

  const apiKey = process.env.BRAVE_SEARCH_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      status: 'not_configured',
      vin,
      message: 'Automatyczne wyszukiwanie nie jest skonfigurowane. Możesz sprawdzić VIN ręcznie w zewnętrznych wyszukiwarkach.',
      manualLinks: {
        web: `https://duckduckgo.com/?q=%22${vin}%22`,
        images: `https://duckduckgo.com/?q=%22${vin}%22&iax=images&ia=images`,
      },
    });
  }

  try {
    const response = await fetch(
      `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(`"${vin}"`)}&count=20&search_lang=pl&country=pl`,
      {
        headers: {
          Accept: 'application/json',
          'Accept-Encoding': 'gzip',
          'X-Subscription-Token': apiKey,
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { status: 'search_error', message: 'Usługa wyszukiwania zwróciła błąd. Sprawdzenie historii nie zostało ukończone.' },
        { status: 502 }
      );
    }

    const data = await response.json();
    const rawResults = data?.web?.results || [];

    const results = rawResults.map((item: any) => {
      const title = item.title || '';
      const url = item.url || '';
      const description = item.description || '';
      const combined = `${title} ${description} ${url}`;
      const exactVinMention = combined.toUpperCase().includes(vin);

      return {
        title,
        url,
        description,
        category: classify(combined),
        vinMatch: exactVinMention ? 'confirmed' : 'possible',
      };
    });

    const alerts = results
      .filter((item: any) => item.category === 'damage')
      .map((item: any) => ({
        level: item.vinMatch === 'confirmed' ? 'warning' : 'review',
        title: item.title,
        url: item.url,
        description: item.description,
        message:
          item.vinMatch === 'confirmed'
            ? 'Znaleziono informację mogącą dotyczyć szkody lub wypadku tego pojazdu.'
            : 'Znaleziono potencjalnie istotną informację. Sprawdź źródło przed wyciąganiem wniosków.',
      }));

    return NextResponse.json({
      status: 'ok',
      vin,
      checkedAt: new Date().toISOString(),
      provider: 'Brave Search',
      resultCount: results.length,
      results,
      alerts,
      disclaimer:
        'Wyniki pochodzą z publicznych stron i nie stanowią kompletnego raportu historii pojazdu. Brak wyników nie potwierdza braku szkody.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'search_error', message: 'Nie udało się wykonać wyszukiwania historii.', details: error?.message },
      { status: 500 }
    );
  }
}
