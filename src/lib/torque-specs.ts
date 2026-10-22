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
 valueNm: 237,
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
