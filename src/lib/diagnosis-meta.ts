import { excerptOf, modelLabel, yearsLabel } from './entry-tile';
import { allNotionIds } from './diagnosis';

/** Dane wpisu potrzebne kafelkowi w narzędziu — mały obiekt, żeby nie przesyłać całych opisów. */
export type EntryMeta = { type: string; title: string; models: string; years: string; excerpt: string };
export type MetaMap = Record<string, EntryMeta>;

type EntryLike = { id: string; Nazwa: string; Typ: string; Opis?: string; Objawy?: string; Rozwiązanie?: string; Model?: string; Modele?: string[]; Lata?: string };

/** Długie opisy zakresu lat (np. „Instrukcja GM 1999 … ”) nie mieszczą się w znaczniku — pełny zakres jest we wpisie. */
function shortYears(label: string): string {
  return label.length > 22 ? 'zob. wpis' : label;
}

/** Wpisy użyte w narzędziu (tylko istniejące i niezastąpione — lista z Notion jest już po filtrze „zastąpione”). */
export function buildMeta(entries: EntryLike[]): MetaMap {
  const wanted = new Set(allNotionIds());
  const meta: MetaMap = {};
  for (const entry of entries) {
    if (!wanted.has(entry.id)) continue;
    meta[entry.id] = {
      type: entry.Typ,
      title: entry.Nazwa.replace(/\s+/g, ' ').trim(),
      models: modelLabel(entry),
      years: shortYears(yearsLabel(entry.Lata)),
      excerpt: excerptOf(entry, ['Objawy', 'Opis'], 150),
    };
  }
  return meta;
}
