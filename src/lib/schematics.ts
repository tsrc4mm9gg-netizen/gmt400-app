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
 title: 'Układ chłodzenia — benzyna (1996–2000)',
 scope: 'C/K, Tahoe/Yukon, Suburban z silnikami benzynowymi 1996–2000 (SM 1996 C/K, OM 1999). Diesel 6.5 ma ciśnieniowy zbiornik wyrównawczy.',
 description: 'Pompa wody → blok i głowice → termostat → chłodnica → pompa. Zimny silnik: termostat zamknięty, płyn krąży tylko w silniku. Zbiorniczek jest połączony wężykiem z szyjką chłodnicy (nadmiar płynu przy nagrzaniu, powrót przy stygnięciu).',
 rows: [
 { label: 'Korek chłodnicy', value: '103 kPa (15 psi) — benzyna; diesel: korek na zbiorniku wyrównawczym' },
 { label: 'Termostat', value: 'woskowy; zamknięty na zimno (szybkie nagrzanie)' },
 { label: 'Poziom płynu', value: 'między ADD i FULL (ok. 1 l różnicy); FULL na ciepłym silniku' },
 { label: 'Płyn', value: 'DEX-COOL 50/50; po dolaniu płynu z krzemianami wymiana po 50 000 km / 24 mies.' },
 { label: 'Pojemność 5.7 L31 / 7.4 L29', value: '16,5 l (19 l z tylną nagrzewnicą) / 23,5 l (26 l) — OM99' }
 ],
 source: 'https://gm.saturn.team/Chevrolet/Chevy_C_Pickup___2WD/1996/2/1/170/37217',
 sourceTitle: 'GM Service Manual 1996 C/K — Engine Cooling (+ OM99)',
 note: 'Sprawdź w swoim aucie / manualu — GMT400 ma wiele wariantów (rocznik, GVWR, silnik, skrzynia, RPO).',
 diagram: { src: '/schematy/chlodzenie-benzyna-1996.svg', alt: 'Schemat obiegu płynu chłodniczego: pompa, silnik, termostat, chłodnica, zbiorniczek, pojemności i płyn', models: 'C/K, Tahoe/Yukon, Suburban benzyna 1996–2000', width: 900, height: 1762 },
 related: ['fluids-1995-1999']
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
 },
 {
 id: 'brakes-abs',
 title: 'Hamulce i ABS — układ (1999)',
 scope: 'Tahoe/Yukon/Suburban 1999 (SM 1999 Tahoe 4WD); C/K 1995 — ABS na 4 koła (OM95). RWAL 1988–1994 — sprawdź w manualu.',
 description: 'Pompa hamulcowa ze wspomaganiem (podciśnieniowe albo Hydro-Boost) → EHCU (EBCM + modulator BPMV) → 3 kanały ABS → tarcze przód / bębny tył (JF9: tarcze z tyłu). Zawór zespolony steruje dozowaniem i proporcją ciśnienia oraz zapala lampkę BRAKE.',
 rows: [
 { label: 'EHCU', value: 'lewa strona komory silnika, przy pompie hamulcowej' },
 { label: 'Kanały ABS', value: '3: lewy przód, prawy przód, tył; lampka ABS bursztynowa' },
 { label: 'Zawór zespolony', value: 'BRAKE zostaje zapalona po awarii — napraw, potem ok. 3100 kPa (450 psi)' },
 { label: 'Płyn hamulcowy', value: 'DOT-3 (Delco Supreme 11 GM 12377967)' },
 { label: 'Hydro-Boost', value: 'płyn wspomagania kierownicy — nie mieszaj z hamulcowym' },
 { label: 'Tarcze przód', value: '295×31,8 mm (JB5/JD5/JB6/JD6) lub 319×32,1 mm (JB7/JD7/JB8/Z56); JF9: 353,4×36,6 mm i tarcze z tyłu' },
 { label: 'Wspomaganie wg RPO', value: 'podciśnieniowe: JB5/JB6/JB7/Z56; Hydro-Boost: JD5/JD6/JD7/JB8/JF9' }
 ],
 source: 'https://gm.saturn.team/Chevrolet/Tahoe___4WD/1999/7/4/795/50063',
 sourceTitle: 'GM Service Manual 1999 Tahoe 4WD — Brakes / ABS',
 note: 'Sprawdź w swoim aucie / manualu — GMT400 ma wiele wariantów (rocznik, GVWR, silnik, skrzynia, RPO).',
 diagram: { src: '/schematy/hamulce-abs-uklad.svg', alt: 'Schemat hamulców: pompa, wspomaganie, EHCU, 3 kanały ABS, zawór zespolony, płyny', models: 'Tahoe/Yukon/Suburban 1999; C/K 1995', width: 900, height: 1678 },
 related: ['fluids-1995-1999']
 },
 {
 id: 'fuel-system',
 title: 'Układ paliwowy — TBI / CSFI / SFI',
 scope: '1988–1995: TBI (OM95). 1996–2000: CSFI w 4.3/5.0/5.7, SFI w 7.4 (SM 1996 C/K, SM 1999 Tahoe).',
 description: 'Pompa w zbiorniku (z pulsatorem i zaworem zwrotnym) → filtr liniowy → regulator → wtrysk → nadmiar wraca osobnym przewodem do zbiornika.',
 rows: [
 { label: 'CSFI — zapłon ON', value: '415–455 kPa (60–66 psi)' },
 { label: 'SFI 7.4 — zapłon ON', value: '385–430 kPa (56–62 psi)' },
 { label: 'CSFI — trzymanie', value: '379–413 kPa (55–60 psi) po wyłączeniu pompy (SM 1999)' },
 { label: 'Minimum na jałowym', value: 'poniżej 300 kPa (44 psi) auto praktycznie nie jedzie' },
 { label: 'Maksimum testu', value: 'nie przekraczaj 517 kPa (75 psi)' },
 { label: 'Pompa', value: 'VCM włącza na 2 s przy zapłonie; rezerwa: czujnik ciśnienia oleju ok. 28 kPa' },
 { label: 'Filtr', value: 'strzałka przepływu; nakrętki 27 N·m; GF626 co 30 000 mil (OM99)' }
 ],
 source: 'https://gm.saturn.team/Chevrolet/Chevy_C_Pickup___2WD/1996/2/1/183/31643',
 sourceTitle: 'GM Service Manual 1996 C/K i 1999 Tahoe — Fuel System Diagnosis',
 note: 'Sprawdź w swoim aucie / manualu — GMT400 ma wiele wariantów (rocznik, GVWR, silnik, skrzynia, RPO).',
 diagram: { src: '/schematy/paliwo-uklad-cisnienie.svg', alt: 'Schemat układu paliwowego: pompa, filtr, regulator, wtrysk, powrót, ciśnienia', models: 'C/K, Tahoe/Yukon, Suburban 1996–2000 (CSFI/SFI)', width: 900, height: 1758 },
 related: []
 },
 {
 id: 'vortec-intake-gaskets',
 title: 'Uszczelki kolektora Vortec 5.0/5.7 — montaż',
 scope: 'Vortec 5.0 L30 / 5.7 L31 w C/K, Tahoe/Yukon, Suburban 1996–2000 (procedura SM 1996 C/K).',
 description: 'Kolejność montażu uszczelek kolektora dolnego wg instrukcji serwisowej GM: klej na końcach uszczelek, kołki ustalające, ścieg uszczelniacza na bloku, montaż na mokro i dokręcanie w 3 etapach.',
 rows: [
 { label: 'Klej na uszczelkę', value: '4 mm GM 12346141 na końcach' },
 { label: 'Uszczelniacz na bloku', value: 'ścieg 5 mm przód i tył, 13 mm na uszczelki' },
 { label: 'Śruby', value: 'klej do gwintów GM 12345382' },
 { label: 'Dokręcanie', value: 'kolejność 1–8: 3 → 12 → 15 N·m' }
 ],
 source: 'https://gm.saturn.team/Chevrolet/Chevy_C_Pickup___2WD/1996/2/1/157/44190',
 sourceTitle: 'GM Service Manual 1996 C/K — Intake Manifold Replacement 5.0L/5.7L',
 note: 'Sprawdź w swoim aucie / manualu — GMT400 ma wiele wariantów (rocznik, GVWR, silnik, skrzynia, RPO).',
 diagram: { src: '/schematy/vortec-uszczelki-kolektora.svg', alt: 'Przekrój: kolektor dolny, uszczelki na głowicach, ścieg na bloku i kolejność montażu', models: 'Vortec 5.0/5.7, 1996–2000', width: 900, height: 1266 },
 related: []
 },
 {
 id: 'ground-points',
 title: 'Punkty masy — silnik i nadwozie (1996)',
 scope: 'C/K 1996 (SM 1996 C Pickup 2WD). Inne lata i nadwozia mogą mieć inne numery i miejsca.',
 description: 'Lista punktów masy z tabel komponentów instrukcji serwisowej 1996 C/K oraz zasada GM: bez podkładek zębatych pod masy nadwozia i ramy.',
 rows: [
 { label: 'G101', value: 'blacha przy prawym przednim nadkolu' },
 { label: 'G102 / G105 (benzyna)', value: 'prawy przód bloku' },
 { label: 'G102 / G105 (diesel)', value: 'lewy przód kolektora / prawa góra głowicy' },
 { label: 'G106 (diesel)', value: 'masa lewego akumulatora do silnika' },
 { label: 'G112', value: 'prawy przód komory, pod lampką' },
 { label: 'Linki masowe', value: 'rama/nadwozie ↔ silnik i skrzynia' }
 ],
 source: 'https://gm.saturn.team/Chevrolet/Chevy_C_Pickup___2WD/1996/2/1/171/37566',
 sourceTitle: 'GM Service Manual 1996 C/K — Starting and Charging Components',
 note: 'Sprawdź w swoim aucie / manualu — GMT400 ma wiele wariantów (rocznik, GVWR, silnik, skrzynia, RPO).',
 diagram: { src: '/schematy/masy-punkty-1996.svg', alt: 'Widok z góry komory silnika z punktami masy G101, G102, G105, G112', models: 'C/K 1996', width: 900, height: 1388 },
 related: []
 },
 {
 id: 'fluids-1995-1999',
 title: 'Tabela płynów — 1995 vs 1999',
 scope: 'C/K 1995 (OM95) i Suburban/Tahoe 1999 (OM99).',
 description: 'Zestawienie płynów i pojemności z instrukcji obsługi GM dla dwóch roczników — pokazuje różnice (np. płyn chłodniczy 6038-M vs DEX-COOL).',
 rows: [
 { label: 'Olej z filtrem 5.7', value: '4,8 l (1995 i 1999)' },
 { label: 'Płyn chłodniczy', value: '1995: etylenowy GM 6038-M • 1999: DEX-COOL' },
 { label: 'Hamulce', value: 'DOT-3 (1995: GM 1052535 • 1999: GM 12377967)' },
 { label: 'Skrzynia auto', value: 'DEXRON-III' },
 { label: 'Mosty', value: 'SAE 80W-90 GM 1052271' },
 { label: 'Reduktor automatyczny (1999)', value: 'GM 12378396' }
 ],
 source: 'https://www.chevrolet.com/ownercenter/content/dam/gmownercenter/gmna/dynamic/manuals/1999/chevrolet/suburban/1999_chevrolet_suburban_owners.pdf',
 sourceTitle: 'OM95 (1995 C/K 1500) i OM99 (1999 Suburban) — Recommended Fluids',
 note: 'Sprawdź w swoim aucie / manualu — GMT400 ma wiele wariantów (rocznik, GVWR, silnik, skrzynia, RPO).',
 diagram: { src: '/schematy/plyny-tabela-1995-1999.svg', alt: 'Tabela płynów i pojemności 1995 vs 1999', models: 'C/K 1995; Suburban/Tahoe 1999', width: 900, height: 1470 },
 related: ['vortec-cooling', 'brakes-abs']
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
