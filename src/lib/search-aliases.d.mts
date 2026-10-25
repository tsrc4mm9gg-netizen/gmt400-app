export interface PreparedQuery {
  normalized: string;
  tokens: string[];
  hard: string[][];
  soft: string[];
  routes: { id: string; boost: number }[];
  note: string | null;
  gap: string | null;
  routedOnly: boolean;
}
export const STOPWORDS: Set<string>;
export const MODEL_WORDS: Set<string>;
export const SYNONYM_GROUPS: string[][];
export const GUIDE_ROUTES: { id: string; test: RegExp; boost: number; gap?: string; requires?: RegExp }[];
export const GAP_NOTES: Record<string, string>;
export function normalizeSearch(value: unknown): string;
export function prepareQuery(query: string): PreparedQuery;
export function scoreDocument(prepared: PreparedQuery, doc: { title: string; body: string; id: string }): number;
