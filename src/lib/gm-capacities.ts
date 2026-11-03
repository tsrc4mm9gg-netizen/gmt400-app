// Pojemności, płyny i części eksploatacyjne GMT400 1988–1999 — WYŁĄCZNIE z dokumentów GM w folderze „Dokumenty GMT400”.
// Każda wartość ma dokument i stronę (numer strony pliku PDF). Wartości sprzeczne między dokumentami NIE są tu podawane —
// trafiają na listę CAPACITY_DOUBTS. Wartości przybliżone („approximate capacities”) — zawsze sprawdź w swoim aucie.

export type GmDocKey = 'SM88' | 'SM89' | 'SM91' | 'SM92' | 'SM94' | 'SM95' | 'SM95S' | 'SM98' | 'OM98' | 'OM99' | 'LUR95';

export const GM_DOCS: Record<GmDocKey, string> = {
  SM88: 'GM Service Manual 1988 C/K Light Duty Trucks',
  SM89: 'GM Service Manual 1989 C/K 10–30 (ST375-89)',
  SM91: 'GM Service Manual „1991” C/K Light Duty Trucks (tabela silników opisana jako 1990)',
  SM92: 'GM Service Manual 1992 C/K 10–30 (ST375-92)',
  SM94: 'GM Service Manual 1994 C/K (NATP 9431)',
  SM95: 'GM Service Manual 1995 C/K (GMT-95 CK-1)',
  SM95S: 'GM Service Manual 1995 C/K — suplement 4-drzwiowe Tahoe/Yukon (CK-S)',
  SM98: 'GM Service Manual 1998 C/K (CK-1, tom 1)',
  OM98: 'GM Owner’s Manual 1998 Chevrolet C/K',
  OM99: 'GM Owner’s Manual 1999 Chevrolet Tahoe/Suburban',
  LUR95: 'GM Light Duty Truck Unit Repair Manual 1995',
};

export type Cite = { doc: GmDocKey; page: string };
export type CapacityRow = { item: string; variant: string; years: string; value: string; note?: string; src: Cite[] };
export type CapacityGroup = { id: string; title: string; intro?: string; rows: CapacityRow[] };

const c = (doc: GmDocKey, page: string): Cite => ({ doc, page });
const S88 = c('SM88', 's. 29–30'), S89 = c('SM89', 's. 39–40'), S91 = c('SM91', 's. 40–41'), S92 = c('SM92', 's. 39–40');
const S94 = c('SM94', 's. 46–48'), S95 = c('SM95', 's. 46–48'), S95S = c('SM95S', 's. 43–45'), S98 = c('SM98', 's. 61–62');
const O98 = c('OM98', 's. 368–369'), O99 = c('OM99', 's. 347–349');

export const CAPACITY_GROUPS: CapacityGroup[] = [
  {
    id: 'chlodzenie', title: 'Układ chłodzenia',
    intro: 'Pojemność całego układu z chłodnicą. „z A/C” / „bez A/C” jak w tabeli GM. Litery to kod silnika w 8. znaku VIN.',
    rows: [
      { item: '4.3 V6', variant: 'VIN Z', years: '1988–1994', value: '10,3 l', src: [S88, S89, S91, S92, S94] },
      { item: '4.3 V6 Vortec', variant: 'VIN W', years: '1998', value: '12,3 l', src: [S98, O98] },
      { item: '5.0 / 5.7 V8', variant: 'VIN H / K, bez A/C', years: '1988–1994', value: '16,5 l', src: [S88, S89, S91, S92, S94] },
      { item: '5.0 / 5.7 V8', variant: 'VIN H / K, z A/C', years: '1988–1994', value: '17,0 l', src: [S88, S89, S91, S92, S94] },
      { item: '5.7 V8', variant: '3500 HD, bez A/C / z A/C', years: '1992–1995', value: '25,0 l / 25,5 l', src: [S92, S94, S95] },
      { item: '5.0 / 5.7 Vortec', variant: 'VIN M / R, bez A/C', years: '1998', value: '16,6 l', src: [S98, O98] },
      { item: '5.7 Vortec', variant: 'C3500 HD, bez A/C / z A/C', years: '1998', value: '25,0 l / 25,5 l', src: [S98] },
      { item: '5.7 (Tahoe / Suburban)', variant: 'bez / z tylną nagrzewnicą', years: '1999', value: '16,5 l / 19,0 l', src: [O99] },
      { item: '7.4 V8', variant: 'VIN N, bez A/C / z A/C', years: '1988–1989', value: '22,0 l / 23,0 l', src: [S88, S89] },
      { item: '7.4 V8', variant: 'VIN N, bez A/C / z A/C', years: '1991–1995', value: '22,0 l / 23,5 l', src: [S91, S92, S94, S95] },
      { item: '7.4 V8', variant: '3500 HD, bez A/C / z A/C', years: '1992–1995', value: '25,0 l / 27,0 l', src: [S92, S94, S95] },
      { item: '7.4 Vortec', variant: 'VIN J, bez A/C', years: '1998', value: '23,5 l', src: [S98, O98] },
      { item: '7.4 Vortec', variant: 'C3500 HD, z A/C / bez A/C', years: '1998', value: '27,0 l / 25,0 l', src: [S98, O98], note: 'Instrukcja obsługi podaje dla 3500 HD jedną wartość: 27 l.' },
      { item: '7.4 (Suburban)', variant: 'bez / z tylną nagrzewnicą', years: '1999', value: '23,5 l / 26,0 l', src: [O99] },
      { item: '6.2 diesel', variant: 'VIN C / J', years: '1988–1989', value: '23,0 l', src: [S88, S89] },
      { item: '6.2 diesel', variant: 'VIN C / J', years: '1991–1992', value: '23,5 l', src: [S91, S92] },
      { item: '6.5 turbodiesel', variant: 'VIN F (1992), F / P / S (1994–1995)', years: '1992–1995', value: '25,0 l', src: [S92, S94, S95] },
      { item: '6.5 turbodiesel', variant: 'VIN F / S', years: '1998', value: '26,0 l', src: [S98] },
    ],
  },
  {
    id: 'olej', title: 'Olej silnikowy (miska)',
    intro: 'Bez filtra / z filtrem — jak w tabeli GM. Po wymianie zawsze sprawdź bagnetem.',
    rows: [
      { item: '4.3 / 5.0 / 5.7', variant: 'VIN Z / H / K', years: '1988–1991', value: '3,8 l / 4,8 l', src: [S88, S89, S91], note: 'C3500 HD (1991): +0,95 l (1 qt).' },
      { item: '4.3 V6', variant: 'VIN Z', years: '1992–1995', value: '3,8 l / 4,3 l', src: [S92, S94, S95] },
      { item: '5.0 / 5.7', variant: 'VIN H / K', years: '1992–1995', value: '3,8 l / 4,8 l', src: [S92, S94, S95], note: '5.7 w 3500 HD: +0,95 l (1 qt).' },
      { item: '4.3 Vortec', variant: 'VIN W, z filtrem', years: '1998', value: '4,3 l', src: [S98, O98] },
      { item: '5.0 / 5.7 Vortec', variant: 'VIN M / R, z filtrem', years: '1998–1999', value: '4,8 l', src: [S98, O98, O99] },
      { item: '7.4 Vortec', variant: 'VIN J, z filtrem', years: '1999', value: '6,3 l', src: [O99] },
      { item: '7.4 V8', variant: 'VIN N', years: '1988–1989', value: '4,8 l / 5,7 l', src: [S88, S89] },
      { item: '7.4 V8', variant: 'VIN N', years: '1991', value: '5,7 l / 6,6 l', src: [S91] },
      { item: '7.4 V8', variant: 'VIN N', years: '1992–1995', value: '5,7 l / 6,5 l', src: [S92, S94, S95], note: '3500 HD: +0,95 l (1 qt).' },
      { item: '6.2 diesel', variant: 'VIN C / J, z filtrem', years: '1988–1992', value: '6,5 l', src: [S88, S89, S91, S92] },
      { item: '6.5 turbodiesel', variant: 'z filtrem', years: '1992–1995', value: '6,5 l', src: [S92, S94, S95] },
      { item: '6.5 turbodiesel', variant: 'VIN F / S, z filtrem', years: '1998', value: '6,5 l', src: [S98] },
    ],
  },
  {
    id: 'paliwo', title: 'Zbiorniki paliwa',
    rows: [
      { item: 'Pickup', variant: 'krótka paka / długa paka', years: '1988–1998', value: '98 l / 128 l', src: [S88, S89, S91, S92, S94, S95, S98, O98], note: '1988–1989: 128 l jako zbiornik „deluxe” tylko z długą paką.' },
      { item: 'Crew Cab (4-drzwiowy pickup)', variant: '—', years: '1992–1998', value: '128 l', src: [S92, S94, S95, S98, O98] },
      { item: 'Chassis Cab', variant: 'zbiornik boczny / tylny', years: '1991–1992', value: '83 l / 113 l', src: [S91, S92] },
      { item: 'C3500 HD', variant: 'zbiornik boczny / tylny', years: '1992', value: '80 l / 121 l', src: [S92] },
      { item: 'Chassis Cab i 3500 HD', variant: 'zbiornik boczny / tylny', years: '1994–1995', value: '87 l / 117 l', src: [S94, S95] },
      { item: 'Chassis Cab i 3500 HD', variant: 'zbiornik tylny', years: '1998', value: '68 l', src: [S98, O98] },
      { item: 'Tahoe / Yukon (utility)', variant: '—', years: '1995–1999', value: '113 l', src: [S95S, S98, O99] },
      { item: 'Suburban', variant: '—', years: '1995', value: '151 l', src: [S95S] },
      { item: 'Suburban', variant: 'benzyna', years: '1998–1999', value: '167 l', src: [S98, O99], note: 'SM 1998: 166,6 l.' },
      { item: 'Suburban', variant: 'diesel', years: '1998–1999', value: '159 l', src: [S98, O99] },
    ],
  },
  {
    id: 'automat', title: 'Skrzynie automatyczne',
    intro: 'Wymiana z miski (pan) / po remoncie (overhaul) — pierwsza liczba to ilość przy wymianie oleju i filtra. Dolewaj stopniowo i sprawdzaj bagnetem na ciepło.',
    rows: [
      { item: 'THM400 (3-biegowa)', variant: 'miska / remont', years: '1988–1989', value: '4,0 l / 10,0 l', src: [S88, S89] },
      { item: '700-R4 / 4L60', variant: 'miska / remont', years: '1988–1991', value: '4,7 l / 10,9 l', src: [S88, S89, S91] },
      { item: '4L60 / 4L60-E', variant: 'miska / remont', years: '1992–1998', value: '4,7 l / 10,6 l', src: [S92, S94, S95, S98] },
      { item: '4L80-E', variant: 'miska / remont', years: '1995–1998', value: '7,3 l / 12,8 l', src: [S95, S98], note: 'Dla 1991–1994 dokumenty podają inne wartości — patrz wątpliwości.' },
    ],
  },
  {
    id: 'manual', title: 'Skrzynie ręczne',
    rows: [
      { item: '4-biegowa 117 mm (SM465)', variant: '—', years: '1988–1991', value: '4,0 l', src: [S88, S89, S91] },
      { item: '4-biegowa 85 mm i 5-biegowa 85 mm', variant: '—', years: '1988–1991', value: '1,75 l', src: [S88, S89, S91] },
      { item: 'NP4500 / NVG4500 (5-biegowa)', variant: '—', years: '1991', value: '4,5 l', src: [S91] },
      { item: 'NVG4500 / NV4500 (5-biegowa)', variant: '—', years: '1992–1998', value: '3,78 l', src: [S92, S94, S95, S98, c('LUR95', 's. 712')] },
      { item: 'NVG 5LM60 / NVG3500 / NV3500 (5-biegowa)', variant: '—', years: '1992–1998', value: '2,0 l', src: [S92, S94, S95, S98], note: 'Instrukcja naprawcza 1995: 1,98 l.' },
    ],
  },
  {
    id: 'rozdzielcza', title: 'Skrzynie rozdzielcze (4WD)',
    rows: [
      { item: 'Skrzynia rozdzielcza K1500 / K2500', variant: '—', years: '1988–1991', value: '1,3 l', src: [S88, S89, S91] },
      { item: 'Skrzynia rozdzielcza K3500', variant: '—', years: '1988–1991', value: '2,6 l', src: [S88, S89, S91] },
      { item: 'NP241 / NV241 / NV243', variant: '—', years: '1995–1998', value: '2,13 l', src: [S98, c('LUR95', 's. 738')] },
      { item: 'Borg-Warner 4470', variant: '—', years: '1995–1998', value: '3,1 l', src: [S98, c('LUR95', 's. 781')] },
    ],
  },
  {
    id: 'mosty', title: 'Mosty napędowe',
    intro: 'Tylko wartości zgodne między dokumentami. Mosty 9½" i 10½" oraz Rockwell — patrz wątpliwości.',
    rows: [
      { item: 'Most tylny 8½"', variant: '—', years: '1989–1991', value: '2,0 l', src: [S89, S91] },
      { item: 'Most tylny Dana 9¾"', variant: '—', years: '1988–1991', value: '2,8 l', src: [S88, S89, S91] },
      { item: 'Most tylny Dana 80 (11")', variant: '—', years: '1995', value: '4,0 l', src: [c('LUR95', 's. 177')] },
      { item: 'Most przedni K1500 / K2500', variant: '—', years: '1988–1991', value: '1,66 l', src: [S88, S89, S91] },
      { item: 'Most przedni K3500', variant: '—', years: '1988–1991', value: '2,1 l', src: [S88, S89, S91] },
      { item: 'Most przedni 8¼"', variant: '—', years: '1995', value: '2,0 l', src: [c('LUR95', 's. 237')] },
      { item: 'Most przedni 9¼"', variant: '—', years: '1995', value: '2,8 l', src: [c('LUR95', 's. 237')] },
    ],
  },
  {
    id: 'inne', title: 'Klimatyzacja i wspomaganie',
    rows: [
      { item: 'Czynnik R-134a', variant: 'pickup', years: '1994–1995', value: '0,91 kg', src: [c('SM94', 's. 150'), c('SM95', 's. 150')] },
      { item: 'Czynnik R-134a', variant: 'Crew Cab / Suburban / utility', years: '1994–1995', value: '1,02 kg', src: [c('SM94', 's. 150'), c('SM95', 's. 150')] },
      { item: 'Czynnik R-134a', variant: 'Suburban z tylną klimatyzacją', years: '1994–1995', value: '1,81 kg', src: [c('SM94', 's. 150'), c('SM95', 's. 150')] },
      { item: 'Olej sprężarki PAG', variant: 'bez / z tylną klimatyzacją', years: '1994–1995', value: '240 ml / 330 ml', src: [c('SM94', 's. 150'), c('SM95', 's. 150')], note: 'Sprężarka HR110-MD.' },
      { item: 'Układ wspomagania', variant: 'cały układ / sama pompa', years: '1995', value: '0,75 l / 0,5 l', src: [c('LUR95', 's. 100')], note: 'Pompa serii CB.' },
    ],
  },
];

export type FluidSpecRow = { item: string; years: string; spec: string; src: Cite[] };
const F88 = c('SM88', 's. 28'), F89 = c('SM89', 's. 37'), F91 = c('SM91', 's. 38'), F94 = c('SM94', 's. 46'), F95 = c('SM95', 's. 46'), F98 = c('SM98', 's. 62');
export const FLUID_SPECS: FluidSpecRow[] = [
  { item: 'Olej silnikowy (klasa API)', years: '1988', spec: 'SF/CC lub SF/CD', src: [F88] },
  { item: 'Olej silnikowy (klasa API)', years: '1989', spec: 'SG, SF/CC lub SF/CD', src: [F89] },
  { item: 'Olej silnikowy (klasa API)', years: '1990–1995', spec: 'SG lub SG/CE', src: [F91, F94, F95] },
  { item: 'Olej silnikowy', years: '1998', spec: 'olej z symbolem API „Starburst”; lepkość według instrukcji obsługi', src: [F98] },
  { item: 'Płyn chłodniczy', years: '1988–1989', spec: 'glikol etylenowy wg GM-1825-M (GM 1052753), z wodą', src: [F88, F89] },
  { item: 'Płyn chłodniczy', years: '1990–1995', spec: 'glikol etylenowy wg GM 6038-M (GM 1052103), z wodą', src: [F91, F94, F95] },
  { item: 'Płyn chłodniczy', years: '1998', spec: 'wyłącznie DEX-COOL, 50/50 z czystą (najlepiej destylowaną) wodą', src: [F98] },
  { item: 'Płyn hamulcowy', years: '1988–1995', spec: 'Delco Supreme 11 (GM 1052535) lub DOT-3', src: [F88, F89, F91, F94, F95] },
  { item: 'Płyn hamulcowy', years: '1998', spec: 'Delco Supreme 11 (GM 12377967) lub DOT-3', src: [F98] },
  { item: 'Hydrauliczne sprzęgło', years: '1988', spec: 'jak hamulce: Delco Supreme 11 lub DOT-3', src: [F88] },
  { item: 'Hydrauliczne sprzęgło', years: '1989–1995', spec: 'płyn GM 12345347 lub DOT-3', src: [F89, F91, F94, F95] },
  { item: 'Wspomaganie kierownicy', years: '1988–1995', spec: 'płyn GM 1050017 (od 1990 z dopiskiem: spec. GM 9985010)', src: [F88, F89, F91, F94, F95] },
  { item: 'Wspomaganie kierownicy', years: '1998', spec: 'płyn GM 1052884 (0,47 l) / 1050017 (0,95 l)', src: [F98] },
  { item: 'Skrzynia automatyczna', years: '1988–1991', spec: 'Dexron II (GM 1051855)', src: [F88, F89, F91] },
  { item: 'Skrzynia automatyczna', years: '1994–1995', spec: 'Dexron III lub IIE', src: [F94, F95] },
  { item: 'Skrzynia automatyczna', years: '1998', spec: 'Dexron III', src: [F98] },
  { item: 'Skrzynia ręczna M20 (4-biegowa)', years: '1988', spec: 'olej przekładniowy SAE 80W GL-5 lub 80W-90 GL-5 (GM 1052271)', src: [F88] },
  { item: 'Skrzynia ręczna M20 (4-biegowa)', years: '1989', spec: 'olej przekładniowy SAE 80W-90 (GM 12345577)', src: [F89] },
  { item: 'Skrzynia ręczna M20 i MT8', years: '1990–1991', spec: 'SAE 80 Synchromesh (GM 12345577)', src: [F91] },
  { item: 'Skrzynia ręczna MC0 (4-biegowa bez biegu pełzającego) i MG5', years: '1988', spec: 'Manual Transmission Fluid (GM 1052931)', src: [F88] },
  { item: 'Skrzynia ręczna MG5', years: '1989', spec: 'Manual Transmission Fluid (GM 1052931)', src: [F89] },
  { item: 'Skrzynia ręczna MC9, MF2, MY6, ML2, ML3, MH3', years: '1989', spec: 'Dexron II (GM 1051855)', src: [F89] },
  { item: 'Skrzynia ręczna ML2, ML3', years: '1990–1991', spec: 'Dexron II (GM 1051855)', src: [F91] },
  { item: 'Skrzynia ręczna MG5, MY2', years: '1990–1995', spec: 'Standard Transmission Fluid (GM 12345349)', src: [F91, F94, F95] },
  { item: 'Skrzynia ręczna MT8 (NVG4500)', years: '1994–1995', spec: 'Castrol Syntorq LT (GM 12345871)', src: [F94, F95, c('LUR95', 's. 712')] },
  { item: 'Skrzynia ręczna NV3500', years: '1995', spec: 'Synchromesh Transmission Fluid', src: [c('LUR95', 's. 697')] },
  { item: 'Skrzynia rozdzielcza', years: '1988–1991', spec: 'Dexron II (GM 1051855)', src: [F88, F89, F91] },
  { item: 'Skrzynia rozdzielcza', years: '1994–1995', spec: 'Dexron IIE (GM 12345881)', src: [F94, F95] },
  { item: 'Skrzynia rozdzielcza NP241 / BW4470', years: '1995', spec: 'Dexron III', src: [c('LUR95', 's. 738, 781')] },
  { item: 'Mosty (standard i szpera)', years: '1988–1998', spec: 'SAE 80W-90 GL-5 (GM 1052271)', src: [F88, F89, F91, F94, F95, F98] },
];

export type PartRow = { item: string; variant: string; years: string; part: string; src: Cite[] };
const P92 = c('SM92', 's. 40'), P94 = c('SM94', 's. 46–47'), P95 = c('SM95', 's. 46–47'), P98 = c('OM98', 's. 368'), P99 = c('OM99', 's. 349');
export const SERVICE_PARTS: PartRow[] = [
  { item: 'Filtr powietrza', variant: '4.3 (VIN Z)', years: '1992–1995', part: 'AC A-178CW', src: [P92, P94, P95] },
  { item: 'Filtr powietrza', variant: '5.0 / 5.7 / 7.4 (VIN H / K / N)', years: '1992–1995', part: 'AC A-348C', src: [P92, P94, P95] },
  { item: 'Filtr powietrza', variant: '6.2 / 6.5 diesel (VIN C / J / F)', years: '1992', part: 'AC A-644C', src: [P92] },
  { item: 'Filtr powietrza', variant: '6.5 turbodiesel (VIN F / P / S)', years: '1994–1995', part: 'AC A-917C', src: [P94, P95] },
  { item: 'Filtr powietrza', variant: 'Vortec 4.3 / 5.0 / 5.7 / 7.4', years: '1998–1999', part: 'AC A1300C (A1301C — wersja o większej pojemności)', src: [P98, P99] },
  { item: 'Filtr oleju', variant: '4.3 (VIN Z)', years: '1992–1994', part: 'AC PF-51', src: [P92, P94] },
  { item: 'Filtr oleju', variant: '5.0 / 5.7 / diesel / 7.4', years: '1992–1994', part: 'AC PF-35 (5.0 / 5.7 z 4WD: PF-51)', src: [P92, P94] },
  { item: 'Filtr oleju', variant: '4.3 (VIN Z)', years: '1995', part: 'AC PF-52', src: [P95] },
  { item: 'Filtr oleju', variant: '5.0 / 5.7 / 6.5 / 7.4', years: '1995', part: 'AC PF-1218 (5.0 / 5.7 z 4WD: PF-52)', src: [P95] },
  { item: 'Filtr oleju', variant: 'Vortec 4.3 (VIN W)', years: '1998', part: 'AC PF52', src: [P98] },
  { item: 'Filtr oleju', variant: 'Vortec 5.0 / 5.7 / 7.4 (VIN M / R / J)', years: '1998–1999', part: 'AC PF1218 (z 4WD: PF52)', src: [P98, P99] },
  { item: 'Zawór PCV', variant: '4.3 (VIN Z)', years: '1992–1995', part: 'AC CV-789C', src: [P92, P94, P95] },
  { item: 'Zawór PCV', variant: '5.0 / 5.7 / 7.4 (VIN H / K / N)', years: '1992–1995', part: 'AC CV-774C', src: [P92, P94, P95] },
  { item: 'Zawór PCV', variant: 'Vortec 4.3 (VIN W)', years: '1998', part: 'AC CV746C', src: [P98] },
  { item: 'Zawór PCV', variant: 'Vortec 7.4 (VIN J)', years: '1998–1999', part: 'AC CV774C', src: [P98, P99] },
  { item: 'Świece zapłonowe', variant: 'benzyna (VIN Z / H / K / N)', years: '1992–1995', part: 'AC CR43TS, przerwa 0,9 mm', src: [P92, P94, P95] },
  { item: 'Świece zapłonowe', variant: 'Vortec', years: '1998–1999', part: 'AC 41-932 (1999: przerwa 1,52 mm)', src: [P98, P99] },
  { item: 'Filtr paliwa', variant: 'benzyna', years: '1992–1995', part: 'AC GF-481', src: [P92, P94, P95] },
  { item: 'Filtr paliwa', variant: 'diesel', years: '1992–1995', part: 'AC TP-1006', src: [P92, P94, P95] },
  { item: 'Filtr paliwa', variant: 'Vortec', years: '1998–1999', part: 'AC GF626', src: [P98, P99] },
  { item: 'Korek chłodnicy', variant: '4.3 / 5.0 / 5.7', years: '1994–1995', part: 'AC RC-36', src: [P94, P95] },
  { item: 'Korek chłodnicy', variant: '6.5 diesel / 7.4', years: '1994–1995', part: 'AC RC-32', src: [P94, P95] },
  { item: 'Pióro wycieraczki przedniej', variant: 'Trico, 45 cm', years: '1998–1999', part: 'GM 22154886', src: [P98, P99] },
  { item: 'Pióro wycieraczki tylnej', variant: 'Trico, 35,5 cm (Tahoe / Suburban)', years: '1999', part: 'GM 22154396', src: [P99] },
];

export const WHEEL_NUT_TORQUE = { value: '190 N·m (140 lb-ft)', years: '1999', variant: 'Tahoe / Suburban 1500 i 2500, koła na 5, 6 i 8 szpilek', src: [c('OM99', 's. 347')] };

export const CAPACITY_DOUBTS: string[] = [
  '1995, płyn chłodniczy 4.3: instrukcja serwisowa 10,3 l, instrukcja obsługi 1995 — 12,3 l. 5.0 / 5.7: serwisowa 16,5 l / 17,0 l, obsługi 16,6 l. Dla 1995 nie podajemy tych wartości.',
  '1998, płyn chłodniczy z A/C: serwisowa podaje osobne wartości (5.0 — 17,0 l, 5.7 — 19,0 l, 7.4 — 26,0 l), instrukcja obsługi tylko jedną (16,6 l / 16,6 l / 23,5 l).',
  '1998, olej 7.4: 6,5 l (serwisowa) wobec 6,3 l (instrukcja obsługi 1998 i 1999).',
  '1998, Chassis Cab i 3500 HD — zbiornik boczny/przedni: 87 l (serwisowa) wobec 79 l (instrukcja obsługi).',
  'Zawór PCV Vortec 5.0 / 5.7: CV796C (instrukcja obsługi 1998) wobec CV769C (1999) — możliwa literówka w jednym z dokumentów.',
  'Skrzynia rozdzielcza Borg-Warner 4401: 1,5 l w instrukcji naprawczej 1995 wobec 3,1 l w serwisowej 1998.',
  'Czynnik R-12 (1991–1992): wartość „1,134 kg (2,8 lb)” jest niespójna (2,8 lb to 1,27 kg).',
  'Mosty 9½" i 10½" oraz Rockwell 12": 1988–1991 — 3,1 l (Rockwell 1988: 5,9 l), 1992 — 2,6 l / 3,4 l (Rockwell 6,6 l), instrukcja naprawcza 1995 — 9½" 2,7 l.',
  'Most 8½" w 1988: 2,6 l przy przeliczeniu 4,2 pinty (= 2,0 l) — błąd druku; podajemy 2,0 l z 1989–1991.',
  '4L80-E: 1991 — 4,0 l / 12,4 l, 1992–1994 — 4,7 l / 10,9 l, 1995 i 1998 — 7,3 l / 12,8 l (wymiana z miski / po remoncie). Publikujemy tylko 1995–1998.',
  'Dokument „1991” ma tabelę silników opisaną jako 1990 — wartości z niego oznaczamy jako 1990–1991 tylko tam, gdzie zgadzają się z 1989 i 1992.',
  'Instrukcja serwisowa 1998 (tom 4): olej 6,65 l / 7,1 l bez wskazania silnika.',
];
