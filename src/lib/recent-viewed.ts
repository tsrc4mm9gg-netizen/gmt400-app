/** „Ostatnio oglądane”: lokalna historia otwartych wpisów (localStorage, bez kont i bez wysyłania danych). */
export type RecentItem = { id: string; title: string; href: string; type: string };
export const RECENT_STORAGE_KEY = 'gmt400-recent';
export const RECENT_EVENT = 'gmt400-recent-change';
export const RECENT_STORE_MAX = 8;
export const RECENT_SHOWN = 5;

/** Akceptuje tylko wewnętrzne ścieżki i krótkie, tekstowe pola — zapis z localStorage traktujemy jak dane niezaufane. */
export function parseRecent(raw: string | null): RecentItem[] {
  if (!raw) return [];
  let data: unknown;
  try { data = JSON.parse(raw); } catch { return []; }
  if (!Array.isArray(data)) return [];
  const out: RecentItem[] = [];
  for (const entry of data) {
    if (!entry || typeof entry !== 'object') continue;
    const { id, title, href, type } = entry as Record<string, unknown>;
    if (typeof id !== 'string' || typeof title !== 'string' || typeof href !== 'string' || typeof type !== 'string') continue;
    if (!id || id.length > 80 || !title.trim() || title.length > 160 || type.length > 24) continue;
    if (!/^\/(?!\/)[A-Za-z0-9/_\-.%]*$/.test(href) || href.length > 120) continue;
    if (out.some(x => x.id === id)) continue;
    out.push({ id, title: title.trim(), href, type });
    if (out.length >= RECENT_STORE_MAX) break;
  }
  return out;
}

export function pushRecent(list: RecentItem[], item: RecentItem): RecentItem[] {
  return [item, ...list.filter(x => x.id !== item.id)].slice(0, RECENT_STORE_MAX);
}

export function readRecent(): RecentItem[] {
  try { return parseRecent(window.localStorage.getItem(RECENT_STORAGE_KEY)); } catch { return []; }
}

export function trackRecent(item: RecentItem): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(pushRecent(readRecent(), item)));
    window.dispatchEvent(new Event(RECENT_EVENT));
  } catch { /* pamięć niedostępna — historia jest opcjonalna */ }
}

export function clearRecent(): void {
  try { window.localStorage.removeItem(RECENT_STORAGE_KEY); window.dispatchEvent(new Event(RECENT_EVENT)); } catch { /* ignoruj */ }
}

/** Etykieta typu wpisu w Notion → krótka nazwa po polsku. */
export function recentTypeLabel(typ: string): string {
  return typ === 'Usterka' ? 'Usterka' : typ === 'Porada' ? 'Poradnik DIY' : typ === 'Kod błędu' ? 'Kod OBD' : typ === 'Model' ? 'Model' : 'Wpis';
}
