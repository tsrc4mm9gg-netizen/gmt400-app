export type TorqueSpecification = {
 id: string;
 component: string;
 appliesTo: string;
 valueLbFt: number;
 valueNm: number;
 notes: string;
 confidence: 'reference' | 'verify';
 source: string;
 sourceTitle: string;
};

export const TORQUE_SPECS: TorqueSpecification[] = [
 {
 id: 'wheel-nuts-1995-standard',
 component: 'Nakrętki kół',
 appliesTo: '1995 — większość modeli (5/6/8 śrub)',
 valueLbFt: 120,
 valueNm: 160,
 notes: 'Sprawdź w swoim aucie / manualu — GMT400 ma wiele wariantów (rocznik, GVWR, silnik, skrzynia, RPO).',
 confidence: 'reference',
 source: 'https://assets.gm.com/manuals/chevrolet/1995_chevrolet_1500_owners.pdf',
 sourceTitle: 'OM95 — 1995 Chevrolet C/K 1500 Owners Manual'
 },
 {
 id: 'wheel-nuts-1995-drw',
 component: 'Nakrętki kół',
 appliesTo: '1995 DRW (dual rear wheels)',
 valueLbFt: 140,
 valueNm: 190,
 notes: 'Sprawdź w swoim aucie / manualu — GMT400 ma wiele wariantów (rocznik, GVWR, silnik, skrzynia, RPO).',
 confidence: 'reference',
 source: 'https://assets.gm.com/manuals/chevrolet/1995_chevrolet_1500_owners.pdf',
 sourceTitle: 'OM95 — 1995 Chevrolet C/K 1500 Owners Manual'
 },
 {
 id: 'wheel-nuts-1995-3500hd',
 component: 'Nakrętki kół',
 appliesTo: '1995 3500HD',
 valueLbFt: 175,
 valueNm: 240,
 notes: 'Sprawdź w swoim aucie / manualu — GMT400 ma wiele wariantów (rocznik, GVWR, silnik, skrzynia, RPO).',
 confidence: 'reference',
 source: 'https://assets.gm.com/manuals/chevrolet/1995_chevrolet_1500_owners.pdf',
 sourceTitle: 'OM95 — 1995 Chevrolet C/K 1500 Owners Manual'
 },
 {
 id: 'wheel-nuts-1999',
 component: 'Nakrętki kół',
 appliesTo: '1999 — 5/6/8 śrub 14 mm (C1500 5, K1500/C-K2500 6, 2500HD/3500 8)',
 valueLbFt: 140,
 valueNm: 190,
 notes: 'Sprawdź w swoim aucie / manualu — GMT400 ma wiele wariantów (rocznik, GVWR, silnik, skrzynia, RPO).',
 confidence: 'reference',
 source: 'https://www.chevrolet.com/ownercenter/content/dam/gmownercenter/gmna/dynamic/manuals/1999/chevrolet/suburban/1999_chevrolet_suburban_owners.pdf',
 sourceTitle: 'OM99 — 1999 Chevrolet Suburban Owners Manual'
 },
 {
 id: 'spark-plugs-vortec-new-head',
 component: 'Świece zapłonowe — nowa głowica',
 appliesTo: '1996–1999 Vortec 5.0/5.7 (C/K)',
 valueLbFt: 22,
 valueNm: 30,
 notes: 'Używana głowica: 15 N·m (11 lb-ft) wg Engine Mechanical lub 20 N·m (14 lb-ft) wg Engine Electrical — GM podaje obie wartości. Sprawdź w swoim aucie / manualu.',
 confidence: 'reference',
 source: 'https://gm.saturn.team/Chevrolet/Chevy_C_Pickup___2WD/1996/2/1/171/37544',
 sourceTitle: 'GM Service Manual 1996 C Pickup — Spark Plug Replacement'
 },
 {
 id: 'intake-lower-vortec',
 component: 'Kolektor dolotowy dolny (Vortec) — etap końcowy',
 appliesTo: '1996–1999 Vortec 5.0/5.7 (C/K)',
 valueLbFt: 11,
 valueNm: 15,
 notes: 'Kolejność 1–8, gwint z klejem: 3 N·m (27 lb-in) → 12 N·m (106 lb-in) → 15 N·m (11 lb-ft). Górny kolektor: 5 N·m, potem 10 N·m. Sprawdź w swoim aucie / manualu.',
 confidence: 'reference',
 source: 'https://gm.saturn.team/Chevrolet/Chevy_C_Pickup___2WD/1996/2/1/157/44190',
 sourceTitle: 'GM Service Manual 1996 C Pickup — Intake Manifold Installation'
 },
 {
 id: '4l60e-pan-bolts',
 component: 'Śruby miski 4L60-E',
 appliesTo: '1996 C/K 4L60-E',
 valueLbFt: 8,
 valueNm: 11,
 notes: 'GM: 11 N·m (97 lb-in), krzyżowo. Sprawdź w swoim aucie / manualu.',
 confidence: 'reference',
 source: 'https://gm.saturn.team/Chevrolet/Chevy_C_Pickup___2WD/1996/2/5/169/6598',
 sourceTitle: 'GM Service Manual 1996 C Pickup — 4L60-E Fluid/Filter Replacement'
 }
];

export function findTorqueSpecs(parameters: { year?: string; component?: string }) {
 const year = parameters.year?.toLowerCase().trim() ?? '';
 const component = parameters.component?.toLowerCase().trim() ?? '';
 return TORQUE_SPECS.filter(item => {
 const yearMatch = !year || item.appliesTo.toLowerCase().includes(year);
 const componentMatch = !component || item.component.toLowerCase().includes(component);
 return yearMatch && componentMatch;
 });
}
