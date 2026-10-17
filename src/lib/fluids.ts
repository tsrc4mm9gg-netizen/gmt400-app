export type FluidSpecification = {
 id: string;
 system: string;
 appliesTo: string[];
 capacity: string | null;
 specification: string | null;
 filter: string | null;
 confidence: 'reference' | 'verify';
 source: string;
 sourceTitle: string;
 notes: string;
};

export const FLUID_SPECS: FluidSpecification[] = [
 {
 id: 'engine-oil-5-7l',
 system: 'Olej silnikowy',
 appliesTo: ['5.7L V8 benzyna'],
 capacity: 'Sprawdź pojemność dla konkretnego rocznika i filtra',
 specification: 'Zgodnie z instrukcją właściwego rocznika',
 filter: 'Filtr oleju zgodny z silnikiem i rocznikiem',
 confidence: 'verify',
 source: 'https://www.gmt400.com/threads/rpo-code-list.37531/',
 sourceTitle: 'GMT400.com — referencja społecznościowa',
 notes: 'Pojemność zależy od miski, filtra i historii napraw. Uzupełniaj do znacznika, nie „na sztywno”.'
 },
 {
 id: 'engine-oil-6-5l',
 system: 'Olej silnikowy',
 appliesTo: ['6.5L V8 diesel'],
 capacity: 'Sprawdź pojemność dla konkretnego rocznika i filtra',
 specification: 'Zgodnie z instrukcją właściwego rocznika',
 filter: 'Filtr oleju zgodny z silnikiem i rocznikiem',
 confidence: 'verify',
 source: 'https://www.gmt400.com/threads/rpo-code-list.37531/',
 sourceTitle: 'GMT400.com — referencja społecznościowa',
 notes: 'Diesel wymaga potwierdzenia filtra, pojemności i specyfikacji oleju dla konkretnego rocznika.'
 },
 {
 id: 'coolant',
 system: 'Płyn chłodniczy',
 appliesTo: ['Benzyna', 'Diesel'],
 capacity: 'Zależna od silnika, chłodnicy i ogrzewania',
 specification: 'Zgodnie z instrukcją właściwego rocznika',
 filter: null,
 confidence: 'verify',
 source: 'https://www.gmt400.com/threads/rpo-code-list.37531/',
 sourceTitle: 'GMT400.com — referencja społecznościowa',
 notes: 'Nie mieszaj różnych technologii płynów. Po wymianie usuń powietrze z układu.'
 },
 {
 id: 'at-4l60e',
 system: 'Automatyczna skrzynia 4L60E',
 appliesTo: ['Automatyczna', '4L60E'],
 capacity: 'Zależna od zakresu serwisu i chłodnicy',
 specification: 'Zgodnie z instrukcją właściwego rocznika',
 filter: 'Filtr skrzyni zgodny z 4L60E',
 confidence: 'verify',
 source: 'https://www.gmt400.com/threads/rpo-code-list.37531/',
 sourceTitle: 'GMT400.com — referencja społecznościowa',
 notes: 'Poziom sprawdzać zgodnie z procedurą i temperaturą płynu. Nie dobieraj płynu wyłącznie po oznaczeniu skrzyni.'
 },
 {
 id: 'at-4l80e',
 system: 'Automatyczna skrzynia 4L80E',
 appliesTo: ['Automatyczna', '4L80E'],
 capacity: 'Zależna od zakresu serwisu i chłodnicy',
 specification: 'Zgodnie z instrukcją właściwego rocznika',
 filter: 'Filtr skrzyni zgodny z 4L80E',
 confidence: 'verify',
 source: 'https://www.gmt400.com/threads/rpo-code-list.37531/',
 sourceTitle: 'GMT400.com — referencja społecznościowa',
 notes: '4L80E nie jest automatycznie wymienna z 4L60E. Potwierdź konwerter, obudowę i złącza.'
 },
 {
 id: 'transfer-case',
 system: 'Skrzynia rozdzielcza',
 appliesTo: ['4x4'],
 capacity: 'Zależna od modelu reduktora',
 specification: 'Zgodnie z instrukcją właściwego rocznika',
 filter: null,
 confidence: 'verify',
 source: 'https://www.gmt400.com/threads/rpo-code-list.37531/',
 sourceTitle: 'GMT400.com — referencja społecznościowa',
 notes: 'Zidentyfikuj reduktor po tabliczce przed doborem płynu.'
 },
 {
 id: 'front-differential',
 system: 'Przedni mechanizm różnicowy',
 appliesTo: ['4x4'],
 capacity: 'Zależna od mostu',
 specification: 'Zgodnie z instrukcją właściwego rocznika',
 filter: null,
 confidence: 'verify',
 source: 'https://www.gmt400.com/threads/rpo-code-list.37531/',
 sourceTitle: 'GMT400.com — referencja społecznościowa',
 notes: 'Sprawdź typ mostu i obecność aktuatorskiego połączenia przed doborem płynu.'
 },
 {
 id: 'rear-differential',
 system: 'Tylny mechanizm różnicowy',
 appliesTo: ['RWD', '4x4'],
 capacity: 'Zależna od mostu',
 specification: 'Zgodnie z instrukcją właściwego rocznika',
 filter: null,
 confidence: 'verify',
 source: 'https://www.gmt400.com/threads/rpo-code-list.37531/',
 sourceTitle: 'GMT400.com — referencja społecznościowa',
 notes: 'Most z ograniczonym poślizgiem może wymagać dodatku. Potwierdź typ mostu i przełożenie.'
 },
 {
 id: 'brake-fluid',
 system: 'Płyn hamulcowy',
 appliesTo: ['Wszystkie'],
 capacity: 'Zależna od układu',
 specification: 'Zgodnie z instrukcją właściwego rocznika',
 filter: null,
 confidence: 'verify',
 source: 'https://www.gmt400.com/threads/rpo-code-list.37531/',
 sourceTitle: 'GMT400.com — referencja społecznościowa',
 notes: 'Nie mieszaj płynów o różnych specyfikacjach. Po serwisie usuń powietrze z układu.'
 },
 {
 id: 'power-steering',
 system: 'Wspomaganie kierownicy',
 appliesTo: ['Wszystkie'],
 capacity: 'Zależna od układu',
 specification: 'Zgodnie z instrukcją właściwego rocznika',
 filter: null,
 confidence: 'verify',
 source: 'https://www.gmt400.com/threads/rpo-code-list.37531/',
 sourceTitle: 'GMT400.com — referencja społecznościowa',
 notes: 'Uzupełniaj tylko płynem zgodnym z układem; sprawdzaj wycieki i stan przewodów.'
 }
];

export function findFluids(parameters: { system?: string; powertrain?: string; transmission?: string }) {
 const system = parameters.system?.toLowerCase().trim() ?? '';
 const powertrain = parameters.powertrain?.toLowerCase().trim() ?? '';
 const transmission = parameters.transmission?.toLowerCase().trim() ?? '';

 return FLUID_SPECS.filter(item => {
 const systemMatch = !system || item.system.toLowerCase().includes(system) || item.id.includes(system);
 const powertrainMatch = !powertrain || item.appliesTo.some(value => value.toLowerCase().includes(powertrain));
 const transmissionMatch = !transmission || item.appliesTo.some(value => value.toLowerCase().includes(transmission));
 return systemMatch && powertrainMatch && transmissionMatch;
 });
}
