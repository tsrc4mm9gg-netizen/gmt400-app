import { BODY_STYLES, findBody, type BodyStyle } from './body-styles';

// Zdjęcia modeli z katalogu (public/*.jpg) — bez parametru ?v=, żeby next/image mógł je optymalizować.
export const bodyImage = (body: BodyStyle) => body.image.split('?')[0];
export const modelHref = (body: BodyStyle) => `/modele/${body.id}`;

const normalize = (value: string) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/g, 'l');

// Kolejność ma znaczenie: od najbardziej szczegółowych nazw do ogólnych.
const RULES: [RegExp, string][] = [
  [/suburban/, 'suburban'],
  [/blazer|tahoe[^,;]{0,20}2[ -]?drzw|2[ -]?drzw[^,;]{0,20}tahoe/, 'tahoe-2d'],
  [/tahoe/, 'tahoe-4d'],
  [/yukon/, 'yukon'],
  [/sierra/, 'sierra'],
  [/dually|[ck]3500/, 'dually'],
  [/extended cab|ext cab|club coupe/, 'ck-ext'],
  [/\bk1500\b/, 'k1500'],
  [/\bc\/k\b|\bc1500\b|\bc2500\b|\bk2500\b|silverado|regular cab|pickup/, 'ck-reg'],
];

/** Dopasowuje nadwozie na podstawie pola Model (gdy konkretne) albo nazwy wpisu. Zwraca null dla „Wszystkie”. */
export function bodyForEntry(entry: { Model?: string; Nazwa?: string }): BodyStyle | null {
  const model = normalize(entry.Model || '');
  const sources = [model && model !== 'wszystkie' ? model : '', normalize(entry.Nazwa || '')];
  for (const source of sources) {
    if (!source) continue;
    const rule = RULES.find(([pattern]) => pattern.test(source));
    if (rule) return findBody(rule[1]);
  }
  return null;
}

export { BODY_STYLES };

// Te same słowa kluczowe co filtr nadwozia w Encyclopedia.tsx (wpisy „Wszystkie” pasują do każdego nadwozia).
export const BODY_MATCH: Record<string, string[]> = {
  'tahoe-4d': ['tahoe', '4-drzwi', '4 drzwi'],
  'tahoe-2d': ['tahoe', 'blazer', '2-drzwi', '2 drzwi'],
  suburban: ['suburban'],
  yukon: ['yukon'],
  'ck-reg': ['regular', 'c/k', '1500', '2500', '3500'],
  'ck-ext': ['extended', 'extended cab'],
  k1500: ['k1500', '4x4'],
  sierra: ['sierra', 'gmc'],
  dually: ['dually', '3500', 'dual'],
};

export const isGeneralEntry = (entry: { Model?: string }) => {
  const model = (entry.Model || '').toLowerCase();
  return !model || model.includes('wszystk') || model.includes('gmt400');
};

export const isSpecificToBody = (entry: { Model?: string; Nazwa?: string }, bodyId: string) => {
  const keywords = BODY_MATCH[bodyId] || [];
  const model = (entry.Model || '').toLowerCase();
  const name = (entry.Nazwa || '').toLowerCase();
  return keywords.some(keyword => (!isGeneralEntry(entry) && model.includes(keyword)) || name.includes(keyword));
};
