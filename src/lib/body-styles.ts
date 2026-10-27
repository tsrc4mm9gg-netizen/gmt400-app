export type BodyStyle = {
  id: string;
  name: string;
  image: string;
  from: number;
  to: number;
  note?: string;
  /** Atrybucja zdjęcia z wolną licencją (Wikimedia Commons). Brak = zdjęcie dotychczasowe (pochodzenie niepotwierdzone). */
  credit?: PhotoCredit;
};

export type PhotoCredit = {
  author: string;
  license: string;
  licenseUrl?: string;
  sourceUrl: string;
  /** Zakres opisu zmian wymagany przez CC BY-SA / dobrą praktykę: wycięcie tła itp. */
  changes: string;
};

// Zakresy lat wg docs/factual-corrections.md (Blazer GMT400 1992–1994, Yukon 1992–2000 itd.).
// Zdjęcia: ?v= wymusza pobranie nowej wersji pliku z CDN i z pamięci przeglądarki.
export const BODY_STYLES: BodyStyle[] = [
  { id: 'tahoe-4d', name: 'Tahoe 4-drzwi', image: '/carousel/tahoe-4d.webp', from: 1995, to: 2000, credit: { author: 'IFCAR', license: 'domena publiczna (public domain)', sourceUrl: 'https://commons.wikimedia.org/wiki/File:1st-Chevrolet-Tahoe-4door.jpg', changes: 'tło usunięte, kadr zmieniony' } },
  { id: 'tahoe-2d', name: 'Tahoe / Blazer 2-drzwi', image: '/carousel/tahoe-2d.webp', from: 1992, to: 1999, note: 'Blazer 1992–1994, Tahoe 2-drzwi 1995–1999', credit: { author: 'Cutlass', license: 'CC0 1.0', licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/', sourceUrl: 'https://commons.wikimedia.org/wiki/File:1997_Chevrolet_Tahoe_2-door_in_Dark_Cherry_Metallic,_front_right,_2-19-2022.jpg', changes: 'tło usunięte, kadr zmieniony' } },
  { id: 'suburban', name: 'Suburban', image: '/carousel/suburban.webp', from: 1992, to: 1999, credit: { author: 'IFCAR', license: 'domena publiczna (public domain)', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Chevrolet-Suburban.jpg', changes: 'tło usunięte, kadr zmieniony' } },
  { id: 'yukon', name: 'GMC Yukon', image: '/carousel/yukon.webp', from: 1992, to: 2000, note: '2-drzwi od 1992, 4-drzwi od 1995', credit: { author: 'IFCAR', license: 'domena publiczna (public domain)', sourceUrl: 'https://commons.wikimedia.org/wiki/File:1st-GMC-Yukon-4door.jpg', changes: 'tło usunięte, kadr zmieniony' } },
  { id: 'ck-reg', name: 'C/K Regular Cab', image: '/ck-reg.jpg', from: 1988, to: 1998 },
  { id: 'ck-ext', name: 'C/K Extended Cab', image: '/ck-ext.jpg', from: 1988, to: 1998, note: 'Trzecie drzwi od 1996' },
  { id: 'k1500', name: 'K1500 4x4', image: '/k1500-black.jpg', from: 1988, to: 1998 },
  { id: 'sierra', name: 'GMC Sierra', image: '/sierra-burgundy.jpg', from: 1988, to: 1998 },
  { id: 'dually', name: 'C/K 3500 Dually', image: '/ck-3500-dually.jpg', from: 1988, to: 2002, note: 'C3500HD do 2002' },
];

export const bodyYears = (b: BodyStyle) => `${b.from}–${b.to}`;
export const findBody = (id: string | null | undefined) => BODY_STYLES.find(b => b.id === id) ?? null;
export const yearOptions = (b: BodyStyle) => Array.from({ length: b.to - b.from + 1 }, (_, i) => String(b.from + i));

// Słowa kluczowe do dopasowania wpisów bazy (pole Model / Nazwa) do wybranego nadwozia.
export const BODY_KEYWORDS: Record<string, string[]> = {
  'tahoe-4d': ['tahoe', '4-drzwi', '4 drzwi', 'yukon'],
  'tahoe-2d': ['tahoe', 'blazer', '2-drzwi', '2 drzwi', 'yukon'],
  suburban: ['suburban'],
  yukon: ['yukon', 'tahoe'],
  'ck-reg': ['regular', 'c/k', 'c1500', 'k1500', 'c2500', 'k2500', 'c3500', 'k3500', '1500', '2500', '3500', 'pickup', 'sierra', 'silverado'],
  'ck-ext': ['extended', 'ext', 'c/k', '1500', '2500', 'pickup', 'sierra', 'silverado'],
  k1500: ['k1500', '4x4', 'k/', 'c/k', 'pickup', 'silverado'],
  sierra: ['sierra', 'gmc'],
  dually: ['dually', '3500', 'dual', 'c/k'],
};
