import type { RpoCategory, RpoEntry } from './rpo-catalog';
const FORUM = 'https://www.gmt400.com/threads/rpo-code-list.37531/';
const PDF = 'https://jameshalderman.com/wp-content/uploads/2019/04/RPO_Codes.pdf';
const COMMUNITY = 'Referencja społecznościowa, nie dokument fabryczny. Zakres rocznikowy i modelowy niepotwierdzony. Sprawdź instrukcję serwisową właściwego auta i obecne wyposażenie.';
function group(category: RpoCategory, rows: string, notes = COMMUNITY, source = FORUM): RpoEntry[] {
 return rows.trim().split('\n').map(line => { const [code, description, original] = line.split('|'); if (!/^[A-Z0-9]{3}$/.test(code) || !description || !original) throw new Error('Nieprawidłowy rekord RPO partii 2'); return { code, category, description, original, years: null, models: [], source, sourceTitle: source === FORUM ? 'GMT400.com — RPO Code List, wpis #4; referencja społecznościowa' : 'James Halderman — General Motors RPO Codes; katalog ogólny', status: 'reference' as const, notes }; });
}
export const RPO_BATCH_2: RpoEntry[] = [
 ...group('Wyposażenie', `AAB|Pakiet pamięci ustawień|MEMORY PACKAGE
AE7|Dzielona przednia kanapa z regulacją oparcia|SPLIT BENCH RECLINING FRT SEAT
AG1|Elektryczna regulacja fotela kierowcy w 6 kierunkach|6-WAY POWER DRIVER SEAT
AG2|Elektryczna regulacja fotela; zakres zależy od wersji|6-WAY Passenger seat / 6-WAY POWER DRIVER & PASS SEATS
AG9|Elektryczna regulacja siedzenia w 6 kierunkach|6-WAY POWER SEAT
AJ1|Mocno przyciemniane szyby|DEEP TINTED GLASS
AJ3|Poduszka powietrzna kierowcy|DRIVER'S SIDE AIRBAG (SIR)
AK5|Poduszki powietrzne kierowcy i pasażera|DRIVER & PASSENGER SUPPLEMENTAL INFLATABLE RESTRAINT SYSTEM
AM7|Składane tylne siedzenie|FOLDING REAR SEAT
AN3|Przednie fotele indywidualne z regulacją elektryczną|FRONT BUCKETS WITH POWER ADJ.
APD|Przygotowanie pasów dla siedzeń kanapowych|BELT PROVISIONS-BENCH SEATS
AR7|Standardowy przedni fotel indywidualny|FRONT BUCKET SEAT-STANDARD
AR9|Fotele indywidualne ze skórzanymi powierzchniami siedzeń|BUCKET SEATS WITH LEATHER TRIMMED SEATING SURFACES
AS3|Siedzenia środkowe i tylne|CENTER AND REAR SEATS
AT5|Siedzenie środkowe|CENTER SEAT
AU0|Zdalne sterowanie zamkami; funkcje zależne od nadwozia|KEYLESS REMOTE DOOR LOCK AND TRUNK OPENER
AU3|Elektryczne zamki drzwi; nie potwierdza pilota|POWER DOOR LOCK SYSTEM
AU6|Zdalne zwalnianie tylnej klapy|REMOTE TAILGATE RELEASE
AXP|Pozycja identyfikacji VIN dla MPV|MPV VIN IDENT POSITION
A20|Uchylne szyby boczne tylne|SWING OUT QUARTER WINDOWS
A28|Przesuwna tylna szyba|SLIDING REAR WINDOW
A31|Elektryczne szyby|POWER WINDOWS
A52|Przednia kanapa|FRONT BENCH SEAT`),
 ...group('Nadwozie', `BAG|Pakowanie części eksportowych|EXPORT PARTS PACKAGING
BVE|Stopnie boczne|SIDE RUNNINGBOARD STEPS
B3P|Obsługa zamówień komercyjnych typu bailment|BAILMENT COMMERCIAL ORDERS
B30|Wykładzina podłogi i nadkoli|WHEEL HOUSING & FLOOR CARPETING
B32|Przednie dywaniki dopasowane kolorystycznie|FRONT COLOR-KEYED FLOOR MATS
B33|Tylne dywaniki dopasowane kolorystycznie|REAR COLOR KEYED FLOOR MATS
B35|Tylne dywaniki wykładzinowe|Rear carpet floor mat
B37|Dywaniki przedniego i środkowego rzędu|COLOR-KEYED FLOOR MATS FOR FRONT AND CENTER SEAT
B38|Pełne pokrycie podłogi z przodu i z tyłu|FULL FRT & REAR FLR COVERING
B39|Dywaniki lub wykładzina dopasowane kolorystycznie|COLOR KEYED FLOOR MATS/ CARPETED
B58|Dywaniki wykładzinowe dopasowane kolorystycznie|COLOR-KEYED FLOOR MATS, CARPETED
B71|Listwy lub poszerzenia otworów kół; wariant wymaga sprawdzenia|Wheel well moulding / WHEEL OPENING FLARES
B84|Listwy boczne nadwozia|BODY SIDE MOLDINGS
B85|Ozdobne jasne listwy boczne|BRIGHT BODY SIDE MOLDINGS
B96|Listwy otworów kół|WHEEL OPENING MOLDINGS
E24|Boczne drzwi ładunkowe na zawiasach|DOOR SIDE CARGO, HINGED
E55|Wariant nadwozia z tylną klapą|BODY STYLE TAILGATE
E63|Skrzynia ładunkowa Fleetside|FLEETSIDE BODY
EF1|Usunięcie tylnego zderzaka z konfiguracji fabrycznej|DELETE REAR BUMPER
EXP|Zamówienie eksportowe|EXPORT ORDER`),
 ...group('Klimatyzacja', `C25|Wycieraczka i spryskiwacz tylnej szyby|REAR WINDOW WASHER & WIPER
C36|Tylna nagrzewnica|REAR HEATER
C49|Elektryczne ogrzewanie tylnej szyby|ELECTRIC REAR WINDOW DEFOGGER
C60|Klimatyzacja; szczegóły układu wymagają weryfikacji|AIR CONDITIONING WITH AIR FILTRATION SYSTEM
C69|Klimatyzacja przednia i tylna|AIR CONDITIONING-FRONT & REAR`, COMMUNITY + ' Opis C60 z listy ogólnej nie dowodzi obecności filtra kabinowego w GMT400.'),
 ...group('Masy', `C5M|Klasa masy całkowitej GVW 6100 lb|GVW RATING, 6100 LBS
C5P|Klasa masy całkowitej GVW 6250 lb|GVW RATING, 6250 LBS
C5Q|Klasa masy całkowitej GVW 6300 lb|GVW RATING, 6300 LBS
C5R|Klasa masy całkowitej GVW 5800 lb|GVW RATING, 5800 LBS
C5S|Klasa masy całkowitej GVW 6600 lb|GVW RATING, 6600 LBS
C5U|Klasa masy całkowitej GVW 6800 lb|GVW, 6800 LBS
C5Z|Klasa masy całkowitej GVW 7200 lb|GVW, 7200 LBS
C6P|Klasa masy całkowitej GVW 8600 lb|GVW RATING, 8600 LBS/3900 KG
C6U|Klasa masy całkowitej GVW 9000 lb|GVW RATING, 9000 LBS
C6W|Klasa masy całkowitej GVW 9200 lb|GVW RATING, 9200 LBS
C7A|Klasa masy całkowitej GVW 10000 lb|GVW RATING, 10000 LBS`, COMMUNITY + ' Nie zastępuje tabliczki pojazdu, polskiej DMC, ładowności ani limitu przyczepy. Nie przenosimy wartości do dokumentów.'),
 ...group('Lusterka i wnętrze', `DF5|Lusterko wewnętrzne z funkcjami temperatury i kompasu|INT R/V MIRROR, LIGHT SENSITIVE W/OUTSIDE TEMP & COMPASS
DH2|Podświetlane lusterka w osłonach przeciwsłonecznych|LIGHTED LH & RH VISOR MIRRORS
DK6|Konsola sufitowa|OVERHEAD CONSOLE
DK7|Specjalna wewnętrzna konsola dachowa|INTERIOR CUSTOM ROOF CONSOLE
DL5|Naklejka informacji o pomocy drogowej|ROADSIDE SERVICE INFORMATION DECAL
DL8|Elektryczne ogrzewane lusterka zewnętrzne|DUAL PWR HEATED OSRV MIRRORS
D48|Elektryczne lusterka zewnętrzne|ELECTRIC EXTERIOR MIRRORS
D55|Konsola|CONSOLE
NP5|Kierownica obszyta skórą|STEERING WHEEL, LEATHER WRAPPED`),
 ...group('Zawieszenie', `F44|Wzmocnione wyposażenie podwozia|HEAVY DUTY CHASSIS EQUIPMENT
F60|Wzmocnione przednie sprężyny|HEAVY DUTY FRONT SPRINGS
FE4|Pakiet zawieszenia ride and handling|RIDE & HANDLING SUSPENSION SYSTEM`, COMMUNITY + ' Pakiet nie określa dokładnych numerów sprężyn ani amortyzatorów.'),
 ...group('Osprzęt', `KNP|Wzmocnione chłodzenie skrzyni biegów|HD TRANSMISSION COOLING
K05|Grzałka bloku silnika|HEATER, ENGINE BLOCK
K34|Elektroniczny tempomat|CRUISE CONTROL, AUTOMATIC, ELECTRONIC
K47|Filtr powietrza o zwiększonej wydajności/pojemności|AIR CLEANER, HIGH CAPACITY
K60|Alternator 100 A|GENERATOR, 100 AMP
K68|Alternator 105 A|GENERATOR, 105 AMP
KW2|Alternator 124 A|GENERATOR, 124 AMP
KC4|Układ chłodzenia oleju silnikowego|COOLING SYSTEM, ENGINE OIL`, COMMUNITY + ' Sprawdź obecny osprzęt, złącza i mocowania; sam kod nie potwierdza zamiennika.'),
 ...group('Napęd', `NP1|Dwubiegowa skrzynia rozdzielcza sterowana elektronicznie|TRANSFER CASE, ELECTRONIC SHIFT CONT, TWO-SPEED`, COMMUNITY + ' Nie przypisujemy konkretnego modelu reduktora bez identyfikacji tabliczki.'),
 ...group('Silniki', `L49|Diesel V8 6.5 l|ENGINE, DIESEL, 8 CYL, 6.5L
L56|Turbodiesel V8 6.5 l|ENGINE, DIESEL, 8 CYL, 6.5L, TURBO
L65|Turbodiesel V8 6.5 l, wariant HO|ENGINE, DIESEL, 8 CYL, 6.5L, TURBO, HO
LH6|Diesel V8 6.2 l|ENGINE, DIESEL, 8 CYL, 6.2L`, COMMUNITY + ' Kod rodziny nie określa automatycznie mocy, sterownika ani osprzętu.'),
 ...group('Skrzynie', `MM4|Przygotowanie konfiguracji dla 4-biegowej skrzyni ręcznej|MERCHANDIZED TRANS, MAN 4 SPD PROVISIONS
MW3|Ręczna skrzynia 5-biegowa NVG, pierwszy bieg 5.61, nadbieg|TRANSMISSION, MAN 5 SPD, NVG, 109MM, 5.61 1ST, O/D
MX0|Przygotowanie konfiguracji automatycznej skrzyni z nadbiegiem|TRANSMISSION, AUTO PROVISIONS, O/D
M20|Ręczna skrzynia 4-biegowa, wariant pierwszy bieg 6.55|TRANSMISSION, MAN 4 SPD, 117MM, 6.55 1ST`, COMMUNITY + ' Kody konfiguracji i przygotowania nie zastępują oznaczenia fizycznej skrzyni. M20 jest kodem wieloznacznym w GM.'),
 ...group('Emisja', `NA1|Konfiguracja emisji dla GVW poniżej 8500 lb|EMISSION SYSTEM, GVW < 8500 LBS
NA5|Federalny układ emisji, Tier 0|EMISSION SYSTEM, FEDERAL, TIER 0
NF2|Federalny układ emisji, Tier 1|EMISSION SYSTEM, FEDERAL TIER 1
NG1|Konfiguracja emisji NY/MA/CT|EMISSION SYSTEM, NY/MA/CT
NG5|Rejestracyjna konfiguracja emisji dla 50 stanów|REGISTRATION, EMISSION SYSTEM (50 STATE)`, COMMUNITY + ' Nie potwierdza spełnienia norm Euro ani dopuszczenia auta do ruchu w Polsce.'),
 ...group('Koła', `PF4|Felga aluminiowa 16x7|WHEEL, 16x7 ALUMINUM
RO4|Pojedyncze koła tylne — zapis kodu według źródła|WHEEL, SINGLE RR
RO5|Podwójne koła tylne — zapis kodu według źródła|WHEEL DUAL RR`, COMMUNITY + ' Nie potwierdza rozstawu śrub, ET ani nośności. RO4/RO5 zawierają literę O w tej referencji; nie zamieniamy jej samoczynnie na zero.'),
 ...group('Pakiety', `X88|Oznaczenie Chevrolet|Chevrolet
ZM9|Pakiet komfortu Suburban|Suburban comfort package`, COMMUNITY + ' Zakres wyposażenia pakietu zależy od modelu i rocznika.'),
 ...group('Hamulce', `JB6|Wspomagane hamulce tarczowo-bębnowe, klasa opisu 7200 lb|BRAKE, POWER, DISC/DRUM 7200 LBS
JB8|Wspomagane hamulce tarczowo-bębnowe, klasa opisu 10000 lb|BRAKE, POWER, DISC/DRUM 10000 LBS
JD5|Układ dual power tarczowo-bębnowy, klasa opisu 6400 lb|DUAL POWER, DISC/DRUM 6400 LBS
JD7|Wspomaganie hydrauliczne, hamulce tarczowo-bębnowe, klasa opisu 8400 lb|BRAKE, HYD POWER, DISC/DRUM 8400 LBS`, COMMUNITY + ' Wartości z opisu hamulców nie są polską DMC ani limitem przyczepy. Przed doborem części zmierz i zidentyfikuj zamontowany układ.'),
 ...group('Kolory i tapicerki', `10U|Główny kolor nadwozia Arctic White, adnotacja źródła 91|PRIMARY COLOR, EXTERIOR, ARCTIC WHITE (91)
12U|Główny kolor nadwozia Silver Metallic, adnotacja źródła 91|PRIMARY COLOR, EXTERIOR SILVER MET (91)
13U|Główny kolor nadwozia Bright Silver Metallic, adnotacja źródła 91|PRIMARY COLOR, EXTERIOR, BRIGHT SILVER MET (91)
14U|Główny kolor nadwozia Light Gray Metallic, adnotacja źródła 92|PRIMARY COLOR, EXTERIOR, LT GRAY MET (92)
16U|Główny kolor nadwozia Warm Gray Metallic, adnotacja źródła 91|PRIMARY COLOR, EXTERIOR, WARM GRAY MET (91)
17U|Główny kolor nadwozia Light Slate Metallic, adnotacja źródła 91|PRIMARY COLOR, EXTERIOR, LT SLATE MET (91)
18U|Główny kolor nadwozia Slate Gray, adnotacja źródła 91|PRIMARY COLOR, EXTERIOR, SLATE GRAY (91)
19U|Główny kolor nadwozia Lamp Black, adnotacja źródła 91|PRIMARY COLOR, EXTERIOR, LAMP BLACK (91)
20U|Główny kolor nadwozia Light Quasar Blue Metallic, adnotacja źródła 93|PRIMARY COLOR, EXTERIOR, LT QUASAR BLUE MET (93)
21U|Główny kolor nadwozia Neon Blue Metallic, adnotacja źródła 91|PRIMARY COLOR EXTERIOR, NEON BLUE MET (91)
22U|Główny kolor nadwozia Bahama Blue Metallic, adnotacja źródła 91|PRIMARY COLOR, EXTERIOR, BAHAMA BLUE MET (91)
23U|Główny kolor nadwozia Medium Maui Blue Metallic, adnotacja źródła 91|PRIMARY COLOR, EXTERIOR, MED MAUI BLUE MET (91)
24U|Główny kolor nadwozia Bright Blue Metallic, adnotacja źródła 91|PRIMARY COLOR, EXTERIOR, BRIGHT BLUE MET (91)
25U|Główny kolor nadwozia Steel Blue Metallic, adnotacja źródła 91|PRIMARY COLOR, EXTERIOR, STEEL BLUE MET (91)
26U|Główny kolor nadwozia Pastel Blue, adnotacja źródła 91|PRIMARY COLOR, EXTERIOR, PASTEL BLUE (91)
27U|Główny kolor nadwozia Light French Blue Metallic, adnotacja źródła 91|PRIMARY COLOR, EXTERIOR, LT FRENCH BLUE MET (91)
28U|Główny kolor nadwozia Black Sapphire Metallic, adnotacja źródła 91|PRIMARY COLOR, EXTERIOR, BLACK SAPPHIRE MET (91)
29U|Główny kolor nadwozia Dark Blue, adnotacja źródła 91|PRIMARY COLOR, EXTERIOR, DK BLUE (91)
40U|Główny kolor nadwozia White, adnotacja źródła 91|PRIMARY COLOR, EXTERIOR, WHITE (91)
41U|Główny kolor nadwozia Black — referencja ogólna|PRIMARY COLOR, EXTERIOR, BLACK`, 'Ogólny katalog kolorów GM, nie potwierdzona paleta GMT400. Nazwy i kody zmieniały znaczenie zależnie od modelu i roku. Zachowano adnotację rocznikową źródła w opisie, lecz nie potwierdza ona zastosowania do GMT400. Do doboru lakieru potrzebne są pełne oznaczenie WA i próba koloru.', PDF),
];
