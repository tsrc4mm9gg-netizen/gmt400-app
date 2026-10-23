// Dekoder VIN GMT400 — tylko pozycje, które mają źródło:
//  • budowa VIN, cyfra kontrolna (poz. 9) i kod roku (poz. 10): 49 CFR § 565.15 (NHTSA, eCFR),
//  • kod silnika (poz. 8): tabele „Engine Identification” / „Capacities and Specifications” z instrukcji GM (OM).
//  • pozycje 1–7 i 11: tabele „Vehicle Identification Number (VIN) System” z GM Service Manual 1998–2000 (C/K, Suburban),
//    WMI z GM VIN Numbering Standards (zgłoszenie GM do NHTSA), a dla 1988–97 katalog LMC Truck (źródło wtórne, oznaczone).
// Kod bez tabeli dla danego rocznika = „nieznane – sprawdź” (nie zgadujemy).

export const VIN_SOURCES = {
  cfr: { short: '49 CFR 565', title: '49 CFR § 565.15 — budowa VIN (eCFR, NHTSA)', url: 'https://www.ecfr.gov/current/title-49/subtitle-B/chapter-V/part-565/subpart-B/section-565.15' },
  om94: { short: 'OM 1994', title: 'OM 1994 Chevrolet C/K Pickup — Engine Identification (kopia dezosmanuals.com)', url: 'https://dezosmanuals.com/wp-content/uploads/2021/07/1994-Chevrolet-1500.pdf' },
  om95: { short: 'OM 1995', title: 'OM 1995 Chevrolet C/K Pickup — Engine Identification (assets.gm.com)', url: 'https://assets.gm.com/manuals/chevrolet/1995_chevrolet_1500_owners.pdf' },
  om96: { short: 'OM 1996', title: 'OM 1996 Chevrolet C/K Pickup — Capacities and Specifications (assets.gm.com)', url: 'https://assets.gm.com/manuals/chevrolet/1996_chevrolet_1500_owners.pdf' },
  om97: { short: 'OM 1997', title: 'OM 1997 Chevrolet C/K Pickup — Capacities and Specifications (assets.gm.com)', url: 'https://assets.gm.com/manuals/chevrolet/1997_chevrolet_1500_owners.pdf' },
  om98: { short: 'OM 1998', title: 'OM 1998 Chevrolet C/K Pickup — Capacities and Specifications (assets.gm.com)', url: 'https://assets.gm.com/manuals/chevrolet/1998_chevrolet_1500_owners.pdf' },
  om99: { short: 'OM 1999 Suburban', title: 'OM 1999 Chevrolet Suburban — Engine Identification (chevrolet.com)', url: 'https://www.chevrolet.com/ownercenter/content/dam/gmownercenter/gmna/dynamic/manuals/1999/chevrolet/suburban/1999_chevrolet_suburban_owners.pdf' },
  vpic: { short: 'NHTSA vPIC', title: 'NHTSA vPIC — oficjalny dekoder VIN', url: 'https://vpic.nhtsa.dot.gov/decoder/' },
  gmsm98: { short: 'GM SM 1998', title: 'GM Service Manual 1998 C/K Suburban — Vehicle Identification (kopia gm.saturn.team)', url: 'https://gm.saturn.team/Chevrolet/Chevy_Suburban___4WD/1998/5/99/469/47882' },
  gmsm99: { short: 'GM SM 1999', title: 'GM Service Manual 1999 C/K Pickup — Vehicle Identification (kopia gm.saturn.team)', url: 'https://gm.saturn.team/Chevrolet/Chevy_K_Pickup___4WD/1999/7/99/740/47882' },
  gmsm00: { short: 'GM SM 2000', title: 'GM Service Manual 2000 — Vehicle Identification, tabela C/K (kopia gm.saturn.team)', url: 'https://gm.saturn.team/GMC_Truck/Yukon_Denali/2000/10/99/927/47882' },
  gmsms10: { short: 'GM SM 1999 (kody marki)', title: 'GM Service Manual 1999 (S10) — tabela kodów marki C/K/N/T (kopia gm.saturn.team)', url: 'https://gm.saturn.team/Chevrolet/S10_Pickup___4WD/1999/7/99/740/47882' },
  gmstd: { short: 'GM VIN Standards', title: 'GM VIN Numbering Standards (zgłoszenie GM do NHTSA, 2003) — Table A1 WMI, A4 fabryki', url: 'https://static.nhtsa.gov/nhtsa/downloads/MfrMail/01-022-N11B-9605.pdf' },
  lmc: { short: 'LMC (wtórne)', title: 'LMC Truck — „1988-98 Vehicle ID Number (VIN)” (katalog, źródło wtórne)', url: 'https://media.lmctruck.com/Catalog_Chassis-Eng_IDs/Chassis_ID/CD_VIN-Chassis_ID.pdf' },
  jegs: { short: 'JEGS (wtórne)', title: 'JEGS — GM Truck VIN Decoder Chart 1996–98 (źródło wtórne)', url: 'https://www.jegs.com/tech-articles/gm-truck-vin-decoder-gm-decoder-chart/' },
};

/** Tabela pozycji VIN: lata, poziom źródła (gm = dokument GM, secondary = katalog/poradnik) i kody. */
const T = (from, to, tier, sources, codes, note) => ({ from, to, tier, sources, codes, ...(note ? { note } : {}) });
const GM_C1_98_00 = ['gmsm98', 'gmsm99', 'gmsm00'];
export const POSITION_TABLES = {
  1: [T(1988, 2000, 'gm', [...GM_C1_98_00, 'lmc'], { 1: 'USA', 2: 'Kanada', 3: 'Meksyk' })],
  3: [
    T(1988, 2000, 'gm', ['gmstd', 'gmsms10'], { C: 'Chevrolet — ciężarówka (Chevrolet Truck)', T: 'GMC — ciężarówka (GMC Truck)', N: 'Chevrolet — pojazd wielozadaniowy (MPV, np. Suburban/Tahoe)', K: 'GMC — pojazd wielozadaniowy (MPV, np. Suburban/Yukon)' }),
  ],
  4: [
    T(1998, 2000, 'gm', GM_C1_98_00, { B: '3001–4000 lb, hamulce hydrauliczne', C: '4001–5000 lb, hydrauliczne', D: '5001–6000 lb, hydrauliczne', E: '6001–7000 lb, hydrauliczne', F: '7001–8000 lb, hydrauliczne', G: '8001–9000 lb, hydrauliczne', H: '9001–10000 lb, hydrauliczne', J: '10001–14000 lb, hydrauliczne', K: '14001–16000 lb, hydrauliczne' }),
    T(1996, 1997, 'secondary', ['jegs'], { B: '3001–4000 lb', C: '4001–5000 lb', D: '5001–6000 lb', E: '6001–7000 lb', F: '7001–8000 lb', G: '8001–9000 lb', H: '9001–10000 lb', J: '10001–14000 lb', K: '14001–16000 lb' }),
    T(1988, 1998, 'secondary', ['lmc'], { D: '5001–6000 lb, hydrauliczne', E: '6001–7000 lb, hydrauliczne', F: '7001–8000 lb, hydrauliczne', G: '8001–9000 lb, hydrauliczne', H: '9001–10000 lb, hydrauliczne' }),
  ],
  5: [
    T(1998, 2000, 'gm', GM_C1_98_00, { C: 'kabina konwencjonalna, 4x2 (C)', D: 'ciężarówka wojskowa, 4x4', K: 'kabina konwencjonalna, 4x4 (K)' }),
    T(1996, 1997, 'secondary', ['jegs'], { C: 'kabina konwencjonalna, 4x2', K: 'kabina konwencjonalna, 4x4', R: 'kabina/podwozie konwencjonalne 4x2 (seria R)', V: 'kabina/podwozie konwencjonalne 4x4 (seria V)' }),
    T(1988, 1998, 'secondary', ['lmc'], { C: 'napęd 2WD (C)', K: 'napęd 4WD (K)' }),
  ],
  6: [
    T(1998, 2000, 'gm', GM_C1_98_00, { 1: '½ tony (1500)', 2: '¾ tony (2500)', 3: '1 tona (3500)' }),
    T(1988, 1997, 'secondary', ['lmc'], { 1: '½ tony (1500)', 2: '¾ tony (2500)', 3: '1 tona (3500)' }),
  ],
  7: [
    T(1998, 1999, 'gm', ['gmsm98', 'gmsm99'], { 3: 'Crew Cab (kabina czterodrzwiowa)', 4: 'kabina dwudrzwiowa', 6: 'Suburban', 8: 'Utility (nadwozie terenowe)', 9: 'kabina przedłużona (Extended Cab)' }),
    T(2000, 2000, 'gm', ['gmsm00'], { 3: 'Crew Cab (kabina czterodrzwiowa)', 4: 'kabina dwudrzwiowa', 9: 'kabina przedłużona (Extended Cab)' }, 'Tabela GM 2000 podaje 5 kodów (3 4 6 8 9) i tylko 4 opisy — kody 6 i 8 są dla 2000 niejednoznaczne.'),
    T(1996, 1997, 'secondary', ['jegs'], { 3: 'Crew Cab / kabina czterodrzwiowa', 4: 'kabina dwudrzwiowa', 6: 'Suburban', 8: 'Blazer/Jimmy/Utility', 9: 'kabina przedłużona' }),
    T(1988, 1997, 'secondary', ['lmc'], { 3: 'Crew Cab', 4: 'kabina dwudrzwiowa', 9: 'kabina przedłużona' }),
  ],
  11: [
    T(1998, 1998, 'gm', ['gmsm98'], { 1: 'Oshawa, Ontario (Kanada)', E: 'Pontiac, Michigan', Z: 'Fort Wayne, Indiana', J: 'Janesville, Wisconsin', G: 'Silao (Meksyk)', R: 'Arlington, Teksas' }),
    T(1999, 2000, 'gm', ['gmsm99', 'gmsm00'], { J: 'Janesville, Wisconsin', F: 'Flint, Michigan', G: 'Silao (Meksyk)', R: 'Arlington, Teksas' }),
    T(1988, 1998, 'secondary', ['lmc'], { E: 'Pontiac, Michigan', F: 'Flint, Michigan', Z: 'Fort Wayne, Indiana', 1: 'Oshawa, Ontario (Kanada)' }),
  ],
};
const POSITION_LABELS = { 1: 'Kraj produkcji', 2: 'Producent', 3: 'Marka / rodzaj pojazdu', 4: 'GVWR (dopuszczalna masa) i hamulce', 5: 'Linia / podwozie (napęd)', 6: 'Seria (tonaż)', 7: 'Nadwozie', 8: 'Silnik', 9: 'Cyfra kontrolna', 10: 'Rok modelowy', 11: 'Fabryka', 12: 'Numer seryjny' };
export const UNKNOWN = 'nieznane – sprawdź';

function lookup(pos, code, year) {
  const tables = POSITION_TABLES[pos] ?? [];
  const inYear = tables.filter(t => year !== null && year >= t.from && year <= t.to);
  const hits = inYear.filter(t => t.codes[code]);
  const best = hits.find(t => t.tier === 'gm') ?? hits[0];
  if (best) return { value: best.codes[code], tier: best.tier, sources: [...new Set(hits.flatMap(t => t.sources))], note: best.note };
  const other = tables.find(t => t.codes[code]);
  const note = inYear.find(t => t.note)?.note;
  const yearNote = year === null ? 'rok modelowy nieodczytany' : inYear.length ? `kodu „${code}” nie ma w tabeli dla ${year}` : `brak tabeli dla ${year}`;
  return { value: null, tier: 'unknown', sources: inYear.flatMap(t => t.sources), note: [note, `${yearNote}${other ? ` (w tabeli ${other.from === other.to ? other.from : `${other.from}–${other.to}`} „${code}” = ${other.codes[code]})` : ''} — sprawdź w vPIC i na naklejce SPID.`].filter(Boolean).join(' ') };
}


// Tabela VII w § 565.15 podaje kody dla 2005–2039; nota do tabeli: przy cyfrze na poz. 7 rok dotyczy zakresu 1980–2009,
// a kody powtarzają się co 30 lat (np. J = 2018 → 1988). Poniżej zakres GMT400.
export const YEAR_CODES = { J: 1988, K: 1989, L: 1990, M: 1991, N: 1992, P: 1993, R: 1994, S: 1995, T: 1996, V: 1997, W: 1998, X: 1999, Y: 2000 };

const TBI = 'wtrysk jednopunktowy TBI';
const C94_95 = 'C/K Pickup (wg OM C/K)';
const LMC_SCOPE = 'C/K Pickup 1988–98 (katalog LMC — źródło wtórne, bez kodów RPO)';
const GM_SCOPE = 'C/K, Suburban, Tahoe/Yukon (tabela VIN z GM Service Manual)';
/** Kody silnika: [lata, poziom źródła, źródła, zakres, { kod: opis }]. Najpierw dokumenty GM, potem źródła wtórne. */
export const ENGINE_TABLES = [
  { from: 1994, to: 1995, tier: 'gm', sources: ['om94', 'om95'], scope: C94_95, codes: {
    Z: { engine: '4.3 L V6', fuel: `benzyna, ${TBI}` }, H: { engine: '5.0 L V8', fuel: `benzyna, ${TBI}` },
    K: { engine: '5.7 L V8', fuel: `benzyna, ${TBI}` }, N: { engine: '7.4 L V8', fuel: `benzyna, ${TBI}` },
    P: { engine: '6.5 L V8 diesel', fuel: 'diesel wolnossący' }, S: { engine: '6.5 L V8 turbodiesel', fuel: 'turbodiesel (emisje LD)' },
    F: { engine: '6.5 L V8 turbodiesel', fuel: 'turbodiesel (emisje HD, GVWR > 8500 lb)' } } },
  { from: 1996, to: 1998, tier: 'gm', sources: ['om96', 'om97', 'om98'], scope: 'C/K Pickup, silniki benzynowe (wg OM C/K; diesel opisuje osobny Diesel Engine Supplement)', codes: {
    W: { engine: 'Vortec 4300 V6', rpo: 'L35' }, M: { engine: 'Vortec 5000 V8', rpo: 'L30' },
    R: { engine: 'Vortec 5700 V8', rpo: 'L31' }, J: { engine: 'Vortec 7400 V8', rpo: 'L29' } } },
  { from: 1998, to: 1998, tier: 'gm', sources: ['gmsm98'], scope: GM_SCOPE, codes: {
    F: { engine: '6.5 L V8 diesel', rpo: 'L65' }, M: { engine: '5.0 L V8 benzyna', rpo: 'L30' }, R: { engine: '5.7 L V8 benzyna', rpo: 'L31' },
    J: { engine: '7.4 L V8 benzyna', rpo: 'L29' }, S: { engine: '6.5 L V8 diesel', rpo: 'L56' }, W: { engine: '4.3 L V6 benzyna', rpo: 'L35' } } },
  { from: 1999, to: 1999, tier: 'gm', sources: ['om99'], scope: 'Suburban, silniki benzynowe (wg OM Suburban 1999; diesel w osobnym suplemencie)', codes: {
    R: { engine: 'Vortec 5700 V8', rpo: 'L31', fuel: 'benzyna, wtrysk sekwencyjny SFI' }, J: { engine: 'Vortec 7400 V8', rpo: 'L29', fuel: 'benzyna, wtrysk sekwencyjny SFI' } } },
  { from: 1999, to: 1999, tier: 'gm', sources: ['gmsm99'], scope: GM_SCOPE, codes: {
    F: { engine: '6.5 L V8 diesel', rpo: 'L65' }, M: { engine: '5.0 L V8 benzyna', rpo: 'L30' }, R: { engine: '5.7 L V8 benzyna', rpo: 'L31' },
    J: { engine: '7.4 L V8 benzyna', rpo: 'L29' }, S: { engine: '6.5 L V8 diesel', rpo: 'L56' } } },
  { from: 2000, to: 2000, tier: 'gm', sources: ['gmsm00'], scope: 'C/K 2000 (tabela VIN z GM Service Manual)', codes: {
    F: { engine: '6.5 L V8 diesel', rpo: 'L65' }, R: { engine: '5.7 L V8 benzyna', rpo: 'L31' }, J: { engine: '7.4 L V8 benzyna', rpo: 'L29' }, S: { engine: '6.5 L V8 diesel', rpo: 'L56' } } },
  { from: 1988, to: 1989, tier: 'secondary', sources: ['lmc'], scope: LMC_SCOPE, codes: {
    C: { engine: '6.2 L V8 diesel' }, H: { engine: '5.0 L V8 (305)' }, J: { engine: '6.2 L V8 diesel' }, K: { engine: '5.7 L V8 (350)' }, Z: { engine: '4.3 L V6 (262)' } } },
  { from: 1990, to: 1991, tier: 'secondary', sources: ['lmc'], scope: LMC_SCOPE, codes: {
    C: { engine: '6.2 L V8 diesel' }, H: { engine: '5.0 L V8 (305)' }, J: { engine: '6.2 L V8 diesel' }, K: { engine: '5.7 L V8 (350)' }, N: { engine: '7.4 L V8 (454)' }, Z: { engine: '4.3 L V6 (262)' } } },
  { from: 1992, to: 1993, tier: 'secondary', sources: ['lmc'], scope: LMC_SCOPE, codes: {
    C: { engine: '6.2 L V8 diesel' }, F: { engine: '6.5 L V8 turbodiesel' }, H: { engine: '5.0 L V8 (305)' }, J: { engine: '6.2 L V8 diesel' }, K: { engine: '5.7 L V8 (350)' }, N: { engine: '7.4 L V8 (454)' }, Z: { engine: '4.3 L V6 (262)' } } },
  { from: 1994, to: 1995, tier: 'secondary', sources: ['lmc'], scope: LMC_SCOPE, codes: {
    F: { engine: '6.5 L V8 turbodiesel' }, H: { engine: '5.0 L V8 (305)' }, K: { engine: '5.7 L V8 (350)' }, N: { engine: '7.4 L V8 (454)' }, P: { engine: '6.5 L V8 diesel' }, S: { engine: '6.5 L V8 turbodiesel' }, Z: { engine: '4.3 L V6 (262)' } } },
  { from: 1996, to: 1998, tier: 'secondary', sources: ['lmc'], scope: LMC_SCOPE, codes: {
    F: { engine: '6.5 L V8 turbodiesel' }, J: { engine: '7.4 L V8 (454)' }, M: { engine: '5.0 L V8 (305)' }, R: { engine: '5.7 L V8 (350)' }, S: { engine: '6.5 L V8 turbodiesel' }, W: { engine: '4.3 L V6 (262)' } } },
];

function findEngine(year, code) {
  const tables = ENGINE_TABLES.filter(t => year >= t.from && year <= t.to);
  const hits = tables.filter(t => t.codes[code]);
  const best = hits.find(t => t.tier === 'gm') ?? hits[0];
  if (!best) return { tables, engine: null };
  return { tables, engine: { code, ...best.codes[code], scope: best.scope, tier: best.tier, sources: [...new Set(hits.flatMap(t => t.sources))] } };
}

const VALUES = { A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, J: 1, K: 2, L: 3, M: 4, N: 5, P: 7, R: 9, S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9 };
const WEIGHTS = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];

export function normalizeVin(value) {
  return String(value ?? '').toUpperCase().replace(/[\s-]/g, '');
}

/** Oczekiwana cyfra kontrolna wg § 565.15(c); null, gdy VIN ma niedozwolone znaki lub złą długość. */
export function expectedCheckDigit(vin) {
  if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) return null;
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    const ch = vin[i];
    const v = /\d/.test(ch) ? Number(ch) : VALUES[ch];
    sum += v * WEIGHTS[i];
  }
  const r = sum % 11;
  return r === 10 ? 'X' : String(r);
}

export function decodeVin(input) {
  const vin = normalizeVin(input);
  const errors = [];
  if (vin.length !== 17) errors.push(`VIN musi mieć 17 znaków (wpisano ${vin.length}).`);
  const bad = [...new Set(vin.replace(/[A-HJ-NPR-Z0-9]/g, ''))];
  if (bad.length) errors.push(`Niedozwolone znaki: ${bad.join(' ')} — VIN nie zawiera liter I, O ani Q (pomyliłeś z 1 lub 0?).`);
  if (errors.length) return { vin, ok: false, errors };
  const expected = expectedCheckDigit(vin);
  const checkOk = vin[8] === expected;
  const yearCode = vin[9];
  const year = /\d/.test(vin[6]) ? (YEAR_CODES[yearCode] ?? null) : null;
  const engineCode = vin[7];
  let engine = null;
  let engineNote;
  if (year) {
    const found = findEngine(year, engineCode);
    if (!found.tables.length) engineNote = `Brak tabeli kodów silnika dla ${year} w naszych źródłach — ${UNKNOWN} w „Engine Identification” w instrukcji swojego rocznika.`;
    else if (found.engine) engine = found.engine;
    else engineNote = `Kod „${engineCode}” nie występuje w tabelach dla ${year} (${[...new Set(found.tables.map(t => t.scope))].join('; ')}) — ${UNKNOWN} w instrukcji i w vPIC.`;
  } else engineNote = 'Najpierw musi się zgadzać rok modelowy (poz. 10).';
  const fields = buildFields(vin, year, engine, engineNote, checkOk, expected);
  return {
    vin, ok: true, errors: [],
    wmi: vin.slice(0, 3), vds: vin.slice(3, 8), check: { value: vin[8], expected, ok: checkOk },
    yearCode, year, yearInRange: year !== null,
    engine, engineNote, plantCode: vin[10], serial: vin.slice(11), fields,
  };
}

const field = (pos, code, r) => ({ pos, code, label: POSITION_LABELS[Number(String(pos).split('–')[0])], value: r.value, tier: r.tier, sources: r.sources, ...(r.note ? { note: r.note } : {}) });

/** Wszystkie pozycje VIN z wartością, poziomem źródła i linkami. value === null ⇒ „nieznane – sprawdź”. */
function buildFields(vin, year, engine, engineNote, checkOk, expected) {
  const out = [];
  out.push(field('1', vin[0], lookup(1, vin[0], year ?? 1998)));
  out.push(field('2', vin[1], vin[1] === 'G' ? { value: 'General Motors', tier: 'gm', sources: [...GM_C1_98_00, 'gmstd'] } : { value: null, tier: 'unknown', sources: [], note: 'Pojazdy GMT400 mają „G” (General Motors) — inny znak oznacza, że to nie VIN GM.' }));
  const make = vin[2];
  if (make === 'B' || make === 'D') out.push(field('3', make, { value: null, tier: 'unknown', sources: GM_C1_98_00, note: `Tabela GM C/K 1998–2000 wymienia kody B, C, D, T z opisami „Chevrolet, Incomplete Chevrolet Truck, GMC, Incomplete GMC Truck” bez jednoznacznego przypisania. „${make}” wiąże się z marką ${make === 'B' ? 'Chevrolet' : 'GMC'}, ale rodzaj (kompletny / niekompletny pojazd) — ${UNKNOWN} w vPIC.` }));
  else out.push(field('3', make, lookup(3, make, year ?? 1998)));
  for (const pos of [4, 5, 6, 7]) out.push(field(String(pos), vin[pos - 1], lookup(pos, vin[pos - 1], year)));
  out.push(field('8', vin[7], engine ? { value: `${engine.engine}${engine.rpo ? ` — RPO ${engine.rpo}` : ''}${engine.fuel ? `, ${engine.fuel}` : ''}`, tier: engine.tier, sources: engine.sources } : { value: null, tier: 'unknown', sources: [], note: engineNote }));
  out.push(field('9', vin[8], { value: checkOk ? 'zgadza się z wyliczeniem' : `nie zgadza się — powinno być ${expected}`, tier: 'gm', sources: ['cfr'] }));
  out.push(field('10', vin[9], year ? { value: String(year), tier: 'gm', sources: ['cfr'] } : { value: null, tier: 'unknown', sources: ['cfr'], note: 'Poza zakresem GMT400 (1988–2000) albo VIN po 2009 r.' }));
  const plant = lookup(11, vin[10], year);
  if (plant.value && vin[10] === '1' && vin[0] !== '2') plant.note = 'Oshawa występuje przy VIN zaczynającym się od 2 (Kanada) — sprawdź pierwszy znak.';
  out.push(field('11', vin[10], plant));
  out.push(field('12–17', vin.slice(11), { value: 'kolejny numer z produkcji w danej fabryce', tier: 'gm', sources: ['gmsm98'] }));
  return out;
}

const MPV = { N: 'Chevrolet', K: 'GMC' };
const TRUCK = { C: 'Chevrolet', B: 'Chevrolet', T: 'GMC', D: 'GMC' };
/** Propozycja profilu „Mój samochód” — tylko z pól, które mają źródło. */
export function profileFromVin(result) {
  if (!result?.ok) return null;
  const f = Object.fromEntries(result.fields.map(x => [x.pos, x]));
  const known = pos => f[pos]?.value !== null && f[pos]?.value !== undefined;
  const code = pos => f[pos]?.code;
  const patch = {};
  const brand = MPV[code('3')] ?? TRUCK[code('3')];
  if (brand) patch.brand = brand;
  if (result.year) patch.year = String(result.year);
  if (known('5') && ['C', 'K'].includes(code('5'))) patch.drive = code('5') === 'K' ? '4WD' : '2WD';
  if (result.engine?.rpo) patch.engine = result.engine.rpo;
  const series = known('6') ? { 1: '1500', 2: '2500', 3: '3500' }[code('6')] : undefined;
  const body = known('7') ? code('7') : undefined;
  const line = ['C', 'K'].includes(code('5')) && known('5') ? code('5') : undefined;
  if (brand && body) {
    if (TRUCK[code('3')] && ['3', '4', '9'].includes(body) && line && series) { patch.platform = 'C/K'; patch.model = `${line}${series}`; }
    else if (body === '6' && (series === '1500' || series === '2500')) { patch.platform = 'Suburban'; patch.model = `Suburban ${series}`; }
    else if (body === '8' && MPV[code('3')]) { patch.platform = brand === 'GMC' ? 'Yukon' : 'Tahoe'; patch.model = `${patch.platform} 2-door`; }
  }
  return patch;
}

/** Linki wychodzące „Zdjęcia i historia tego VIN” — tylko wyszukiwania i strony startowe; nic nie pobieramy. */
export function vinHistoryLinks(vin) {
  const q = s => encodeURIComponent(s);
  return [
    { label: 'Google — dokładny VIN', href: `https://www.google.com/search?q=${q(`"${vin}"`)}` },
    { label: 'Google Grafika — dokładny VIN', href: `https://www.google.com/search?tbm=isch&q=${q(`"${vin}"`)}` },
    { label: 'Historia aukcji: bidfax.info (przez Google)', href: `https://www.google.com/search?q=${q(`site:bidfax.info "${vin}"`)}` },
    { label: 'Historia aukcji: poctra.com (przez Google)', href: `https://www.google.com/search?q=${q(`site:poctra.com "${vin}"`)}` },
    { label: 'Historia aukcji: autoastat.com (przez Google)', href: `https://www.google.com/search?q=${q(`site:autoastat.com "${vin}"`)}` },
    { label: 'CARFAX — raport historii (płatny)', href: 'https://www.carfax.com/vehicle-history-reports/' },
    { label: 'AutoCheck — raport historii (płatny)', href: 'https://www.autocheck.com/vehiclehistory/' },
    { label: 'VinAudit — raport historii (płatny)', href: 'https://www.vinaudit.com/' },
    { label: 'NICB VINCheck — kradzież / szkoda całkowita (USA)', href: 'https://www.nicb.org/vincheck' },
  ];
}
