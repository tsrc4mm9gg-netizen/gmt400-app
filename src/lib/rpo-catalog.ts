import RAW from '../data/rpo-gmt400.json';

/**
 * Kody RPO GMT400 (1988–2000) — wyłącznie kody wydrukowane w dokumentach GM:
 * GM Service Manual „RPO Code List” (1997 CNG, 1998–2000) oraz GM Heritage Center
 * Vehicle Information Kits (order guides 1988–1999). Zestawienie i cytaty: RPO Archive.
 * Generator: /workspace/gmt400/src/rpo/build.py → src/data/rpo-gmt400.json.
 */
export type RpoCategory = 'Silniki' | 'Silnik – osprzęt' | 'Skrzynie' | 'Napęd' | 'Osie' | 'Hamulce' | 'Zawieszenie' | 'Koła i opony' | 'Masy (GVWR)' | 'Holowanie' | 'Pakiety' | 'Wyposażenie' | 'Audio i wskaźniki' | 'Lakiery' | 'Tapicerka' | 'Kody zakładowe';
export type RpoDoc = { id: string; label: string; url: string };
export type RpoApplies = { vehicle: string; years: string; original?: string };
export type RpoEntry = {
  code: string;
  category: RpoCategory;
  description: string;
  original: string;
  years: [number, number] | null;
  models: string[];
  applies: RpoApplies[];
  sources: RpoDoc[];
  source: string;
  sourceTitle: string;
  status: 'verified' | 'disputed' | 'internal';
  hasPolish: boolean;
  notes: string;
  ratio?: string;
};

type RawCode = { c: string; k: string; g: string; p?: string; a: [number, string, string?][]; s: number[]; i?: 1; d?: 1; n?: string };
type RawData = { generated: string; vehicles: string[]; aggregator: { label: string; urls: string[] }; docs: RpoDoc[]; codes: RawCode[] };
const DATA = RAW as unknown as RawData;

export const RPO_GENERATED = DATA.generated;
export const RPO_VEHICLES = DATA.vehicles;
export const RPO_AGGREGATOR = DATA.aggregator;
export const RPO_DOCS = DATA.docs;
export const RPO_CATEGORIES: RpoCategory[] = ['Silniki', 'Skrzynie', 'Napęd', 'Osie', 'Pakiety', 'Hamulce', 'Zawieszenie', 'Holowanie', 'Masy (GVWR)', 'Koła i opony', 'Silnik – osprzęt', 'Wyposażenie', 'Audio i wskaźniki', 'Lakiery', 'Tapicerka', 'Kody zakładowe'];

const yearNumbers = (text: string) => {
  const out: number[] = [];
  for (const part of text.split(',')) {
    const m = part.trim().match(/^(\d{4})(?:\s*[–-]\s*(\d{4}))?$/);
    if (!m) continue;
    const a = Number(m[1]), b = Number(m[2] ?? m[1]);
    for (let y = a; y <= b; y++) out.push(y);
  }
  return out;
};

/** Czy zapis lat z dokumentów (np. „1988–1989, 1993–2000”) obejmuje rok. */
export function yearsInclude(text: string, year: number): boolean {
  return yearNumbers(text).includes(year);
}

export const RPO_CATALOG: RpoEntry[] = DATA.codes.map(raw => {
  const all = raw.a.flatMap(([, years]) => yearNumbers(years));
  const ratio = raw.g.match(/ratio[^\d]*(\d\.\d{2})|(\d\.\d{2})\s*ratio/i);
  const sources = raw.s.map(i => DATA.docs[i]).filter(Boolean);
  return {
    code: raw.c,
    category: raw.k as RpoCategory,
    description: raw.p ?? raw.g,
    original: raw.g,
    years: all.length ? [Math.min(...all), Math.max(...all)] : null,
    models: raw.a.map(([v, years]) => `${DATA.vehicles[v]} ${years}`),
    applies: raw.a.map(([v, years, alt]) => ({ vehicle: DATA.vehicles[v], years, ...(alt ? { original: alt } : {}) })),
    sources,
    source: sources[0]?.url ?? DATA.aggregator.urls[0],
    sourceTitle: sources[0]?.label ?? DATA.aggregator.label,
    status: raw.d ? 'disputed' : raw.i ? 'internal' : 'verified',
    hasPolish: Boolean(raw.p),
    notes: raw.n ?? '',
    ...(ratio && /axle/i.test(raw.g) ? { ratio: (ratio[1] ?? ratio[2]) } : {}),
  };
});

const BY_CODE = new Map(RPO_CATALOG.map(entry => [entry.code, entry]));
export const findRpo = (code: string) => BY_CODE.get(code.toUpperCase());

/** Profil (marka + nadwozie) → nazwa pojazdu w zestawieniu. */
export function rpoVehicleFor(brand: string, platform: string): string | null {
  if (!brand || !platform) return null;
  if (brand === 'Chevrolet') return platform === 'C/K' ? 'Chevrolet C/K' : platform === 'Suburban' ? 'Chevrolet Suburban' : platform === 'Tahoe' ? 'Chevrolet Tahoe' : null;
  if (brand === 'GMC') return platform === 'Sierra' || platform === 'C/K' ? 'GMC Sierra' : platform === 'Suburban' ? 'GMC Suburban' : platform === 'Yukon' ? 'GMC Yukon' : null;
  return null;
}

export type RpoFit = 'listed' | 'other-years' | 'other-vehicle' | 'no-data';
/** Czy kod występuje w dokumentach dla danego pojazdu i rocznika. „no-data” = brak dokumentu dla tego pojazdu/rocznika w zestawieniu. */
export function rpoFit(entry: RpoEntry, vehicle: string | null, year: number | null): RpoFit {
  if (!vehicle || !year) return 'no-data';
  const own = entry.applies.find(a => a.vehicle === vehicle);
  if (!own) return 'other-vehicle';
  return yearsInclude(own.years, year) ? 'listed' : 'other-years';
}

const HINTS: [RegExp, (code: string) => string][] = [
  [/^NP\d{3}$|^NV\d{3,4}$|^4L[68]0E?$|^TH\d{3}$/, code => `${code} to oznaczenie modelu podzespołu (np. reduktora lub skrzyni), a nie kod RPO. Na naklejce szukaj trzyznakowego kodu (np. NP1, NP8, M30, MT1).`],
];

/** Wariant z pomyloną literą O/0 lub I/1 (częsty błąd przy przepisywaniu naklejki). */
function lookalike(code: string): string | null {
  const swaps: Record<string, string> = { O: '0', '0': 'O', I: '1', '1': 'I' };
  const chars = code.split('');
  for (let i = 0; i < chars.length; i++) {
    const swap = swaps[chars[i]];
    if (!swap) continue;
    const candidate = chars.map((c, j) => (j === i ? swap : c)).join('');
    if (BY_CODE.has(candidate)) return candidate;
  }
  return null;
}

export type RpoTokenResult = { code: string; entry: RpoEntry | null; suggestion: string | null; hint: string | null };

export function decodeRpo(input: string) {
  const tokens = [...new Set(input.toUpperCase().trim().split(/[\s,;|/]+/).filter(Boolean))].slice(0, 120);
  const valid = tokens.filter(code => /^[A-Z0-9]{3}$/.test(code));
  const invalid = tokens.filter(code => !/^[A-Z0-9]{3}$/.test(code));
  const matches = valid.map(code => ({ code, entries: BY_CODE.has(code) ? [BY_CODE.get(code)!] : [] }));
  const results: RpoTokenResult[] = tokens.map(code => {
    const entry = BY_CODE.get(code) ?? null;
    const hint = HINTS.find(([re]) => re.test(code))?.[1](code) ?? null;
    return { code, entry, suggestion: entry || code.length !== 3 ? null : lookalike(code), hint };
  });
  const ratios = new Set(matches.flatMap(match => match.entries.flatMap(entry => (entry.ratio ? [entry.ratio] : []))));
  return { tokens, matches, invalid, results, ratioConflict: ratios.size > 1 };
}
