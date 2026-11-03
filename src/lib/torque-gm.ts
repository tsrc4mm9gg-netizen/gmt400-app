import RAW from '../data/momenty-gm.json';

/** Wiersz momentu dokręcania z dokumentów GM (z momenty-propozycje.csv; wartości z grup spornych przypisane do konkretnych podzespołów). */
export type TorqueRow = {
  system: string;
  name: string;
  original: string;
  nm: string;
  imperial: string;
  variant: string;
  /** Dokładnie czego dotyczy wartość (podzespół, wersja, rocznik) — przy nazwach z różnymi wartościami. */
  appliesTo: string;
  /** Wartość przypisana do podzespołu po sprawdzeniu stron instrukcji (nazwa z kilkoma wartościami). */
  assigned: boolean;
  years: string[];
  sources: { doc: string; page: number }[];
  unitRepair: boolean;
  singleSource: boolean;
  fromProcedure: boolean;
};

type Raw = { s: string; n: string; o: string; nm: string; i: string; e: string; d?: string; y: string[]; z: [string, number][]; f: string };
const data = RAW as unknown as { systems: string[]; docs: Record<string, string>; rows: Raw[] };

export const TORQUE_DOCS: Record<string, string> = data.docs;
export const TORQUE_SYSTEMS: string[] = data.systems.filter(s => data.rows.some(r => r.s === s));
export const TORQUE_ROWS: TorqueRow[] = data.rows.map(r => ({
  system: r.s, name: r.n, original: r.o, nm: r.nm, imperial: r.i, variant: r.e, appliesTo: r.d ?? '', assigned: r.f.includes('r'), years: r.y,
  sources: r.z.map(([doc, page]) => ({ doc, page })),
  unitRepair: r.f.includes('u'), singleSource: r.f.includes('1'), fromProcedure: r.f.includes('p'),
}));

export const SYSTEM_LABEL: Record<string, string> = {
  'silnik': 'Silnik', 'chłodzenie': 'Chłodzenie', 'paliwo/emisja': 'Paliwo i emisja', 'wydech': 'Wydech', 'skrzynia biegów': 'Skrzynia biegów',
  'reduktor': 'Reduktor', 'mosty/napęd': 'Mosty i napęd', 'zawieszenie': 'Zawieszenie', 'układ kierowniczy': 'Układ kierowniczy', 'hamulce': 'Hamulce',
  'koła': 'Koła', 'elektryka': 'Elektryka', 'klimatyzacja/ogrzewanie': 'Klimatyzacja i ogrzewanie', 'nadwozie': 'Nadwozie', 'inne': 'Inne',
};

/** Zakres lat jako tekst, np. „1988–1992, 1994”. */
export function yearsLabel(years: string[]): string {
  const ys = years.map(Number).sort((a, b) => a - b);
  const out: string[] = [];
  for (let i = 0; i < ys.length; i++) {
    let j = i;
    while (j + 1 < ys.length && ys[j + 1] === ys[j] + 1) j++;
    out.push(j > i ? `${ys[i]}–${ys[j]}` : String(ys[i]));
    i = j;
  }
  return out.join(', ');
}

export function foldText(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/g, 'l');
}
