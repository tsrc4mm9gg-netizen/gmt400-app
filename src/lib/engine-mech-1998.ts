// Wybrane dane mechaniczne silników wg instrukcji serwisowej GM 1998 C/K, tom 3 („Engine Mechanical Specifications”).
// Tylko podstawowe dane ogólne — nie kopiujemy całych tabel GM. Jednostki metryczne pierwsze, w nawiasie wartość angielska z instrukcji.
// Bez importów: plik jest ładowany w testach przez transpileModule.

export const MECH_SOURCE = 'GM 1998 C/K Truck Service Manual, tom 3 — Engine Mechanical Specifications';

export type EngineMech = { rpo: string; title: string; pages: string; rows: [string, string][]; note?: string };

const OIL_MIN_HOT = 'min. 41 kPa przy 1000 obr/min · 124 kPa przy 2000 · 165 kPa przy 4000 (6 / 18 / 24 psi), olej gorący';

export const ENGINE_MECH_1998: EngineMech[] = [
  {
    rpo: 'L35', title: '4.3 Vortec (L35)', pages: 's. 6-25–6-27',
    rows: [
      ['Układ / pojemność', 'V6 90°, 4,3 L (262 cid)'],
      ['Średnica × skok', '101,60 × 88,39 mm (4.000 × 3.480 in)'],
      ['Stopień sprężania', '9,2 : 1'],
      ['Kolejność zapłonu', '1-6-5-4-3-2'],
      ['Przerwa na świecy', '1,52 mm (0.060 in)'],
      ['Ciśnienie oleju', OIL_MIN_HOT],
      ['Rozrząd', 'popychacze hydrauliczne rolkowe, dźwigienki 1,50 : 1, bez regulacji luzu (net lash); wałek wyrównoważający'],
      ['Wznios zaworu', 'dolot 10,52 mm, wylot 10,87 mm (0.414 / 0.428 in)'],
    ],
    note: 'W tabeli GM przerwa na świecy w kolumnie metrycznej to 1,24 mm, a w angielskiej 0.060 in (= 1,52 mm) — sprawdź naklejkę emisji pod maską.',
  },
  {
    rpo: 'L30', title: '5.0 Vortec (L30)', pages: 's. 6-239–6-241',
    rows: [
      ['Układ / pojemność', 'V8, 5,0 L (305 cid)'],
      ['Średnica × skok', '94,89 × 88,39 mm (3.736 × 3.480 in)'],
      ['Stopień sprężania', '9,4 : 1'],
      ['Kolejność zapłonu', '1-8-4-3-6-5-7-2'],
      ['Ciśnienie oleju', OIL_MIN_HOT],
      ['Filtr oleju', 'dokręcenie 20 N·m (15 lb-ft)'],
      ['Rozrząd', 'popychacze hydrauliczne rolkowe, dźwigienki 1,50 : 1, regulacja: 1 obrót nakrętki od zera luzu'],
    ],
  },
  {
    rpo: 'L31', title: '5.7 Vortec (L31)', pages: 's. 6-241–6-243',
    rows: [
      ['Układ / pojemność', 'V8, 5,7 L (350 cid)'],
      ['Średnica × skok', '101,60 × 88,39 mm (4.000 × 3.480 in)'],
      ['Stopień sprężania', '9,4 : 1'],
      ['Kolejność zapłonu', '1-8-4-3-6-5-7-2'],
      ['Ciśnienie oleju', OIL_MIN_HOT],
      ['Filtr oleju', 'dokręcenie 20 N·m (15 lb-ft)'],
      ['Rozrząd', 'popychacze hydrauliczne rolkowe, dźwigienki 1,50 : 1, regulacja: 1 obrót nakrętki od zera luzu'],
    ],
  },
  {
    rpo: 'L56', title: '6.5 turbodiesel (L56 / L65)', pages: 's. 6-456–6-458',
    rows: [
      ['Układ / pojemność', 'V8 diesel, 6,5 L (396 cid)'],
      ['Średnica × skok', '103 × 97 mm (4.06 × 3.82 in)'],
      ['Stopień sprężania', '21,3 : 1'],
      ['Kolejność wtrysku', '1-8-7-2-6-5-4-3'],
      ['Ciśnienie oleju (manometr mechaniczny)', '41 kPa na gorącym jałowym (6 psi) · 207–296 kPa przy 2000 obr/min (30–43 psi)'],
      ['Rozrząd', 'popychacze hydrauliczne rolkowe, dźwigienki 1,50 : 1, bez regulacji luzu'],
    ],
  },
  {
    rpo: 'L29', title: '7.4 Vortec (L29)', pages: 's. 6-688–6-691',
    rows: [
      ['Układ / pojemność', 'V8, 7,4 L (454 cid)'],
      ['Średnica × skok', '107,95 × 101,6 mm (4.25 × 4.00 in)'],
      ['Stopień sprężania', '9,0 : 1'],
      ['Kolejność zapłonu', '1-8-4-3-6-5-7-2'],
      ['Przerwa na świecy', '1,52 mm (0.060 in)'],
      ['Olej bez wymiany filtra', '5,7 L (6 qt)'],
      ['Ciśnienie oleju (rozgrzany, nie gorący)', '69 kPa przy 600 obr/min · 172 kPa przy 2000 (10 / 25 psi)'],
      ['Rozrząd', 'popychacze hydrauliczne z rolką, dźwigienki 1,70 : 1, bez regulacji luzu (net lash)'],
    ],
    note: 'W tabeli GM przerwa na świecy w kolumnie metrycznej to 0,889 mm, a w angielskiej 0.060 in (= 1,52 mm) — sprawdź naklejkę emisji pod maską.',
  },
];

/** Dane 1998 dla silników pokazanych w karcie modelu (dopasowanie po kodzie RPO z verified-specs). */
export function mechForRpos(rpoStrings: string[]): EngineMech[] {
  return ENGINE_MECH_1998.filter(m => rpoStrings.some(r => r.includes(m.rpo)));
}
