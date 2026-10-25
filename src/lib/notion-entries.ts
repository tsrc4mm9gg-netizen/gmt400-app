import { cache } from 'react';
import { notionFetch } from './notion-fetch';
import { withoutSuperseded } from './superseded.mjs';

/** Baza wiedzy GMT400 w Notion — jedno źródło dla /api/notion i stron renderowanych na serwerze (ISR). */
export const DATABASE_ID = '746973771d604f1e8276502851176af2';
/** Co ile sekund strony list (/usterki, /diy, /modele, /poradniki, /baza) odświeżają się na serwerze. */
export const LIST_REVALIDATE_SECONDS = 900;
/** Adres API Notion; zmieniany tylko w testach lokalnych (atrapa serwera), na produkcji zawsze api.notion.com. */
const NOTION_API = process.env.NOTION_API_BASE || 'https://api.notion.com';

export type NotionEntry = {
  Nazwa: string; Typ: string; Model: string; Modele: string[]; Opis: string; Objawy: string; Rozwiązanie: string; Lata: string; id: string;
  applicability: { brand: string[]; model: string[]; years: string[]; engine: string[]; drive: string[]; transmission: string[] };
};

export class NotionIncompleteError extends Error {}

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

/** Kompletna lista wpisów (bez oznaczonych jako zastąpione) albo wyjątek — nigdy lista częściowa. */
export async function fetchAllEntries(token: string, revalidate = 300): Promise<NotionEntry[]> {
  let allResults: any[] = [];
  let startCursor: string | undefined;
  let hasMore = true;
  const seenCursors = new Set<string>();
  while (hasMore) {
    const body: any = { page_size: 100 };
    if (startCursor) body.start_cursor = startCursor;
    // Ponawianie przy 429/5xx (limit Notion ~3 zapytania/s); kompletna lista albo błąd — nigdy częściowa.
    const res = await notionFetch(`${NOTION_API}/v1/databases/${DATABASE_ID}/query`, { token, method: 'POST', body: JSON.stringify(body), revalidate, timeoutMs: 15000 });
    if (!res.ok) throw new NotionIncompleteError('Nie udało się pobrać kompletnej bazy Notion.');
    const data = await res.json();
    if (!Array.isArray(data.results) || typeof data.has_more !== 'boolean') throw new NotionIncompleteError('Nieprawidłowa odpowiedź Notion. Nie zwracamy częściowej listy.');
    allResults = allResults.concat(data.results);
    hasMore = data.has_more;
    if (hasMore) {
      const next = data.next_cursor;
      if (typeof next !== 'string' || !next || seenCursors.has(next)) throw new NotionIncompleteError('Nieprawidłowa paginacja Notion. Nie zwracamy częściowej listy.');
      seenCursors.add(next);
      startCursor = next;
    }
  }
  // Wpisy oznaczone „Do usunięcia – zastąpione przez …” zostają w Notion do przeglądu, ale nie trafiają na stronę.
  return withoutSuperseded(allResults.map((page: any): NotionEntry => {
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
}

/** Lista dla stron serwerowych: null, gdy Notion jest niedostępny (strona wtedy sama pobiera dane w przeglądarce). */
export const getListEntries = cache(async (): Promise<NotionEntry[] | null> => {
  const token = process.env.NOTION_TOKEN;
  if (!token) return null;
  try { return await fetchAllEntries(token, LIST_REVALIDATE_SECONDS); } catch { return null; }
});

/** Dane strukturalne ItemList dla listy wpisów (adresy /baza/[id] istnieją i są w sitemap). */
export function itemListJsonLd(name: string, url: string, entries: { id: string; Nazwa: string }[]) {
  return {
    '@context': 'https://schema.org', '@type': 'ItemList', name, url,
    numberOfItems: entries.length,
    itemListElement: entries.map((entry, index) => ({ '@type': 'ListItem', position: index + 1, name: entry.Nazwa, url: `https://www.gmt400.pl/baza/${entry.id}` })),
  };
}
