import type { Guide } from './types';

export const LIGHTS_GUIDE: Guide = {
  slug: 'swiatla-eu',
  title: 'Przeróbka świateł GMT400 na europejskie — co zaakceptuje badanie',
  short: 'Światła na europejskie',
  description: 'Czego wymaga stacja kontroli pojazdów, jak przerobić tylne kierunkowskazy w C/K, Suburbanie, Tahoe i Blazerze, numery części, schemat okablowania i „patenty” użytkowników — z oceną legalności.',
  seoTitle: 'Czerwone kierunkowskazy z USA — przeróbka świateł Tahoe, Suburban',
  seoDescription: 'Jak przerobić tylne kierunkowskazy z USA na europejskie w Tahoe, Suburban, Blazerze i C/K (Silverado): wymagania stacji kontroli, numery części, schemat okablowania — z oceną legalności.',
  asOf: '24.10.2026',
  bodies: ['ck-reg', 'ck-ext', 'k1500', 'sierra', 'dually', 'suburban', 'tahoe-4d', 'tahoe-2d', 'yukon'],
  years: '1988–2000',
  summary: [
    'Najpewniejsza droga: oryginalne lampy z homologacją E (znak E w kółku) i pomarańczowymi tylnymi kierunkowskazami. Eurodiagnosta: bez odstępstw dla oświetlenia, nie wolno zmieniać koloru ani kloszy.',
    'Z przodu (1988–89, poczwórne sealed beam): reflektory Bosch E-code GM RPO T84/T85 (numery poniżej) — ale wycofane z produkcji; w 1994–98 (kompozyt): Arteb (Brazylia) E-code, ok. 250 USD za parę wg wątku z 2022.',
    'Z tyłu najczęstsza przeróbka użytkowników: kierunkowskaz przeniesiony do dawnej komory cofania z żółtą żarówką; światło cofania — dodatkowa lampa. Schemat poniżej (relacja użytkownika z C1500 \'94).',
    '„Zielona żarówka w czerwonym kloszu” to forumowy trik z wątpliwą zgodnością z przepisami — nie polecamy jako rozwiązania na badanie.',
    'Mgłowa tylna: czerwona, 1–2 lampy, lewa/środek, wysokość 250–1000 mm, z kontrolką — wymagana wg załącznika do WT.',
    'Sprawdź w swoim aucie / manualu kolory przewodów — mogą się różnić między rocznikami i nadwoziami.',
  ],
  sections: [
    {
      id: 'wymagania', title: 'Czego wymaga badanie techniczne', open: true,
      blocks: [
        { t: 'table', caption: 'Wymagania wg Warunków technicznych (Dz.U. 2024 poz. 502; stan na: 24.10.2026)', head: ['Element', 'Wymóg'], rows: [
          { cells: ['Znaki homologacji', '§10: elementy oświetlenia muszą mieć znak E (homologacja).'], src: ['wt'] },
          { cells: ['Tylne kierunkowskazy', 'pomarańczowe; ≤400 mm od skraju pojazdu, ≥600 mm od siebie; wysokość 350–1500 mm.'], src: ['wt'] },
          { cells: ['Boczne kierunkowskazy (repeatery)', 'pomarańczowe; w odległości do 1800 mm od przodu.'], src: ['wt'] },
          { cells: ['Mgłowa tylna', '1–2 lampy, czerwone; po lewej lub w osi; wysokość 250–1000 mm; ≥100 mm od światła stop; z kontrolką.'], src: ['wt'] },
          { cells: ['Światła pozycyjne tylne', 'czerwone.'], src: ['wt'] },
          { cells: ['Światła mijania', 'wysokość 500–1200 mm.'], src: ['wt'] },
        ] },
        { t: 'callout', tone: 'legal', title: 'Stanowisko diagnostów', text: 'Eurodiagnosta: dla oświetlenia nie ma odstępstw; zmiany koloru ani kloszy nie są dopuszczalne. Nie znalazłem zweryfikowanego źródła, że zabytek jest z tego zwolniony — zapytaj stację kontroli pojazdów.', src: ['eurodiagnosta'] },
        { t: 'callout', tone: 'warn', title: 'Europejskie GMT400', text: 'Użytkownik z gmt400.com (wątek z 14.04.2010) pisze, że GM dostarczał Tahoe/Suburbana do Europy od końca 1997 z reflektorami Bosch E, bocznymi pomarańczowymi światłami, pomarańczowym kierunkowskazem w dawnej komorze cofania, lampą cofania pod zderzakiem, mgłową i błotnikami. Nie zweryfikowałem tego w katalogu GM.', src: ['g4-946'] },
      ],
    },
    {
      id: 'przod', title: 'Reflektory — numery części i gdzie kupić', open: true,
      blocks: [
        { t: 'table', caption: 'Części — przód (stan na: 24.10.2026)', head: ['Nadwozie / lata', 'Część', 'Uwagi'], rows: [
          { cells: ['C/K, Blazer, Suburban 1988–89 (poczwórne)', 'Sealed beam H4703 (mijania, zewnętrzne) i H4701 (drogowe, wewnętrzne), 92×150 mm', 'Wymiary i oznaczenia z wątków; sealed beam nie jest homologacją E.'], src: ['g4-946', 'g4-62350'] },
          { cells: ['88–89 — „Bosch E-code”', 'GM RPO T84: mijania 16506324; T85: 16507483; drogowe 16506325', 'Numery z wątku z 2010/2012; GMPartsWiki pokazuje 16506324 jako wycofany. Nie weryfikowałem w katalogu GM — sprawdź w swoim aucie / manualu.'], src: ['g4-946', 'gmpartswiki'] },
          { cells: ['94–98 kompozyty', 'Arteb (GM Brazylia), E-code, ok. 250 USD/para + ok. 5 USD wysyłka do Europy (28.04.2022, aktualizacja 4.03.2024)', 'Dostępność oparta na liście oczekujących; osobny wątek „Arteb end of life” — sprawdź status u producenta.'], src: ['g4-57899', 'g4-63941', 'arteb'] },
        ] },
        { t: 'callout', tone: 'warn', title: 'Czego NIE kupować „na badanie”', text: 'Lampy tylne mnf.de dla GM full-size 88–00 (ok. 102 € w dniu sprawdzenia) są sprzedawane „bez TÜV-Gutachten, ABE” — nie są homologowane E. Spyder ALT-YD-CCK88-C to DOT, nie E. Hella 1AE 003 427-011 nie pasuje bezpośrednio — nie twierdzę, że pasuje.', src: ['mnf', 'g4-946'] },
      ],
    },
    {
      id: 'tyl', title: 'Tył: kierunkowskazy, cofanie, mgłowa', open: true,
      blocks: [
        { t: 'p', text: 'W relacji użytkownika (GMC C1500 \'94, 06.2017) w wersji z USA kierunkowskaz i światło stop dzielą jedną czerwoną komorę (przewód żółty — lewa strona, ciemnozielony — prawa), a światło cofania ma osobny przewód jasnozielony. W Europie tylny kierunkowskaz musi być pomarańczowy. Poniższy schemat opiera się na tej jednej relacji (auto przeszło TÜV w Niemczech).', src: ['cf-25376', 'wt'] },
        { t: 'svg', id: 'lights-wiring' },
        { t: 'callout', tone: 'warn', title: 'Schemat jest poglądowy', text: 'Kolory przewodów pochodzą z jednej relacji (C1500 \'94). Sprawdź w swoim aucie / manualu (schemat elektryczny GM) kolory i zasilanie — szczególnie dla Suburbana/Tahoe/Blazera, gdzie może być inna komora lamp.', src: ['cf-25376'] },
        { t: 'table', caption: 'Różnice między nadwoziami (co wiemy)', head: ['Nadwozie', 'Co jest zweryfikowane'], rows: [
          { cells: ['C/K pickup (Regular/Extended, Sierra, K1500)', 'Relacja C1500 \'94: przeróbka jak na schemacie (06.2017).'], src: ['cf-25376'] },
          { cells: ['Suburban / Tahoe / Yukon', 'Brak zweryfikowanego schematu — opis europejskiej specyfikacji z wątku 2010 (E-reflektory, kierunkowskaz w komorze cofania). Szukaj lamp E-code dla swojego rocznika.'], src: ['g4-946'] },
          { cells: ['Blazer (1992–94)', 'Brak zweryfikowanych relacji o tylnej lampie — brak informacji w źródłach.'], src: [] },
        ] },
        { t: 'callout', tone: 'info', title: 'Wątek o 2014+ Sierra — nie GMT400', text: 'chevy-forum.eu wątek 47013 (ok. 2017/18) dotyczy nowszego Sierra (2014+); nie stosuj go do GMT400.', src: ['cf-47013'] },
      ],
    },
    {
      id: 'triki', title: 'Triki użytkowników — z oceną legalności', blocks: [
        { t: 'reports', title: 'Relacje', items: [
          { date: '09–10.06.2017', where: 'chevy-forum.eu (C1500 \'94)', text: 'Przeróbka okablowania tylnych lamp (schemat wyżej); „TÜV war zufrieden”. Legalność: rozwiązanie jest zgodne z zasadą pomarańczowego kierunkowskazu, pod warunkiem że lampa ma homologację E; sama zmiana okablowania nie zastępuje homologacji kloszy.', src: 'cf-25376' },
          { date: '2013', where: 'forum.vwgolf.pl', text: 'Zielona żarówka za czerwonym kloszem daje światło „pomarańczowawe”. Legalność: wątpliwa — eurodiagnosta: bez zmian koloru; WT §10: wymagana homologacja. Nie traktuj jako zgodnego z przepisami.', src: 'vwgolf-529136' },
        ] },
        { t: 'callout', tone: 'warn', title: 'Naklejki / folie / żarówki w innym kolorze', text: 'Folie i zmiana koloru kloszy nie spełniają wymogu homologacji; stacja może odmówić pozytywnego wyniku. Wątki o „naklejkach korekcyjnych” z USA nie są potwierdzone w WT.', src: ['eurodiagnosta', 'wt'] },
      ],
    },
  ],
  mistakes: [
    'Zamawianie lamp DOT lub „performance” bez znaku E i bez ABE.',
    'Zielona żarówka w czerwonym kloszu jako „rozwiązanie” — to nie jest homologowane.',
    'Brak mgłowej z kontrolką lub zamontowanie jej po prawej (wymóg: lewa/środek).',
    'Przeróbka okablowania bez dokumentowania (zdjęcia, schemat) — przy odmowie trudno się odwołać.',
    'Przyjęcie schematu z C/K 1994 dla każdego nadwozia bez sprawdzenia kolorów przewodów.',
  ],
  faq: [
    { q: 'Czy trzeba zmieniać przednie reflektory?', a: 'Wymagany jest znak homologacji E dla elementów oświetlenia (§10 WT). Sealed beam (DOT) nie ma znaku E — rozwiązaniem są Bosch E-code (88–89) lub Arteb E-code (94–98).', src: ['wt', 'g4-946', 'g4-57899'] },
    { q: 'Czy można zostawić czerwone kierunkowskazy z tyłu?', a: 'Nie — tylne kierunkowskazy muszą być pomarańczowe (WT).', src: ['wt', 'eurodiagnosta'] },
    { q: 'Czy zabytek ma inne zasady?', a: 'Nie znalazłem zweryfikowanego źródła o zwolnieniu zabytków z wymogów oświetlenia. Zapytaj stację kontroli pojazdów; zob. przewodnik o żółtych tablicach.', src: ['eurodiagnosta'] },
  ],
  related: ['import', 'zolte-tablice'],
  keywords: ['światła', 'kierunkowskazy', 'tylne lampy', 'reflektory', 'E-code', 'Bosch', 'Arteb', 'mgłowa', 'badanie techniczne', 'zielona żarówka', 'schemat'],
};
