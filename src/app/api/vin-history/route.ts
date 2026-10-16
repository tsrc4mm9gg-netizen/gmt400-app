import { NextRequest, NextResponse } from 'next/server';

const DAMAGE_TERMS = ['wypadek', 'szkoda', 'uszkodz', 'salvage', 'damage', 'accident', 'crash', 'kolizja', 'szkodowy', 'total loss', 'po szkodzie'];
const AUCTION_TERMS = ['copart', 'iaai', 'aukcja', 'auction', 'salvage auction', 'bidfax', 'autoauction'];
const LISTING_TERMS = ['olx', 'otomoto', 'allegro', 'craigslist', 'facebook marketplace', 'ogłoszenie', 'listing', 'for sale', 'sprzedaż', 'sprzedam'];
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];

function classify(text: string) {
  const lower = text.toLowerCase();
  if (DAMAGE_TERMS.some((term) => lower.includes(term))) return 'damage';
  if (AUCTION_TERMS.some((term) => lower.includes(term))) return 'auction';
  if (LISTING_TERMS.some((term) => lower.includes(term))) return 'listing';
  return 'other';
}

function decodeDuckDuckGoUrl(href: string) {
  try {
    const url = new URL(href, 'https://duckduckgo.com');
    const target = url.searchParams.get('uddg');
    return target ? decodeURIComponent(target) : url.toString();
  } catch {
    return href;
  }
}

async function searchPublicWeb(vin: string) {
  const response = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(`"${vin}"`)}`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; GMT400HistoryChecker/1.0)',
      Accept: 'text/html',
    },
  });

  if (!response.ok) {
    throw new Error(`Wyszukiwarka zwróciła status ${response.status}`);
  }

  const html = await response.text();
  const results: { title: string; url: string; description: string }[] = [];
  const linkRegex = /<a[^>]+class="result__a"[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
  const snippetRegex = /<a[^>]+class="result__snippet"[^>]*>([\s\S]*?)<\/a>/g;
  const snippets: string[] = [];
  let snippetMatch: RegExpExecArray | null;

  while ((snippetMatch = snippetRegex.exec(html)) !== null) {
    snippets.push(snippetMatch[1].replace(/<[^>]+>/g, '').replace(/&/g, '&').trim());
  }

  let match: RegExpExecArray | null;
  while ((match = linkRegex.exec(html)) !== null && results.length < 20) {
    const title = match[2].replace(/<[^>]+>/g, '').replace(/&/g, '&').trim();
    const url = decodeDuckDuckGoUrl(match[1]);
    if (title && url.startsWith('http')) {
      results.push({ title, url, description: snippets[results.length] || '' });
    }
  }

  return results;
}

function absolutizeImageUrl(src: string, pageUrl: string) {
  try {
    return new URL(src, pageUrl).toString();
  } catch {
    return '';
  }
}

async function findPublicImages(results: { url: string; title: string }[]) {
  const images: { url: string; sourceUrl: string; sourceTitle: string }[] = [];
  const sourcePages = results.slice(0, 5);

  for (const result of sourcePages) {
    if (images.length >= 12) break;

    try {
      const response = await fetch(result.url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; GMT400HistoryChecker/1.0)' },
      });
      if (!response.ok) continue;

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('text/html')) continue;

      const html = await response.text();
      const imageRegex = /<img[^>]+(?:data-src|src)="([^"]+)"[^>]*>/gi;
      let imageMatch: RegExpExecArray | null;

      while ((imageMatch = imageRegex.exec(html)) !== null && images.length < 12) {
        const raw = imageMatch[1];
        const absolute = absolutizeImageUrl(raw, result.url);
        const lower = absolute.toLowerCase();

        if (!absolute || lower.startsWith('data:') || lower.includes('svg') || lower.includes('logo') || lower.includes('icon')) continue;
        if (!IMAGE_EXTENSIONS.some((extension) => lower.includes(extension))) continue;
        if (images.some((image) => image.url === absolute)) continue;

        images.push({
          url: absolute,
          sourceUrl: result.url,
          sourceTitle: result.title || result.url,
        });
      }
    } catch {
      // Pojedyncza strona może być niedostępna — pomijamy ją.
    }
  }

  return images;
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

  try {
    let rawResults: { title: string; url: string; description: string }[] = [];
    let provider = 'Publiczne wyniki DuckDuckGo';

    if (apiKey) {
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
      rawResults = (data?.web?.results || []).map((item: any) => ({
        title: item.title || '',
        url: item.url || '',
        description: item.description || '',
      }));
      provider = 'Brave Search';
    } else {
      rawResults = await searchPublicWeb(vin);
    }

    const results = rawResults.map((item) => {
      const combined = `${item.title} ${item.description} ${item.url}`;
      return {
        ...item,
        category: classify(combined),
        vinMatch: combined.toUpperCase().includes(vin) ? 'confirmed' : 'possible',
      };
    });

    const images = await findPublicImages(results);

    const alerts = results
      .filter((item) => item.category === 'damage')
      .map((item) => ({
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
      provider,
      resultCount: results.length,
      results,
      alerts,
      images,
      imageSummary:
        images.length > 0
          ? `Znaleziono ${images.length} potencjalnych zdjęć lub grafik w ${new Set(images.map((image) => image.sourceUrl)).size} publicznie dostępnych źródłach.`
          : 'Nie znaleziono zdjęć ani grafik w publicznie dostępnych źródłach dla tego VIN.',
      disclaimer:
        'Wyniki i zdjęcia pochodzą z publicznych stron. Zdjęcie może przedstawiać inny pojazd, jeśli strona nie potwierdza zgodności pełnego VIN. Brak wyników nie potwierdza braku szkody.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'search_error', message: 'Nie udało się wykonać wyszukiwania historii.', details: error?.message },
      { status: 500 }
    );
  }
}
