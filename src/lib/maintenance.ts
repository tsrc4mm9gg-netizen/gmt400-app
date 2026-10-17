export type MaintenanceItem = {
 id: string;
 category: string;
 task: string;
 intervalMiles: number | null;
 intervalMonths: number | null;
 severeServiceMiles: number | null;
 severeServiceMonths: number | null;
 appliesTo: string[];
 confidence: 'reference' | 'verify';
 source: string;
 sourceTitle: string;
 notes: string;
};

export const MAINTENANCE_ITEMS: MaintenanceItem[] = [
 {
 id: 'engine-oil',
 category: 'Silnik',
 task: 'Wymiana oleju silnikowego i filtra oleju',
 intervalMiles: 3000,
 intervalMonths: 3,
 severeServiceMiles: 3000,
 severeServiceMonths: 3,
 appliesTo: ['Benzyna', 'Diesel'],
 confidence: 'reference',
 source: 'https://www.gmt400.com/threads/rpo-code-list.37531/',
 sourceTitle: 'GMT400.com — referencja społecznościowa',
 notes: 'Dla starszych silników i jazdy miejskiej, krótkich tras lub ciągnięcia przyczepy stosuj krótszy interwał. Potwierdź lepkość i pojemność w instrukcji właściwego rocznika.'
 },
 {
 id: 'air-filter',
 category: 'Silnik',
 task: 'Kontrola i wymiana filtra powietrza',
 intervalMiles: 15000,
 intervalMonths: 12,
 severeServiceMiles: 7500,
 severeServiceMonths: 6,
 appliesTo: ['Benzyna', 'Diesel'],
 confidence: 'reference',
 source: 'https://www.gmt400.com/threads/rpo-code-list.37531/',
 sourceTitle: 'GMT400.com — referencja społecznościowa',
 notes: 'W warunkach pylonych filtr należy sprawdzać częściej. Nie stosuj filtra o innym oporze przepływu bez weryfikacji.'
 },
 {
 id: 'transmission-fluid',
 category: 'Skrzynia',
 task: 'Wymiana płynu automatycznej skrzyni i filtra',
 intervalMiles: 30000,
 intervalMonths: 24,
 severeServiceMiles: 15000,
 severeServiceMonths: 12,
 appliesTo: ['Automatyczna'],
 confidence: 'verify',
 source: 'https://www.gmt400.com/threads/rpo-code-list.37531/',
 sourceTitle: 'GMT400.com — referencja społecznościowa',
 notes: 'Typ płynu, filtr i procedura różnią się między 4L60E i 4L80E. Sprawdź oznaczenie skrzyni przed serwisem.'
 },
 {
 id: 'manual-transmission-fluid',
 category: 'Skrzynia',
 task: 'Wymiana płynu ręcznej skrzyni biegów',
 intervalMiles: 30000,
 intervalMonths: 24,
 severeServiceMiles: 15000,
 severeServiceMonths: 12,
 appliesTo: ['Ręczna'],
 confidence: 'verify',
 source: 'https://www.gmt400.com/threads/rpo-code-list.37531/',
 sourceTitle: 'GMT400.com — referencja społecznościowa',
 notes: 'Specyfikacja zależy od skrzyni. Nie mieszaj płynów i nie stosuj oleju na podstawie samego typu napędu.'
 },
 {
 id: 'transfer-case-fluid',
 category: 'Napęd 4x4',
 task: 'Wymiana płynu skrzyni rozdzielczej',
 intervalMiles: 30000,
 intervalMonths: 24,
 severeServiceMiles: 15000,
 severeServiceMonths: 12,
 appliesTo: ['4x4'],
 confidence: 'verify',
 source: 'https://www.gmt400.com/threads/rpo-code-list.37531/',
 sourceTitle: 'GMT400.com — referencja społecznościowa',
 notes: 'Typ skrzyni rozdzielczej i płyn muszą być potwierdzone z tabliczki oraz instrukcji serwisowej.'
 },
 {
 id: 'differential-fluid',
 category: 'Osie',
 task: 'Wymiana płynu mechanizmu różnicowego',
 intervalMiles: 30000,
 intervalMonths: 24,
 severeServiceMiles: 15000,
 severeServiceMonths: 12,
 appliesTo: ['RWD', '4x4'],
 confidence: 'verify',
 source: 'https://www.gmt400.com/threads/rpo-code-list.37531/',
 sourceTitle: 'GMT400.com — referencja społecznościowa',
 notes: 'Most z G80 może wymagać dodatku do płynu. Potwierdź typ mostu, przełożenie i specyfikację dodatku.'
 },
 {
 id: 'coolant',
 category: 'Chłodzenie',
 task: 'Wymiana płynu chłodniczego',
 intervalMiles: 30000,
 intervalMonths: 24,
 severeServiceMiles: 30000,
 severeServiceMonths: 24,
 appliesTo: ['Benzyna', 'Diesel'],
 confidence: 'verify',
 source: 'https://www.gmt400.com/threads/rpo-code-list.37531/',
 sourceTitle: 'GMT400.com — referencja społecznościowa',
 notes: 'Nie mieszaj technologii płynów. Po wymianie usuń powietrze z układu zgodnie z procedurą dla konkretnego silnika.'
 },
 {
 id: 'brake-fluid',
 category: 'Hamulce',
 task: 'Wymiana płynu hamulcowego',
 intervalMiles: null,
 intervalMonths: 24,
 severeServiceMiles: null,
 severeServiceMonths: 12,
 appliesTo: ['Wszystkie'],
 confidence: 'reference',
 source: 'https://www.gmt400.com/threads/rpo-code-list.37531/',
 sourceTitle: 'GMT400.com — referencja społecznościowa',
 notes: 'Płyn higroskopijny; wymieniaj częściej przy intensywnej eksploatacji lub po naprawie układu. Używaj płynu o specyfikacji z instrukcji.'
 },
 {
 id: 'brake-inspection',
 category: 'Hamulce',
 task: 'Kontrola klocków, tarcz, bębnów, przewodów i poziomu płynu',
 intervalMiles: 7500,
 intervalMonths: 6,
 severeServiceMiles: 5000,
 severeServiceMonths: 3,
 appliesTo: ['Wszystkie'],
 confidence: 'reference',
 source: 'https://www.gmt400.com/threads/rpo-code-list.37531/',
 sourceTitle: 'GMT400.com — referencja społecznościowa',
 notes: 'Kontroluj również przewody elastyczne, zaciski i działanie hamulca postojowego.'
 },
 {
 id: 'tire-rotation',
 category: 'Koła',
 task: 'Rotacja opon i kontrola ciśnienia',
 intervalMiles: 7500,
 intervalMonths: 6,
 severeServiceMiles: 5000,
 severeServiceMonths: 3,
 appliesTo: ['Wszystkie'],
 confidence: 'reference',
 source: 'https://www.gmt400.com/threads/rpo-code-list.37531/',
 sourceTitle: 'GMT400.com — referencja społecznościowa',
 notes: 'Schemat rotacji zależy od układu napędowego i typu opon. Ciśnienie ustawiaj według tabliczki pojazdu.'
 }
];

export function findMaintenance(parameters: { fuel?: string; drivetrain?: string; transmission?: string; severeService?: boolean }) {
 const fuel = parameters.fuel?.toLowerCase().trim() ?? '';
 const drivetrain = parameters.drivetrain?.toLowerCase().trim() ?? '';
 const transmission = parameters.transmission?.toLowerCase().trim() ?? '';
 const severe = Boolean(parameters.severeService);

 return MAINTENANCE_ITEMS.filter(item => {
 const fuelMatch = !fuel || item.appliesTo.some(value => value.toLowerCase().includes(fuel));
 const drivetrainMatch = !drivetrain || item.appliesTo.some(value => value.toLowerCase().includes(drivetrain));
 const transmissionMatch = !transmission || item.appliesTo.some(value => value.toLowerCase().includes(transmission));
 return fuelMatch && drivetrainMatch && transmissionMatch;
 }).map(item => ({
 ...item,
 intervalMiles: severe && item.severeServiceMiles ? item.severeServiceMiles : item.intervalMiles,
 intervalMonths: severe && item.severeServiceMonths ? item.severeServiceMonths : item.intervalMonths,
 severeService: severe
 }));
}
