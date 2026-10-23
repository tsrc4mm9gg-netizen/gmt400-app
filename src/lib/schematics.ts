export type SchematicRow = { label: string; value: string };
export type Schematic = {
 id: string;
 title: string;
 scope: string;
 description: string;
 rows: SchematicRow[];
 source: string;
 sourceTitle: string;
 note: string;
 /** Schemat SVG (ciemna wersja w public/schematy/). models = model + lata, którego dotyczy rysunek. */
 diagram?: { src: string; alt: string; models: string; width: number; height: number };
 related?: string[];
};

export const SCHEMATICS: Schematic[] = [
 {
 id: 'aldl-12-pin',
 title: 'Złącze ALDL 12-pin (1988–1995)',
 scope: 'GMT400 1988–1995 (OBD-I).',
 description: 'Złącze ALDL służy do odczytu kodów usterek. Zwarcie pinów A i B włącza tryb diagnostyczny; lampka SES miga kody (kod 12 = tryb diagnostyczny).',
 rows: [
 { label: 'A', value: 'Masa' },
 { label: 'B', value: 'Diagnostyka (zwarcie z A włącza tryb)' },
 { label: 'E', value: 'Dane szeregowe 160 baud' },
 { label: 'M', value: 'Dane szeregowe 8192 baud' },
 { label: 'Pozostałe piny', value: 'Funkcje zależne od modelu i rocznika — nie zakładaj jednego pinoutu' }
 ],
 source: 'https://en.wikipedia.org/wiki/ALDL',
 sourceTitle: 'ALDL — Wikipedia',
 diagram: { src: '/schematy/aldl-12pin-obd1.svg', alt: 'Schemat złącza ALDL 12-pin z zaznaczonymi pinami A (masa) i B (wejście diagnostyczne) oraz kroki odczytu kodów migowych', models: 'C/K, Sierra, Blazer/Tahoe, Yukon, Suburban — benzyna 1988–1995 (OBD-I)', width: 1100, height: 560 },
 related: ['obd-ii-16-pin'],
 note: 'Sprawdź w swoim aucie / manualu — GMT400 ma wiele wariantów (rocznik, GVWR, silnik, skrzynia, RPO).'
 },
 {
 id: 'obd-ii-16-pin',
 title: 'Gniazdo OBD-II 16-pin (1996+)',
 scope: 'GMT400 1996+ (OBD-II).',
 description: 'Standardowe gniazdo OBD-II służy do podłączenia skanera. Piny zasilania i masy są stałe; linie danych zależą od protokołu.',
 rows: [
 { label: '4', value: 'Masa nadwozia' },
 { label: '5', value: 'Masa sygnałowa' },
 { label: '16', value: 'Zasilanie +12 V' },
 { label: 'Linie danych', value: 'Zależne od protokołu (J1850 / CAN / ISO)' }
 ],
 source: 'https://en.wikipedia.org/wiki/On-board_diagnostics',
 sourceTitle: 'On-board diagnostics — Wikipedia',
 diagram: { src: '/schematy/obd2-dlc-16pin-gmt400.svg', alt: 'Schemat gniazda OBD-II DLC 16-pin z pinami 2 (J1850 VPW), 4 i 5 (masa) oraz 16 (+12 V)', models: 'C/K, Sierra, Tahoe, Yukon, Suburban 1996–2000 (OBD-II)', width: 1100, height: 560 },
 related: ['aldl-12-pin'],
 note: 'Sprawdź w swoim aucie / manualu — GMT400 ma wiele wariantów (rocznik, GVWR, silnik, skrzynia, RPO).'
 },
 {
 id: 'vortec-cooling',
 title: 'Uproszczony układ chłodzenia Vortec (1996–2000)',
 scope: 'Vortec 4.3L L35 / 5.7L L31, 1996–2000.',
 description: 'Płyn krąży: silnik → termostat → chłodnica → zbiorniczek wyrównawczy → nagrzewnica → silnik. Termostat reguluje przepływ do chłodnicy.',
 rows: [
 { label: 'Zbiorniczek wyrównawczy', value: 'Uzupełnianie i kompensacja objętości płynu' },
 { label: 'Termostat', value: 'Reguluje przepływ do chłodnicy' },
 { label: 'Nagrzewnica', value: 'Ogrzewanie kabiny (odgałęzienie obiegu)' },
 { label: 'Chłodnica', value: 'Oddawanie ciepła' }
 ],
 source: 'https://www.chevrolet.com/ownercenter/content/dam/gmownercenter/gmna/dynamic/manuals/1999/chevrolet/suburban/1999_chevrolet_suburban_owners.pdf',
 sourceTitle: 'OM99 — 1999 Chevrolet Suburban Owners Manual',
 note: 'Nie mieszaj technologii płynów. Sprawdź w swoim aucie / manualu — GMT400 ma wiele wariantów (rocznik, GVWR, silnik, skrzynia, RPO).'
 },
 {
 id: '4wd-control',
 title: 'Napęd 4×4 — różnice w sterowaniu (1988–2000)',
 scope: 'NP241C (mechaniczna), NP243C (przyciski od 1996), NV246 AutoTrac (od 1998).',
 description: 'Różne typy reduktorów mają inne sterowanie: dźwignia, przyciski lub tryb Auto.',
 rows: [
 { label: 'NP241C', value: 'Dźwignia mechaniczna' },
 { label: 'NP243C', value: 'Przyciski (od 1996)' },
 { label: 'NV246 AutoTrac', value: 'Tryb Auto 4WD (od 1998)' }
 ],
 related: ['front-suspension-c-k'],
 source: 'https://www.chevrolet.com/ownercenter/content/dam/gmownercenter/gmna/dynamic/manuals/1999/chevrolet/suburban/1999_chevrolet_suburban_owners.pdf',
 sourceTitle: 'OM99 — 1999 Chevrolet Suburban Owners Manual',
 note: 'Sprawdź w swoim aucie / manualu — GMT400 ma wiele wariantów (rocznik, GVWR, silnik, skrzynia, RPO).'
 },
 {
 id: '4l60e-atf-filter',
 title: '4L60-E — wymiana ATF i filtra krok po kroku',
 scope: '4L60-E, GMT400 1500 / lekkie 2500, 1993–2000.',
 description: 'Kolejność prac przy wymianie oleju i filtra w skrzyni 4L60-E: od przygotowania i spuszczenia ATF po napełnienie i kontrolę poziomu wg instrukcji.',
 rows: [
 { label: '1. Przygotowanie', value: 'Stabilne podpory, ostudzona skrzynia; nowy filtr, uszczelka miski, ATF DEXRON-III' },
 { label: '2. Miska', value: 'Luzuj śruby, zostaw 2–3 z jednej strony i spuść ATF do wanny' },
 { label: '3. Filtr', value: 'Wyjmij stary filtr; sprawdź, czy uszczelniacz nie został w obudowie' },
 { label: '4. Czyszczenie', value: 'Oczyść miskę i magnes, obejrzyj osad (zrób zdjęcie)' },
 { label: '5. Montaż', value: 'Nowy uszczelniacz, filtr i uszczelka; momenty śrub wg FSM rocznika' },
 { label: '6. Napełnianie', value: 'ATF przez rurkę bagnetu; poziom wg procedury z instrukcji (temperatura, bieg)' },
 { label: 'Interwał (OM99)', value: 'co 100 000 mil (160 000 km); w ciężkich warunkach co 50 000 mil (80 000 km)' }
 ],
 source: 'https://www.chevrolet.com/ownercenter/content/dam/gmownercenter/gmna/dynamic/manuals/1999/chevrolet/suburban/1999_chevrolet_suburban_owners.pdf',
 sourceTitle: 'OM99 — 1999 Chevrolet Suburban Owners Manual',
 note: 'Sprawdź w swoim aucie / manualu — GMT400 ma wiele wariantów (rocznik, GVWR, silnik, skrzynia, RPO).',
 diagram: { src: '/schematy/4l60e-atf-filtr-kroki.svg', alt: 'Sześć kroków wymiany ATF i filtra w skrzyni 4L60-E', models: 'C/K 1500, lekkie 2500, Tahoe/Yukon, Suburban 1500 z 4L60-E, 1993–2000', width: 1100, height: 600 }
 },
 {
 id: 'fuse-locations',
 title: 'Gdzie są skrzynki bezpieczników',
 scope: 'Tahoe/Suburban 1999 (OM99); C/K 1500 1995 (OM95) — kabina.',
 description: 'Poglądowy widok z góry: skrzynka w kabinie na bocznej krawędzi deski po stronie kierowcy oraz skrzynka bezpieczników i przekaźników pod maską przy zbiorniczku płynu hamulcowego.',
 rows: [
 { label: 'Kabina', value: 'Boczna krawędź deski po stronie kierowcy — zdejmij pokrywę (w niej szczypce)' },
 { label: 'Pod maską (1999)', value: 'Tył komory silnika, przy zbiorniczku płynu hamulcowego' },
 { label: '1995 C/K', value: 'Instrukcja opisuje skrzynkę w kabinie w tym samym miejscu' },
 { label: 'Obsada', value: 'Układ bezpieczników zależy od rocznika — opis jest na pokrywie i w instrukcji' }
 ],
 source: 'https://www.chevrolet.com/ownercenter/content/dam/gmownercenter/gmna/dynamic/manuals/1999/chevrolet/suburban/1999_chevrolet_suburban_owners.pdf',
 sourceTitle: 'OM99 — 1999 Chevrolet Suburban Owners Manual',
 note: 'Sprawdź w swoim aucie / manualu — GMT400 ma wiele wariantów (rocznik, GVWR, silnik, skrzynia, RPO).',
 diagram: { src: '/schematy/bezpieczniki-lokalizacja.svg', alt: 'Widok auta z góry z zaznaczoną skrzynką bezpieczników w kabinie i skrzynką pod maską', models: 'Tahoe / Suburban 1999; C/K 1500 1995 (kabina)', width: 1180, height: 560 }
 },
 {
 id: 'front-suspension-c-k',
 title: 'Przednie zawieszenie: C (4×2) vs K (4×4)',
 scope: 'C/K, Tahoe/Yukon, Suburban 1988–2000 (K = 4×4).',
 description: 'Wersje C mają niezależne zawieszenie na wahaczach nierównej długości ze sprężyną śrubową. Wersje K mają wahacze z drążkiem skrętnym, półosie z przegubami i przedni most.',
 rows: [
 { label: 'C (4×2)', value: 'Wahacze nierównej długości + sprężyna śrubowa' },
 { label: 'K (4×4)', value: 'Wahacze nierównej długości + drążek skrętny, półosie, przedni most' },
 { label: 'Skrzynie rozdzielcze K', value: 'NP241 (dźwignia), NP243 (przyciski, Tahoe/Yukon 1996+), NV246 AutoTrac (od 1998)' },
 { label: 'NP231', value: 'Nie występuje w GMT400 (Jeep / S-10)' }
 ],
 source: 'https://en.wikipedia.org/wiki/Chevrolet_C/K_(fourth_generation)',
 sourceTitle: 'Wikipedia: Chevrolet C/K (4. generacja)',
 note: 'Sprawdź w swoim aucie / manualu — GMT400 ma wiele wariantów (rocznik, GVWR, silnik, skrzynia, RPO).',
 diagram: { src: '/schematy/zawieszenie-przod-c-k.svg', alt: 'Porównanie przedniego zawieszenia C (sprężyna śrubowa) i K (drążek skrętny, półoś, przedni most)', models: 'C/K, Sierra, Tahoe/Yukon, Suburban 1988–2000', width: 1180, height: 560 },
 related: ['4wd-control']
 }
];

export function findSchematics(parameters: { id?: string; query?: string }) {
 const id = parameters.id?.toLowerCase().trim() ?? '';
 const query = parameters.query?.toLowerCase().trim() ?? '';
 return SCHEMATICS.filter(item => {
 const idMatch = !id || item.id === id;
 const queryMatch = !query || item.title.toLowerCase().includes(query) || item.scope.toLowerCase().includes(query);
 return idMatch && queryMatch;
 });
}
