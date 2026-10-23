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
 id: 'engine-oil-4-3l',
 system: 'Olej silnikowy',
 appliesTo: ['4.3L V6 benzyna'],
 capacity: '4,3 L (4,5 qt) z filtrem',
 specification: 'Zgodnie z instrukcją właściwego rocznika',
 filter: 'Filtr oleju zgodny z silnikiem i rocznikiem',
 confidence: 'reference',
 source: 'https://www.centerlearning.com/tmswebtree/techlink/images/issues/ref_gds/Oil_capchart9608.pdf',
 sourceTitle: 'GM — Oil capacity chart (1996-08)',
 notes: 'Pojemność z filtrem. Sprawdź w swoim aucie / manualu — GMT400 ma wiele wariantów (rocznik, GVWR, silnik, skrzynia, RPO).'
 },
 {
 id: 'engine-oil-5-0-5-7l',
 system: 'Olej silnikowy',
 appliesTo: ['5.0L V8 benzyna', '5.7L V8 benzyna'],
 capacity: '4,7 L (5 qt) z filtrem',
 specification: 'Zgodnie z instrukcją właściwego rocznika',
 filter: 'Filtr oleju zgodny z silnikiem i rocznikiem',
 confidence: 'reference',
 source: 'https://www.centerlearning.com/tmswebtree/techlink/images/issues/ref_gds/Oil_capchart9608.pdf',
 sourceTitle: 'GM — Oil capacity chart (1996-08)',
 notes: 'Pojemność z filtrem. Sprawdź w swoim aucie / manualu — GMT400 ma wiele wariantów (rocznik, GVWR, silnik, skrzynia, RPO).'
 },
 {
 id: 'engine-oil-6-5l',
 system: 'Olej silnikowy',
 appliesTo: ['6.5L V8 diesel'],
 capacity: '6,6 L (7 qt) z filtrem',
 specification: 'Zgodnie z instrukcją właściwego rocznika',
 filter: 'Filtr oleju zgodny z silnikiem i rocznikiem',
 confidence: 'reference',
 source: 'https://www.centerlearning.com/tmswebtree/techlink/images/issues/ref_gds/Oil_capchart9608.pdf',
 sourceTitle: 'GM — Oil capacity chart (1996-08)',
 notes: 'Pojemność z filtrem. Sprawdź w swoim aucie / manualu — GMT400 ma wiele wariantów (rocznik, GVWR, silnik, skrzynia, RPO).'
 },
 {
 id: 'engine-oil-7-4l',
 system: 'Olej silnikowy',
 appliesTo: ['7.4L V8 benzyna'],
 capacity: '6,6 L (7 qt) z filtrem',
 specification: 'Zgodnie z instrukcją właściwego rocznika',
 filter: 'Filtr oleju zgodny z silnikiem i rocznikiem',
 confidence: 'reference',
 source: 'https://www.centerlearning.com/tmswebtree/techlink/images/issues/ref_gds/Oil_capchart9608.pdf',
 sourceTitle: 'GM — Oil capacity chart (1996-08)',
 notes: 'Pojemność z filtrem. Sprawdź w swoim aucie / manualu — GMT400 ma wiele wariantów (rocznik, GVWR, silnik, skrzynia, RPO).'
 },
 {
 id: 'coolant-1995',
 system: 'Płyn chłodniczy',
 appliesTo: ['1995 Benzyna', '1995 Diesel'],
 capacity: '4.3L: 12,3 L (13 qt); 5.0/5.7L: 16,6 L (17,5 qt); 6.5L: 22,2 L (23,5 qt); 7.4L: 23,7 L (25 qt)',
 specification: 'Zielony płyn długowieczny GM; wymiana 48 000 km (30 000 mil) / 24 mies.',
 filter: null,
 confidence: 'reference',
 source: 'https://assets.gm.com/manuals/chevrolet/1995_chevrolet_1500_owners.pdf',
 sourceTitle: 'OM95 — 1995 Chevrolet C/K 1500 Owners Manual',
 notes: 'Nie mieszaj technologii płynów. Po wymianie usuń powietrze z układu. Sprawdź w swoim aucie / manualu — GMT400 ma wiele wariantów (rocznik, GVWR, silnik, skrzynia, RPO).'
 },
 {
 id: 'coolant-1999',
 system: 'Płyn chłodniczy',
 appliesTo: ['1999 Benzyna', '1999 Diesel'],
 capacity: 'L31 5.7L: 16,6 L (17,5 qt); z tylną nagrzewnicą 18,9 L (20 qt); 7.4L: 23,7 L (25 qt); z tylną nagrzewnicą 26 L (27,5 qt)',
 specification: 'DEX-COOL; pierwsza wymiana 240 000 km (150 000 mil) / 60 mies.',
 filter: null,
 confidence: 'reference',
 source: 'https://www.chevrolet.com/ownercenter/content/dam/gmownercenter/gmna/dynamic/manuals/1999/chevrolet/suburban/1999_chevrolet_suburban_owners.pdf',
 sourceTitle: 'OM99 — 1999 Chevrolet Suburban Owners Manual',
 notes: 'DEX-COOL: 240 000 km (150 000 mil) / 60 mies. Nie mieszaj technologii płynów. Sprawdź w swoim aucie / manualu — GMT400 ma wiele wariantów (rocznik, GVWR, silnik, skrzynia, RPO).'
 },
 {
 id: 'at-4l60e',
 system: 'Automatyczna skrzynia 4L60E',
 appliesTo: ['Automatyczna', '4L60E'],
 capacity: 'Zależna od zakresu serwisu i chłodnicy',
 specification: 'DEXRON-III',
 filter: 'Filtr skrzyni zgodny z 4L60E',
 confidence: 'reference',
 source: 'https://assets.gm.com/manuals/chevrolet/1995_chevrolet_1500_owners.pdf',
 sourceTitle: 'OM95 — 1995 Chevrolet C/K 1500 Owners Manual',
 notes: 'Poziom sprawdzać zgodnie z procedurą i temperaturą płynu. Sprawdź w swoim aucie / manualu — GMT400 ma wiele wariantów (rocznik, GVWR, silnik, skrzynia, RPO).'
 },
 {
 id: 'at-4l80e',
 system: 'Automatyczna skrzynia 4L80E',
 appliesTo: ['Automatyczna', '4L80E'],
 capacity: 'Zależna od zakresu serwisu i chłodnicy',
 specification: 'Zgodnie z instrukcją właściwego rocznika',
 filter: 'Filtr skrzyni zgodny z 4L80E',
 confidence: 'verify',
 source: 'https://assets.gm.com/manuals/chevrolet/1995_chevrolet_1500_owners.pdf',
 sourceTitle: 'OM95 — 1995 Chevrolet C/K 1500 Owners Manual',
 notes: '4L80E nie jest automatycznie wymienna z 4L60E. Potwierdź konwerter, obudowę i złącza. Sprawdź w swoim aucie / manualu — GMT400 ma wiele wariantów (rocznik, GVWR, silnik, skrzynia, RPO).'
 },
 {
 id: 'transfer-case-manual',
 system: 'Skrzynia rozdzielcza — manualna (NP241C / NP243C)',
 appliesTo: ['4x4'],
 capacity: 'Zależna od modelu reduktora',
 specification: 'DEXRON-III',
 filter: null,
 confidence: 'reference',
 source: 'https://www.chevrolet.com/ownercenter/content/dam/gmownercenter/gmna/dynamic/manuals/1999/chevrolet/suburban/1999_chevrolet_suburban_owners.pdf',
 sourceTitle: 'OM99 — 1999 Chevrolet Suburban Owners Manual',
 notes: 'Reduktor z dźwignią lub przyciskami bez trybu Auto. Sprawdź w swoim aucie / manualu — GMT400 ma wiele wariantów (rocznik, GVWR, silnik, skrzynia, RPO).'
 },
 {
 id: 'transfer-case-autotrac',
 system: 'Skrzynia rozdzielcza — AutoTrac (NV246)',
 appliesTo: ['4x4'],
 capacity: 'Zależna od modelu reduktora',
 specification: 'GM Automatic Transfer Case Fluid 12378396 (zastąpiony przez GM 12378508 Auto-Trak II)',
 filter: null,
 confidence: 'reference',
 source: 'https://www.chevrolet.com/ownercenter/content/dam/gmownercenter/gmna/dynamic/manuals/1999/chevrolet/suburban/1999_chevrolet_suburban_owners.pdf',
 sourceTitle: 'OM99 — 1999 Chevrolet Suburban Owners Manual',
 notes: 'Reduktor z trybem Auto 4WD. Sprawdź w swoim aucie / manualu — GMT400 ma wiele wariantów (rocznik, GVWR, silnik, skrzynia, RPO).'
 },
 {
 id: 'front-differential',
 system: 'Przedni mechanizm różnicowy',
 appliesTo: ['4x4'],
 capacity: 'Zależna od mostu',
 specification: 'SAE 80W-90 GL-5 (GM 1052271)',
 filter: null,
 confidence: 'reference',
 source: 'https://assets.gm.com/manuals/chevrolet/1995_chevrolet_1500_owners.pdf',
 sourceTitle: 'OM95 — 1995 Chevrolet C/K 1500 Owners Manual',
 notes: 'G80: bez dodatku tarciowego. Sprawdź typ mostu przed doborem płynu. Sprawdź w swoim aucie / manualu — GMT400 ma wiele wariantów (rocznik, GVWR, silnik, skrzynia, RPO).'
 },
 {
 id: 'rear-differential',
 system: 'Tylny mechanizm różnicowy',
 appliesTo: ['RWD', '4x4'],
 capacity: 'Zależna od mostu',
 specification: 'SAE 80W-90 GL-5 (GM 1052271)',
 filter: null,
 confidence: 'reference',
 source: 'https://assets.gm.com/manuals/chevrolet/1995_chevrolet_1500_owners.pdf',
 sourceTitle: 'OM95 — 1995 Chevrolet C/K 1500 Owners Manual',
 notes: 'G80: bez dodatku tarciowego. Sprawdź typ mostu i przełożenie. Sprawdź w swoim aucie / manualu — GMT400 ma wiele wariantów (rocznik, GVWR, silnik, skrzynia, RPO).'
 },
 {
 id: 'brake-fluid',
 system: 'Płyn hamulcowy',
 appliesTo: ['Wszystkie'],
 capacity: 'Zależna od układu',
 specification: 'Zgodnie z instrukcją właściwego rocznika',
 filter: null,
 confidence: 'verify',
 source: 'https://assets.gm.com/manuals/chevrolet/1995_chevrolet_1500_owners.pdf',
 sourceTitle: 'OM95 — 1995 Chevrolet C/K 1500 Owners Manual',
 notes: 'Nie mieszaj płynów o różnych specyfikacjach. Po serwisie usuń powietrze z układu. Sprawdź w swoim aucie / manualu — GMT400 ma wiele wariantów (rocznik, GVWR, silnik, skrzynia, RPO).'
 },
 {
 id: 'power-steering',
 system: 'Wspomaganie kierownicy',
 appliesTo: ['Wszystkie'],
 capacity: 'Zależna od układu',
 specification: 'Zgodnie z instrukcją właściwego rocznika',
 filter: null,
 confidence: 'verify',
 source: 'https://assets.gm.com/manuals/chevrolet/1995_chevrolet_1500_owners.pdf',
 sourceTitle: 'OM95 — 1995 Chevrolet C/K 1500 Owners Manual',
 notes: 'Uzupełniaj tylko płynem zgodnym z układem; sprawdzaj wycieki i stan przewodów. Sprawdź w swoim aucie / manualu — GMT400 ma wiele wariantów (rocznik, GVWR, silnik, skrzynia, RPO).'
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
