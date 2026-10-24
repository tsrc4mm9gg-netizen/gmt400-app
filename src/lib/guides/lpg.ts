import type { Guide } from './types';

export const LPG_GUIDE: Guide = {
  slug: 'lpg',
  title: 'LPG w GMT400 — co wybrać, ile kosztuje, jakie formalności',
  short: 'LPG w GMT400',
  description: 'Instalacja LPG w Chevrolecie/GMC GMT400 (1988–2000): mikser czy sekwencja, zbiornik, koszty w zł, spalanie, przepisy (R67/R115, badanie roczne, garaże podziemne).',
  asOf: '24.10.2026',
  bodies: ['ck-reg', 'ck-ext', 'k1500', 'sierra', 'dually', 'suburban', 'tahoe-4d', 'tahoe-2d', 'yukon'],
  years: '1988–2000',
  engines: 'benzynowe: 4.3, 5.0, 5.7, 7.4 (TBI 1988–95, Vortec/CSFI od 1996); 6.5 TD — nie dotyczy',
  summary: [
    'Mikser (venturi) nad korpusem TBI to sprawdzone rozwiązanie dla TBI 1988–95. Dla Vortec/CSFI od 1996 relacje użytkowników odradzają mikser i wskazują sekwencję (wtrysk gazu).',
    'Gotowego, zweryfikowanego „zestawu pod GMT400” nie znalazłem — dobór (reduktor, listwy wtryskowe, sterownik) robi monter pod konkretny silnik. Szukaj warsztatu, który montował V8 i pokaże zdjęcia.',
    'Orientacyjnie (cennik z 24.10.2026): sekwencja do 8 cylindrów od 5 500 zł (Standard) lub 6 500 zł (Premium). Zbiornik toroidalny 70 L to ok. 283 € w sklepie online (przy opisie: brak towaru 24.10.2026).',
    'Instalacja LPG wymaga badania technicznego co roku (art. 81 ust. 6 PoRD). W garażu podziemnym zasady zależą od wentylacji i czujników (§108 WT budynków) — to nie jest absolutny zakaz.',
    'Żółte tablice zabytkowe i LPG się wykluczają w praktyce (WUOZ Olsztyn: instalacja nie fabryczna blokuje wpis). Zobacz przewodnik o żółtych tablicach.',
  ],
  sections: [
    {
      id: 'wybor', title: 'Mikser czy sekwencja — wybór wg silnika', open: true,
      blocks: [
        { t: 'p', text: 'Na GMT400 występują dwie zasadnicze architektury zasilania benzyną: TBI (centralny wtrysk do korpusu, 1988–95) oraz Vortec z CSFI (centralny wtrysk sekwencyjny z „pająkiem”, od 1996). Od tego zależy typ instalacji LPG. Sprawdź w swoim aucie / manualu, który układ masz (VIN 8. znak = kod silnika; zob. dekoder VIN w serwisie).' },
        { t: 'table', caption: 'Dobór instalacji wg silnika (stan na: 24.10.2026)', head: ['Silnik / lata', 'Co mówią źródła', 'Wniosek'], rows: [
          { cells: ['5.7 L (350) TBI, 1988–95', 'Użytkownik G20 5.7 TBI z LPG: „kein Problem”; poleca mikser Impco (venturi) dla układów gaźnikowych/TBI (22.01.2018). Dystrybutor: mikser montuje się przed przepustnicą; Impco CA300A do ok. 231–337 CID, CA425 do ok. 305–445 CID.', 'Mikser Impco + reduktor; wariant dual-fuel (benzyna/gaz) ze sterownikiem odcinającym wtryski gazu.'], src: ['cf-26433', 'raso-tbi', 'raso-sizing'] },
          { cells: ['5.0 L (305) TBI, 1988–95', 'Pojemność 305 CID mieści się w zakresie CA300A (231–337 CID) i CA425 (305–445 CID) wg dystrybutora. Nie znalazłem relacji z GMT400.', 'Jak 5.7 — dobór mieszacza u dystrybutora; brak zweryfikowanych relacji.'], src: ['raso-sizing'] },
          { cells: ['4.3 L (262) TBI, 1988–95', 'Nie znalazłem zweryfikowanych relacji LPG dla 4.3 w GMT400. Pojemność ok. 262 CID mieści się w zakresie CA300A wg dystrybutora.', 'Brak danych — konsultacja z montażystą.'], src: ['raso-sizing'] },
          { cells: ['7.4 L (454) TBI, 1988–95', 'Pojemność ok. 454 CID jest powyżej zakresu 305–445 CID podanego dla CA425; dystrybutor zaznacza, że przy większych silnikach maksymalne obroty są niższe. Nie znalazłem relacji z GMT400.', 'Brak danych — mikser dobierz wg zaleceń producenta mieszacza.'], src: ['raso-sizing'] },
          { cells: ['5.0 / 5.7 / 7.4 Vortec (CSFI), od 1996', 'Wątek chevy-forum.eu (2018): Vortec „nicht geeignet oder nur mit erheblichem Umbauaufwand” dla venturi. lpgforum.de (Tahoe 5.7 \'99, treść widoczna w wyszukiwarce): venturi nieodpowiedni; źle wywiercone otwory w kolektorze mogą dawać strzały i wypalone wtryskiwacze/zawory; sekwencja STAG300 pasuje, jeśli otwory wykona się poprawnie.', 'Sekwencja (wtrysk gazu). Mikser — tylko świadomie, wg relacji ryzykowny.'], src: ['cf-26433', 'lpgforum-9455', 'cf-1740'] },
          { cells: ['6.5 TD (diesel)', 'Silnik wysokoprężny — instalacje LPG opisane w tym przewodniku dotyczą silników benzynowych.', 'Nie dotyczy.'], src: [] },
        ] },
        { t: 'callout', tone: 'info', title: 'Czego nie znalazłem', text: 'AutoCentrum (opinie LPG) nie ma kategorii dla modeli GMT400 (Tahoe, Suburban, Blazer, Silverado — wpisy dla nowszych generacji). Publicznych wątków Reddit z kosztami LPG w GMT400 nie znalazłem. Grupy na Facebooku wymagają logowania — nie były sprawdzane.', src: ['autocentrum-lpg'] },
      ],
    },
    {
      id: 'zbiornik', title: 'Zbiorniki — toroidalny czy cylindryczny, gdzie się mieści', open: true,
      blocks: [
        { t: 'table', caption: 'Zbiorniki toroidalne 70 L (stan na: 24.10.2026)', head: ['Model', 'Wymiary / masa', 'Uwagi'], rows: [
          { cells: ['LPGwebshop, 70 L toroidalny, 1 otwór, multizawór w zestawie', 'Ø650 × 270 mm, 36 kg brutto, R67-01', '70 L brutto = ok. 56 L użytecznych (80%); do montażu poziomo w miejscu koła zapasowego (wewnątrz, nie pod). Cena 282,78 € z podatkiem; w dniu sprawdzenia „brak w magazynie”.'], src: ['lpgwebshop'] },
          { cells: ['Van Meenen, wewnętrzny toroidalny 70 L', 'Ø680 × 240 mm, ECE 67R01', 'Cena nie została przeze mnie odczytana.'], src: ['vanmeenen'] },
        ] },
        { t: 'callout', tone: 'warn', title: 'Wymiary kosza koła zapasowego GMT400 — nie zweryfikowane', text: 'Nie mam wiarygodnych pomiarów kosza koła zapasowego dla poszczególnych nadwozi (C/K, Suburban, Tahoe, Blazer). Nie podaję „pasuje / nie pasuje”. Zmierz własny kosz (średnica, głębokość) i porównaj z wymiarami zbiornika, zanim cokolwiek zamówisz. Zbiornik cylindryczny — dobiera monter (litraż i średnica wg miejsca).' },
        { t: 'reports', title: 'Co robią użytkownicy (relacje z forów)', items: [
          { date: '29.03.2019', where: 'gmt400.com (Vortec 350, pickup)', text: 'Instalacja dual-fuel zdjęta z Vortec 350 miała podwójne zbiorniki pomiędzy tylnymi podłużnicami ramy, tam gdzie normalnie jest koło zapasowe; mikser/waporyzator przed korpusem przepustnicy; moduł pod deską przełączał paliwa i odcinał sygnał pompy i wtryskiwaczy. Autor: moc −10%, spalanie podobne lub trochę większe; zimne starty nie lubiane.', src: 'g4-44553' },
          { date: '29.03.2019', where: 'gmt400.com (w tym samym wątku)', text: 'Inny użytkownik: \'89 4x4 3/4T z długą skrzynią na propanie — dwa zbiorniki „siodłowe” plus jeden pod skrzynią.', src: 'g4-44553' },
        ] },
        { t: 'callout', tone: 'info', title: 'Suburban / Tahoe / Blazer — brak zweryfikowanej relacji', text: 'Nie znalazłem zweryfikowanej relacji o miejscu zbiornika w Suburbanie, Tahoe ani Blazerze. Poproś montera o zdjęcia podobnych aut i o pomiar kosza koła zapasowego w Twoim egzemplarzu.' },
      ],
    },
    {
      id: 'zawory', title: 'Smarowanie zaworów (Flashlube) i typowe problemy', blocks: [
        { t: 'p', text: 'LPG nie ma właściwości smarnych benzyny. Producent Flashlube opisuje płyn Valve Saver jako dozowany do dolotu, tworzący film między grzybkiem a gniazdem zaworu; według dystrybutorów jest przeznaczony m.in. do silników bez hartowanych gniazd. To dodatek ochronny — nie naprawi już wypalonego zaworu.', src: ['flashlube'] },
        { t: 'callout', tone: 'warn', title: 'Czy twoje gniazda są hartowane?', text: 'Nie znalazłem zweryfikowanego źródła, które stwierdza, czy głowice konkretnych silników GM z GMT400 (TBI vs Vortec, różne lata) mają hartowane gniazda. Nie twierdzę ani „potrzebny”, ani „zbędny” — zapytaj warsztat silnikowy lub producenta głowic. Sprawdź w swoim aucie / manualu.' },
        { t: 'reports', title: 'Typowe problemy z relacji użytkowników', items: [
          { date: '29.03.2019', where: 'gmt400.com', text: 'Krótkie dystanse dawały skroplinę, rdzę i zatarty zawór wydechowy (autor wiąże to z pracą na gazie).', src: 'g4-44553' },
          { date: 'brak daty', where: 'lpgforum.de (Tahoe 5.7 \'99)', text: 'Źle wywiercone otwory w kolektorze: strzały w dolot, wypalone wtryskiwacze benzyny/zawory.', src: 'lpgforum-9455' },
          { date: '22.01.2018', where: 'chevy-forum.eu', text: 'Awarie przypisywane zbyt ubogiej mieszance (mikser źle ustawiony).', src: 'cf-26433' },
        ] },
        { t: 'check', title: 'Patenty z wątków (traktuj jako opinie, nie normy)', items: [
          { text: 'Układ dual-fuel zachowuje benzynę: moduł przełącza paliwa i odcina wtryski/pompę benzyny na gazie. Autor wątku nie lubił zimnych startów na gazie.', src: ['g4-44553'] },
          { text: 'Przy mikserze: nie ustawiać zbyt ubogiej mieszanki — to była przyczyna awarii w relacji z 2018.', src: ['cf-26433'] },
          { text: 'Przy Vortec: sekwencja i staranne wykonanie otworów w kolektorze — bez tego ryzyko strzałów.', src: ['lpgforum-9455'] },
        ] },
      ],
    },
    {
      id: 'koszty', title: 'Koszty (zł) i spalanie (l/100 km)', open: true,
      blocks: [
        { t: 'table', caption: 'Cennik montażu i serwisu — jeden warsztat (Autogaz Grajewo), stan na: 24.10.2026', head: ['Pozycja', 'Cena'], rows: [
          { cells: ['Instalacja sekwencyjna 8-cyl., Standard', 'od 5 500 zł'], src: ['grajewo'] },
          { cells: ['Instalacja sekwencyjna 8-cyl., Premium', 'od 6 500 zł'], src: ['grajewo'] },
          { cells: ['Instalacja sekwencyjna 6–8 cyl. (wiersz cennika)', 'od 4 800 zł'], src: ['grajewo'] },
          { cells: ['Regulacja instalacji', '150 zł'], src: ['grajewo'] },
          { cells: ['Wymiana filtrów', '100 zł'], src: ['grajewo'] },
          { cells: ['Wymiana reduktora', '350 zł'], src: ['grajewo'] },
          { cells: ['Wymiana zbiornika', '650 zł (950 zł z multizaworem)'], src: ['grajewo'] },
        ] },
        { t: 'callout', tone: 'conflict', title: 'Rozbieżność w cenniku', text: 'Cennik podaje „od 4 800 zł” dla 6–8 cylindrów i „od 5 500 zł” dla 8 cylindrów Standard — to ceny minimalne dla różnych pozycji; zapytaj o wycenę dla swojego silnika. To cennik jednego warsztatu, nie średnia rynkowa. Koszty montażu mikserów dla TBI nie zostały przeze mnie zweryfikowane (wątek z 2019 podaje „$400 new” dla zestawu aftermarket — to wartość z forum USA, bez kosztów w PL).', src: ['grajewo', 'g4-44553'] },
        { t: 'table', caption: 'Opłaty urzędowe związane z LPG (stan na: 24.10.2026)', head: ['Pozycja', 'Kwota', 'Uwagi'], rows: [
          { cells: ['Badanie techniczne roczne z LPG', '149 zł + 96 zł = 245 zł', 'Wg tabeli opłat: badanie okresowe osobowego 149 zł oraz pozycja „pojazd przystosowany do zasilania gazem (za badanie specjalistyczne)” 96 zł. Potwierdź w SKP, czy doliczają obie.'], src: ['badania-oplaty'] },
        ] },
        { t: 'reports', title: 'Spalanie — relacje użytkowników (dane z forów, nie normy)', items: [
          { date: '08.2013', where: 'chevy-forum.eu — Tahoe 5.7 MY99', text: 'Benzyna: 12,5–13,8 l/100 km przy 100–120 km/h. LPG: 15,6 l/100 km przy 89–105 km/h. Inni: ok. 22 l w mieście i 18 l w trasie.', src: 'cf-17330' },
          { date: '11.2013', where: 'roadrunners.pl', text: 'Spalanie w mieście „do 25 l”; Avalanche 5.3 (GMT800, nie GMT400) 19–21 l LPG.', src: 'rr-3089' },
          { date: '29.03.2019', where: 'gmt400.com (Vortec 350)', text: 'Moc o ok. 10% niższa, spalanie podobne lub trochę większe niż na benzynie.', src: 'g4-44553' },
        ] },
        { t: 'p', text: 'Cenę LPG za litr sprawdź na bieżąco na stacji — nie podaję wartości bez aktualnego źródła, więc nie liczę tu „kosztu 100 km”. Przelicz: l/100 km × aktualna cena za litr.' },
      ],
    },
    {
      id: 'prawo', title: 'Przepisy: homologacja, badanie, garaże', blocks: [
        { t: 'list', items: [
          { text: 'Po montażu dostajesz: wyciąg ze świadectwa homologacji (R67 dla elementów, R115 dla kompletnej instalacji), świadectwo zbiornika oraz fakturę. Zmianę zgłaszasz w wydziale komunikacji w ciągu 30 dni („GAZ” w dowodzie). Zbiornik wymaga decyzji TDT (wg STAG).', src: ['stag', 'tdt-faq', 'lpg-homolog'] },
          { text: 'Rozporządzenie MI z 12.09.2023 opisuje homologację montażu dodatkowej instalacji zasilania gazem, w tym świadectwo R115 i tabliczkę informacyjną montażysty.', src: ['lpg-homolog'] },
          { text: 'Badanie techniczne: pojazdy z LPG badane są co roku (art. 81 ust. 6 PoRD). Montaż LPG nie wymaga dodatkowego badania (art. 81 ust. 11 pkt 3).', src: ['pord'] },
          { text: 'Garaż podziemny: §108 ust. 1 pkt 4 WT budynków pozwala na pojazdy z LPG tylko przy wentylacji mechanicznej sterowanej czujnikami propanu-butanu i z informacją przy wjeździe — to nie jest zakaz bezwzględny. Zarządca/wspólnota może mieć własne zasady.', src: ['garaz-wt', 'samar'] },
          { text: 'Zabytek (żółte tablice): bez badań okresowych (art. 81 ust. 10), ale w praktyce WUOZ może nie wpisać auta z niefabrycznym LPG.', src: ['pord', 'wuoz-olsztyn'] },
        ] },
        { t: 'callout', tone: 'legal', title: 'Przepisy się zmieniają — sprawdź w urzędzie', text: 'Opisy pochodzą z tekstów z 24.10.2026. Wymagania dla konkretnego auta potwierdź w stacji kontroli pojazdów (SKP) lub wydziale komunikacji.' },
      ],
    },
  ],
  mistakes: [
    'Montaż miksera (venturi) w Vortec/CSFI bez konsultacji — relacje mówią o strzałach i wypalonych zaworach.',
    'Zamówienie zbiornika bez zmierzenia kosza koła zapasowego własnego auta.',
    'Brak zgłoszenia zmiany w wydziale komunikacji po montażu (30 dni).',
    'Założenie, że „gaz = bez problemów w garażu podziemnym” — sprawdź regulamin garażu i wentylację.',
    'Montaż LPG w aucie, które chcesz zarejestrować na żółte tablice — to się wyklucza.',
  ],
  faq: [
    { q: 'Czy LPG jest możliwe w 6.5 TD?', a: 'Nie. To silnik wysokoprężny; opisane tu instalacje LPG dotyczą silników benzynowych.' },
    { q: 'Jak często badanie z LPG?', a: 'Co roku (art. 81 ust. 6 PoRD). Opłata: 149 zł + 96 zł = 245 zł (Dz.U. 2025 poz. 1223).', src: ['pord', 'badania-oplaty'] },
    { q: 'Mikser czy sekwencja do TBI?', a: 'Relacje i dystrybutor wskazują mikser (Impco) dla TBI; dla Vortec — sekwencja. Szczegóły w tabeli powyżej.', src: ['cf-26433', 'raso-tbi'] },
    { q: 'Czy zbiornik zmieści się w koszu koła zapasowego?', a: 'Nie ma zweryfikowanych pomiarów dla GMT400. Toroid 70 L ma Ø650–680 mm i 240–270 mm wysokości — zmierz własny kosz.', src: ['lpgwebshop', 'vanmeenen'] },
  ],
  related: ['zolte-tablice', 'import'],
  keywords: ['lpg', 'gaz', 'instalacja gazowa', 'impco', 'stag', 'zbiornik toroidalny', 'sekwencja', 'mikser', 'flashlube', 'r115', 'r67'],
};
