/**
 * Poradniki diagnostyczne z instrukcji serwisowych GM (do /diagnoza/[slug] i wyszukiwarki objawów).
 * Zasady: tylko fakty z podanych dokumentów, opisane własnymi słowami, jednostki metryczne; dokument + strona przy każdym poradniku.
 * Dokumenty serwisowe podajemy tylko z nazwy (bez linków).
 */
export type GuideTable = { caption: string; cols: string[]; rows: string[][]; note?: string };
export type GuideSection = { heading: string; intro?: string; items?: string[]; table?: GuideTable; warn?: string };
export type GuideSource = { doc: string; pages: string };
export type DiagGuide = {
  slug: string;
  title: string;
  /** Krótki opis (meta, wyszukiwarka, lista). */
  summary: string;
  scope: string;
  /** Słowa do wyszukiwarki (bez polskich znaków). */
  keywords: string;
  /** Objawy /diagnoza, z których linkujemy. */
  symptoms: string[];
  sections: GuideSection[];
  sources: GuideSource[];
};

const SM98 = 'GM 1998 C/K Truck Service Manual, tom 3 (silnik i sterowanie silnikiem)';
const X9236 = 'GM 1992 Light Duty Truck Fuel and Emissions Manual (X-9236), sekcja 2 „Driveability Symptoms”';
const NATP = 'GM 1994 Driveability, Emissions & Electrical Diagnosis (NATP-9442), sekcja 2';
const CK2 = 'GM 1995 C/K Truck Driveability, Emissions and Wiring Diagrams (CK-2), sekcja 2';

export const DIAG_GUIDES: DiagGuide[] = [
  {
    slug: 'tester-obd2-wartosci',
    title: 'Tester OBD-II: typowe odczyty na biegu jałowym (Vortec 4.3 / 5.0 / 5.7, 1996–99)',
    summary: 'Jakie wartości pokazuje tester w sprawnym Vortecu: obroty, IAC, TPS, ECT, MAP, MAF, korekty paliwa, wyprzedzenie, wtryski. Plus progi „uboga/bogata” z OBD-I.',
    scope: 'Benzyna Vortec 4.3 L, 5.0 L i 5.7 L z OBD-II (1996–1999). Progi korekt paliwa i TPS — także OBD-I 1992–1995.',
    keywords: 'tester skaner obd2 obdii scan tool typowe wartosci odczyty parametry live data dane biezace bieg jalowy obroty 650 iac kroki tps przepustnica ect temperatura map kpa maf g/s ltft stft korekta paliwa fuel trim block learn blm wyprzedzenie zaplonu knock retard wtrysk ms vortec 4.3 5.0 5.7 l35 l30 l31',
    symptoms: ['check-engine', 'szarpie-gasnie'],
    sections: [
      {
        heading: 'Kiedy te liczby mają sens',
        items: [
          'Silnik rozgrzany, bieg jałowy, pętla zamknięta (Closed Loop), przepustnica zamknięta, dźwignia w P lub N, wszystkie odbiorniki wyłączone.',
          'To średnie z prawidłowo działających aut — Twoje odczyty mogą się nieco różnić (np. przy słabym akumulatorze).',
          'Porównuj dopiero po wstępnej kontroli układu OBD i gdy nie ma zapisanych kodów — tabela nie zastępuje diagnozy kodu.',
          'Dla 5.0/5.7 L podręcznik podaje te same wartości co dla 4.3 L; dochodzą tylko pola immobilizera (VTD) — „blokada paliwa” powinna być nieaktywna.',
        ],
      },
      {
        heading: 'Typowe odczyty (bieg jałowy, silnik ciepły)',
        table: {
          caption: 'Wartości typowe wg GM dla 4.3 L (te same dla 5.0/5.7 L)',
          cols: ['Parametr', 'Typowo'],
          rows: [
            ['Obroty / obroty zadane', '650 obr/min'],
            ['IAC (silnik krokowy biegu jałowego)', 'ok. 18 kroków (zakres 0–255)'],
            ['TP — czujnik przepustnicy', '0,47 V; kąt 0 %'],
            ['ECT — temperatura płynu', '93 °C (ok. 2,0 V)'],
            ['MAP — podciśnienie w kolektorze', '38 kPa (ok. 1,46 V)'],
            ['BARO — ciśnienie otoczenia', '101 kPa (ok. 4,76 V), przy poziomie morza'],
            ['IAT — temperatura powietrza', 'ok. 43 °C — zależy od otoczenia'],
            ['MAF — masa powietrza', '4,6 g/s (ok. 2285 Hz)'],
            ['Obciążenie silnika', 'ok. 2 % na jałowym; ok. 11 % przy 2500 obr/min'],
            ['Korekty paliwa LTFT / STFT (oba rzędy)', '0 % (127 jednostek)'],
            ['Komórka korekty (fuel trim cell)', '17'],
            ['Zawór EVAP (purge)', 'ok. 17 % wypełnienia'],
            ['EGR — sterowanie / położenie', '0 % (czujnik ok. 0,64 V)'],
            ['Wyprzedzenie zapłonu', 'ok. 21°'],
            ['Cofanie zapłonu od spalania stukowego', '0–2°'],
            ['Napięcie zasilania (Ignition 1)', 'ok. 13,5 V'],
            ['Skład mieszanki (AFR)', '14,7 : 1'],
            ['Czas wtrysku (oba rzędy)', 'ok. 3,6 ms'],
            ['Liczniki wypadania zapłonów', '0'],
            ['Testy EVAP', 'zaliczone (Pass)'],
          ],
          note: 'Tabela jest skrótem — pełna lista ma kilkadziesiąt pól w kilku ekranach testera.',
        },
      },
      {
        heading: 'Jak czytać najważniejsze pola',
        items: [
          'TPS: na jałowym 0,36–0,96 V, przy pełnym otwarciu ponad 4,0 V. Przy zamkniętej przepustnicy odczyt powyżej ok. 0,85 V (OBD-II) albo 1,25 V (OBD-I) oznacza, że sterownik widzi „otwartą” przepustnicę i nie reguluje biegu jałowego — szukaj zacinającej się osi lub cięgna.',
          'Korekty paliwa: długoterminowa korekta (LTFT, w OBD-I „Block Learn”/BLM) powyżej 150 jednostek = mieszanka uboga, poniżej 115 = bogata. Sprawdzaj w jeździe z prędkością, przy której występuje objaw.',
          'ECT na zimnym silniku (po nocy) powinna być bliska temperaturze otoczenia; różnica większa niż ok. 5 stopni wskazuje na opór w obwodzie czujnika albo sam czujnik.',
          'IAC nie porusza się, gdy napięcie instalacji jest poza zakresem 9–16 V; to samo „okno” napięcia ładowania podają podręczniki OBD-I.',
          'Nieszczelność dolotu daje wyższe niż zwykle obroty jałowe i niskie kroki IAC.',
          'Pompa paliwa po włączeniu zapłonu powinna pracować ok. 2 s (w OBD-I z modułem paliwa — ok. 20 s).',
        ],
      },
    ],
    sources: [
      { doc: SM98, pages: 's. 6-1090–6-1096 (4.3 L), 6-1644–6-1647 (5.0/5.7 L), 6-1464–6-1474 (tabele objawów)' },
      { doc: X9236, pages: 's. 2-5, 2-7, 2-15' },
    ],
  },
  {
    slug: 'halas-silnika',
    title: 'Hałasy silnika: stuki, tykanie, popychacze — jak je rozróżnić (wg GM)',
    summary: 'Stuk z prędkością wału czy wałka? Tykanie popychaczy po rozruchu, stuk na zimno, luz zaworowy, wtryskiwacz 6.5 TD. Do tego próba ciśnienia sprężania.',
    scope: 'Silniki benzynowe 4.3 / 5.0 / 5.7 / 7.4 L i diesel 6.5 TD (procedury GM 1998, mechanika tych silników jest wspólna dla całej serii GMT400).',
    keywords: 'halas halasy stuk stuki stukanie tykanie klekotanie popychacze hydrauliczne szklanki luz zaworowy dzwigienka panewki korbowod tlok klawiszowanie kompresja cisnienie sprezania test mokry uszczelka pod glowica wtryskiwacz 6.5 noise knock tick lifter',
    symptoms: ['halasy'],
    sections: [
      {
        heading: 'Cztery kroki',
        items: [
          'Nazwij rodzaj dźwięku: stuk, tykanie, klekot, pisk.',
          'Ustal warunki: zimny czy ciepły silnik, jałowy, pod obciążeniem, przy jakich obrotach.',
          'Ustal częstotliwość i miejsce (z przodu, z góry, z dołu silnika).',
          'Porównaj z dobrym silnikiem tego samego typu — część dźwięków jest normalna.',
        ],
      },
      {
        heading: 'Wał czy wałek? Prosty test lampą stroboskopową',
        items: [
          'Podłącz lampę stroboskopową i słuchaj w rytmie błysków.',
          'Dwa stuki na jeden błysk → hałas z prędkością wału korbowego: panewki główne lub korbowodowe, tłok/cylinder, sworzeń, korbowód, nagar w komorze.',
          'Jeden stuk na błysk → hałas z prędkością wałka rozrządu: rozrząd zaworowy — dźwigienki, popychacze, sprężyny, zawory, krzywki wałka, łańcuch rozrządu.',
          'Lekkie „klawiszowanie” tłoka na zimno jest dopuszczalne, jeśli znika po rozgrzaniu (wg GM: w ciągu ok. 1,5 minuty).',
        ],
      },
      {
        heading: 'Stuk na zimnym silniku — co jeszcze sprawdzić',
        items: [
          'Koło zamachowe ocierające o osłonę, luźny tłumik drgań lub koła pasowe.',
          'Luz tłoka w cylindrze, krzywy korbowód, luz sworznia, luz osiowy wału, luzy panewek.',
          'Zła lepkość oleju.',
          'Spalanie stukowe (detonacja) — sprawdź sterowanie zapłonem i obwód czujnika spalania stukowego.',
          'Luźne śruby przekładni hydrokinetycznej (konwertera) i nieszczelność kolektora wydechowego.',
        ],
      },
      {
        heading: 'Rozrząd zaworowy: tabela objawów',
        intro: 'Lekkie tykanie z połową prędkości obrotowej, narastające z obrotami. Oceniaj na rozgrzanym silniku, z fotela kierowcy, przy zamkniętej masce.',
        items: [
          'Tykanie przez 1–2 minuty po rozruchu — normalne: popychacze hydrauliczne napełniają się olejem.',
          'Tylko chwilami, tylko na jałowym → zabrudzony lub uszkodzony zaworek kulkowy popychacza.',
          'Na wolnym jałowym albo przy gorącym oleju → za szybki upust oleju z popychacza (zużyty popychacz).',
          'Popychacze głośne przy wysokich obrotach → za dużo oleju (pienienie) albo za mało (zasysanie powietrza), wgnieciona miska dotykająca smoka, problem z sitkiem pompy.',
          'Tykanie narastające do ok. 1500 obr/min (ok. 16–24 km/h na biegu L albo 48–56 km/h na D) → zużyty koniec trzonka zaworu lub stopka dźwigienki, luz trzonka w prowadnicy, bicie gniazda lub grzybka, krzywa sprężyna (wymień, jeśli odchyłka przekracza 1,6 mm).',
          'Hałas zaworów przy każdej prędkości → najpierw luz zaworowy, końcówka i prostość drążka popychacza, smarowanie, dźwigienka; dopiero potem popychacz i wałek.',
          'Inne przyczyny z listy GM: niskie ciśnienie oleju, luźne dźwigienki, pęknięta sprężyna, zawieszające się zawory, zużyte prowadnice, wypadnięte klinki.',
        ],
      },
      {
        heading: 'Diesel 6.5 TD',
        items: [
          'Zawieszona końcówka wtryskiwacza potrafi stukać jak korbowód. Wykonaj test równomierności cylindrów testerem albo przełóż podejrzany wtryskiwacz na sąsiedni cylinder i sprawdź, czy stuk „poszedł” za nim.',
          'Grzechotanie od spodu: sprawdź wieszaki i obejmy wydechu.',
          'Prędkość rozruchowa (mierzona testerem po wyjęciu bezpiecznika elektrozaworu paliwa): co najmniej 100 obr/min na zimno i 180 obr/min na ciepło.',
        ],
      },
      {
        heading: 'Próba ciśnienia sprężania (benzyna)',
        items: [
          'Odłącz cewkę zapłonową i wtryskiwacze, wykręć wszystkie świece, przepustnica szeroko otwarta, akumulator naładowany; po 4 suwy na cylinder.',
          'Najniższy cylinder powinien mieć co najmniej 70 % wartości najwyższego i żaden nie mniej niż 690 kPa. Przykład: najwyższy 1035 kPa → minimum ok. 725 kPa.',
          'Próba „na mokro”: ok. 15 ml oleju do cylindra. Pierścienie: nisko przy pierwszym suwie, potem rośnie i wyraźnie poprawia się z olejem. Zawory: nisko, nie rośnie, olej nie pomaga.',
          'Dwa sąsiednie cylindry nisko i olej nie pomaga → uszczelka pod głowicą między nimi.',
        ],
        warn: 'Diesel 6.5 TD: nie wlewaj oleju do cylindra przy próbie — grozi uszkodzeniem silnika.',
      },
      {
        heading: 'Próba ciśnienia sprężania (6.5 TD)',
        items: [
          'Wykręć świece żarowe, po 6 suwów na cylinder, bez oleju.',
          'Normalnie ok. 2625–2760 kPa; żaden cylinder poniżej 2625 kPa, najniższy co najmniej 80 % najwyższego.',
        ],
      },
    ],
    sources: [
      { doc: SM98, pages: 's. 6-30–6-34 (4.3 L), 6-246–6-250 (5.0/5.7 L), 6-462–6-463 (6.5 L), 6-694–6-699 (7.4 L)' },
    ],
  },
  {
    slug: 'zuzycie-oleju-wycieki',
    title: 'Ubywa oleju: zużycie, ciśnienie oleju i szukanie wycieków (wg GM)',
    summary: 'Kiedy zużycie oleju jest za duże (1,9 l na 3200 km), jak sprawdzić ciśnienie oleju manometrem i jak znaleźć wyciek: papier, puder, barwnik UV.',
    scope: 'Silniki 4.3 / 5.0 / 5.7 / 7.4 L i 6.5 TD (procedury GM 1998).',
    keywords: 'zuzycie oleju bierze olej ubywa oleju pali olej ciśnienie oleju cisnienie oleju manometr kontrolka oleju czujnik cisnienia wyciek oleju plama barwnik uv puder pcv odma uszczelniacze zaworow pierscienie oil consumption leak pressure',
    symptoms: ['wycieki', 'paliwo-dym'],
    sections: [
      {
        heading: 'Kiedy zużycie oleju jest „za duże”',
        items: [
          'GM uznaje za nadmierne zużycie powyżej 1,9 l oleju na 3200 km — gdy nie ma wycieków zewnętrznych.',
          'W czasie docierania nowego silnika (pierwsze ok. 4800–6400 km) zużycie może być wyższe.',
          'Przyczyny według kolejności z podręcznika: wycieki zewnętrzne, zły odczyt poziomu (auto nie stoi poziomo, za krótko po zgaszeniu), zła lepkość, jazda z dużą prędkością lub w ciężkich warunkach, zatkana wentylacja skrzyni korbowej (PCV), zużyte prowadnice lub uszczelniacze zaworów, pierścienie, niewłaściwy tłok.',
          'Świeca zalana olejem → wykonaj próbę sprężania: pomoże odróżnić zawory i uszczelniacze od pierścieni.',
        ],
      },
      {
        heading: 'Ciśnienie oleju — kolejność sprawdzania',
        items: [
          'Auto na równym podłożu; po zgaszeniu odczekaj 2–3 minuty (diesel 6.5: ok. 15 minut), sprawdź i uzupełnij do pełna.',
          'Uruchom, obserwuj wskaźnik lub kontrolkę i nasłuchuj stuków.',
          'Sprawdź olej: czy nie jest rozrzedzony wilgocią lub paliwem, czy lepkość jest właściwa. Potem czujnik ciśnienia, wskaźnik, zatkany filtr i jego zawór obejściowy.',
          'Jeśli dalej wygląda źle — wkręć mechaniczny manometr w miejsce czujnika i zmierz rzeczywiste ciśnienie.',
          'Niskie ciśnienie na manometrze: zużyta lub zabrudzona pompa oleju, zawór regulacyjny, sitko smoka, luzy panewek, zatkane kanały olejowe, brakujące lub nieszczelne korki kanałów, pęknięte popychacze.',
          'W 6.5 TD dodatkowo: śruby mocowania pompy do bloku, oring sitka, dysze olejowe chłodzące tłoki.',
        ],
      },
      {
        heading: 'Jak znaleźć wyciek',
        items: [
          'Oględziny: rozgrzej silnik, postaw auto nad czystym papierem i sprawdź, gdzie kapie. Zapach i kolor pomagają odróżnić olej od innych płynów.',
          'Umyj okolicę wycieku, przejedź kawałek i obejrzyj ponownie — świeży ślad pokaże źródło.',
          'Puder: posyp suchy, czysty obszar, przejedź się — wyciek zostawi ślad na pudrze.',
          'Barwnik UV: dodaj barwnik do oleju, jedź, a potem oświetl silnik lampą UV — źródło świeci.',
          'Typowe przyczyny: za wysoki poziom lub ciśnienie płynu, zatkany filtr lub zawór obejściowy, zatkana PCV, luźne lub źle dokręcone śruby, pęknięte lub porowate elementy, zła masa uszczelniająca lub uszczelka, zużyte uszczelniacze i powierzchnie pod nimi.',
        ],
      },
      {
        heading: 'Płyn chłodzący ubywa bez śladów?',
        items: ['Przy wypadaniu zapłonów GM każe sprawdzić też zużycie płynu chłodzącego: wycieki zewnętrzne, uszczelka pod głowicą, pęknięta lub krzywa głowica, uszkodzony blok.'],
      },
    ],
    sources: [
      { doc: SM98, pages: 's. 6-30–6-31, 6-35–6-36 (4.3 L), 6-251–6-252 (5.0/5.7 L), 6-464–6-465 (6.5 L), 6-700–6-701 (7.4 L)' },
    ],
  },
  {
    slug: 'pasek-osprzetu',
    title: 'Pasek osprzętu: ćwierkanie, pisk, wycie, spadający pasek (wg GM)',
    summary: 'Rozróżnij ćwierkanie (zbieżność kół), pisk (poślizg pod obciążeniem) i wycie (łożysko). Co sprawdzić, gdy pasek drga albo spada.',
    scope: 'Pasek wieloklinowy (serpentynowy) — silniki 4.3 / 5.0 / 5.7 / 7.4 L i 6.5 TD.',
    keywords: 'pasek osprzetu pasek wieloklinowy serpentynowy pisk piszczy cwierkanie cwierka wycie spada pasek napinacz rolka kolo pasowe alternator wspomaganie klimatyzacja sprzeglo wiskotyczne wentylator belt chirp squeal whine',
    symptoms: ['halasy'],
    sections: [
      {
        heading: 'Jaki to dźwięk',
        items: [
          'Ćwierkanie (chirp): krótki, wysoki dźwięk raz na obrót koła pasowego, zwykle w zimne, wilgotne poranki. Spryskanie paska wodą na chwilę je ucisza.',
          'Pisk (squeal): pasek ślizga się pod obciążeniem — przy załączeniu klimatyzacji, gwałtownym gazie albo gdy koło pasowe się zacina.',
          'Wycie (whine): to nie pasek, tylko łożysko któregoś podzespołu lub rolki.',
          'Dudnienie (rumble) raz na obrót paska: często kulki gumy w rowkach koła (pilling). Odrobina jest normalna; problem, gdy wypełniają ponad 1/3 głębokości rowka.',
        ],
      },
      {
        heading: 'Co sprawdzić — w tej kolejności',
        items: [
          'Ćwierkanie: współosiowość kół pasowych, wsporniki, śruby mocujące, kołnierz koła pasowego, kulki gumy w rowkach; dopiero na końcu wymiana paska.',
          'Pisk: współosiowość, długość paska, napinacz, rozmiar koła pasowego, zatarte łożysko.',
          'Drgania: śruby mocujące, łopatki wentylatora, krzywe sprzęgło wentylatora lub wałek pompy wody, wsporniki.',
          'Pasek spada: współosiowość, wsporniki, śruby, koło pompy wspomagania, uszkodzony pasek, napinacz, łożyska rolki i napinacza.',
          'Liczba żeberek paska musi pasować do rowków kół. Wskaźnik na napinaczu pokazuje zakres dla nowego i dla używanego paska — poza zakresem: zły pasek albo zużyty napinacz.',
        ],
      },
    ],
    sources: [
      { doc: SM98, pages: 's. 6-37–6-40 (4.3 L), 6-253–6-255 (5.0/5.7 L), 6-466–6-469 (6.5 L), 6-702–6-703 (7.4 L)' },
    ],
  },
  {
    slug: 'detonacja-dieseling',
    title: 'Detonacja (stuki przy przyspieszaniu), dieseling i strzały — lista kontrolna GM',
    summary: 'Metaliczne „dzwonienie” pod gazem, silnik pracujący po wyłączeniu zapłonu, strzały w dolocie lub wydechu. Kolejność kontroli z podręczników GM 1992–1998.',
    scope: 'Silniki benzynowe 4.3 / 5.0 / 5.7 / 7.4 L: TBI (1988–1995) i Vortec (1996–1999).',
    keywords: 'detonacja spalanie stukowe stuki przy przyspieszaniu dzwonienie metaliczne stuki pinging spark knock oktany liczba oktanowa benzyna 98 czujnik spalania stukowego knock sensor esc nagar dieseling run on silnik pracuje po wylaczeniu zaplonu wtryskiwacz cieknie tbi backfire strzaly w wydech strzela w gaznik',
    symptoms: ['halasy', 'szarpie-gasnie'],
    sections: [
      {
        heading: 'Detonacja: co to jest',
        intro: 'Od lekkiego do mocnego „dzwonienia”, zwykle gorszego przy przyspieszaniu — ostre, metaliczne stuki, które zmieniają się razem z otwarciem przepustnicy. Upewnij się najpierw, że to faktycznie problem, a nie normalny odgłos.',
        items: [
          'Chłodzenie: przegrzewanie, niski poziom płynu, luźny pasek, zatkana chłodnica (przepływ powietrza lub płynu), zły lub niewłaściwy termostat, zły skład płynu — ma być 50/50 płyn i woda.',
          'Czujnik temperatury płynu (ECT/CTS), który „przesunął się” i zaniża odczyt.',
          'Mieszanka uboga: w jeździe z prędkością, przy której stuka, długoterminowa korekta (LTFT / BLM) powyżej 150 jednostek.',
          'Ciśnienie paliwa, jakość paliwa i liczba oktanowa.',
          'Świece: właściwa wartość cieplna i przerwa. Działanie czujnika spalania stukowego (KS / ESC). Ustawienie zapłonu.',
          'Nagar w komorach spalania — GM zaleca środek do czyszczenia górnej części silnika (wg instrukcji na opakowaniu). Próba sprężania.',
          'Zawór EGR, punkty zmiany biegów, sprzęgło konwertera (TCC), przełącznik zakresu skrzyni, aktualizacja oprogramowania sterownika (PROM) z biuletynów serwisowych.',
          'W starszych autach (TBI) także: działanie podgrzewania powietrza dolotowego (THERMAC / dolot), zbyt dużo oleju dostającego się do komory spalania, niewłaściwe części silnika (wałek, głowice, tłoki).',
          'TBI: jeśli tylko jeden wtryskiwacz rozpyla paliwo, zamień ich wtyczki. Problem został przy wtryskiwaczu → wtryskiwacz; przeszedł z wtyczką → obwód sterowania.',
        ],
      },
      {
        heading: 'Paliwo',
        items: [
          'Gdy odczyty testera są prawidłowe i mechanika jest sprawna, GM każe zatankować benzynę premium o liczbie oktanowej co najmniej 92 i ocenić auto ponownie.',
          'Uwaga: w USA liczba oktanowa na dystrybutorze to średnia (RON+MON)/2 — jest o kilka punktów niższa niż europejska RON. 92 w skali USA odpowiada mniej więcej RON 96–97, więc w Polsce sięgnij po „98”, a nie „95”.',
        ],
      },
      {
        heading: 'Dieseling (silnik pracuje po wyłączeniu zapłonu)',
        items: [
          'Objaw: po przekręceniu kluczyka silnik dalej pracuje, ale bardzo nierówno. Jeśli pracuje równo — to nie dieseling, tylko stacyjka lub jej regulacja.',
          'Sprawdź układ EVAP (pochłaniacz par) i odpowietrzenie zbiornika paliwa.',
          'Sprawdź, czy wtryskiwacze nie cieką. W TBI: podaj 12 V na złącze testowe pompy paliwa, żeby zbudować ciśnienie, i obejrzyj, czy z wtryskiwaczy nie kapie.',
          '7.4 L (1994–1995): sprawdź też siłownik regulacji biegu jałowego.',
        ],
      },
      {
        heading: 'Strzały w dolot lub wydech (backfire)',
        items: [
          'Napięcie wyjściowe cewki (tester iskry), świece, ustawienie zapłonu.',
          'Przeskok iskry między przewodami: kopułka, przewody świec i ich prowadzenie.',
          'Mechanika: sprężanie, rozrząd, uszczelki kolektorów, zawieszające się lub nieszczelne zawory.',
          'Zawór zwrotny układu AIR, zawór EGR stale otwarty, nadlewki odlewnicze lub inne przewężenia w kolektorach.',
        ],
      },
    ],
    sources: [
      { doc: SM98, pages: 's. 6-1467–6-1468, 6-1474 (4.3 L), 6-2074–6-2075, 6-2080 (5.0/5.7 L)' },
      { doc: X9236, pages: 's. 2-10–2-11, 2-18–2-19' },
      { doc: NATP, pages: 'PDF s. 41–42, 49' },
      { doc: CK2, pages: 'PDF s. 40–41, 48' },
    ],
  },
  {
    slug: 'przydlawienie-falowanie',
    title: 'Przydławienie przy ruszaniu i falowanie mocy na stałym gazie — lista kontrolna GM',
    summary: 'Chwilowy brak reakcji na gaz (hesitation, sag, stumble) i „pompowanie” prędkości na stałym gazie (surge, chuggle): czujniki, paliwo, zapłon, TCC.',
    scope: 'Silniki benzynowe 4.3 / 5.0 / 5.7 / 7.4 L: TBI (1988–1995) i Vortec (1996–1999).',
    keywords: 'przydlawienie przyduszenie zawahanie dziura przy dodawaniu gazu zamula przy ruszaniu hesitation sag stumble falowanie pompowanie szarpanie na stalym gazie tempomat surge chuggle tcc sprzeglo konwertera vss sonda o2 krzem korekta paliwa tps map pochlaniacz evap',
    symptoms: ['szarpie-gasnie'],
    sections: [
      {
        heading: 'Przydławienie (hesitation, sag, stumble)',
        intro: 'Chwilowy brak reakcji po wciśnięciu gazu — przy dowolnej prędkości, najmocniej zwykle przy ruszaniu spod świateł. Gdy jest silne, silnik może zgasnąć.',
        items: [
          'Ciśnienie paliwa — także zaraz po zimnym rozruchu i przy mocnym przyspieszaniu. Spadek poniżej specyfikacji = słabnąca pompa albo przewężenie w układzie paliwa.',
          'Czujnik przepustnicy (TPS): nie może się zacinać; napięcie ma rosnąć równo aż do pełnego otwarcia.',
          'Czujnik MAP: szybkość reakcji i dokładność.',
          'Woda lub zanieczyszczenia w paliwie.',
          'Przedmuch pochłaniacza par paliwa (canister purge / EVAP).',
          'OBD-II: test cewek i test równomierności wtryskiwaczy.',
          'Zapłon: uszkodzone przewody świec, zalane świece, przerwana masa układu zapłonowego (TBI: obwód 453) lub ustawienie zapłonu.',
          'Dodatkowo: aktualizacja oprogramowania sterownika (PROM) z biuletynów, napięcie ładowania (naprawa, gdy poniżej 9 lub ponad 16 V), działanie EGR.',
        ],
      },
      {
        heading: 'Falowanie (surges, chuggles)',
        intro: 'Moc zmienia się przy stałym gazie albo na tempomacie — auto przyspiesza i zwalnia, choć pedał stoi w miejscu.',
        items: [
          'Najpierw upewnij się, że to nie normalna praca sprzęgła konwertera (TCC) albo załączanie sprężarki klimatyzacji.',
          'Porównaj prędkość z czujnika VSS na testerze z prędkościomierzem (przy skrzyniach elektronicznych mała różnica jest normalna). Sprawdź poziom płynu w skrzyni.',
          'Sonda lambda: zanieczyszczenie krzemem (z paliwa albo od niewłaściwego silikonu) daje biały, mączysty nalot i fałszywie wysoki sygnał „bogatej” mieszanki — sterownik zubaża dawkę i auto źle jeździ. Nigdy nie używaj masy uszczelniającej na wodoszczelnych złączach.',
          'Bogato czy ubogo: jedź z prędkością objawu i patrz na korektę długoterminową — powyżej 150 uboga, poniżej 115 bogata.',
          'Ciśnienie paliwa w chwili objawu, filtr paliwa w przewodzie.',
          'Zapłon: tester iskry, świece (mokre, pęknięte, zużyte, zła przerwa, wypalone elektrody, nagar), czujnik położenia wału (OBD-II) albo ustawienie zapłonu (OBD-I).',
          'Masy sterownika (czyste, dokręcone, na swoich miejscach), napięcie alternatora, przewody podciśnienia (pęknięcia, załamania — wg naklejki emisyjnej pod maską), sporadyczne działanie EGR, działanie TCC.',
        ],
      },
    ],
    sources: [
      { doc: SM98, pages: 's. 6-1465–6-1466, 6-1468–6-1469 (4.3 L), 6-2072–6-2073, 6-2075 (5.0/5.7 L)' },
      { doc: X9236, pages: 's. 2-7, 2-12' },
      { doc: NATP, pages: 'PDF s. 38, 43' },
      { doc: CK2, pages: 'PDF s. 37, 42' },
    ],
  },
];

export const getDiagGuide = (slug: string) => DIAG_GUIDES.find(g => g.slug === slug);
export const guidesForSymptom = (symptomId: string) => DIAG_GUIDES.filter(g => g.symptoms.includes(symptomId));
