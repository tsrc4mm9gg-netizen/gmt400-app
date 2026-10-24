import type { Guide } from './types';

export const IMPORT_GUIDE: Guide = {
  slug: 'import',
  title: 'Sprowadzenie i rejestracja GMT400 z USA/UE — opłaty i procedura 2026',
  short: 'Import i rejestracja z USA/UE',
  description: 'Cło, akcyza, VAT, badanie, tłumaczenia, opłaty rejestracyjne, termin 30 dni i kara — wraz z kalkulatorem (orientacyjnie). Trasa USA→DE/NL→PL, zabytek CN 9705.',
  asOf: '24.10.2026',
  bodies: ['ck-reg', 'ck-ext', 'k1500', 'sierra', 'dually', 'suburban', 'tahoe-4d', 'tahoe-2d', 'yukon'],
  years: '1988–2002',
  summary: [
    'Auto z USA: cło + akcyza + VAT liczone od wartości celnej (cena + transport/ubezpieczenie do granicy UE). Od 1.07.2026 cło na osobowe (CN 8703) z pochodzeniem USA to 0% (rozp. UE 2026/1455), ale potrzebny jest dowód pochodzenia; inaczej 10%.',
    'Akcyza (tylko CN 8703 — osobowe): 18,6% przy pojemności powyżej 2000 cm³ (czyli praktycznie każdy GMT400 benzynowy), 3,1% do 2000 cm³. Podstawa: wartość celna + cło.',
    'VAT 23% od: wartość celna + cło + akcyza. Opłata recyklingowa — zniesiona od 1.01.2016 (nie płacisz jej; część portali wciąż błędnie ją wymienia).',
    'Rejestracja: 30 dni od sprowadzenia. Kara za spóźnienie: 500 zł, a przy opóźnieniu ponad 180 dni — 1000 zł (art. 140mb PoRD). Opłaty urzędowe: ok. 160 zł (dowód 54 + tablice 80 + pozwolenie czasowe 13,50 + nalepki 12,50).',
    'Pickup (N1, CN 8704) to inna taryfa: bez akcyzy (akcyza dotyczy tylko 8703), cło wg taryfy ok. 22% (nie zweryfikowane przeze mnie w ISZTAR4) — a klasyfikacja zależy od konstrukcji, nie od słowa „pickup”. Zabytek (CN 9705): cło 0%, VAT 8%, bez akcyzy — o kwalifikacji decyduje urząd celny.',
    'Wyliczenia poniżej są orientacyjne — sprawdź w urzędzie. Przepisy się zmieniają.',
  ],
  sections: [
    {
      id: 'kalkulator', title: 'Kalkulator kosztów (orientacyjnie)', open: true,
      blocks: [
        { t: 'calc' },
      ],
    },
    {
      id: 'oplaty', title: 'Wszystkie opłaty i podatki — tabela', open: true,
      blocks: [
        { t: 'table', caption: 'Podatki i cło przy imporcie spoza UE (stan na: 24.10.2026)', head: ['Pozycja', 'Stawka', 'Podstawa / uwagi'], rows: [
          { cells: ['Cło — osobowy (CN 8703 24 90), pochodzenie USA z dowodem', '0% od 1.07.2026 do 31.12.2029', 'Rozporządzenie UE 2026/1455. Pochodzenie = kraj produkcji, nie kraj zakupu. Dowód pochodzenia (wg nazysk.pl: kod 300 / U190). USA oznacza VIN zaczynający się od 1, 4 lub 5; 2 (Kanada) i 3 (Meksyk) — nie objęte tą preferencją.'], src: ['agc', 'log24', 'nazysk', 'origin-pl'] },
          { cells: ['Cło — osobowy, bez dowodu pochodzenia USA', '10% wartości celnej', 'Stawka zasadnicza dla 8703 24 90 (przytaczana m.in. przez agencję celną). Zweryfikuj swój kod w ISZTAR4.'], src: ['agc', 'isztar'] },
          { cells: ['Cło — pickup/ciężarowy N1 (CN 8704 31 39)', '22%', 'Stawka zasadnicza wg taryfy — NIE zweryfikowana w ISZTAR4 przez serwis; sprawdź kod. Nie wiem, czy preferencja USA od 1.07.2026 obejmuje 8704.'], src: ['isztar', 'pickup-mf'] },
          { cells: ['Akcyza — osobowy powyżej 2000 cm³', '18,6%', 'Podstawa przy imporcie: wartość celna + cło (+ transport do pierwszego miejsca w PL). Dotyczy tylko CN 8703.'], src: ['akcyza-stawki', 'akcyza-ustawa'] },
          { cells: ['Akcyza — osobowy do 2000 cm³', '3,1%', 'Hybrydy: 9,3% (>2000 cm³) i 1,55% (do 2000 cm³).'], src: ['akcyza-stawki'] },
          { cells: ['VAT (import)', '23% (8% dla CN 9705)', 'Podstawa: wartość celna + cło + akcyza (art. 30b ust. 1 ustawy o VAT).'], src: ['vat-30b', 'cn9705-granica'] },
          { cells: ['Opłata recyklingowa', '0 zł', 'Zniesiona 1.01.2016 (Dz.U. 2015 poz. 933); wymagana tylko dla pojazdów sprowadzonych do końca 2015.'], src: ['recykling'] },
        ] },
        { t: 'callout', tone: 'warn', title: 'Podatek VAT w art. 30b — sprawdź aktualne brzmienie', text: 'Treść art. 30b ust. 1, którą widziałem na gofin.pl, jest dla wersji obowiązującej „od 16.06.2025 do 27.09.2026”. Brzmienie po 27.09.2026 sprawdź w ISAP lub u doradcy — nie założyłem zmiany, ale nie potwierdziłem jej braku.', src: ['vat-30b'] },
        { t: 'table', caption: 'Zakup w UE (WNT) — co płacisz w Polsce (stan na: 24.10.2026)', head: ['Pozycja', 'Zasada', 'Uwagi'], rows: [
          { cells: ['Cło', 'brak', 'Towar unijny, bez cła.'], src: ['wnt-vat'] },
          { cells: ['Akcyza (osobowy)', '18,6% / 3,1% od kwoty należnej za auto', 'Deklaracja uproszczona AKC-U/S w urzędzie skarbowym: złóż w ciągu 14 dni od powstania obowiązku; zapłać w ciągu 30 dni (nie później niż w dniu rejestracji).'], src: ['akcyza-stawki', 'puesc-akcyza', 'akc-us', 'agc'] },
          { cells: ['VAT', 'zależnie od transakcji', 'Od osoby prywatnej (auto używane: >6 mies. i >6000 km) — wg portali bez VAT w PL i z VAT-24 przy rejestracji; od firmy — wg faktury. Podstawa WNT obejmuje cło, podatki i koszty transportu. Sprawdź w urzędzie.'], src: ['wnt-vat'] },
        ] },
        { t: 'callout', tone: 'conflict', title: 'Błędne informacje, które krążą', text: '„Cło 10% + VAT 23% i opłata recyklingowa” — to uproszczenie nieaktualne od 2016 (recykling) i od 1.07.2026 (cło 0% dla USA z dowodem). „Pickup = zero akcyzy” — to nie reguła; klasyfikacja zależy od konstrukcji (MF: skrzynia dłuższa niż 50% rozstawu osi to jeden z warunków).', src: ['recykling', 'pickup-mf', 'agc'] },
      ],
    },
    {
      id: 'trasa', title: 'Trasa USA → DE/NL → PL: gdzie odprawić', blocks: [
        { t: 'p', text: 'Auta z USA płyną zwykle do Rotterdamu, Bremerhaven lub Antwerpii. Masz dwie drogi: odprawa w porcie (cło i VAT wg przepisów kraju odprawy) albo tranzyt T1 do polskiego urzędu i jedna odprawa w Polsce. Po odprawie w innym państwie UE w Polsce powstaje jeszcze akcyza WNT (AKC-U/S: 14 dni na deklarację, 30 dni na zapłatę, nie później niż w dniu rejestracji).', src: ['agc'] },
        { t: 'callout', tone: 'info', title: 'Koszty transportu — brak wiarygodnych cen', text: 'Nie znalazłem wiarygodnych, datowanych cen transportu morskiego dla GMT400 (strony przewoźników nie podawały kwot). Kalkulator pobiera transport od ciebie — wpisz kwotę z oferty. Zbieraj minimum 2–3 wyceny.', src: ['agc'] },
        { t: 'check', title: 'Dokumenty do odprawy z USA', items: [
          { text: 'Title (amerykański dowód własności) lub dokument stanowy.', src: ['agc'] },
          { text: 'Bill of sale — faktura z ceną i danymi sprzedającego.', src: ['agc'] },
          { text: 'Konosament (Bill of Lading).', src: ['agc'] },
          { text: 'Dokument T1, jeśli odprawa nie następuje w porcie wejścia do UE.', src: ['agc'] },
          { text: 'Dokument potwierdzający kraj pochodzenia (dla preferencji 0% cła).', src: ['agc'] },
          { text: 'Zgłoszenie celne SAD/PZC w urzędzie celno-skarbowym.', src: ['agc'] },
        ] },
        { t: 'reports', title: 'Przykładowe wyliczenie agencji celnej (nie GMT400)', items: [
          { date: '30.09.2026', where: 'agencjacelna.uk — przykład z danych założonych', text: 'Auto 2200 cm³, wartość celna CIF 20 000 EUR, produkcja USA (cło 0%), akcyza 18,6%: akcyza 3 720 EUR, VAT 23% od 23 720 EUR = 5 455,60 EUR, razem podatki ok. 9 175,60 EUR. Ten sam wzór z cłem 10% (inne pochodzenie): ok. 12 093,16 EUR.', src: 'agc' },
        ] },
        { t: 'p', text: 'Wzór sprawdziłem w kalkulatorze (test automatyczny porównuje wynik z powyższym przykładem). Prawdziwych, datowanych rozliczeń z importu GMT400 z forów w tym przeglądzie nie znalazłem — dlatego nie wklejam „relacji kosztów” bez źródła.' },
      ],
    },
    {
      id: 'procedura', title: 'Rejestracja krok po kroku', open: true,
      blocks: [
        { t: 'check', title: 'Lista kontrolna', items: [
          { text: 'Kup auto i zachowaj dokumenty: Title/dowód rejestracyjny, faktura/umowa, w razie potrzeby kopie przelewów.', src: ['rejestracja-gov'] },
          { text: 'Odprawa celna (spoza UE) lub deklaracja AKC-U/S (z UE) — zapłać akcyzę i zachowaj potwierdzenie.', src: ['puesc-akcyza', 'akc-us'] },
          { text: 'Tłumaczenia przysięgłe dokumentów — nadal wymagane (gov.pl). Amerykański Certificate of Title jest honorowany (art. 72 ust. 2a PoRD).', src: ['rejestracja-gov', 'zarejestruj-gov', 'pord'] },
          { text: 'Pozwolenie czasowe (wydaje wydział komunikacji) — potrzebne do badania technicznego pojazdu niezarejestrowanego w PL.', src: ['rejestracja-gov'] },
          { text: 'Badanie techniczne przed pierwszą rejestracją w PL (art. 81 ust. 3 PoRD): w tym światła (zob. przewodnik o światłach).', src: ['pord'] },
          { text: 'Wniosek o rejestrację w wydziale komunikacji (30 dni od sprowadzenia). Płacisz opłaty urzędowe.', src: ['rejestracja-gov', 'pord'] },
        ] },
        { t: 'table', caption: 'Opłaty urzędowe przy rejestracji (stan na: 24.10.2026)', head: ['Pozycja', 'Kwota'], rows: [
          { cells: ['Dowód rejestracyjny', '54,00 zł'], src: ['oplaty-rej-1', 'oplaty-rej-2', 'rejestracja-rozp'] },
          { cells: ['Tablice (komplet)', '80,00 zł'], src: ['oplaty-rej-1', 'oplaty-rej-2', 'rejestracja-rozp'] },
          { cells: ['Pozwolenie czasowe', '13,50 zł'], src: ['oplaty-rej-1', 'oplaty-rej-2', 'rejestracja-rozp'] },
          { cells: ['Nalepki', '12,50 zł'], src: ['oplaty-rej-1', 'oplaty-rej-2', 'rejestracja-rozp'] },
          { cells: ['Razem standardowo', '160,00 zł (66,50 zł, jeśli zachowujesz ważne tablice)'], src: ['oplaty-rej-1', 'oplaty-rej-2'] },
          { cells: ['Tablice indywidualne', '1 000 zł'], src: ['rejestracja-rozp'] },
          { cells: ['Tablice zabytkowe', '100 zł (razem 180 zł)'], src: ['rejestracja-rozp'] },
          { cells: ['Tablice czasowe', '30 zł'], src: ['rejestracja-rozp'] },
          { cells: ['Opłata ewidencyjna', '0,50 zł za dokument'], src: ['rejestracja-rozp'] },
        ] },
        { t: 'callout', tone: 'conflict', title: 'Konflikt: nowe stawki opłat rejestracyjnych?', text: 'Portal klasyk.pl (24.07.2026) podaje wyższe stawki w obowiązującym stanie (115,50 / 62,50 / 14,50 zł, razem ok. 190 zł). Urzędowe tabele, które sprawdziłem 24.10.2026, pokazują 54 / 80 / 12,50 zł. Projekt podwyżki (RCL nr 12404903: 62,50 / 92,50 / 3 000 zł) jest w wykazie jako niepodpisany. Przyjąłem tabele urzędowe, ale zweryfikuj w swoim wydziale komunikacji przed wizytą.', src: ['klasyk', 'rcl-oplaty', 'oplaty-rej-1'] },
        { t: 'table', caption: 'Opłaty za badania techniczne (Dz.U. 2025 poz. 1223; stan na: 24.10.2026)', head: ['Pozycja', 'Kwota'], rows: [
          { cells: ['Badanie okresowe osobowego do 3,5 t', '149 zł'], src: ['badania-oplaty'] },
          { cells: ['Dodatkowe — po wypadku', '143 zł'], src: ['badania-oplaty'] },
          { cells: ['Dodatkowe — sprawdzenie tożsamości', '91 zł'], src: ['badania-oplaty'] },
          { cells: ['Dodatkowe — zmiany konstrukcyjne', '125 zł'], src: ['badania-oplaty'] },
          { cells: ['Dodatkowe — szkoda istotna', '76 zł'], src: ['badania-oplaty'] },
          { cells: ['Dodatkowe — hak holowniczy', '53 zł'], src: ['badania-oplaty'] },
          { cells: ['LPG (badanie specjalistyczne)', '96 zł'], src: ['badania-oplaty'] },
        ] },
        { t: 'callout', tone: 'info', title: 'Zmiany od 10.06.2026 (Dz.U. 2026 poz. 742)', text: 'Brak konieczności ponownej legalizacji tablic; brak papierowego zaświadczenia z badania, gdy wynik jest w CEPiK; hak wpisywany na podstawie dokumentów; osoby niemające stałego pobytu mogą zarejestrować pojazd czasowo.', src: ['zmiany-2026'] },
        { t: 'table', caption: 'Terminy i kary', head: ['Co', 'Wartość'], rows: [
          { cells: ['Termin rejestracji po sprowadzeniu', '30 dni (art. 73aa PoRD)'], src: ['pord', 'rejestracja-gov'] },
          { cells: ['Kara za spóźnienie', '500 zł; 1 000 zł po 180 dniach (art. 140mb PoRD)'], src: ['pord'] },
          { cells: ['Akcyza WNT — deklaracja / zapłata', '14 dni / 30 dni od powstania obowiązku'], src: ['puesc-akcyza'] },
        ] },
      ],
    },
    {
      id: 'zabytek', title: 'Zabytek (CN 9705) — ulga w cle i VAT', blocks: [
        { t: 'p', text: 'Kolekcjonerski pojazd (CN 9705): 0% cła, VAT 8%, bez akcyzy. Warunki: oryginalny stan bez zasadniczych zmian podwozia, nadwozia, układu kierowniczego, hamulcowego, napędowego, zawieszenia i silnika; wiek co najmniej 30 lat; model nie jest już produkowany — wszystko jednocześnie (alternatywy: udział w historycznym wydarzeniu; pojazdy wyścigowe). O kwalifikacji decyduje urząd celny.', src: ['cn9705-granica', 'cn9705-mf'] },
        { t: 'callout', tone: 'warn', title: 'GMT400: kiedy w ogóle', text: 'Dla GMT400 (1988–2002) pojazd ma 30 lat od 2018 do 2032 (zależnie od rocznika) — kryterium wieku celnego (30 lat) bywa spełnione; kłopot to „oryginalny stan” i to, że auta seryjne bywają kwestionowane. Wpis do ewidencji zabytków (żółte tablice) to osobna procedura, zwykle od 40 lat — zob. przewodnik o żółtych tablicach. Portal klasyk.pl wskazuje, że KAS kwestionuje 9705 dla seryjnych modeli z lat 90.', src: ['klasyk', 'cn9705-granica'] },
      ],
    },
  ],
  mistakes: [
    'Zakup bez sprawdzenia dokumentów odprawy i kraju pochodzenia (decyduje o stawce cła).',
    'Założenie 0% cła bez dowodu pochodzenia USA — wtedy 10% (osobowe).',
    'Zapomnienie o akcyzie 18,6% przy silnikach >2000 cm³ (wszystkie V8 GMT400).',
    'Liczenie opłaty recyklingowej — nie istnieje od 2016.',
    'Kupno z Kanady/Meksyku (VIN zaczynający się od 2/3) i założenie preferencji USA.',
    'Przeoczenie terminu 30 dni (kara 500/1000 zł) i 14-dniowego terminu deklaracji AKC-U/S.',
    'Rejestrowanie bez sprawdzenia świateł (zob. przewodnik) — badanie techniczne ich wymaga.',
  ],
  faq: [
    { q: 'Czy 0% cła dla USA działa na GMT400?', a: 'Jeśli to osobowy (CN 8703) o pochodzeniu USA (produkcja), z dowodem pochodzenia — od 1.07.2026 tak. Suburban/Tahoe zwykle klasyfikuje się jako osobowe; pickup (N1) to osobna sprawa (nie zweryfikowano preferencji dla 8704).', src: ['agc', 'log24'] },
    { q: 'Czy Suburban to osobowy czy ciężarowy?', a: 'To zależy od klasyfikacji w dokumentach i konstrukcji (CN 8703 vs 8704). Nie rozstrzygam — sprawdź w ISZTAR4/KAS lub u agenta celnego.', src: ['isztar', 'pickup-mf'] },
    { q: 'Czy trzeba tłumaczyć dokumenty z USA?', a: 'Tak, tłumaczenie dokumentów jest nadal wymagane wg gov.pl.', src: ['zarejestruj-gov'] },
    { q: 'Ile mam czasu na rejestrację?', a: '30 dni od sprowadzenia; kara 500 zł (1 000 zł po 180 dniach).', src: ['pord'] },
    { q: 'Czy auto z UE ma akcyzę?', a: 'Tak: 18,6% (>2000 cm³) lub 3,1%, deklaracja AKC-U/S (14 dni), zapłata do 30 dni.', src: ['puesc-akcyza', 'akcyza-stawki'] },
  ],
  related: ['swiatla-eu', 'zolte-tablice', 'lpg'],
  keywords: ['import', 'sprowadzenie', 'rejestracja', 'cło', 'akcyza', 'vat', 'USA', 'Niemcy', 'Holandia', 'zabytek', '9705', 'kalkulator', 'opłata recyklingowa', 'tłumaczenie', 'pozwolenie czasowe'],
};
