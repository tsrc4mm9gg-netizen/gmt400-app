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
  { kat: 'silnik', nazwa: 'Czujnik MAF', oem: 'AC Delco 213-252', opis: 'Czujnik przepływu powietrza', model: '1996-2000', status: 'niezweryfikowane', uwaga: `${NV}. Część katalogów przypisuje 213-252 innym autom (Camaro/Firebird).` },
  { kat: 'silnik', nazwa: 'Czujnik O2', oem: 'AC Delco 213-1555', opis: 'Sonda lambda', model: 'Wszystkie', status: 'niezweryfikowane', uwaga: NV },
  { kat: 'skrzynia', nazwa: 'Uszczelka miski 4L60E', oem: 'Fel-Pro TOS18663', opis: 'Uszczelka miski oleju skrzyni', model: '4L60E (700R4/4L60/4L65E)', status: 'poprawione', src: ['TOS18663', 'TOS18722'], uwaga: 'Wcześniej: TOS18722 — to uszczelka 4T80-E (Cadillac/Buick).' },
  { kat: 'skrzynia', nazwa: 'Solenoid zmiany biegów A/B', oem: 'AC Delco 24230298', opis: 'Solenoid 1-2 / 3-4 (dwa w skrzyni). To NIE jest solenoid EPC.', model: '4L60E 1993+', status: 'poprawione', src: ['SOL24230298'], uwaga: 'Usunięto duplikat „Solenoid EPC” z tym samym numerem.' },
  { kat: 'hamulce', nazwa: 'Klocki hamulcowe przód', oem: 'AC Delco 17D473CH', opis: 'Klocki hamulcowe przednie', model: '1500', status: 'niezweryfikowane', uwaga: NV },
  { kat: 'hamulce', nazwa: 'Tarcze hamulcowe przód', oem: 'AC Delco 18A2491', opis: 'Tarcze hamulcowe przednie', model: '1500', status: 'niezweryfikowane', uwaga: NV },
  { kat: 'hamulce', nazwa: 'Cylinderki hamulcowe', oem: 'AC Delco 18E660', opis: 'Cylinderki bębnów tylnych', model: '1500', status: 'niezweryfikowane', uwaga: NV },
  { kat: 'zawieszenie', nazwa: 'Amortyzatory przód', oem: 'AC Delco 504-1079', opis: 'Amortyzatory przednie', model: '1500', status: 'niezweryfikowane', uwaga: NV },
  { kat: 'zawieszenie', nazwa: 'Amortyzatory tył', oem: 'AC Delco 504-1080', opis: 'Amortyzatory tylne', model: '1500', status: 'niezweryfikowane', uwaga: NV },
  { kat: 'zawieszenie', nazwa: 'Końcówki drążków', oem: 'AC Delco 45A0526', opis: 'Końcówki drążków kierowniczych', model: 'Wszystkie', status: 'niezweryfikowane', src: ['TR45A0526'], uwaga: `${NV}. Katalogi przypisują 45A0526 innemu autu (Toyota Van).` },
  { kat: 'silnik', nazwa: 'Uszczelka kolektora', oem: 'Fel-Pro MS98016T', opis: 'Uszczelki kolektora dolotowego', model: '5.7L', status: 'niezweryfikowane', src: ['MS98016T'], uwaga: `${NV}. Fel-Pro opisuje MS 98016 T jako zestaw do silników LS (Gen III), nie L31.` },
  { kat: 'silnik', nazwa: 'Pompa paliwa', oem: 'AC Delco EP381', opis: 'Pompa paliwa w zbiorniku', model: 'C/K 1996–1997 (wg katalogu)', status: 'poprawione', src: ['EP381'] },
  { kat: 'silnik', nazwa: 'Cewka zapłonowa', oem: 'AC Delco D577', opis: 'Cewka zapłonowa (GM 10489421)', model: 'Vortec 1996–1999', status: 'poprawione', src: ['D577'] },
  { kat: 'silnik', nazwa: 'Rozdzielacz TBI', oem: 'AC Delco 1103952', opis: 'Rozdzielacz zapłonu HEI', model: '5.0/5.7/7.4 TBI do 1995', status: 'poprawione', src: ['DIST1103952'] },
  { kat: 'silnik', nazwa: 'Kopułka rozdzielacza V8 Vortec', oem: 'GM 10452459', opis: 'Kopułka rozdzielacza', model: 'V8 Vortec 1996–1999 (4.3L: 10452458)', status: 'potwierdzone', src: ['GPG_CAP'] },
  { kat: 'silnik', nazwa: 'Palec rozdzielacza Vortec', oem: 'GM 10452457', opis: 'Palec (rotor) rozdzielacza', model: 'Vortec 1996–1999', status: 'potwierdzone', src: ['GPG_ROTOR'] },
  { kat: 'skrzynia', nazwa: 'Czujnik prędkości', oem: 'AC Delco 24203876', opis: 'Czujnik prędkości wejściowej/wyjściowej z uszczelką', model: '4L60E / 4L80E', status: 'potwierdzone', src: ['VSS24203876'] },
  { kat: 'skrzynia', nazwa: 'Uszczelka konwertera', oem: 'AC Delco 24206182', opis: 'Uszczelka konwertera momentu', model: '4L60E', status: 'niezweryfikowane', src: ['G24206182'], uwaga: `${NV}. GM opisuje 24206182 jako uszczelkę miski 20-śrubowej skrzyni aut FWD — nie pasuje do opisu.` },
  { kat: 'hamulce', nazwa: 'Pompa hamulcowa', oem: 'AC Delco 18M1165', opis: 'Pompa hamulcowa główna', model: 'Wszystkie', status: 'niezweryfikowane', src: ['MC18M1165'], uwaga: `${NV}. Katalogi przypisują 18M1165 innym autom.` },
  { kat: 'hamulce', nazwa: 'Przewody hamulcowe', oem: 'Inline Tube', opis: 'Zestaw przewodów stalowych (marka, bez numeru)', model: 'Wszystkie', status: 'niezweryfikowane', uwaga: NV },
  { kat: 'zawieszenie', nazwa: 'Sworznie / wahacz górny', oem: 'AC Delco 45D2278', opis: 'Sworznie wahaczy', model: '1500', status: 'niezweryfikowane', src: ['BJ45D2278'], uwaga: `${NV}. Katalogi przypisują 45D2278 innym autom (Dodge Dakota/Durango).` },
  { kat: 'zawieszenie', nazwa: 'Tuleje wahaczy', oem: 'AC Delco 45G11040', opis: 'Tuleje wahaczy', model: '1500', status: 'niezweryfikowane', uwaga: NV },
  { kat: 'filtry', nazwa: 'Filtr kabinowy', oem: 'AC Delco CF101', opis: 'Filtr powietrza kabiny', model: '1996+', status: 'niezweryfikowane', uwaga: `${NV}. Instrukcja GM 1999 nie wymienia filtra kabinowego.` },
  { kat: 'silnik', nazwa: 'Czujnik MAP', oem: 'AC Delco 213-1545', opis: 'Czujnik ciśnienia kolektora', model: 'Wszystkie', status: 'niezweryfikowane', uwaga: NV },
  { kat: 'silnik', nazwa: 'Czujnik IAT', oem: 'AC Delco 213-243', opis: 'Czujnik temperatury powietrza', model: 'Wszystkie', status: 'niezweryfikowane', uwaga: NV },
  { kat: 'silnik', nazwa: 'Czujnik ECT', oem: 'AC Delco 213-928', opis: 'Czujnik temperatury płynu (GM 15326386)', model: 'Tahoe 1995–2000 (wg katalogu)', status: 'poprawione', src: ['ECT213928'] },
  { kat: 'silnik', nazwa: 'Czujnik tlenu', oem: 'AC Delco 213-1552', opis: 'Sonda lambda', model: 'Wszystkie', status: 'niezweryfikowane', src: ['O2_213_1552'], uwaga: `${NV}. Katalogi przypisują 213-1552 autom 2004–2007.` },
  { kat: 'hamulce', nazwa: 'Zacisk przedni', oem: 'AC Delco 18FR1247', opis: 'Zacisk hamulcowy przód', model: '1500', status: 'niezweryfikowane', src: ['CAL18FR1247'], uwaga: `${NV}. Katalogi przypisują 18FR1247 innym autom (Toyota).` },
  { kat: 'hamulce', nazwa: 'Tarcza przednia', oem: 'AC Delco 18A1532', opis: 'Tarcza hamulcowa przód', model: '1500', status: 'niezweryfikowane', uwaga: NV },
  { kat: 'zawieszenie', nazwa: 'Wahacz dolny', oem: 'AC Delco 45D2279', opis: 'Wahacz dolny', model: '1500', status: 'niezweryfikowane', uwaga: NV },
  { kat: 'silnik', nazwa: 'Wtrysk centralny (spider)', oem: 'AC Delco 217-3028', opis: 'Zestaw wtrysku CPI/spider', model: '4.3L V6 Vortec 1996+', status: 'poprawione', src: ['INJ2173028'], uwaga: 'Wcześniej przypisany do 5.7L — to część do 4.3L.' },
  { kat: 'silnik', nazwa: 'Regulator ciśnienia', oem: 'AC Delco 217-3074', opis: 'Regulator ciśnienia paliwa', model: 'Vortec', status: 'niezweryfikowane', uwaga: NV },
  { kat: 'silnik', nazwa: 'Czujnik stukowy (KS)', oem: 'AC Delco 213-324', opis: 'Czujnik spalania stukowego', model: 'C/K 1988–2000 (wg katalogu)', status: 'poprawione', src: ['KS213324'], uwaga: 'Wcześniej opisany jako czujnik wału (CKP) — to czujnik stukowy.' },
  { kat: 'silnik', nazwa: 'Czujnik wałka (CMP)', oem: 'AC Delco 213-920', opis: 'Czujnik położenia wałka rozrządu', model: 'Vortec 1996–1999', status: 'potwierdzone', src: ['CMP213920'] },
  { kat: 'hamulce', nazwa: 'Cylinder koła', oem: 'AC Delco 18E1277', opis: 'Cylinder hamulcowy tył', model: '1500', status: 'niezweryfikowane', uwaga: NV },
  { kat: 'zawieszenie', nazwa: 'Sprężyna przód', oem: 'AC Delco 45H0065', opis: 'Sprężyna przednia', model: 'C1500', status: 'niezweryfikowane', uwaga: NV },
  { kat: 'filtry', nazwa: 'Filtr paliwa Diesel', oem: 'AC Delco TP1006', opis: 'Filtr paliwa 6.5L', model: '6.5L diesel (wg OM95)', status: 'potwierdzone', src: ['OM95'] },
];

export const STATUS_LABEL: Record<PartStatus, string> = {
  potwierdzone: 'potwierdzone',
  poprawione: 'poprawione wg źródła',
  niezweryfikowane: 'niezweryfikowane — sprawdź w manualu',
};
