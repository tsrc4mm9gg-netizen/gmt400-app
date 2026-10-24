// Kalkulator kosztów sprowadzenia auta — czysta funkcja, bez zależności (testowana w Playwright/Node).
// Wyniki są ORIENTACYJNE (sprawdź w urzędzie). Źródła stawek: zob. src/lib/guides/import.ts.
export const IMPORT_RATES = {
  asOf: '24.10.2026',
  customs: { passengerMfn: 0.10, passengerUsOrigin: 0, vanMfn: 0.22 },
  excise: { over2000: 0.186, upTo2000: 0.031 },
  vat: { standard: 0.23, collector: 0.08 },
  fixedMinimum: { registration: 160, inspection: 149 },
} as const;

export type VehicleKind = 'osobowy' | 'pickup-n1' | 'zabytek-9705';
export type Origin = 'usa-proof' | 'usa-no-proof' | 'ue';

export type ImportInput = { price: string; transport: string; capacity: string; kind: VehicleKind; origin: Origin };
export type ImportLine = { id: string; label: string; amount: number; note?: string };
export type ImportResult =
  | { valid: false; error: string }
  | { valid: true; lines: ImportLine[]; duties: number; fixed: number; total: number; notes: string[]; rates: { customs: number; excise: number; vat: number } };

const parse = (v: string): number | null => {
  const t = String(v ?? '').trim().replace(/\s/g, '').replace(',', '.');
  if (!/^\d+(\.\d{1,2})?$/.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) && n <= 100_000_000 ? n : null;
};
const r2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

export function calculateImport(input: ImportInput): ImportResult {
  const price = parse(input.price);
  const transport = parse(input.transport === '' ? '0' : input.transport);
  const capacity = parse(input.capacity);
  if (price === null || price <= 0) return { valid: false, error: 'Podaj cenę zakupu w zł (liczba większa od zera).' };
  if (transport === null) return { valid: false, error: 'Podaj koszt transportu w zł (0, jeśli nie dotyczy).' };
  if (capacity === null || capacity < 50 || capacity > 20000) return { valid: false, error: 'Podaj pojemność silnika w cm³ (np. 5700).' };
  if (!['osobowy', 'pickup-n1', 'zabytek-9705'].includes(input.kind)) return { valid: false, error: 'Wybierz rodzaj pojazdu.' };
  if (!['usa-proof', 'usa-no-proof', 'ue'].includes(input.origin)) return { valid: false, error: 'Wybierz pochodzenie.' };

  const notes: string[] = [];
  const eu = input.origin === 'ue';
  const R = IMPORT_RATES;
  let customsRate = 0;
  if (!eu) {
    if (input.kind === 'zabytek-9705') customsRate = 0;
    else if (input.kind === 'osobowy') customsRate = input.origin === 'usa-proof' ? R.customs.passengerUsOrigin : R.customs.passengerMfn;
    else {
      customsRate = R.customs.vanMfn;
      if (input.origin === 'usa-proof') notes.push('Nie zweryfikowałem, czy preferencja USA od 1.07.2026 obejmuje pozycję 8704 (pickup N1) — liczę stawką 22%. Sprawdź w ISZTAR4/TARIC.');
    }
  }
  // wartość celna: cena + transport (do granicy UE; transport wewnątrz UE zwykle też wchodzi do podstawy akcyzy — przy imporcie wg art. 104)
  const customsValue = r2(price + transport);
  const customs = r2(customsValue * customsRate);
  let exciseRate = 0;
  if (input.kind === 'osobowy') exciseRate = capacity > 2000 ? R.excise.over2000 : R.excise.upTo2000;
  const exciseBase = eu ? price : customsValue + customs;
  const excise = r2(exciseBase * exciseRate);
  const vatRate = input.kind === 'zabytek-9705' ? R.vat.collector : R.vat.standard;
  let vat = 0;
  if (eu) {
    notes.push('Zakup w UE: VAT w Polsce zwykle nie jest doliczany przy zakupie od osoby prywatnej (auto używane >6 mies. i >6000 km); od firmy wynika z faktury — policzone 0 zł. Sprawdź w urzędzie.');
    if (input.kind === 'zabytek-9705') notes.push('Pozycja 9705 dotyczy odprawy celnej spoza UE; przy zakupie w UE liczy się status zabytku wg WUOZ, nie kod celny.');
  } else {
    vat = r2((customsValue + customs + excise) * vatRate);
    if (input.kind === 'zabytek-9705') notes.push('Stawki 0% cła i 8% VAT wymagają przyjęcia przez urząd celny, że to pojazd kolekcjonerski CN 9705. KAS może to kwestionować dla aut seryjnych.');
  }
  if (input.kind === 'pickup-n1') notes.push('Pickup nie oznacza automatycznie stawki 0%. Klasyfikacja 8704 zależy m.in. od długości skrzyni ładunkowej względem rozstawu osi; akcyza 18,6% dotyczy tylko pozycji 8703.');
  if (!eu && input.origin === 'usa-no-proof') notes.push('Bez dowodu pochodzenia cło wg stawki zasadniczej 10% (osobowe). Pochodzenie = kraj produkcji, nie kraj zakupu.');
  notes.push('Transport i ubezpieczenie do granicy UE wchodzą do wartości celnej — wpisz ich pełną kwotę w zł. Kurs przeliczenia z USD ustala urząd, nie ten kalkulator.');

  const lines: ImportLine[] = [
    { id: 'price', label: 'Cena zakupu', amount: r2(price) },
    { id: 'transport', label: 'Transport i ubezpieczenie', amount: r2(transport) },
    { id: 'customs', label: `Cło (${Math.round(customsRate * 1000) / 10}%)`, amount: customs },
    { id: 'excise', label: `Akcyza (${Math.round(exciseRate * 1000) / 10}%)`, amount: excise },
    { id: 'vat', label: `VAT (${eu ? '0' : Math.round(vatRate * 100)}%)`, amount: vat },
    { id: 'recycling', label: 'Opłata recyklingowa (zniesiona od 1.01.2016)', amount: 0 },
  ];
  const duties = r2(customs + excise + vat);
  const fixed = r2(R.fixedMinimum.registration + R.fixedMinimum.inspection);
  lines.push({ id: 'fixed', label: 'Rejestracja (160 zł) + badanie techniczne (149 zł) — minimum urzędowe', amount: fixed });
  const total = r2(price + transport + duties + fixed);
  return { valid: true, lines, duties, fixed, total, notes, rates: { customs: customsRate, excise: exciseRate, vat: eu ? 0 : vatRate } };
}
