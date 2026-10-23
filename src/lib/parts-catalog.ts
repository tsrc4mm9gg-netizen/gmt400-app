// Numery części z weryfikacją źródeł (audyt 2026-10-23, log: zrodla-zmiany.md).
// status: 'potwierdzone' — źródło podaje ten numer dla GMT400;
//         'poprawione'   — wartość zmieniona na zgodną ze źródłem;
//         'niezweryfikowane' — brak potwierdzenia (często katalogi przypisują numer innemu autu).
// Zawsze: sprawdź w swoim aucie / manualu (VIN, RPO, rocznik).

export type PartStatus = 'potwierdzone' | 'poprawione' | 'niezweryfikowane';
export type PartSource = { label: string; url: string };

const GMSM = 'https://gm.saturn.team/Chevrolet/Chevy_C_Pickup___2WD';
export const PART_SOURCES = {
  OM95: { label: 'GM Owner’s Manual 1995 C/K, s. 6-83', url: 'https://assets.gm.com/manuals/chevrolet/1995_chevrolet_1500_owners.pdf' },
  OM99: { label: 'GM Owner’s Manual 1999 Suburban, s. 6-69', url: 'https://www.chevrolet.com/ownercenter/content/dam/gmownercenter/gmna/dynamic/manuals/1999/chevrolet/suburban/1999_chevrolet_suburban_owners.pdf' },
  SM96_PLUG: { label: 'GM Service Manual 1996 C Pickup — Spark Plug Replacement', url: `${GMSM}/1996/2/1/171/37544` },
  SM96_FTS: { label: 'GM Service Manual 1996 C Pickup — Engine Fastener Tightening Specs', url: `${GMSM}/1996/2/1/157/44186` },
  SM96_INTAKE: { label: 'GM Service Manual 1996 C Pickup — Intake Manifold Installation', url: `${GMSM}/1996/2/1/157/44190` },
  SM96_ATF: { label: 'GM Service Manual 1996 C Pickup — 4L60-E Fluid/Filter Replacement', url: `${GMSM}/1996/2/5/169/6598` },
  SM99_OIL: { label: 'GM Service Manual 1999 C Pickup — Engine Oil and Filter Replacement', url: `${GMSM}/1999/7/1/820/44336` },
  GPG_CAP: { label: 'GMPartsGiant — GM 10452459 (kopułka V8)', url: 'https://www.gmpartsgiant.com/parts/gm-cap-10452459.html' },
  GPG_ROTOR: { label: 'GMPartsGiant — GM 10452457 (palec)', url: 'https://www.gmpartsgiant.com/parts/gm-rotor-10452457.html' },
  TF289: { label: 'Katalog ACDelco (PartsHawk) — TF289', url: 'https://partshawk.com/acdelco-tf289-transmission-filter-kit.html' },
  T131113: { label: 'Katalog ACDelco (KBUSA) — 131-113', url: 'https://www.kbusaparts.nl/en/131-113' },
  WP252711: { label: 'Katalog ACDelco — 252-711 (GM 88926225)', url: 'https://newparts.com/acdelco-252-711-engine-water-pump' },
  WP252611: { label: 'Amazon/ACDelco — 252-611 (Corvette LT1)', url: 'https://www.amazon.com/ACDelco-252-611-Professional-Water-Pump/dp/B000C9IJFM' },
  WP252707: { label: 'Katalog ACDelco (PartsHawk) — 252-707 (Cadillac 4.6)', url: 'https://partshawk.com/acdelco-252-707-engine-water-pump.html' },
  TOS18663: { label: 'Fel-Pro TOS18663 — 4L60/4L60E (Winners Circle)', url: 'https://www.winnerscircle.com/products/feltos18663' },
  TOS18722: { label: 'Fel-Pro TOS18722 — zastosowania (4T80-E)', url: 'https://autofactsdb.com/part/fel-pro/tos18722/' },
  SOL24230298: { label: 'GM 24230298 — solenoid A/B 4L60E', url: 'https://www.transmissionpartsdistributors.com/4l60e-4l65e-4l70e-transmission-shift-solenoid-a-or-b-ac-delco-24230298-original-equipment-fits-93/' },
  VSS24203876: { label: 'GMPartsDirect — GM 24203876', url: 'https://www.gmpartsdirect.com/oem-parts/gm-automatic-transmission-input-and-output-speed-sensor-with-seal-24203876' },
  G24206182: { label: 'GM 24206182 — uszczelka miski (20 śrub, FWD)', url: 'https://parts.chevrolet.com/product/gm-genuine-parts-automatic-transmission-fluid-pan-gasket-24206182' },
  EP381: { label: 'Katalog ACDelco (PartsHawk) — EP381', url: 'https://partshawk.com/acdelco-ep381-electric-fuel-pump.html' },
  D577: { label: 'Katalog ACDelco (PartsHawk) — D577', url: 'https://partshawk.com/acdelco-d577-ignition-coil.html' },
  DIST1103952: { label: 'Rozdzielacz 1103952 — zastosowania 1987–95', url: 'https://carpartstore.net/products/1103952-ignition-distributor-for-87-95-chevy-c1500-gmc-k1500-pontiac-5-0l-5-7l' },
  ECT213928: { label: 'Summit Racing — ACDelco 213-928', url: 'https://www.summitracing.com/parts/ado-213-928' },
  KS213324: { label: 'Katalog ACDelco (PartsHawk) — 213-324 (czujnik stukowy)', url: 'https://partshawk.com/acdelco-213-324-ignition-knock-detonation-sensor.html' },
  CMP213920: { label: 'ACDelco 213-920 — CMP 1996–99 GM Trucks', url: 'https://www.maxxtech.de/Sensor-Camshaft-Position-213-920-96-99-GM-Trucks-SUV.html' },
  INJ2173028: { label: 'ACDelco 217-3028 — wtrysk centralny 4.3L', url: 'https://www.motormanfuelinjection.com/gm-vortec-spider-injector/V6-MFI-Vortec-Spider.html' },
  O2_213_1552: { label: 'Katalog ACDelco (PartsHawk) — 213-1552', url: 'https://partshawk.com/acdelco-213-1552-oxygen-sensor.html' },
  MC18M1165: { label: 'ACDelco 18M1165 — zastosowania', url: 'https://autoelements.com/acdelco-brake-master-cylinder-19111330' },
  BJ45D2278: { label: 'ACDelco 45D2278 — zastosowania', url: 'http://www.yoyopart.com/oem/12143558/acdelco-45d2278.html' },
  TR45A0526: { label: 'ACDelco 45A0526 — zastosowania', url: 'http://www.yoyopart.com/oem/11488107/acdelco-45a0526.html' },
  CAL18FR1247: { label: 'ACDelco 18FR1247 — zastosowania', url: 'http://www.yoyopart.com/oem/11649572/acdelco-18fr1247.html' },
  MAF2134581: { label: 'Katalog ACDelco (PartsHawk) — 213-4581 (MAF)', url: 'https://partshawk.com/acdelco-213-4581-mass-air-flow-sensor-kit.html' },
  AFS105: { label: 'PartsGeek — ACDelco AFS105, C1500 1996–1999 (przed katalizatorem)', url: 'https://www.partsgeek.com/fzkxfgl-chevrolet-c1500-oxygen-sensor.html' },
  PADS17D369MH: { label: 'Katalog ACDelco (PartsHawk) — 17D369MH', url: 'https://partshawk.com/acdelco-17d369mh-disc-brake-pad-set.html' },
  PADS17D473: { label: 'YoYoPart — 17D473MH (Ford Escort / Mazda)', url: 'http://www.yoyopart.com/oem/13359207/acdelco-17d473mh.html' },
  ROT18A258AC: { label: 'Katalog ACDelco (PartsHawk) — 18A258AC (K 4×4)', url: 'https://partshawk.com/acdelco-18a258ac-disc-brake-rotor-for-chevrolet-k1500.html' },
  ROT18A1532: { label: 'YoYoPart — 18A1532 (Subaru SVX)', url: 'http://www.yoyopart.com/oem/13064039/acdelco-18a1532.html' },
  MS98000T: { label: 'FinditParts — Fel-Pro MS 98000 T (zastosowania)', url: 'https://www.finditparts.com/products/2487782/fel-pro-ms98000t' },
  TCS24202535: { label: 'Katalog ACDelco (PartsHawk) — 24202535 (uszczelka konwertera)', url: 'https://partshawk.com/acdelco-24202535-automatic-transmission-torque-converter-seal.html' },
  MC18M1492: { label: 'Katalog ACDelco (PartsHawk) — 18M1492', url: 'https://partshawk.com/acdelco-18m1492-brake-master-cylinder.html' },
  MAP2131545: { label: 'Katalog ACDelco (PartsHawk) — 213-1545', url: 'https://partshawk.com/acdelco-213-1545-manifold-absolute-pressure-sensor.html' },
  IAT213243: { label: 'Katalog ACDelco (PartsHawk) — 213-243', url: 'https://partshawk.com/acdelco-213-243-air-charge-temperature-sensor.html' },
  IAT_DEALER: { label: 'Folsom Chevrolet (katalog GM) — 1996 K1500 5.0, czujniki', url: 'https://parts.folsomchevy.com/v-1996-chevrolet-k1500-pickup--wt--5-0l-v8-gas/engine--sensors' },
  BJ45D2279: { label: 'AutoFactsDB — ACDelco 45D2279 (sworzeń dolny, Dodge/Plymouth Neon)', url: 'https://autofactsdb.com/part/acdelco/45d2279/' },
  WC18E660: { label: 'Parts Mart — ACDelco 18E660 (GM 19109381)', url: 'https://www.partsmartaz.net/parts/acdelco-rear-passenger-side-brake-wheel-cylinder-18e660' },
  CS45H0065: { label: 'Amazon — ACDelco 45H0065 (GM 88913378)', url: 'https://www.amazon.com/ACDelco-45H0065-Professional-Front-Spring/dp/B000C9RW96' },
  MS98016T: { label: 'Fel-Pro — uszczelki kolektora (MS 98016 T = LS Gen III)', url: 'https://www.felpro.com/technical/tecblogs/gm-trucks-intake-manifold-gasket-issues.html' },
} satisfies Record<string, PartSource>;

export type SourceId = keyof typeof PART_SOURCES;

export type Part = {
  kat: 'filtry' | 'silnik' | 'skrzynia' | 'hamulce' | 'zawieszenie';
  nazwa: string;
  oem: string;
  opis: string;
  model: string;
  status: PartStatus;
  src?: SourceId[];
  uwaga?: string;
  img?: string;
};

const NV = 'niezweryfikowane, sprawdź w manualu / po VIN';

export const PARTS: Part[] = [
  { kat: 'filtry', nazwa: 'Filtr oleju V8 / 6.5 diesel', oem: 'AC Delco PF1218', opis: 'Filtr oleju silnikowego. Dokręć wg instrukcji na filtrze (GM nie podaje momentu dla benzyny). Wymiana co 5-8 tys. km.', model: '5.0/5.7/7.4 V8 2WD 1995–1999, 6.5 diesel; 4WD benzyna: PF52', status: 'poprawione', src: ['OM95', 'OM99', 'SM99_OIL'], img: '/part-filter.jpg' },
  { kat: 'filtry', nazwa: 'Filtr oleju 4.3L / 4WD', oem: 'AC Delco PF52', opis: 'Filtr oleju 4.3L V6 oraz V8 z napędem 4WD', model: '4.3L (1995); V8 4WD 1995–1999', status: 'poprawione', src: ['OM95', 'OM99'], uwaga: 'Wcześniej: PF47 — instrukcja GM 1995 podaje PF52.' },
  { kat: 'filtry', nazwa: 'Filtr powietrza V8 1996+', oem: 'AC Delco A1300C', opis: 'Filtr powietrza silnika (wersja o większej pojemności: A1301C)', model: '5.7/7.4 Vortec 1996–1999 (wg OM99); 1995 V8: A348C, 1995 4.3L: A1178CW', status: 'poprawione', src: ['OM99', 'OM95'], uwaga: 'Wcześniej: A1163C — katalogi przypisują go S10/Blazer/Astro, nie C/K.' },
  { kat: 'filtry', nazwa: 'Filtr paliwa', oem: 'AC Delco GF626', opis: 'Filtr paliwa w linii', model: '1996–1999 (wg OM99); 1995: GF481', status: 'poprawione', src: ['OM99', 'OM95'] },
  { kat: 'filtry', nazwa: 'Filtr ATF 4L60E', oem: 'AC Delco TF289', opis: 'Zestaw filtra skrzyni (płytka miska, 16 śrub)', model: '4L60E 1993–1999, płytka miska', status: 'potwierdzone', src: ['TF289'] },
  { kat: 'silnik', nazwa: 'Świece zapłonowe Vortec', oem: 'AC Delco 41-932', opis: 'Szczelina 1,52 mm (0.060"). Moment: nowa głowica 30 Nm (22 lb-ft); używana głowica 15–20 Nm (GM SM podaje 15 Nm w Engine Mechanical i 20 Nm w Engine Electrical).', model: '5.0/5.7/7.4 Vortec 1996–1999; 1995: CR43TS', status: 'poprawione', src: ['OM99', 'SM96_PLUG', 'SM96_FTS', 'OM95'], img: '/part-plugs.jpg' },
  { kat: 'silnik', nazwa: 'Termostat', oem: 'AC Delco 131-113', opis: 'Termostat 195°F (91°C)', model: 'C/K 1500 1996–1999 5.0/5.7', status: 'potwierdzone', src: ['T131113'] },
  { kat: 'silnik', nazwa: 'Pompa wody', oem: 'AC Delco 252-711', opis: 'Pompa wody (GM 88926225)', model: '4.3/5.0/5.7 Vortec 1996–1999', status: 'poprawione', src: ['WP252711', 'WP252611', 'WP252707'], uwaga: 'Wcześniej: 252-611 (Corvette LT1) i 252-707 (Cadillac 4.6) — nie pasują do GMT400.' },
  { kat: 'silnik', nazwa: 'Czujnik MAF', oem: 'GM / AC Delco 213-4581', opis: 'Czujnik przepływu powietrza (zestaw)', model: 'Vortec: C/K 1500 1996–1999, C/K 2500/3500 1996–2000, Suburban/Tahoe/Yukon 1996–1999 (wg katalogu)', status: 'poprawione', src: ['MAF2134581'], uwaga: 'Wcześniej: 213-252 — katalogi przypisują go innym autom (Camaro/Firebird).' },
  { kat: 'silnik', nazwa: 'Czujnik O2', oem: 'AC Delco AFS105', opis: 'Sonda lambda przed katalizatorem (upstream)', model: 'C1500 1996–1999: 4.3 L35, 5.0 L30, 5.7 L31 (wg katalogu); inne wersje — sprawdź po VIN', status: 'poprawione', src: ['AFS105'], uwaga: 'Wcześniej: 213-1555 bez potwierdzenia dla GMT400.' },
  { kat: 'skrzynia', nazwa: 'Uszczelka miski 4L60E', oem: 'Fel-Pro TOS18663', opis: 'Uszczelka miski oleju skrzyni', model: '4L60E (700R4/4L60/4L65E)', status: 'poprawione', src: ['TOS18663', 'TOS18722'], uwaga: 'Wcześniej: TOS18722 — to uszczelka 4T80-E (Cadillac/Buick).' },
  { kat: 'skrzynia', nazwa: 'Solenoid zmiany biegów A/B', oem: 'AC Delco 24230298', opis: 'Solenoid 1-2 / 3-4 (dwa w skrzyni). To NIE jest solenoid EPC.', model: '4L60E 1993+', status: 'poprawione', src: ['SOL24230298'], uwaga: 'Usunięto duplikat „Solenoid EPC” z tym samym numerem.' },
  { kat: 'hamulce', nazwa: 'Klocki hamulcowe przód', oem: 'AC Delco 17D369MH', opis: 'Klocki hamulcowe przednie', model: 'C/K 1500 1988–1999, C/K 2500 1988–2000 (lekkie), Tahoe 1995–2000, Yukon 1992–2000 (wg katalogu)', status: 'poprawione', src: ['PADS17D369MH', 'PADS17D473'], uwaga: 'Wcześniej: 17D473CH — to klocki do Forda Escort / Mazdy.' },
  { kat: 'hamulce', nazwa: 'Tarcze hamulcowe przód', oem: 'AC Delco 18A2491', opis: 'Tarcze hamulcowe przednie', model: '1500', status: 'niezweryfikowane', uwaga: NV },
  { kat: 'hamulce', nazwa: 'Cylinderki hamulcowe', oem: 'AC Delco 18E660', opis: 'Cylinderki bębnów tylnych', model: '1500', status: 'niezweryfikowane', src: ['WC18E660'], uwaga: `${NV}. Sklep podaje: tył, strona pasażera, odpowiednik GM 19109381 — bez listy aut, więc nie potwierdza GMT400.` },
  { kat: 'zawieszenie', nazwa: 'Amortyzatory przód', oem: 'AC Delco 504-1079', opis: 'Amortyzatory przednie', model: '1500', status: 'niezweryfikowane', uwaga: NV },
  { kat: 'zawieszenie', nazwa: 'Amortyzatory tył', oem: 'AC Delco 504-1080', opis: 'Amortyzatory tylne', model: '1500', status: 'niezweryfikowane', uwaga: NV },
  { kat: 'zawieszenie', nazwa: 'Końcówki drążków', oem: 'AC Delco 45A0526', opis: 'Końcówki drążków kierowniczych', model: 'Wszystkie', status: 'niezweryfikowane', src: ['TR45A0526'], uwaga: `${NV}. Katalogi przypisują 45A0526 innemu autu (Toyota Van).` },
  { kat: 'silnik', nazwa: 'Uszczelka kolektora', oem: 'Fel-Pro MS98000T', opis: 'Zestaw uszczelek kolektora dolotowego (PermaDryPlus)', model: 'Vortec 1996–2000: C/K 1500 1996–1999, C/K 2500/3500 1996–2000, Tahoe/Yukon 1996–2000 (wg katalogu)', status: 'poprawione', src: ['MS98000T', 'MS98016T'], uwaga: 'Wcześniej: MS98016T — Fel-Pro opisuje go jako zestaw do silników LS (Gen III), nie L31.' },
  { kat: 'silnik', nazwa: 'Pompa paliwa', oem: 'AC Delco EP381', opis: 'Pompa paliwa w zbiorniku', model: 'C/K 1996–1997 (wg katalogu)', status: 'poprawione', src: ['EP381'] },
  { kat: 'silnik', nazwa: 'Cewka zapłonowa', oem: 'AC Delco D577', opis: 'Cewka zapłonowa (GM 10489421)', model: 'Vortec 1996–1999', status: 'poprawione', src: ['D577'] },
  { kat: 'silnik', nazwa: 'Rozdzielacz TBI', oem: 'AC Delco 1103952', opis: 'Rozdzielacz zapłonu HEI', model: '5.0/5.7/7.4 TBI do 1995', status: 'poprawione', src: ['DIST1103952'] },
  { kat: 'silnik', nazwa: 'Kopułka rozdzielacza V8 Vortec', oem: 'GM 10452459', opis: 'Kopułka rozdzielacza', model: 'V8 Vortec 1996–1999 (4.3L: 10452458)', status: 'potwierdzone', src: ['GPG_CAP'] },
  { kat: 'silnik', nazwa: 'Palec rozdzielacza Vortec', oem: 'GM 10452457', opis: 'Palec (rotor) rozdzielacza', model: 'Vortec 1996–1999', status: 'potwierdzone', src: ['GPG_ROTOR'] },
  { kat: 'skrzynia', nazwa: 'Czujnik prędkości', oem: 'AC Delco 24203876', opis: 'Czujnik prędkości wejściowej/wyjściowej z uszczelką', model: '4L60E / 4L80E', status: 'potwierdzone', src: ['VSS24203876'] },
  { kat: 'skrzynia', nazwa: 'Uszczelka konwertera', oem: 'GM / AC Delco 24202535', opis: 'Uszczelka konwertera momentu (przednia uszczelka pompy)', model: 'C/K 1500 1988–1999 z 700R4 / 4L60 / 4L60-E (wg katalogu)', status: 'poprawione', src: ['TCS24202535', 'G24206182'], uwaga: 'Wcześniej: 24206182 — GM opisuje go jako uszczelkę miski skrzyni aut FWD.' },
  { kat: 'hamulce', nazwa: 'Pompa hamulcowa', oem: 'AC Delco 18M1492', opis: 'Pompa hamulcowa główna', model: 'C/K 1500 i Suburban 1995–1999, C/K 2500 1994–2000, Tahoe/Yukon 1995–2000 (wg katalogu); 1988–94 1500 — inny numer', status: 'poprawione', src: ['MC18M1492', 'MC18M1165'], uwaga: 'Wcześniej: 18M1165 — katalogi przypisują go innym autom.' },
  { kat: 'hamulce', nazwa: 'Przewody hamulcowe', oem: 'Inline Tube', opis: 'Zestaw przewodów stalowych (marka, bez numeru)', model: 'Wszystkie', status: 'niezweryfikowane', uwaga: NV },
  { kat: 'zawieszenie', nazwa: 'Sworznie / wahacz górny', oem: 'AC Delco 45D2278', opis: 'Sworznie wahaczy', model: '1500', status: 'niezweryfikowane', src: ['BJ45D2278'], uwaga: `${NV}. Katalogi przypisują 45D2278 innym autom (Dodge Dakota/Durango).` },
  { kat: 'zawieszenie', nazwa: 'Tuleje wahaczy', oem: 'AC Delco 45G11040', opis: 'Tuleje wahaczy', model: '1500', status: 'niezweryfikowane', uwaga: NV },
  { kat: 'filtry', nazwa: 'Filtr kabinowy', oem: 'AC Delco CF101', opis: 'Filtr powietrza kabiny', model: '1996+', status: 'niezweryfikowane', uwaga: `${NV}. Instrukcja GM 1999 nie wymienia filtra kabinowego; prawdopodobnie fabrycznie go nie ma.` },
  { kat: 'silnik', nazwa: 'Czujnik MAP', oem: 'AC Delco 213-1545', opis: 'Czujnik ciśnienia kolektora (GM 12569240)', model: 'C1500 1988–1996, C2500 1988–1998, C3500 1988–1995, K1500 1988–1998, K2500/K3500 1988–1995 (wg katalogu)', status: 'potwierdzone', src: ['MAP2131545'] },
  { kat: 'silnik', nazwa: 'Czujnik IAT', oem: 'AC Delco 213-243', opis: 'Czujnik temperatury powietrza (GM 12160244)', model: 'Vortec 1996–2000: C/K, Tahoe, Yukon (wg katalogu)', status: 'potwierdzone', src: ['IAT213243', 'IAT_DEALER'] },
  { kat: 'silnik', nazwa: 'Czujnik ECT', oem: 'AC Delco 213-928', opis: 'Czujnik temperatury płynu (GM 15326386)', model: 'Tahoe 1995–2000 (wg katalogu)', status: 'poprawione', src: ['ECT213928'] },
  { kat: 'silnik', nazwa: 'Czujnik tlenu', oem: 'AC Delco 213-1552', opis: 'Sonda lambda', model: 'Wszystkie', status: 'niezweryfikowane', src: ['O2_213_1552'], uwaga: `${NV}. Katalogi przypisują 213-1552 autom 2004–2007.` },
  { kat: 'hamulce', nazwa: 'Zacisk przedni', oem: 'AC Delco 18FR1247', opis: 'Zacisk hamulcowy przód', model: '1500', status: 'niezweryfikowane', src: ['CAL18FR1247'], uwaga: `${NV}. Katalogi przypisują 18FR1247 innym autom (Toyota).` },
  { kat: 'hamulce', nazwa: 'Tarcza przednia', oem: 'AC Delco 18A258AC', opis: 'Tarcza hamulcowa przód (tylko 4×4)', model: 'K1500 1988–1999, K2500 1988–1998, K1500 Suburban 1992–1999, Tahoe 1995–2000, Yukon 1992–2000, Blazer 1992–94 (wg katalogu); 2WD — inny numer', status: 'poprawione', src: ['ROT18A258AC', 'ROT18A1532'], uwaga: 'Wcześniej: 18A1532 — to tarcza do Subaru SVX.' },
  { kat: 'zawieszenie', nazwa: 'Wahacz dolny', oem: 'AC Delco 45D2279', opis: 'Wahacz dolny', model: '1500', status: 'niezweryfikowane', src: ['BJ45D2279'], uwaga: `${NV}. 45D2279 to w katalogach przedni dolny sworzeń (nie wahacz) do Dodge/Plymouth Neon 2000–2005 — nie pasuje do GMT400.` },
  { kat: 'silnik', nazwa: 'Wtrysk centralny (spider)', oem: 'AC Delco 217-3028', opis: 'Zestaw wtrysku CPI/spider', model: '4.3L V6 Vortec 1996+', status: 'poprawione', src: ['INJ2173028'], uwaga: 'Wcześniej przypisany do 5.7L — to część do 4.3L.' },
  { kat: 'silnik', nazwa: 'Regulator ciśnienia', oem: 'AC Delco 217-3074', opis: 'Regulator ciśnienia paliwa', model: 'Vortec', status: 'niezweryfikowane', uwaga: `${NV}. Nie znaleziono listy zastosowań 217-3074 dla GMT400.` },
  { kat: 'silnik', nazwa: 'Czujnik stukowy (KS)', oem: 'AC Delco 213-324', opis: 'Czujnik spalania stukowego', model: 'C/K 1988–2000 (wg katalogu)', status: 'poprawione', src: ['KS213324'], uwaga: 'Wcześniej opisany jako czujnik wału (CKP) — to czujnik stukowy.' },
  { kat: 'silnik', nazwa: 'Czujnik wałka (CMP)', oem: 'AC Delco 213-920', opis: 'Czujnik położenia wałka rozrządu', model: 'Vortec 1996–1999', status: 'potwierdzone', src: ['CMP213920'] },
  { kat: 'hamulce', nazwa: 'Cylinder koła', oem: 'AC Delco 18E1277', opis: 'Cylinder hamulcowy tył', model: '1500', status: 'niezweryfikowane', uwaga: NV },
  { kat: 'zawieszenie', nazwa: 'Sprężyna przód', oem: 'AC Delco 45H0065', opis: 'Sprężyna przednia', model: 'C1500', status: 'niezweryfikowane', src: ['CS45H0065'], uwaga: `${NV}. Sklep podaje tylko: komplet sprężyn przednich, GM 88913378 — bez listy aut.` },
  { kat: 'filtry', nazwa: 'Filtr paliwa Diesel', oem: 'AC Delco TP1006', opis: 'Filtr paliwa 6.5L', model: '6.5L diesel (wg OM95)', status: 'potwierdzone', src: ['OM95'] },
];

export const STATUS_LABEL: Record<PartStatus, string> = {
  potwierdzone: 'potwierdzone',
  poprawione: 'poprawione wg źródła',
  niezweryfikowane: 'niezweryfikowane — sprawdź w manualu',
};
