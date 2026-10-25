import type { Guide } from './types';
import { BODY_STYLES } from '../body-styles';

const AGE_ROWS = BODY_STYLES.map(b => ({
  cells: [b.name, `${b.from}–${b.to}`, `${b.from + 40}–${b.to + 40}`],
  src: ['wuoz-olsztyn'],
}));

export const PLATES_GUIDE: Guide = {
  slug: 'zolte-tablice',
  title: 'Żółte tablice (zabytek) dla GMT400 — kryteria, procedura, koszty',
  short: 'Żółte tablice',
  description: 'Kiedy GMT400 może dostać żółte tablice zabytkowe: kryteria wieku wg województw, procedura krok po kroku, koszty w zł, plusy i minusy (OC, badania, LPG) — z oznaczeniem rozbieżności źródeł.',
  seoTitle: 'Żółte tablice dla Tahoe, Suburban, Silverado — kryteria i koszty',
  seoDescription: 'Kiedy Tahoe, Suburban czy Silverado (GMT400) może dostać żółte tablice zabytkowe: kryteria wieku wg województw, procedura krok po kroku, koszty w zł, OC, badania i LPG — z oznaczeniem rozbieżności źródeł.',
  asOf: '24.10.2026',
  bodies: ['ck-reg', 'ck-ext', 'k1500', 'sierra', 'dually', 'suburban', 'tahoe-4d', 'tahoe-2d', 'yukon'],
  years: '1988–2002',
  summary: [
    'Żółte tablice to nie „wiek 25 lat”: pojazd zabytkowy to taki, który ma wpis do rejestru/ewidencji zabytków (art. 2 pkt 39 PoRD). Decyduje wojewódzki konserwator zabytków na podstawie opinii rzeczoznawcy.',
    'Dla GMT400 problem to wiek: większość urzędów przyjmuje 40 lat (od daty produkcji) dla aut z importu. Czyli rocznik 1988 — dopiero od 2028; 1995 — od 2035; 2000 — od 2040. Młodsze auta tylko wyjątkowo (unikat + opinia rzeczoznawcy).',
    'Dodatkowo: wymagane ≥75% oryginalnych części (w tym główne podzespoły) — WUOZ Olsztyn (zarządzenie z 18.02.2026). LPG założone po fabryce w praktyce blokuje wpis.',
    'Koszt całej ścieżki (wg klasyk.pl, 24.07.2026): ok. 1 000–1 700 zł — rzeczoznawca + biała karta 500–1 200 zł, badanie w OSKP ok. 305 zł (bywa do 700 zł), opłaty urzędowe.',
    'Korzyści: brak okresowych badań (poza użyciem zarobkowym), OC krótkoterminowe ≥30 dni bez ciągłości, zwolnienie ze SCT. Wady: brak LPG, brak użytku zarobkowego, nie można mieć tablic indywidualnych.',
    'Rozbieżności źródeł (progi wieku wg województw, opłaty) są oznaczone poniżej — sprawdź w swoim WUOZ. Przepisy się zmieniają — sprawdź w urzędzie.',
  ],
  sections: [
    {
      id: 'kryteria', title: 'Kryteria: wiek, oryginalność, województwo', open: true,
      blocks: [
        { t: 'p', text: 'Ustawa nie określa minimalnego wieku — to wytyczne wojewódzkich konserwatorów (wpis do wojewódzkiej ewidencji zabytków). Poniżej: kiedy GMT400 osiągnie 40 lat — najczęstszy próg w Polsce.', src: ['pord', 'klasyk', 'rankomat'] },
        { t: 'table', caption: 'GMT400: kiedy 40 lat od produkcji (wg body-styles; stan na: 24.10.2026)', head: ['Nadwozie', 'Lata produkcji', 'Rok, w którym auto ma 40 lat'], rows: AGE_ROWS },
        { t: 'p', text: 'Obliczenie: rok produkcji + 40. Ostateczny wiek liczy WUOZ wg daty produkcji pojazdu — sprawdź w swoim aucie / manualu (tabliczka znamionowa/VIN).' },
        { t: 'table', caption: 'Wymagania wg WUOZ Olsztyn (zarządzenie W-M WKZ 5/2026 z 18.02.2026)', head: ['Kryterium', 'Wartość'], rows: [
          { cells: ['Wiek podstawowy', '≥40 lat, o ile pojazd nie jest produkowany od 20 lat, ma ≥75% oryginalnych części (w tym główne podzespoły) i cechy pojazdu zabytkowego.'], src: ['wuoz-olsztyn'] },
          { cells: ['Wyjątek 25–<40 lat', 'Tylko egzemplarz unikalny (wyjątkowe rozwiązania konstrukcyjne, jednostkowa produkcja), ≥75% oryginału, potwierdzone przez certyfikowanego rzeczoznawcę.'], src: ['wuoz-olsztyn'] },
          { cells: ['Rola wieku', 'Pomocniczy — ostateczną decyzję podejmuje WKZ na podstawie opinii rzeczoznawcy.'], src: ['wuoz-olsztyn'] },
          { cells: ['Karta ewidencyjna ("biała karta")', 'W 2 oryginałach.'], src: ['wuoz-olsztyn'] },
        ] },
        { t: 'table', caption: 'Minimalny wiek wg województw — dwa niezależne zestawienia (stan na: lipiec/sierpień 2026)', head: ['Województwo', 'klasyk.pl (24.07.2026)', 'rankomat.pl (aktualne na 10.08.2026)'], rows: [
          { cells: ['Mazowieckie', '40 lat (import)', '40 lat'], src: ['klasyk', 'rankomat', 'wuoz-mwkz'] },
          { cells: ['Lubelskie', '43 lata (import)', '40 lat'], src: ['klasyk', 'rankomat'] },
          { cells: ['Łódzkie', '50 lat', '40 lat'], src: ['klasyk', 'rankomat'] },
          { cells: ['Podlaskie', '50 lat', '50 lat'], src: ['klasyk', 'rankomat'] },
          { cells: ['Dolnośląskie', '40 lat (+20 od końca produkcji)', '40 lat (+20 od końca produkcji)'], src: ['klasyk', 'rankomat', 'wuoz-wroclaw'] },
          { cells: ['Pomorskie', '40 lat (+15 od końca produkcji)', '40 lat'], src: ['klasyk', 'rankomat', 'wuoz-gdansk'] },
          { cells: ['Śląskie', '40 lat (+25 od końca produkcji)', '40 lat (+25 od końca produkcji)'], src: ['klasyk', 'rankomat'] },
          { cells: ['Wielkopolskie', '40 lat (unikaty 30)', '40 lat (+20, unikaty 30)'], src: ['klasyk', 'rankomat'] },
          { cells: ['Kujawsko-pomorskie', '30 lat', '40 lat (+15 od końca produkcji)'], src: ['klasyk', 'rankomat'] },
          { cells: ['Warmińsko-mazurskie', '—', '40 lat (+20); unikaty 25'], src: ['rankomat', 'wuoz-olsztyn'] },
        ] },
        { t: 'callout', tone: 'conflict', title: 'Rozbieżności źródeł', text: 'klasyk.pl i rankomat.pl podają różne progi dla Lubelskiego (43 vs 40), Łódzkiego (50 vs 40) i Kujawsko-pomorskiego (30 vs 40). To portale wtórne — nie rozstrzygam, które jest aktualne. Obowiązuje wytyczna twojego WUOZ; sprawdź na jego stronie lub zapytaj telefonicznie. Rankomat pisze też, że zmiany wprowadzano niezależnie w latach 2016–2018 oraz 2024–2025.', src: ['klasyk', 'rankomat'] },
        { t: 'callout', tone: 'warn', title: 'Wniosek dla GMT400', text: 'Przy progu 40 lat żółte tablice są realne dopiero od 2028 (pierwsze roczniki 1988) i dla późniejszych roczników odpowiednio później. Wcześniej: tylko jako unikat potwierdzony przez rzeczoznawcę i konserwatora, w WUOZ z taką ścieżką (np. 25–<40 lat w warmińsko-mazurskim). Auto musi mieć ≥75% oryginalnych części; typowe modyfikacje (LPG, zmiana silnika) mogą być przeszkodą.', src: ['wuoz-olsztyn', 'klasyk'] },
      ],
    },
    {
      id: 'procedura', title: 'Procedura krok po kroku', open: true,
      blocks: [
        { t: 'check', title: 'Kroki (wg klasyk.pl, stan na 24.07.2026, i WUOZ Olsztyn)', items: [
          { text: 'Sprawdź kryteria WUOZ swojego województwa (wiek, oryginalność, lata od końca produkcji).', src: ['wuoz-olsztyn', 'klasyk'] },
          { text: 'Opinia rzeczoznawcy (z listy Ministra) + biała karta (karta ewidencyjna): 500–1 200 zł; zdjęcia 9×13 cm — procedura jest częściowo analogowa.', src: ['klasyk', 'wuoz-olsztyn'] },
          { text: 'Wniosek do WUOZ o włączenie karty do wojewódzkiej ewidencji zabytków: urzędowy termin 30 dni, w praktyce 2–3 miesiące.', src: ['klasyk'] },
          { text: 'Badanie na OSKP (okręgowa stacja): protokół oceny stanu technicznego pojazdu zabytkowego; stawka nieujęta w taryfikatorze, ok. 305 zł (bywa 700 zł).', src: ['klasyk'] },
          { text: 'Wydział komunikacji: wniosek, potwierdzenie wpisu, wynik badania, dowód własności, dowód rejestracyjny (lub oświadczenie) i stare tablice; opłaty wg tabeli poniżej.', src: ['klasyk', 'rejestracja-rozp'] },
        ] },
        { t: 'table', caption: 'Koszty procedury (stan na: 24.07.2026 / 24.10.2026)', head: ['Pozycja', 'Kwota', 'Uwagi'], rows: [
          { cells: ['Opinia rzeczoznawcy + biała karta', '500–1 200 zł', 'Zależy od regionu i eksperta.'], src: ['klasyk'] },
          { cells: ['Badanie w OSKP', 'ok. 305 zł (do 700 zł)', 'Brak stawki w rozporządzeniu — cena umowna.'], src: ['klasyk'] },
          { cells: ['Tablice zabytkowe', '100 zł (urzędowo wg tabeli); klasyk.pl: 115,50 zł', 'Zob. rozbieżność niżej.'], src: ['rejestracja-rozp', 'klasyk'] },
          { cells: ['Dowód rejestracyjny', '54 zł (urzędowo); klasyk.pl: 62,50 zł', ''], src: ['oplaty-rej-1', 'klasyk'] },
          { cells: ['Nalepka', '12,50 zł (urzędowo); klasyk.pl: 14,50 zł', ''], src: ['oplaty-rej-1', 'klasyk'] },
          { cells: ['Razem (klasyk.pl)', 'ok. 1 000–1 700 zł', 'Przy ewidencji + badaniu + tablicach.'], src: ['klasyk'] },
        ] },
        { t: 'callout', tone: 'conflict', title: 'Opłaty: urzędowa tabela vs klasyk.pl', text: 'Urzędowe tabele (sprawdzone 24.10.2026): dowód 54 zł, tablice zabytkowe 100 zł, nalepki 12,50 zł (razem 180 zł dla zabytkowych). klasyk.pl (24.07.2026): 115,50 / 62,50 / 14,50 zł ≈ 190 zł „po podwyżce 2026”. Projekt zmiany RCL 12404903 (62,50 / 92,50 / 3 000 zł) jest w wykazie jako niepodpisany. Zapytaj w wydziale komunikacji przed wizytą.', src: ['rejestracja-rozp', 'oplaty-rej-1', 'klasyk', 'rcl-oplaty'] },
        { t: 'table', caption: 'Rodzaje tablic i ich opłaty (stan na: 24.10.2026)', head: ['Rodzaj', 'Opłata za tablice'], rows: [
          { cells: ['Zwykłe (komplet)', '80 zł'], src: ['rejestracja-rozp'] },
          { cells: ['Zabytkowe (żółte)', '100 zł'], src: ['rejestracja-rozp'] },
          { cells: ['Indywidualne', '1 000 zł'], src: ['rejestracja-rozp'] },
          { cells: ['Czasowe', '30 zł'], src: ['rejestracja-rozp'] },
        ] },
        { t: 'callout', tone: 'info', title: 'Nie mylić z pojazdem historycznym', text: 'Pojazd historyczny (ustawa ubezpieczeniowa) to zabytek, auto ≥40 lat lub ≥25 lat uznane za unikatowe. To pojęcie ma znaczenie dla OC i SCT, ale nie daje żółtych tablic. Z klasyk.pl: w Krakowie i Warszawie zwolnienie ze SCT dotyczy także historycznych ≥40 lat.', src: ['klasyk', 'oc-ustawa'] },
      ],
    },
    {
      id: 'plusy-minusy', title: 'Plusy i minusy', open: true,
      blocks: [
        { t: 'table', caption: 'Bilans (stan na: 24.10.2026)', head: ['Plus', 'Szczegóły'], rows: [
          { cells: ['Badania techniczne', 'Zabytek bez badań okresowych (art. 81 ust. 10 PoRD), poza użyciem w transporcie zarobkowym; przed pierwszą rejestracją badanie zgodności (ust. 11a). Oszczędność 149 zł/rok.'], src: ['pord', 'klasyk'] },
          { cells: ['OC', 'Polisa krótkoterminowa (min. 30 dni) dla pojazdów historycznych, brak ciągłości; zniżki do 70% dla członków PZM — wg klasyk.pl.'], src: ['klasyk', 'oc-ustawa'] },
          { cells: ['Akcyza przy imporcie spoza UE', 'Zabytek CN 9705 — bez akcyzy i cła, VAT 8% — o ile urząd celny uzna klasyfikację; KAS bywa restrykcyjne wobec aut seryjnych.'], src: ['cn9705-granica', 'klasyk'] },
          { cells: ['SCT', 'Zabytki zwolnione ze Stref Czystego Transportu (Kraków, Warszawa) wg klasyk.pl.'], src: ['klasyk'] },
        ] },
        { t: 'table', caption: 'Wady', head: ['Minus', 'Szczegóły'], rows: [
          { cells: ['LPG', 'Niefabryczna instalacja LPG traktowana jako niedopuszczalna ingerencja; w warmińsko-mazurskim wpis blokuje niefabryczne LPG.'], src: ['klasyk', 'wuoz-olsztyn'] },
          { cells: ['Użytek zarobkowy', 'Zakaz regularnego transportu zarobkowego; przy takim użyciu wracają coroczne badania.'], src: ['klasyk', 'pord'] },
          { cells: ['Tablice indywidualne', 'Żółte tablice zabytkowe wykluczają tablice indywidualne.'], src: ['rankomat'] },
          { cells: ['Zmiany w aucie', 'Wymóg ≥75% oryginalnych części — przeróbki (silnik, zawieszenie, nadwozie) ryzykowne.'], src: ['wuoz-olsztyn'] },
        ] },
      ],
    },
    {
      id: 'zmiany', title: 'Aktualne zasady i zmiany', blocks: [
        { t: 'list', items: [
          { text: 'Zmiany w rejestracji od 10.06.2026 (Dz.U. 2026 poz. 742): brak ponownej legalizacji tablic; brak papierowego zaświadczenia z badania, gdy wynik jest w CEPiK; hak z dokumentów; czasowa rejestracja dla cudzoziemców.', src: ['zmiany-2026'] },
          { text: 'Zabytek — definicja: art. 2 pkt 39 PoRD; badania: art. 81 ust. 10 i 11a.', src: ['pord'] },
          { text: 'Pozwolenie na wywóz stały — tylko dla pojazdów starszych niż 50 lat i wartych ponad 32 000 zł (opłata 100 zł) — wg klasyk.pl.', src: ['klasyk'] },
          { text: 'Nie znalazłem w wiarygodnym źródle gotowego opisu formatu/wymiarów żółtych tablic w 2026 — nie podaję go.', src: [] },
        ] },
        { t: 'callout', tone: 'legal', title: 'Przepisy się zmieniają — sprawdź w urzędzie', text: 'Progi wieku są wytycznymi WUOZ i zmieniają się niezależnie w każdym województwie (rankomat: zmiany w 2016–2018 i 2024–2025). Przed wydatkiem na opinię rzeczoznawcy zadzwoń do WUOZ.', src: ['rankomat', 'wuoz-olsztyn'] },
      ],
    },
  ],
  mistakes: [
    'Założenie, że „auto ma 30 lat, więc dostanę żółte tablice” — większość WUOZ wymaga 40 lat.',
    'Zamówienie opinii rzeczoznawcy przed sprawdzeniem wymagań WUOZ swojego województwa.',
    'Wpis z fabrycznie oryginalnym autem — a potem LPG: wpis traktuje LPG jako ingerencję.',
    'Plan wykorzystania auta zarobkowo (taxi, dostawczak) — wyklucza przywileje zabytku.',
    'Mylenie pojazdu historycznego (OC/SCT) z zabytkowym (żółte tablice).',
    'Poleganie na jednym portalu — źródła podają różne progi i opłaty.',
  ],
  faq: [
    { q: 'Czy GMT400 może dostać żółte tablice?', a: 'Tak, ale zwykle po osiągnięciu 40 lat (pierwsze roczniki 1988 w 2028) i przy zachowanej oryginalności (≥75% części). Młodsze — tylko wyjątkowo.', src: ['wuoz-olsztyn', 'klasyk'] },
    { q: 'Czy można mieć żółte tablice z LPG?', a: 'W praktyce nie: WUOZ Olsztyn zaznacza niefabryczne LPG jako przeszkodę; klasyk.pl: niedopuszczalna ingerencja.', src: ['wuoz-olsztyn', 'klasyk'] },
    { q: 'Ile kosztuje cała procedura?', a: 'Wg klasyk.pl ok. 1 000–1 700 zł (rzeczoznawca, OSKP, opłaty). Opłaty urzędowe: zob. rozbieżność w tabelach.', src: ['klasyk'] },
    { q: 'Czy zabytek ma badania techniczne?', a: 'Bez okresowych (art. 81 ust. 10), chyba że do transportu zarobkowego; przed pierwszą rejestracją badanie zgodności.', src: ['pord'] },
    { q: 'Czy zabytek może jeździć po Krakowie/Warszawie (SCT)?', a: 'Wg klasyk.pl tak — zwolnienie wymaga zgłoszenia lub nalepki. Sprawdź uchwałę swojego miasta.', src: ['klasyk'] },
  ],
  related: ['import', 'lpg'],
  keywords: ['żółte tablice', 'zabytek', 'ewidencja zabytków', 'WUOZ', 'biała karta', 'rzeczoznawca', 'SCT', 'OC', 'pojazd historyczny', '9705'],
};
