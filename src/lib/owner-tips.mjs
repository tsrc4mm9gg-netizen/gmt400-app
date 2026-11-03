// Porady właściciela: fakty wyłącznie z instrukcji GM (Owner's Manual 1995–1999, Service Manual 1988/1991/1998),
// opisane własnymi słowami, ze stroną źródła. Zakres (model/lata/napęd) = to, co potwierdza dokument.
// Status względem profilu „Moje auto”: match / general / unknown / outside — domyślnie ukrywamy tylko „outside”.

const OM = {
  OM95: { doc: 'Owner’s Manual Chevrolet C/K 1995', url: 'https://assets.gm.com/manuals/chevrolet/1995_chevrolet_1500_owners.pdf' },
  OM96: { doc: 'Owner’s Manual Chevrolet C/K 1996', url: 'https://assets.gm.com/manuals/chevrolet/1996_chevrolet_1500_owners.pdf' },
  OM97: { doc: 'Owner’s Manual Chevrolet C/K 1997', url: 'https://assets.gm.com/manuals/chevrolet/1997_chevrolet_1500_owners.pdf' },
  OM98: { doc: 'Owner’s Manual Chevrolet C/K 1998', url: 'https://assets.gm.com/manuals/chevrolet/1998_chevrolet_1500_owners.pdf' },
  OM99: { doc: 'Owner’s Manual Chevrolet Tahoe / Suburban 1999', url: 'https://www.chevrolet.com/ownercenter/content/dam/gmownercenter/gmna/dynamic/manuals/1999/chevrolet/suburban/1999_chevrolet_suburban_owners.pdf' },
  SM88: { doc: 'GM Service Manual C/K 1988' },
  SM91: { doc: 'GM Service Manual C/K 1991' },
  SM95S: { doc: 'GM Service Manual 1995 — suplement Tahoe/Yukon' },
  SM98_3: { doc: 'GM Service Manual C/K 1998, tom 3 (silnik)' },
  WCD: { doc: 'West Coast Differentials — What gear ratio do I have?', url: 'https://differentials.com/technical-help-2/differential-faqs/' },
  WCD_RPO: { doc: 'West Coast Differentials — GM axle ratio identification codes', url: 'https://differentials.com/gm-axle-ratio-identification-codes/' },
  GM_ORDER: { doc: 'Przewodniki zamówień GM C/K 1996–1999 (kody RPO, jak w /narzedzia/rpo)' },
};
const src = (key, page) => ({ ...OM[key], page });
const PICKUP = ['C/K', 'Sierra'];
const SUV = ['Tahoe', 'Yukon', 'Suburban'];

export const OWNER_TIP_CATEGORIES = [
  { id: 'jazda', label: 'Jazda na co dzień' },
  { id: 'elektryka', label: 'Elektryka, kluczyki, kontrolki' },
  { id: 'napęd', label: 'Napęd 4×4 i most' },
  { id: 'przyczepa', label: 'Przyczepa i holowanie' },
  { id: 'opony', label: 'Opony, koła, łańcuchy' },
  { id: 'teren', label: 'Zima, teren, woda' },
  { id: 'warsztat', label: 'Proste sprawdzenia w garażu' },
  { id: 'ilustrowane', label: 'Porady ilustrowane — Tahoe / Suburban 1999' },
];

/** @type {import('./owner-tips.d.mts').OwnerTip[]} */
export const OWNER_TIPS = [
  // ── Jazda ──
  { id: 'docieranie', cat: 'jazda', title: 'Docieranie nowego silnika i nowych klocków', years: [1995, 1999],
    scope: 'Dotyczy: wszystkie GMT400 1995–1999 opisane w instrukcjach; po remoncie silnika lub wymianie okładzin hamulcowych.',
    steps: ['Przez pierwsze 805 km jedź nie szybciej niż ok. 88 km/h i zmieniaj prędkość — nie trzymaj długo jednej, ani wolnej, ani szybkiej.', 'Nie ruszaj z pełnym gazem.', 'Przez pierwsze ok. 322 km unikaj gwałtownego hamowania. To samo dotyczy każdej wymiany okładzin hamulcowych.', 'W czasie docierania nie ciągnij przyczepy.'],
    sources: [src('OM95', 's. 2-9'), src('OM98', 's. 2-10'), src('OM99', 's. 2-12')], check: true },
  { id: 'tempomat', cat: 'jazda', title: 'Tempomat — jak włączyć, ustawić i wznowić', years: [1995, 1999], fixed: 'Karta 12 (poprawiona)',
    scope: 'Dotyczy: auta z tempomatem (opcja) sterowanym przełącznikiem na dźwigni wielofunkcyjnej; opis z instrukcji 1995 i 1998.',
    steps: ['Tempomat działa od ok. 40 km/h; poniżej nie da się go włączyć.', 'Przesuń przełącznik na dźwigni na ON, rozpędź auto do wybranej prędkości, naciśnij i puść przycisk SET na końcu dźwigni, zdejmij nogę z gazu.', 'Wciśnięcie hamulca wyłącza tempomat. Krótkie przesunięcie przełącznika na R/A (ok. pół sekundy) wraca do zapamiętanej prędkości; przytrzymanie R/A przyspiesza.', 'Gdy nie używasz tempomatu, zostaw przełącznik w pozycji OFF.'],
    warning: 'Nie używaj tempomatu na krętych drogach, w gęstym ruchu ani na śliskiej nawierzchni.',
    sources: [src('OM95', 's. 2-43'), src('OM98', 's. 2-38–2-39')], check: true },
  { id: 'postojowy', cat: 'jazda', title: 'Hamulec postojowy przed „P” — unikniesz zablokowanej dźwigni', years: [1995, 1999],
    scope: 'Dotyczy: automatyczna skrzynia; ostrzeżenie o skrzyni rozdzielczej w N — auta 4×4.',
    steps: ['Najpierw zaciągnij hamulec postojowy, dopiero potem wrzuć P. Jeśli auto stoi na pochyłości oparte na blokadzie skrzyni, dźwignia może trudno wychodzić z P („torque lock”).', 'Przy ruszaniu najpierw wyprowadź dźwignię z P, dopiero potem zwolnij hamulec postojowy.', 'Nie jedź z zaciągniętym hamulcem postojowym — przegrzewa tylne hamulce.'],
    warning: 'Skrzynia rozdzielcza w N odłącza napęd: auto może się stoczyć nawet w P. Przed ustawieniem N zawsze zaciągnij hamulec postojowy.',
    sources: [src('OM95', 's. 2-28, 2-30'), src('OM98', 's. 2-22, 2-25, 2-28'), src('OM99', 's. 2-23, 2-28')], check: true },
  { id: 'postojowy-3500hd', cat: 'jazda', title: '3500 HD: dotarcie hamulca postojowego na wale', modelIncludes: ['3500'], years: [1995, 1995],
    scope: 'Dotyczy: C/K 3500 HD z hamulcem postojowym na wale napędowym (instrukcja 1995) — sprawdź, czy Twoje auto go ma.',
    steps: ['GM zaleca dotarcie tego hamulca w ramach docierania nowego auta — działa potem najlepiej.', 'Zrób 10 hamowań samym pedałem hamulca postojowego z ok. 32 km/h, co ok. 4 km.', 'Między hamowaniami jedź ok. 32 km/h.'],
    sources: [src('OM95', 's. 2-28')], check: true },
  { id: 'kierunkowskazy', cat: 'jazda', title: 'Kierunkowskaz miga dwa razy szybciej', years: [1998, 1998],
    scope: 'Dotyczy: C/K 1998 (opis z instrukcji); w innych rocznikach zasada zwykle ta sama — sprawdź w swoim aucie.',
    steps: ['Szybkie miganie strzałki = przepalona żarówka kierunkowskazu po tej stronie.', 'Strzałka w ogóle nie miga = sprawdź żarówki i bezpiecznik.', 'Z przyczepą: strzałki na zegarach migają nawet wtedy, gdy żarówki przyczepy są przepalone — sprawdź światła przyczepy na postoju.'],
    sources: [src('OM98', 's. 2-35–2-36, 4-57')], check: true },
  { id: 'drl', cat: 'jazda', title: 'Światła do jazdy dziennej (DRL) — kiedy się włączają', years: [1995, 1999],
    scope: 'Dotyczy: auta z DRL (instrukcje 1995–1999). O przeróbce świateł na europejskie — poradnik „Światła na europejskie”.',
    steps: ['DRL to reflektory świecące ze zmniejszoną jasnością (w 1995: światła drogowe). Włączają się, gdy zapłon jest włączony, włącznik świateł wyłączony, a hamulec postojowy zwolniony.', 'Pozostałe lampy (tylne, obrysowe) są wtedy wyłączone — o zmroku włącz normalne światła.', 'Brzęczyk przypomina o pozostawionych włączonych reflektorach.'],
    sources: [src('OM95', 's. 2-50'), src('OM98', 's. 2-42'), src('OM99', 's. 2-41')], check: true },
  // ── Elektryka ──
  { id: 'pilot', cat: 'elektryka', title: 'Pilot centralnego zamka: zasięg, dwa kliknięcia, synchronizacja', years: [1997, 1999],
    scope: 'Dotyczy: auta z pilotem (keyless entry) 1997–1999 — synchronizację opisują instrukcje 1997, 1998 i 1999.',
    steps: ['Zasięg pilota to ok. 1–9 m; w deszczu lub śniegu podejdź bliżej albo unieś pilota wyżej. Jedno UNLOCK otwiera drzwi kierowcy i zapala oświetlenie wnętrza na 40 s (lub do włączenia zapłonu); drugie naciśnięcie w ciągu 5 s otwiera pozostałe drzwi.', 'Dwukrotne LOCK = krótki sygnał klaksonu (potwierdzenie).', 'Pilot przestał działać po wymianie baterii? Stań blisko auta i przytrzymaj jednocześnie LOCK i UNLOCK co najmniej 5 s. Zamki powinny „przeskoczyć” na potwierdzenie; jeśli nie — serwis.', 'Do jednego auta można przypisać najwyżej 4 piloty. Przy zgubieniu zabierz do serwisu wszystkie pozostałe — zgubiony zostaje wtedy wyłączony.'],
    sources: [src('OM97', 's. 2-9'), src('OM98', 's. 2-7, 2-9'), src('OM99', 's. 2-8')], check: true },
  { id: 'passlock', cat: 'elektryka', title: 'PassLock i kontrolka SECURITY — co znaczy miganie', years: [1998, 1999],
    scope: 'Dotyczy: auta z PassLock opisanym w instrukcjach C/K 1998 i Tahoe/Suburban 1999. Dla innych roczników sprawdź, czy auto ma ten system.',
    steps: ['PassLock uzbraja się po wyjęciu kluczyka. Przy złym kluczyku lub manipulacji przy stacyjce system odcina paliwo.', 'Kontrolka SECURITY zapala się na chwilę przy kręceniu rozrusznikiem i gaśnie po uruchomieniu silnika. Miganie = system przeszedł w tryb wykrycia manipulacji.', 'Silnik zgasł, a SECURITY miga: zaczekaj, aż przestanie migać, i dopiero wtedy uruchom ponownie. Puść kluczyk ze START od razu po zapaleniu silnika.', 'SECURITY zapala się w czasie jazdy i świeci: silnik da się ponownie uruchomić, ale system wymaga serwisu, a auto nie jest wtedy chronione. Sprawdź też bezpiecznik.'],
    sources: [src('OM98', 's. 2-10, 2-73'), src('OM99', 's. 2-11')], check: true },
  { id: 'kontrolki', cat: 'elektryka', title: 'Kontrolki hamulców, ABS i wskaźnik temperatury', years: [1998, 1998],
    scope: 'Dotyczy: C/K 1998 (opis i progi z instrukcji). W innych rocznikach zegary mogą się różnić — sprawdź w swoim aucie.',
    steps: ['Kontrolka BRAKE świeci w czasie jazdy (przy zwolnionym postojowym): zatrzymaj się bezpiecznie i wezwij lawetę.', 'Świeci tylko kontrolka ABS: zwykłe hamulce działają, ABS nie — jedź ostrożnie do serwisu.', 'Wskaźnik temperatury do ok. 100 °C to praca normalna. Pod dużym obciążeniem (upał, przyczepa, podjazd) może zbliżać się do 125 °C. Dojście do 125 °C oznacza przeciążenie układu chłodzenia.'],
    warning: 'Świecąca kontrolka BRAKE może oznaczać utratę części układu hamulcowego. Nie kontynuuj jazdy.',
    sources: [src('OM98', 's. 2-68–2-69')], check: true },
  { id: 'grzalka', cat: 'elektryka', title: 'Grzałka płynu chłodniczego (opcja) — zimowy rozruch', years: [1995, 1998],
    scope: 'Dotyczy: auta z fabryczną grzałką płynu chłodniczego (opcja), instrukcje 1995 i 1998. Uwaga: instrukcja USA zakłada gniazdo 110 V.',
    steps: ['Przydaje się od ok. −18 °C w dół: łatwiejszy rozruch i mniejsze zużycie paliwa przy rozgrzewaniu.', 'Podłącz na co najmniej 4 h przed uruchomieniem. Przewód jest po stronie kierowcy, przy zbiorniczku wspomagania (1998).', 'Używaj uziemionego gniazda trójbolcowego; przedłużacz tylko trójżyłowy, na co najmniej 15 A.', 'Przed uruchomieniem odłącz i schowaj przewód z dala od ruchomych części.'],
    warning: 'Instrukcja przewiduje gniazdo 110 V (USA). Nie podłączaj grzałki bezpośrednio do gniazda 230 V — zleć sprawdzenie elektrykowi.',
    sources: [src('OM95', 's. 2-18'), src('OM98', 's. 2-14')], check: true },
  { id: 'bezpieczniki-maska', cat: 'elektryka', title: 'Skrzynka bezpieczników i przekaźników pod maską', years: [1996, 1999], fixed: 'Karta 7 (poprawiona)',
    scope: 'Dotyczy: C/K 1996–1999 i Tahoe/Suburban 1999 (opis z instrukcji). Pełne tabele — strona Bezpieczniki.',
    steps: ['Skrzynka jest z tyłu komory silnika, przy zbiorniczku płynu hamulcowego. Pokrywę zdejmiesz po odsunięciu zatrzasków; szczypce do bezpieczników są w skrzynce w kabinie.', 'ECM-B — pompa paliwa i sterownik PCM/VCM. ECM-1 — wtryskiwacze i PCM/VCM.', 'HORN — klakson i lampy pod maską. GLOW PLUG i FUEL SOL — świece żarowe i elektrozawór paliwa w dieslu.', 'Instrukcje nie podają amperażu tych bezpieczników — przy wymianie odczytaj wartość z wyjętego bezpiecznika.'],
    sources: [src('OM96', 's. 6-71–6-72'), src('OM97', 's. 6-74'), src('OM98', 's. 6-74–6-75'), src('OM99', 's. 6-64')], check: true, link: { href: '/schematy/bezpieczniki', label: 'Bezpieczniki — pełne tabele' } },
  { id: 'ecm-b', cat: 'elektryka', title: 'Silnik kręci, ale nie odpala — sprawdź ECM-B', years: [1996, 1999], fixed: 'Karta 9 (poprawiona: ECM-B jest pod maską, nie pod deską)',
    scope: 'Dotyczy: C/K 1996–1999 i Tahoe/Suburban 1999 — bezpiecznik ECM-B w skrzynce pod maską.',
    steps: ['ECM-B zasila pompę paliwa i sterownik PCM/VCM, więc przepalony bezpiecznik daje objaw „kręci, nie zapala”.', 'Otwórz skrzynkę pod maską (tył komory silnika, przy zbiorniczku hamulcowym) i obejrzyj ECM-B pod światło lub sprawdź próbnikiem.', 'Wymieniaj tylko na bezpiecznik tej samej wartości co wyjęty (instrukcja nie podaje amperażu).', 'Jeśli nowy bezpiecznik znów się przepala — szukaj zwarcia, nie wkładaj mocniejszego.'],
    sources: [src('OM96', 's. 6-72'), src('OM97', 's. 6-74'), src('OM98', 's. 6-74–6-75'), src('OM99', 's. 6-64')], check: true, link: { href: '/diagnoza', label: 'Diagnoza: nie odpala' } },
  // ── Napęd ──
  { id: '4wd-dzwignia', cat: 'napęd', title: '4×4 z dźwignią: 2H/4H w ruchu, 4L i N prawie na postoju', drive: '4WD', years: [1998, 1998], fixed: 'Karta 13 (poprawiona — usunięto „4HI do 80 km/h”, brak w instrukcji)',
    scope: 'Dotyczy: 4×4 z ręczną dźwignią skrzyni rozdzielczej (opis C/K 1998).',
    steps: ['2H ↔ 4H możesz przełączać w czasie jazdy. Przód załączy się szybciej, jeśli na kilka sekund zdejmiesz nogę z gazu. W dużym mrozie może być trzeba zwolnić lub stanąć.', 'Do 4L lub N (i z powrotem): zwolnij do ok. 2–5 km/h, automat w N (manual: wciśnięte sprzęgło) i przesuń dźwignię jednym, płynnym ruchem — bez zatrzymywania w N, bo zgrzytną koła zębate.', 'N tylko do holowania lub napędu przystawki (PTO). Kontrolka przedniej osi może zapalić się z opóźnieniem — to normalne; gdy po wyłączeniu 4×4 od razu nie gaśnie, oddaj auto do sprawdzenia.', 'Jazda w 4×4 po suchym asfalcie przyspiesza zużycie opon, utrudnia przełączanie i zwiększa hałas skrzyni rozdzielczej.'],
    sources: [src('OM98', 's. 2-22–2-23')], check: true },
  { id: '4wd-przyciski', cat: 'napęd', title: '4×4 z przyciskami (elektryczna skrzynia rozdzielcza)', drive: '4WD', years: [1996, 1999], fixed: 'Karta 13 (poprawiona)',
    scope: 'Dotyczy: 4×4 z elektryczną skrzynią rozdzielczą (przyciski obok panelu klimatyzacji) — opis C/K 1998 i Tahoe/Suburban 1999 (AUTO 4WD tylko w niektórych).',
    steps: ['2HI ↔ 4HI (oraz AUTO 4WD, jeśli jest) — przy dowolnej prędkości. Kontrolka miga w czasie zmiany i świeci stale po jej zakończeniu.', '4LO i wyjście z 4LO: silnik pracuje, auto stoi lub toczy się wolniej niż 4,8 km/h, skrzynia biegów w N. Najlepiej przy 1,6–3,2 km/h.', 'Wrzuć bieg dopiero, gdy kontrolka przestanie migać.', 'Wybór 4LO w ruchu lub na biegu: kontrolka miga 30 s, po czym skrzynia wraca do poprzedniego ustawienia. Świecące SERVICE 4WD = serwis.'],
    sources: [src('OM98', 's. 2-24–2-25'), src('OM99', 's. 2-23–2-24')], check: true },
  { id: 'g80', cat: 'napęd', title: 'Most z blokadą (G80) — jak się zachowuje', years: [1995, 1999],
    scope: 'Dotyczy: auta z tylnym mostem z blokadą (opcja G80).',
    steps: ['Na co dzień działa jak zwykły most.', 'Gdy jedno tylne koło traci przyczepność (śnieg, błoto, lód, piasek, żwir), blokada pozwala kołu z przyczepnością pchać auto.', 'Kod G80 sprawdzisz na naklejce RPO.'],
    sources: [src('OM95', 's. 2-27'), src('OM98', 's. 2-32'), src('OM99', 's. 2-31')], check: true, link: { href: '/narzedzia/rpo', label: 'Dekoder kodów RPO' } },
  // ── Przyczepa ──
  { id: 'przyczepa-start', cat: 'przyczepa', title: 'Przyczepa: pierwsze kilometry, biegi, stabilizator', years: [1995, 1999],
    scope: 'Dotyczy: wszystkie GMT400 1995–1999 z hakiem; dopuszczalne masy sprawdź w dokumentach swojego auta.',
    steps: ['Nowe auto: bez przyczepy przez pierwsze 800 km. Potem przez pierwsze 800 km z przyczepą: do ok. 80 km/h i bez ruszania z pełnym gazem.', 'Automat: jedź na nadbiegu (D z kółkiem); jeśli skrzynia często zmienia biegi — na 3. Manual: na 4., nie na 5.', 'Stabilizator kołysania (sway control): rozważ go, gdy przyczepa waży mniej niż nośność wybita na zderzaku stopniowym; gdy waży więcej — używaj go zawsze.'],
    sources: [src('OM95', 's. 4-43'), src('OM98', 's. 4-50'), src('OM99', 's. 4-47')], check: true },
  { id: 'przyczepa-hamulce', cat: 'przyczepa', title: 'Hamulce przyczepy i łańcuchy bezpieczeństwa', years: [1998, 1999],
    scope: 'Dotyczy: C/K 1998 i Tahoe/Suburban 1999 (progi z instrukcji USA). Przepisy PL dotyczące przyczep mają pierwszeństwo.',
    steps: ['Przyczepa cięższa niż 450 kg z ładunkiem potrzebuje własnych hamulców.', 'Podłączenie do hydrauliki auta tylko, gdy elementy przyczepy wytrzymują 20 650 kPa i pobierają mniej niż 0,3 cm³ płynu. Przewód stalowy — nie miedziany (pęka).', 'Łańcuchy: skrzyżowane pod dyszlem, nie do zderzaka, z luzem na skręt, nigdy nie wloką się po ziemi.', 'Hamulce elektryczne przetestuj ręcznie sterownikiem przy ruszaniu.'],
    warning: 'Za słabe lub źle podłączone hamulce przyczepy mogą odebrać hamulce obu pojazdom.',
    sources: [src('OM98', 's. 4-56'), src('OM99', 's. 4-52')], check: true },
  { id: 'przyczepa-jazda', cat: 'przyczepa', title: 'Jazda i parkowanie z przyczepą na wzniesieniu', years: [1998, 1998],
    scope: 'Dotyczy: C/K 1998 (opis z instrukcji); zasady jazdy są ogólne — sprawdź w swoim aucie.',
    steps: ['Co najmniej dwa razy większy odstęp niż zwykle; szersze zakręty.', 'Cofanie: trzymaj kierownicę za dół — ruch ręki w lewo = przyczepa w lewo.', 'Z góry redukuj bieg zamiast ciągle hamować. Długi podjazd: niższy bieg i ok. 70 km/h, żeby nie przegrzać silnika i skrzyni. Wysoko w górach daj silnikowi kilka minut na wolnych obrotach przed wyłączeniem.', 'Parkowanie na pochyłości: wciśnij hamulec → druga osoba podkłada kliny pod koła przyczepy → powoli zwolnij hamulec, aż kliny przejmą ciężar → hamulec → postojowy → P (manual: R).'],
    sources: [src('OM98', 's. 4-57–4-58')], check: true },
  { id: 'przyczepa-wiazka', cat: 'przyczepa', title: 'Wiązki do przyczepy i kampera: kolory przewodów', platforms: PICKUP, years: [1998, 1998],
    scope: 'Dotyczy: pickup C/K 1998 z fabryczną wiązką (opis z instrukcji). Podłączenie zleć elektrykowi.',
    steps: ['Wiązka kampera (jeśli jest): brązowy — światła tylne; żółty — stop/kierunek lewy; ciemnozielony — stop/kierunek prawy; gruby biały — masa; jasnozielony — cofanie.', 'Wiązka przyczepy (8 przewodów) jest schowana pod tyłem auta: ma zasilanie z akumulatora 30 A i nie ma fabrycznego złącza. Kolory: brązowy — światła tylne; żółty — stop/kierunek lewy; ciemnozielony — stop/kierunek prawy; gruby biały — masa; jasnozielony — światło cofania; cienki biały — trzecie światło stop; niebieski — hamulec elektryczny przyczepy; pomarańczowy — zasilanie pomocnicze z bezpiecznikiem.'],
    sources: [src('OM98', 's. 4-48, 4-60')], check: true },
  { id: 'holowanie-na-kolach', cat: 'przyczepa', title: 'Holowanie auta na czterech kołach (za kamperem)', years: [1998, 1998],
    scope: 'Dotyczy: C/K 1998 (opis z instrukcji). Na czterech kołach tylko 4×4 z ręczną skrzynią rozdzielczą.',
    steps: ['2WD: nie holuj na czterech kołach — użyj platformy/lawety albo oznacz i wymontuj wał napędowy.', '4×4 z dźwignią skrzyni rozdzielczej: zaciągnij postojowy → P (manual: 1. bieg) → podłącz do pojazdu holującego → przy pracującym silniku skrzynia rozdzielcza w N → zwolnij postojowy → zapłon OFF (kolumna kierownicy odblokowana).', 'Elektryczna skrzynia rozdzielcza ma osobną procedurę ustawiania N z przyciskami — patrz instrukcja swojego auta.'],
    warning: 'Skrzynia rozdzielcza w N = auto może się stoczyć nawet w P. Zawsze najpierw hamulec postojowy.',
    sources: [src('OM98', 's. 4-41–4-42'), src('OM99', 's. 2-24')], check: true },
  // ── Opony ──
  { id: 'cisnienie-rotacja', cat: 'opony', title: 'Ciśnienie co miesiąc, rotacja co 10–13 tys. km', years: [1998, 1999],
    scope: 'Dotyczy: C/K 1998 i Tahoe/Suburban 1999 (opis z instrukcji); ciśnienia z naklejki w Twoim aucie.',
    steps: ['Ciśnienie sprawdzaj raz w miesiącu (również w zapasie) dobrym manometrem; opona radialna może wyglądać dobrze mimo za niskiego ciśnienia. Zakręć kapturki wentyli.', 'Rotacja co 10 000–13 000 km; najważniejsza jest pierwsza. Przy nietypowym zużyciu — rotacja od razu i sprawdzenie geometrii.', 'Jeśli przód ma inne opony (inny indeks nośności lub bieżnik) niż tył — nie przekładaj przód↔tył.', 'Po rotacji ustaw ciśnienia według naklejki i sprawdź dokręcenie nakrętek kół.'],
    warning: 'Nie zakładaj używanej felgi o nieznanej historii — może nagle pęknąć. Instrukcja zaleca nową oryginalną felgę GM.',
    sources: [src('OM98', 's. 6-53, 6-60'), src('OM99', 's. 6-44, 6-50')], check: true, link: { href: '/momenty-dokrecania', label: 'Momenty dokręcania kół' } },
  { id: 'blizniaki', cat: 'opony', title: 'Koła bliźniacze: dokręć nakrętki po 160, 1600 i 10 000 km', modelIncludes: ['3500'], years: [1995, 1998],
    scope: 'Dotyczy: C/K 3500 z kołami bliźniaczymi (instrukcje 1995 i 1998).',
    steps: ['Nowe auto (instrukcja 1995) oraz po każdej wymianie koła, szpilki lub nakrętki: sprawdź moment nakrętek po 160, 1600 i 10 000 km.', 'Zewnętrzna opona zużywa się szybciej — rotuj koła parami, wewnętrzne na zewnątrz; ustaw otwory wentylacyjne felg w jednej linii.', 'Przy dłuższej jeździe po drogach o mocno wypukłym profilu instrukcja 1995 dopuszcza +35 kPa w oponach zewnętrznych — potem wróć do zalecanych ciśnień.'],
    sources: [src('OM95', 's. 6-62'), src('OM98', 's. 6-54, 6-60')], check: true, link: { href: '/momenty-dokrecania', label: 'Momenty dokręcania kół' } },
  { id: 'lancuchy', cat: 'opony', title: 'Łańcuchy śniegowe — tylko tył i nie przy każdym rozmiarze', years: [1995, 1999],
    scope: 'Dotyczy: wszystkie GMT400 1995–1999; zakaz dla kół bliźniaczych oraz opon P/LT265/75R16 (brak miejsca).',
    steps: ['Koła bliźniacze lub opony 265/75R16: nie zakładaj łańcuchów. Inne urządzenie przeciwpoślizgowe tylko, jeśli jego producent dopuszcza je do Twojego auta i rozmiaru.', 'Pozostałe rozmiary: łańcuchy tylko tam, gdzie to legalne i konieczne, we właściwym rozmiarze, wyłącznie na oś tylną — nigdy na przednią.', 'Napnij jak najmocniej. Słychać ocieranie o auto — stań i dociągnij; jeśli nie pomaga, zwolnij. Nie buksuj kołami.'],
    sources: [src('OM95', 's. 6-66'), src('OM98', 's. 6-60–6-61'), src('OM99', 's. 6-50')], check: true },
  // ── Teren / zima ──
  { id: 'zakopany', cat: 'teren', title: 'Zakopany w śniegu lub błocie — „bujanie”', years: [1995, 1999],
    scope: 'Dotyczy: wszystkie GMT400 1995–1999; 4×4 — w 4HI.',
    steps: ['Najpierw pokręć kierownicą w lewo i prawo, żeby odgarnąć miejsce przy przednich kołach.', 'Przełączaj między R a biegiem do przodu (manual: 1./2. i R), z minimalnym buksowaniem. Na czas zmiany biegu puść gaz, potem dodawaj go delikatnie.', 'Po kilku nieudanych próbach — wyciąganie, np. za przednie haki (recovery hooks), jeśli auto je ma.'],
    warning: 'Szybkie buksowanie i szarpane przełączanie R/D może zniszczyć opony i skrzynię biegów.',
    sources: [src('OM95', 's. 5-39'), src('OM98', 's. 5-37'), src('OM99', 's. 5-37')], check: true },
  { id: 'teren', cat: 'teren', title: 'Przed i po jeździe w terenie, przejazd przez wodę', years: [1998, 1999],
    scope: 'Dotyczy: C/K 1998 i Tahoe/Suburban 1999 (opis z instrukcji).',
    steps: ['Przed: zrób zaległy serwis, sprawdź mocowanie osłon podwozia, paliwo, ciśnienie w zapasie i poziomy płynów. Najcięższy ładunek kładź na podłodze, jak najdalej do przodu przed tylną osią, i dobrze go zabezpiecz.', 'Woda: najpierw sprawdź głębokość. Jeśli sięga piast, osi lub wydechu — nie wjeżdżaj. Płytką wodę pokonuj powoli; po wyjeździe mokre hamulce działają słabiej.', 'Po: usuń gałęzie i suche liście spod auta i spod maski (ryzyko pożaru). Po błocie lub piasku oczyść i sprawdź okładziny hamulcowe. Obejrzyj układ kierowniczy, zawieszenie, koła, wydech, przewody paliwowe i chłodzenie.'],
    warning: 'Nie wjeżdżaj w rwący nurt ani na zamarznięte jezioro — auto może zostać porwane lub zarwać lód.',
    sources: [src('OM98', 's. 4-14, 4-25–4-26'), src('OM99', 's. 4-15, 4-26–4-27')], check: true },
  { id: 'zima', cat: 'teren', title: 'Zima: zestaw w aucie i jazda po lodzie', years: [1995, 1999],
    scope: 'Dotyczy: wszystkie GMT400 (opis z instrukcji C/K 1998) — sprawdź w swoim aucie.',
    steps: ['Wożenie zimą: skrobaczka, szczotka, płyn do spryskiwaczy, ścierka, ciepłe ubranie, łopata, latarka, czerwona szmatka i trójkąty. W trudnych warunkach także piasek i kawałek wykładziny pod koła.', 'Najgorsza przyczepność jest na mokrym lodzie, przy ok. 0 °C.', 'Przyspieszaj łagodnie. Z ABS-em również zaczynaj hamować wcześniej i zwiększ odstęp.'],
    sources: [src('OM98', 's. 4-36–4-37')], check: true },
  // ── Warsztat (zweryfikowane stare karty) ──
  { id: 'aldl', cat: 'warsztat', title: 'Kody OBD-I bez skanera (złącze ALDL)', years: [1991, 1991], hardYears: [1988, 1995], fixed: 'Karta 1 (potwierdzona, doprecyzowana)',
    scope: 'Dotyczy: auta z 12-stykowym złączem ALDL pod deską (OBD-I, do 1995). Gdy pod deską jest złącze 16-stykowe (OBD-II), użyj skanera.',
    steps: ['Zapłon ON, silnik wyłączony.', 'Połącz zworką styki A i B złącza ALDL (pod deską rozdzielczą).', 'Kontrolka Service Engine Soon miga kodem 12 (jedno mignięcie, przerwa, dwa) trzy razy, potem pokazuje zapisane kody.', 'Kod 12 oznacza tylko, że diagnostyka działa — nie „brak usterek”.', 'Zworka przy pracującym silniku = tryb serwisowy: miganie co 2,5 s — pętla otwarta, co 1 s — pętla zamknięta.'],
    sources: [src('SM91', 's. 3-9')], check: true, link: { href: '/kody-obd', label: 'Kody OBD — znaczenie' } },
  { id: 'kompresja', cat: 'warsztat', title: 'Test kompresji manometrem (zamiast „testu kciukiem”)', years: [1998, 1998], fixed: 'Karta 10 (zastąpiona procedurą GM)',
    scope: 'Dotyczy: silniki benzynowe 4.3, 5.0 i 5.7 (Service Manual 1998). Dla diesla 6.5 i 7.4 procedura jest osobna.',
    steps: ['Odłącz zasilanie cewki zapłonowej i złącze wtryskiwaczy. Wykręć wszystkie świece, zablokuj przepustnicę w pełni otwartą, naładuj akumulator.', 'Wyzeruj manometr i zakręć silnikiem przez cztery suwy sprężania (cztery „pyknięcia”). Każdy cylinder mierz tak samo i zapisuj wynik.', 'Najsłabszy cylinder: nie mniej niż 70% najmocniejszego i nie mniej niż 690 kPa. Przykład: najwyższy 1035 kPa → najniższy dopuszczalny ok. 725 kPa.', 'Niska kompresja: wlej ok. 15 ml oleju przez otwór świecy. Wyraźna poprawa = pierścienie; brak poprawy = zawory; dwa sąsiednie cylindry niskie bez poprawy = możliwa uszczelka głowicy.'],
    sources: [src('SM98_3', 's. 6-32 (4.3), 6-248 (5.0/5.7)')], check: true, link: { href: '/diagnoza', label: 'Diagnoza objawów silnika' } },
  { id: 'drazki-skretne', cat: 'warsztat', title: 'Wysokość przodu 4×4: śruba regulacyjna drążka skrętnego', drive: '4WD', years: [1988, 1995], fixed: 'Karta 2 (częściowo potwierdzona; usunięto niepotwierdzone 18 mm, kierunek obrotu i „max 2 cale”)',
    scope: 'Dotyczy: K (4×4) z przednimi drążkami skrętnymi — Service Manual 1988 i 1991, suplement Tahoe 1995.',
    steps: ['Wysokość przodu ustawia ramię regulacyjne drążka skrętnego; jeden obrót śruby regulacyjnej zmienia wysokość o ok. 6 mm.', 'Przy demontażu policz i zapisz obroty śruby regulacyjnej; przy montażu wkręć ją o tyle samo obrotów.', 'Przy wymianie drążka GM podaje wymiar odniesienia ramienia: 34 mm luzu przy wsporniku.', 'Po każdej regulacji zmierz wysokość „Z” według instrukcji i zrób geometrię kół.'],
    sources: [src('SM88', 'PDF s. 107 (rys. 3A-4), PDF s. 201 (rys. 41)'), src('SM91', 's. 3A-4'), src('SM95S', 'PDF s. 52')], check: true },
  { id: 'przelozenie-test', cat: 'warsztat', title: 'Sprawdź przełożenie mostu bez rozbierania', fixed: 'Karta 3 (bez zmian)',
    image: { src: '/tip-axle-ratio-guide.svg', alt: 'Otwarty mechanizm: jedno koło nieruchome, drugie dwa obroty; liczymy obroty wału' },
    scope: 'Dotyczy: każdy GMT400. Najpierw odczytaj kod RPO — jeśli most był zmieniany, kod może nie odpowiadać obecnemu przełożeniu.',
    steps: ['Otwarty mechanizm, drugie koło nieruchome: oznacz oponę i wał, obróć swobodne koło o dwa pełne obroty i policz obroty wału.', 'Gdy oba koła obracają się razem w tę samą stronę: jeden obrót obu kół = liczba obrotów wału równa przełożeniu. Nie zakładaj tego przy każdym mechanizmie z blokadą.', 'Ok. 3,73 obrotu wału ≈ 3,73:1. To oszacowanie, nie dokładne liczenie zębów.'],
    warning: 'Równe podłoże, kliny pod kołami na ziemi, podpory o właściwej nośności. Silnik wyłączony, koła obracaj ręcznie. Zabezpiecz auto, zanim ustawisz skrzynię w N i zwolnisz postojowy.',
    sources: [src('WCD', 'FAQ')], check: true },
  { id: 'rpo-przelozenia', cat: 'warsztat', title: 'Kody RPO: przełożenia i silniki Vortec', years: [1996, 1999], fixed: 'Karta 5 (potwierdzona, z zakresem lat)',
    image: { src: '/tip-rpo-guide.svg', alt: 'Schemat schowka pasażera i przykładowej naklejki: GT4 oznacza przełożenie 3,73' },
    scope: 'Dotyczy: C/K 1996–1999 (przewodniki zamówień GM). Naklejka Service Parts Identification opisuje wyposażenie fabryczne, nie późniejsze przeróbki.',
    steps: ['Przełożenia: GU6 = 3,42 · GT4 = 3,73 · GT5 = 4,10 · HC4 = 4,56 (w zestawie z blokadą G80).', 'Silniki Vortec: L35 = 4.3 V6 · L30 = 5.0 V8 · L31 = 5.7 V8.', 'Naklejkę zwykle znajdziesz w schowku lub na drzwiach. Kody wpisz w dekoderze RPO.'],
    sources: [src('GM_ORDER', 'kody GU6, GT4, GT5, HC4, L35, L30, L31'), src('WCD_RPO', 'tabela kodów')], check: true, link: { href: '/narzedzia/rpo', label: 'Dekoder kodów RPO' } },
];

/** Zakres 5 ilustrowanych porad (zdjęcia /tips/{id}.jpg bez zmian). */
export const ILLUSTRATED_SCOPE = {
  'second-row': { platforms: ['Tahoe', 'Yukon', 'Suburban'], years: [1999, 1999], doors4: true },
  'third-row': { platforms: ['Suburban'], years: [1999, 1999] },
  coolant: { platforms: SUV, years: [1999, 1999] },
  atf: { years: [1999, 1999] },
  spare: { platforms: SUV, years: [1999, 1999] },
};

/** Porady ze starej zakładki Tips pominięte (brak potwierdzenia w dokumentach). */
export const SKIPPED_OLD_CARDS = [
  { card: 4, title: 'Ukryty klucz pod zderzakiem', reason: 'brak w instrukcjach GM' },
  { card: 6, title: 'Reset adaptacji 4L60E odłączeniem akumulatora', reason: 'GM opisuje tylko automatyczną adaptację ciśnień przez PCM; procedury resetu brak' },
  { card: 8, title: 'Klapa nie otwiera się — trik', reason: 'brak w instrukcjach GM (śruby, klipsy, WD-40)' },
  { card: 11, title: 'Test pompy: zworka 30–87 w przekaźniku', reason: 'brak w instrukcjach GM; numeracja styków niepotwierdzona' },
];

const inferDrive = (profile) => profile.drive || (/^K/.test(profile.model) ? '4WD' : /^C/.test(profile.model) ? '2WD' : '');

/**
 * @param {{platforms?: string[]; modelIncludes?: string[]; drive?: string; years?: number[]; hardYears?: number[]; doors4?: boolean}} tip
 * @param {{platform?: string; model?: string; year?: string; drive?: string} | null} profile
 * @returns {{status: 'match'|'general'|'unknown'|'outside'; reasons: string[]}}
 */
export function ownerTipFit(tip, profile) {
  const constrained = Boolean(tip.platforms?.length || tip.modelIncludes?.length || tip.drive || tip.years || tip.hardYears);
  if (!constrained) return { status: 'general', reasons: ['Porada ogólna'] };
  if (!profile || !profile.model) return { status: 'unknown', reasons: ['Ustaw profil auta, żeby zobaczyć dopasowanie'] };
  const outside = []; const unknown = [];
  if (tip.platforms?.length) {
    if (!profile.platform) unknown.push('model nieustalony');
    else if (!tip.platforms.includes(profile.platform)) outside.push('inny model (' + tip.platforms.join(', ') + ')');
  }
  if (tip.doors4 && profile.model && /2-door/.test(profile.model)) outside.push('tylko wersja 4-drzwiowa');
  if (tip.modelIncludes?.length && !tip.modelIncludes.some(m => profile.model.includes(m))) outside.push('tylko wersje ' + tip.modelIncludes.join(', '));
  if (tip.drive) {
    const d = inferDrive(profile);
    if (!d) unknown.push('napęd nieustalony');
    else if (d !== tip.drive) outside.push('tylko ' + (tip.drive === '4WD' ? '4×4' : '4×2'));
  }
  const y = Number(profile.year);
  if (tip.hardYears || tip.years) {
    if (!/^\d{4}$/.test(profile.year || '')) unknown.push('rocznik nieustalony');
    else if (tip.hardYears && (y < tip.hardYears[0] || y > tip.hardYears[1])) outside.push('roczniki ' + tip.hardYears.join('–'));
    else if (tip.years && (y < tip.years[0] || y > tip.years[1])) unknown.push('instrukcja z innego rocznika (' + (tip.years[0] === tip.years[1] ? tip.years[0] : tip.years.join('–')) + ') — sprawdź w swoim aucie');
  }
  if (outside.length) return { status: 'outside', reasons: outside };
  if (unknown.length) return { status: 'unknown', reasons: unknown };
  return { status: 'match', reasons: ['Pasuje do Twojego auta'] };
}
