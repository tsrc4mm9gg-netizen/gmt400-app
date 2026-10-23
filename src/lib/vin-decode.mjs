// Dekoder VIN GMT400 — tylko pozycje, które mają źródło:
//  • budowa VIN, cyfra kontrolna (poz. 9) i kod roku (poz. 10): 49 CFR § 565.15 (NHTSA, eCFR),
//  • kod silnika (poz. 8): tabele „Engine Identification” / „Capacities and Specifications” z instrukcji GM (OM).
// Pozostałe pozycje (WMI, model/nadwozie, fabryka) wymagają danych GM — kierujemy do NHTSA vPIC.

export const VIN_SOURCES = {
  cfr: { title: '49 CFR § 565.15 — budowa VIN (eCFR, NHTSA)', url: 'https://www.ecfr.gov/current/title-49/subtitle-B/chapter-V/part-565/subpart-B/section-565.15' },
  om94: { title: 'OM 1994 Chevrolet C/K Pickup — Engine Identification (kopia dezosmanuals.com)', url: 'https://dezosmanuals.com/wp-content/uploads/2021/07/1994-Chevrolet-1500.pdf' },
  om95: { title: 'OM 1995 Chevrolet C/K Pickup — Engine Identification (assets.gm.com)', url: 'https://assets.gm.com/manuals/chevrolet/1995_chevrolet_1500_owners.pdf' },
  om96: { title: 'OM 1996 Chevrolet C/K Pickup — Capacities and Specifications (assets.gm.com)', url: 'https://assets.gm.com/manuals/chevrolet/1996_chevrolet_1500_owners.pdf' },
  om97: { title: 'OM 1997 Chevrolet C/K Pickup — Capacities and Specifications (assets.gm.com)', url: 'https://assets.gm.com/manuals/chevrolet/1997_chevrolet_1500_owners.pdf' },
  om98: { title: 'OM 1998 Chevrolet C/K Pickup — Capacities and Specifications (assets.gm.com)', url: 'https://assets.gm.com/manuals/chevrolet/1998_chevrolet_1500_owners.pdf' },
  om99: { title: 'OM 1999 Chevrolet Suburban — Engine Identification (chevrolet.com)', url: 'https://www.chevrolet.com/ownercenter/content/dam/gmownercenter/gmna/dynamic/manuals/1999/chevrolet/suburban/1999_chevrolet_suburban_owners.pdf' },
  vpic: { title: 'NHTSA vPIC — oficjalny dekoder VIN', url: 'https://vpic.nhtsa.dot.gov/decoder/' },
};

// Tabela VII w § 565.15 podaje kody dla 2005–2039; nota do tabeli: przy cyfrze na poz. 7 rok dotyczy zakresu 1980–2009,
// a kody powtarzają się co 30 lat (np. J = 2018 → 1988). Poniżej zakres GMT400.
export const YEAR_CODES = { J: 1988, K: 1989, L: 1990, M: 1991, N: 1992, P: 1993, R: 1994, S: 1995, T: 1996, V: 1997, W: 1998, X: 1999, Y: 2000 };

const TBI = 'wtrysk jednopunktowy TBI';
const C94_95 = 'C/K Pickup (wg OM C/K)';
/** Kody silnika wg OM: [lata od, do, źródła, nadwozia, { kod: opis }]. */
export const ENGINE_TABLES = [
  { from: 1994, to: 1995, sources: ['om94', 'om95'], scope: C94_95, codes: {
    Z: { engine: '4.3 L V6', fuel: `benzyna, ${TBI}` }, H: { engine: '5.0 L V8', fuel: `benzyna, ${TBI}` },
    K: { engine: '5.7 L V8', fuel: `benzyna, ${TBI}` }, N: { engine: '7.4 L V8', fuel: `benzyna, ${TBI}` },
    P: { engine: '6.5 L V8 diesel', fuel: 'diesel wolnossący' }, S: { engine: '6.5 L V8 turbodiesel', fuel: 'turbodiesel (emisje LD)' },
    F: { engine: '6.5 L V8 turbodiesel', fuel: 'turbodiesel (emisje HD, GVWR > 8500 lb)' } } },
  { from: 1996, to: 1998, sources: ['om96', 'om97', 'om98'], scope: 'C/K Pickup, silniki benzynowe (wg OM C/K; diesel opisuje osobny Diesel Engine Supplement)', codes: {
    W: { engine: 'Vortec 4300 V6', rpo: 'L35' }, M: { engine: 'Vortec 5000 V8', rpo: 'L30' },
    R: { engine: 'Vortec 5700 V8', rpo: 'L31' }, J: { engine: 'Vortec 7400 V8', rpo: 'L29' } } },
  { from: 1999, to: 1999, sources: ['om99'], scope: 'Suburban, silniki benzynowe (wg OM Suburban 1999; diesel w osobnym suplemencie)', codes: {
    R: { engine: 'Vortec 5700 V8', rpo: 'L31', fuel: 'benzyna, wtrysk sekwencyjny SFI' }, J: { engine: 'Vortec 7400 V8', rpo: 'L29', fuel: 'benzyna, wtrysk sekwencyjny SFI' } } },
];

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
    const table = ENGINE_TABLES.find(t => year >= t.from && year <= t.to);
    if (!table) engineNote = `Brak tabeli kodów silnika dla ${year} w naszych źródłach — sprawdź „Engine Identification” w instrukcji swojego rocznika.`;
    else if (table.codes[engineCode]) engine = { code: engineCode, ...table.codes[engineCode], scope: table.scope, sources: table.sources };
    else engineNote = `Kod „${engineCode}” nie występuje w tabeli OM ${table.from === table.to ? table.from : `${table.from}–${table.to}`} (${table.scope}). Inne nadwozie lub diesel — sprawdź w instrukcji i w vPIC.`;
  } else engineNote = 'Najpierw musi się zgadzać rok modelowy (poz. 10).';
  return {
    vin, ok: true, errors: [],
    wmi: vin.slice(0, 3), vds: vin.slice(3, 8), check: { value: vin[8], expected, ok: checkOk },
    yearCode, year, yearInRange: year !== null,
    engine, engineNote, plantCode: vin[10], serial: vin.slice(11),
  };
}
