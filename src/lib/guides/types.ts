export type SourceKind = 'official' | 'media' | 'forum' | 'shop';

export type Source = {
  id: string;
  label: string;
  url: string;
  kind: SourceKind;
  /** Data publikacji/aktualizacji źródła (dd.mm.rrrr) albo "sprawdzono 24.10.2026", gdy strona nie podaje daty. */
  date: string;
};

export type Cited = { text: string; src?: string[] };

export type Block =
  | { t: 'p'; text: string; src?: string[] }
  | { t: 'list'; items: Cited[]; ordered?: boolean }
  | { t: 'check'; title: string; items: Cited[] }
  | { t: 'table'; caption: string; head: string[]; rows: { cells: string[]; src: string[] }[] }
  | { t: 'callout'; tone: 'warn' | 'conflict' | 'info' | 'legal'; title: string; text: string; src?: string[] }
  | { t: 'reports'; title: string; items: { date: string; where: string; text: string; src: string }[] }
  | { t: 'svg'; id: 'lights-wiring' }
  | { t: 'calc' };

export type Section = { id: string; title: string; open?: boolean; blocks: Block[] };

export type Guide = {
  slug: string;
  /** Szkic: poradnik jest w repo, ale ukryty (hub, strona główna, menu, sitemap, wyszukiwarka, adres daje 404), dopóki nie ma źródeł. Usuń pole po przepisaniu ze źródłami. */
  draft?: boolean;
  title: string;
  short: string;
  description: string;
  /** Tytuł i opis do <title>/meta (z nazwami modeli); H1 i karty używają title/description. */
  seoTitle?: string;
  seoDescription?: string;
  /** Data, na którą sprawdzono wszystkie liczby na stronie. */
  asOf: string;
  /** Id z BODY_STYLES (src/lib/body-styles.ts). */
  bodies: string[];
  years: string;
  engines?: string;
  summary: string[];
  sections: Section[];
  mistakes: string[];
  faq: { q: string; a: string; src?: string[] }[];
  related: string[];
  keywords: string[];
};
