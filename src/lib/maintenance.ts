export type MaintenanceItem = {
 id: string; category: string; task: string;
 intervalMiles: number | null; intervalMonths: number | null;
 severeServiceMiles: number | null; severeServiceMonths: number | null;
 appliesTo: string[]; fuel?: string[]; drivetrain?: string[]; transmission?: string[];
 confidence: 'reference' | 'verify'; source: string | null; sourceTitle: string; notes: string;
};
export function normalizeMaintenanceValue(value: string | undefined): string {
 const key = (value ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/g, 'l').trim();
 const aliases: Record<string, string> = { petrol: 'benzyna', gasoline: 'benzyna', '4wd': '4x4', '2wd': 'rwd', manual: 'reczna', automatic: 'automatyczna' };
 return aliases[key] ?? key;
}
function item(id: string, category: string, task: string, appliesTo: string[], scope: Pick<MaintenanceItem, 'fuel' | 'drivetrain' | 'transmission'> = {}): MaintenanceItem {
 return { id, category, task, appliesTo, ...scope, intervalMiles: null, intervalMonths: null, severeServiceMiles: null, severeServiceMonths: null, confidence: 'verify', source: null, sourceTitle: 'Lista czynności do weryfikacji — brak potwierdzonej instrukcji serwisowej', notes: 'Nie ustalono interwału, pojemności ani specyfikacji dla konkretnego auta. Wcześniejsze wartości liczbowe wycofano jako niezweryfikowane. Nie traktuj tej listy jako harmonogramu producenta; dane należy potwierdzić w dokumentacji właściwego rocznika i podzespołu.' };
}
export const MAINTENANCE_ITEMS: MaintenanceItem[] = [
 item('engine-oil', 'Silnik', 'Wymiana oleju silnikowego i filtra oleju', ['Benzyna', 'Diesel'], { fuel: ['benzyna', 'diesel'] }),
 item('air-filter', 'Silnik', 'Kontrola i wymiana filtra powietrza', ['Benzyna', 'Diesel'], { fuel: ['benzyna', 'diesel'] }),
 item('transmission-fluid', 'Skrzynia', 'Wymiana płynu automatycznej skrzyni i filtra', ['Automatyczna'], { transmission: ['automatyczna'] }),
 item('manual-transmission-fluid', 'Skrzynia', 'Wymiana płynu ręcznej skrzyni biegów', ['Ręczna'], { transmission: ['reczna'] }),
 item('transfer-case-fluid', 'Napęd 4x4', 'Wymiana płynu skrzyni rozdzielczej', ['4x4'], { drivetrain: ['4x4'] }),
 item('differential-fluid', 'Osie', 'Wymiana płynu mechanizmu różnicowego', ['RWD', '4x4'], { drivetrain: ['rwd', '4x4'] }),
 item('coolant', 'Chłodzenie', 'Wymiana płynu chłodniczego', ['Benzyna', 'Diesel'], { fuel: ['benzyna', 'diesel'] }),
 item('brake-fluid', 'Hamulce', 'Wymiana płynu hamulcowego', ['Wszystkie']),
 item('brake-inspection', 'Hamulce', 'Kontrola klocków, tarcz, bębnów, przewodów i poziomu płynu', ['Wszystkie']),
 item('tire-rotation', 'Koła', 'Rotacja opon i kontrola ciśnienia', ['Wszystkie'])
];

const transmissionFluid = MAINTENANCE_ITEMS.find(item => item.id === 'transmission-fluid');
if (transmissionFluid) {
 // OM95 (s. 7-23, harmonogram silników benzynowych): przy normalnej eksploatacji płyn i filtr nie wymagają wymiany.
 transmissionFluid.intervalMiles = null;
 transmissionFluid.severeServiceMiles = 50000;
 transmissionFluid.confidence = 'reference';
 transmissionFluid.source = 'https://assets.gm.com/manuals/chevrolet/1995_chevrolet_1500_owners.pdf';
 transmissionFluid.sourceTitle = 'OM95 — 1995 Chevrolet C/K 1500 Owners Manual';
 transmissionFluid.notes = 'OM95 (1995, s. 7-23): wymiana płynu i filtra co 50 000 mil (w instrukcji: 83 000 km) tylko przy ciężkiej eksploatacji — gęsty ruch miejski przy temperaturze regularnie od 32 °C, teren górzysty, częste holowanie przyczepy, taxi/policja/dostawy. Bez tych warunków instrukcja 1995 mówi, że płyn i filtr nie wymagają wymiany. Od rocznika 1998 instrukcja dodaje wymianę co 160 000 km (100 000 mil) przy normalnej eksploatacji i 80 000 km przy GVWR powyżej 8 600 lb — szczegóły w Harmonogramie przeglądów (/przeglady). Płyn DEXRON-III. Sprawdź w swoim aucie / manualu — GMT400 ma wiele wariantów (rocznik, GVWR, silnik, skrzynia, RPO).';
}

const coolantItem = MAINTENANCE_ITEMS.find(item => item.id === 'coolant');
if (coolantItem) {
 coolantItem.notes = '1995: zielony płyn długowieczny GM, wymiana 48 000 km (30 000 mil) / 24 mies. 1999 DEX-COOL: pierwsza wymiana 240 000 km (150 000 mil) / 60 mies. Nie mieszaj technologii płynów. Sprawdź w swoim aucie / manualu — GMT400 ma wiele wariantów (rocznik, GVWR, silnik, skrzynia, RPO).';
}

const transferCaseItem = MAINTENANCE_ITEMS.find(item => item.id === 'transfer-case-fluid');
if (transferCaseItem) {
 transferCaseItem.notes = 'NP241C / NP243C: DEXRON-III. NV246 AutoTrac: GM Automatic Transfer Case Fluid 12378396 (zastąpiony przez GM 12378508 Auto-Trak II). Sprawdź w swoim aucie / manualu — GMT400 ma wiele wariantów (rocznik, GVWR, silnik, skrzynia, RPO).';
}

const differentialItem = MAINTENANCE_ITEMS.find(item => item.id === 'differential-fluid');
if (differentialItem) {
 differentialItem.notes = 'SAE 80W-90 GL-5 (GM 1052271). G80: bez dodatku tarciowego. Sprawdź w swoim aucie / manualu — GMT400 ma wiele wariantów (rocznik, GVWR, silnik, skrzynia, RPO).';
}

// OM95 (1995, s. 7-4–7-6, 7-12, 7-23) — interwały potwierdzone w instrukcji GM; instrukcje serwisowe 1988–1994 podają te same wartości dla oleju, filtra powietrza i płynu chłodniczego (szczegóły i inne roczniki: /przeglady).
const OM95_URL = 'https://assets.gm.com/manuals/chevrolet/1995_chevrolet_1500_owners.pdf';
const CHECK = 'Sprawdź w swoim aucie / manualu — GMT400 ma wiele wariantów (rocznik, GVWR, silnik, skrzynia, RPO).';
function confirm(id: string, values: Partial<MaintenanceItem>) {
 const entry = MAINTENANCE_ITEMS.find(candidate => candidate.id === id);
 if (entry) Object.assign(entry, { confidence: 'reference', source: OM95_URL, sourceTitle: 'OM95 — 1995 Chevrolet C/K 1500 Owners Manual', ...values });
}
confirm('engine-oil', { intervalMiles: 7500, intervalMonths: 12, severeServiceMiles: 3000, severeServiceMonths: 3, notes: `OM95 (1995, s. 7-4–7-6), silniki benzynowe do 8 600 lb GVWR: olej i filtr co 12 000 km (7 500 mil) lub 12 mies.; ciężka eksploatacja co 5 000 km (3 000 mil) lub 3 mies. Powyżej 8 600 lb GVWR (HD): co 10 000 km (6 000 mil) / 3 mies. Instrukcje serwisowe 1988–1994 podają te same wartości. Rocznik 1999 i diesel 6.5 mają inne zasady — zob. /przeglady. ${CHECK}` });
confirm('air-filter', { intervalMiles: 30000, severeServiceMiles: 30000, notes: `OM95 (1995, s. 7-4–7-6): wymiana co 48 000 km (30 000 mil); w kurzu kontrola co 24 000 km (15 000 mil). To samo w instrukcjach serwisowych 1988–1994. ${CHECK}` });
confirm('coolant', { intervalMiles: 30000, intervalMonths: 24, severeServiceMiles: 30000, severeServiceMonths: 24, notes: `OM95 (1995, s. 7-4–7-6): zielony płyn GM 6038-M 50/50 z wodą, wymiana z płukaniem co 48 000 km (30 000 mil) / 24 mies. (to samo 1988–1994). 1999 DEX-COOL: pierwsza wymiana 240 000 km (150 000 mil) / 60 mies. Nie mieszaj technologii płynów. ${CHECK}` });
confirm('tire-rotation', { intervalMiles: 15000, severeServiceMiles: 12000, notes: `OM95 (1995, s. 7-4–7-6): pierwsza rotacja po 12 000 km (7 500 mil), potem co 24 000 km (15 000 mil); ciężka eksploatacja: pierwsza po ok. 10 000 km (6 000 mil), potem co 19 000 km (12 000 mil); HD powyżej 8 600 lb: pierwsza po 10 000 km, potem co 19 000 km. Ciśnienie według naklejki na drzwiach. ${CHECK}` });
confirm('manual-transmission-fluid', { notes: `OM95 (1995, s. 7-23): olej w skrzyni ręcznej nie wymaga okresowej wymiany — tylko kontrola poziomu. Pojemności i typ oleju: /pojemnosci. ${CHECK}` });
confirm('differential-fluid', { severeServiceMiles: 15000, notes: `OM95 (1995, s. 7-12): wymiana oleju w moście co 24 000 km (15 000 mil) tylko przy jeździe w kurzu lub holowaniu przyczepy; bez tego tylko kontrola poziomu. SAE 80W-90 GL-5 (GM 1052271); G80 bez dodatku tarciowego. Pojemności: /pojemnosci. ${CHECK}` });

export function findMaintenance(parameters: { fuel?: string; drivetrain?: string; transmission?: string; severeService?: boolean }) {
 const fuel = normalizeMaintenanceValue(parameters.fuel);
 const drivetrain = normalizeMaintenanceValue(parameters.drivetrain);
 const transmission = normalizeMaintenanceValue(parameters.transmission);
 const matches = (selected: string, allowed?: string[]) => !selected || !allowed || allowed.includes(selected);
 return MAINTENANCE_ITEMS.filter(entry => matches(fuel, entry.fuel) && matches(drivetrain, entry.drivetrain) && matches(transmission, entry.transmission)).map(entry => ({ ...entry, severeService: parameters.severeService === true, intervalVerified: entry.confidence === 'reference' }));
}
