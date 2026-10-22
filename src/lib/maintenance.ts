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
 transmissionFluid.intervalMiles = 100000;
 transmissionFluid.severeServiceMiles = 50000;
 transmissionFluid.confidence = 'reference';
 transmissionFluid.source = 'https://assets.gm.com/manuals/chevrolet/1995_chevrolet_1500_owners.pdf';
 transmissionFluid.sourceTitle = 'OM95 — 1995 Chevrolet C/K 1500 Owners Manual';
 transmissionFluid.notes = 'Wymiana płynu i filtra: 100 000 mil normalnie, 50 000 mil przy ciężkiej eksploatacji. Płyn DEXRON-III. Sprawdź w swoim aucie / manualu — GMT400 ma wiele wariantów (rocznik, GVWR, silnik, skrzynia, RPO).';
}

const coolantItem = MAINTENANCE_ITEMS.find(item => item.id === 'coolant');
if (coolantItem) {
 coolantItem.notes = '1995: zielony płyn długowieczny GM, wymiana 30 000 mil / 24 mies. 1999 DEX-COOL: pierwsza wymiana 150 000 mil / 60 mies. Nie mieszaj technologii płynów. Sprawdź w swoim aucie / manualu — GMT400 ma wiele wariantów (rocznik, GVWR, silnik, skrzynia, RPO).';
}

const transferCaseItem = MAINTENANCE_ITEMS.find(item => item.id === 'transfer-case-fluid');
if (transferCaseItem) {
 transferCaseItem.notes = 'NP241C / NP243C: DEXRON-III. NV246 AutoTrac: GM Automatic Transfer Case Fluid 12378396. Sprawdź w swoim aucie / manualu — GMT400 ma wiele wariantów (rocznik, GVWR, silnik, skrzynia, RPO).';
}

const differentialItem = MAINTENANCE_ITEMS.find(item => item.id === 'differential-fluid');
if (differentialItem) {
 differentialItem.notes = 'SAE 80W-90 GL-5 (GM 1052271). G80: bez dodatku tarciowego. Sprawdź w swoim aucie / manualu — GMT400 ma wiele wariantów (rocznik, GVWR, silnik, skrzynia, RPO).';
}

export function findMaintenance(parameters: { fuel?: string; drivetrain?: string; transmission?: string; severeService?: boolean }) {
 const fuel = normalizeMaintenanceValue(parameters.fuel);
 const drivetrain = normalizeMaintenanceValue(parameters.drivetrain);
 const transmission = normalizeMaintenanceValue(parameters.transmission);
 const matches = (selected: string, allowed?: string[]) => !selected || !allowed || allowed.includes(selected);
 return MAINTENANCE_ITEMS.filter(entry => matches(fuel, entry.fuel) && matches(drivetrain, entry.drivetrain) && matches(transmission, entry.transmission)).map(entry => ({ ...entry, severeService: parameters.severeService === true, intervalVerified: entry.confidence === 'reference' }));
}
