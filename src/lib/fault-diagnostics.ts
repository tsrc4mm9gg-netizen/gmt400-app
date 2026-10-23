export type FaultDiagnostic = {
 id: string;
 title: string;
 scope: string;
 symptoms: string[];
 tests: string[];
 causes: string[];
 mistakes: string[];
 source: string;
 sourceTitle: string;
 note: string;
};

export const FAULT_DIAGNOSTICS: FaultDiagnostic[] = [
 {
 id: 'obd-i-ses-codes',
 title: 'OBD-I — odczyt kodów SES (1988–1995)',
 scope: 'GMT400 1988–1995 (OBD-I).',
 symptoms: ['Zapalona lampka SES (Service Engine Soon).'],
 tests: ['Wyłącz zapłon.', 'Znajdź złącze ALDL pod deską rozdzielczą.', 'Zewrzyj piny A i B (np. spinaczem).', 'Włącz zapłon (silnik NIE pracuje).', 'Lampka SES zacznie migać kody: kod 12 (1 błysk, pauza, 2 błyski) = tryb diagnostyczny.', 'Kody powtarzają się 3 razy każdy.', 'Zapisz wszystkie kody i porównaj z tabelą kodów GM dla właściwego rocznika.'],
 causes: ['Kod wskazuje obwód/układ, nie konkretną część.', 'Najczęstsze kody: 13, 14, 15, 21, 22, 32, 33, 34, 42, 43, 44, 45.'],
 mistakes: ['Nie zakładaj wymiany części tylko na podstawie kodu — potwierdź obwód testem.', 'Nie myl trybu diagnostycznego (kod 12) z usterką.'],
 source: 'https://www.chevytalk.org/fusionbb/showtopic.php?tid/273660',
 sourceTitle: 'Checking trouble codes for OBD-I (1988-1995 trucks) — Chevy Talk',
 note: 'Sprawdź w swoim aucie / manualu — GMT400 ma wiele wariantów (rocznik, GVWR, silnik, skrzynia, RPO).'
 },
 {
 id: 'vortec-intake-gasket',
 title: 'Uszczelka kolektora Vortec L31/L35 (1996–2000)',
 scope: 'Vortec 5.7L L31 / 4.3L L35, 1996–2000.',
 symptoms: ['Ubytek płynu chłodniczego.', 'Mleczny olej (płyn chłodniczy w oleju).', 'Przegrzewanie silnika.', 'Wyciek płynu lub oleju przy kolektorze.'],
 tests: ['Sprawdź poziom płynu chłodniczego i oleju.', 'Obejrzyj okolice kolektora pod kątem wycieków.', 'Wykonaj test ciśnieniowy układu chłodzenia.', 'Oceń olej (mleczna barwa = możliwy wyciek wewnętrzny).', 'W razie podejrzenia wycieku wewnętrznego skróć wymianę oleju i obserwuj.'],
 causes: ['Uszczelka kolektora dolotowego.', 'Problem typowy dla Vortec, nie dla TBI.'],
 mistakes: ['Nie ignoruj mlecznego oleju — ryzyko uszkodzenia silnika.', 'Nie mieszaj problemu z TBI (inne konstrukcyjnie).'],
 source: 'https://repairpal.com/problem/chevrolet/suburban-1500/intake-manifold-gaskets-may-leak-coolant-or-engine-oil-901',
 sourceTitle: 'Intake Manifold Gaskets May Leak Coolant or Engine Oil — RepairPal',
 note: 'Sprawdź w swoim aucie / manualu — GMT400 ma wiele wariantów (rocznik, GVWR, silnik, skrzynia, RPO).'
 },
 {
 id: 'abs-differences',
 title: 'ABS — różnice rocznikowe (1988–2000)',
 scope: '1988–1994: RWAL (tylko tylna oś; w K-modelach działa tylko w 2WD). 1995+: czterokołowy ABS (do 3856 kg / 8500 lb GVWR).',
 symptoms: ['Lampka ABS.', 'Różne zachowanie hamulców zależnie od rocznika.'],
 tests: ['Sprawdź rocznik i typ ABS (RWAL vs 4-kołowy).', 'Dla RWAL: diagnostyka ograniczona do tylnej osi.', 'Dla 4-kołowego: diagnostyka obejmuje wszystkie koła.', 'Potwierdź w instrukcji właściwego rocznika.'],
 causes: ['Inna architektura układu zależnie od rocznika.'],
 mistakes: ['Nie zakładaj jednej procedury dla RWAL i 4-kołowego ABS.', 'Nie ignoruj różnicy K-modeli (RWAL tylko 2WD).'],
 source: 'https://gmtcentral.com/gmt400-chevrolet-c-k-1500/',
 sourceTitle: 'GMT400 Chevrolet C/K 1500 (1988–1998) — Deep Dive',
 note: 'Sprawdź w swoim aucie / manualu — GMT400 ma wiele wariantów (rocznik, GVWR, silnik, skrzynia, RPO).'
 },
 {
 id: '4wd-not-engaging',
 title: '4WD nie załącza (1988–2000)',
 scope: 'NP241C (mechaniczna), NP243C (przyciski od 1996), NV246 AutoTrac (od 1998).',
 symptoms: ['4WD nie załącza się.', 'Różne zachowanie zależnie od typu reduktora.'],
 tests: ['Sprawdź typ reduktora (NP241C / NP243C / NV246).', 'Dla NP241C: sprawdź mechanizm dźwigni.', 'Dla NP243C: sprawdź przyciski i moduł.', 'Dla NV246: sprawdź tryb Auto 4WD i moduł.', 'Potwierdź poziom i typ płynu zgodnie z fluids.ts.'],
 causes: ['Mechanizm dźwigni (NP241C).', 'Przyciski/moduł (NP243C).', 'Tryb Auto/moduł (NV246).'],
 mistakes: ['Nie mieszaj procedur dla różnych typów reduktorów.', 'Nie zakładaj jednej przyczyny dla wszystkich lat.'],
 source: 'https://www.chevrolet.com/ownercenter/content/dam/gmownercenter/gmna/dynamic/manuals/1999/chevrolet/suburban/1999_chevrolet_suburban_owners.pdf',
 sourceTitle: 'OM99 — 1999 Chevrolet Suburban Owners Manual',
 note: 'Sprawdź w swoim aucie / manualu — GMT400 ma wiele wariantów (rocznik, GVWR, silnik, skrzynia, RPO).'
 },
 {
 id: 'brake-line-corrosion',
 title: 'Korozja przewodów hamulcowych / ramy (1988–2000)',
 scope: 'Wszystkie GMT400.',
 symptoms: ['Wyciek płynu hamulcowego.', 'Korozja przewodów lub ramy.'],
 tests: ['Obejrzyj przewody hamulcowe i ramę pod kątem korozji.', 'Sprawdź wycieki płynu.', 'W razie wątpliwości skieruj do serwisu.'],
 causes: ['Korozja przewodów.', 'Korozja ramy.'],
 mistakes: ['Nie ignoruj wycieku płynu hamulcowego.', 'Nie jeźdź z uszkodzonymi przewodami.'],
 source: 'https://assets.gm.com/manuals/chevrolet/1995_chevrolet_1500_owners.pdf',
 sourceTitle: 'OM95 — 1995 Chevrolet C/K 1500 Owners Manual',
 note: 'Sprawdź w swoim aucie / manualu — GMT400 ma wiele wariantów (rocznik, GVWR, silnik, skrzynia, RPO).'
 }
];

export function findFaultDiagnostics(parameters: { id?: string; query?: string }) {
 const id = parameters.id?.toLowerCase().trim() ?? '';
 const query = parameters.query?.toLowerCase().trim() ?? '';
 return FAULT_DIAGNOSTICS.filter(item => {
 const idMatch = !id || item.id === id;
 const queryMatch = !query || item.title.toLowerCase().includes(query) || item.scope.toLowerCase().includes(query);
 return idMatch && queryMatch;
 });
}
