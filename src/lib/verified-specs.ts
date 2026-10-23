// Dane zweryfikowane wg audytu (docs/factual-corrections.md):
// [W1] en.wikipedia.org/wiki/Chevrolet_C/K_(fourth_generation), [W2] .../Chevrolet_Tahoe,
// [OM95] GM Owner's Manual 1995 C/K 1500, [OM99] GM Owner's Manual 1999 Suburban.
// Jednostki metryczne pierwsze; w nawiasie wartość źródłowa (lb-ft, qt, mil) — 1 lb-ft = 1,3558 Nm, 1 qt = 0,9464 L, 1 mila = 1,609 km.

export const CHECK_NOTE = 'Sprawdź w swoim aucie / manualu — GMT400 ma wiele wariantów (rocznik, GVWR, silnik, skrzynia, RPO).';

export const SOURCES: Record<string, { label: string; url: string }> = {
  W1: { label: 'Wikipedia: Chevrolet C/K (4. generacja)', url: 'https://en.wikipedia.org/wiki/Chevrolet_C/K_(fourth_generation)' },
  W2: { label: 'Wikipedia: Chevrolet Tahoe', url: 'https://en.wikipedia.org/wiki/Chevrolet_Tahoe' },
  OM95: { label: 'GM Owner’s Manual 1995 C/K 1500', url: 'https://assets.gm.com/manuals/chevrolet/1995_chevrolet_1500_owners.pdf' },
  OM99: { label: 'GM Owner’s Manual 1999 Suburban', url: 'https://www.chevrolet.com/ownercenter/content/dam/gmownercenter/gmna/dynamic/manuals/1999/chevrolet/suburban/1999_chevrolet_suburban_owners.pdf' },
};

export type EngineSpec = { name: string; rpo: string; years: string; output: string; note?: string; src: string };

export const ENGINES: EngineSpec[] = [
  { name: '4.3 V6 TBI', rpo: 'LB4', years: '1988–1995', output: '150–165 KM / 312–319 Nm (230–235 lb-ft)', note: 'zależnie od rocznika i GVWR', src: 'W1' },
  { name: '4.3 Vortec 4300', rpo: 'L35', years: '1996–1998', output: '200 KM / 346 Nm (255 lb-ft)', src: 'W1' },
  { name: '5.0 V8 TBI', rpo: 'L03', years: '1988–1995', output: '175 KM / 359–366 Nm (265–270 lb-ft)', src: 'W1' },
  { name: '5.0 Vortec 5000', rpo: 'L30', years: '1996–1998', output: '230 KM / 386 Nm (285 lb-ft)', src: 'W1' },
  { name: '5.7 V8 TBI', rpo: 'L05', years: '1988–1995', output: '190–210 KM / 400–420 Nm (295–310 lb-ft)', src: 'W1' },
  { name: '5.7 Vortec 5700', rpo: 'L31', years: '1996–2000', output: '255 KM / 447 Nm (330 lb-ft)', note: 'Tahoe wg [W2]: 454 Nm (335 lb-ft)', src: 'W1' },
  { name: '7.4 V8 TBI', rpo: 'L19', years: '1988–1995', output: '230 KM / 522 Nm (385 lb-ft)', note: '454 SS 1991–1993: 255 KM / 549 Nm (405 lb-ft)', src: 'W1' },
  { name: '7.4 Vortec 7400', rpo: 'L29', years: '1996–2000', output: '290 KM / 556 Nm (410 lb-ft)', src: 'W1' },
  { name: '6.2 diesel', rpo: 'LH6 / LL4', years: '1988–1993', output: '126–150 KM', src: 'W1' },
  { name: '6.5 diesel (wolnossący)', rpo: 'L49', years: '1994–1995', output: '155 KM / 373 Nm (275 lb-ft)', src: 'W1' },
  { name: '6.5 turbodiesel', rpo: 'L56 (GVWR < 3856 kg / 8500 lb) / L65 (> 3856 kg)', years: '1992–2002', output: '180–195 KM / 488–597 Nm (360–440 lb-ft)', note: 'w Tahoe/Yukon tylko 3-drzwiowe 4WD 1994–1999 [W2]', src: 'W1' },
];

export type FluidRow = { item: string; spec: string; capacity: string; interval: string; src: string };

export const FLUIDS: FluidRow[] = [
  { item: 'Olej silnikowy z filtrem — 1995', spec: 'wg instrukcji', capacity: '4.3: 4,3 L (4,5 qt) · 5.0/5.7: 4,7 L (5 qt) · 6.5 i 7.4: 6,6 L (7 qt)', interval: 'co 12 000 km (7 500 mil); w ciężkich warunkach co 4 800 km (3 000 mil)', src: 'OM95' },
  { item: 'Olej silnikowy z filtrem — Vortec 1996+', spec: 'filtr PF1218, w 4WD PF52', capacity: 'L31: 4,7 L (5 qt) · L29: 6,2 L (6,6 qt)', interval: 'wg instrukcji', src: 'OM99' },
  { item: 'Płyn chłodniczy — 1995', spec: 'płyn wg instrukcji 1995 (nie mieszać typów)', capacity: '4.3: 12,3 L (13 qt) · 5.0/5.7: 16,6 L (17,5 qt) · 6.5: 22,2 L (23,5 qt) · 7.4: 23,7 L (25 qt)', interval: 'co 48 000 km (30 000 mil) / 24 mies.', src: 'OM95' },
  { item: 'Płyn chłodniczy — 1999', spec: 'DEX-COOL (nie mieszać typów)', capacity: 'L31: 16,6 L (17,5 qt), z tylną nagrzewnicą 18,9 L (20 qt) · L29: 23,7 L (25 qt) / 26 L (27,5 qt)', interval: 'co 240 000 km (150 000 mil) / 60 mies.', src: 'OM99' },
  { item: 'ATF 4L60-E (od 1993)', spec: 'DEXRON-III', capacity: 'z FSM', interval: 'co 160 000 km (100 000 mil); w ciężkich warunkach co 80 000 km (50 000 mil)', src: 'OM99' },
  { item: 'Most z blokadą G80', spec: 'SAE 80W-90 GL-5, tylko GM 1052271 — bez modyfikatora tarcia', capacity: 'z FSM', interval: 'wg instrukcji', src: 'OM99' },
  { item: 'Skrzynia rozdzielcza (NP241C / NP243C / NV246)', spec: 'wg instrukcji danej skrzyni', capacity: 'z FSM', interval: 'wg instrukcji', src: 'OM99' },
];

export const TRANSFER_CASES = 'Skrzynie rozdzielcze GMT400 (4WD): NP241C (dźwignia), NP243C (przyciski, od 1996 w Tahoe/Yukon), NV246 AutoTrac (RPO NP8, od 1998). NP231 to Jeep/S-10 — nie GMT400.';
