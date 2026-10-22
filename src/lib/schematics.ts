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
 source: 'https://www.chevrolet.com/ownercenter/content/dam/gmownercenter/gmna/dynamic/manuals/1999/chevrolet/suburban/1999_chevrolet_suburban_owners.pdf',
 sourceTitle: 'OM99 — 1999 Chevrolet Suburban Owners Manual',
 note: 'Sprawdź w swoim aucie / manualu — GMT400 ma wiele wariantów (rocznik, GVWR, silnik, skrzynia, RPO).'
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
