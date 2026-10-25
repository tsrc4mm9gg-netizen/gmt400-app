// Statyczne wpisy poradników do wyszukiwarki (zwykły .mjs, by testy Node mogły go importować).
// Zgodność z src/lib/guides/*.ts pilnuje tests/guides.spec.cjs.
export const GUIDE_ENTRIES = [
  {
    id: 'guide:lpg',
    Slowa: 'lpg gaz autogaz autogas instalacja gazowa dual fuel propan-butan sekwencja sekwencyjna mikser mieszalnik zbiornik toroidalny cylindryczny flashlube zawory spalanie zużycie paliwa l/100 km koszty cennik montaż badanie roczne garaż podziemny tahoe lpg suburban lpg silverado lpg sierra lpg yukon lpg blazer lpg v8 lpg vortec lpg tbi lpg stag impco',
    Nazwa: 'Poradnik: LPG w GMT400 — instalacja, zbiornik, zawory, koszty, przepisy',
    Typ: 'Poradnik',
    Model: 'Chevrolet/GMC GMT400 (C/K, Silverado, Sierra, Suburban, Tahoe, Yukon, Blazer)',
    Opis: 'LPG w GMT400: sekwencja czy mieszalnik, TBI 4.3/5.0/5.7/7.4 (1988–95) i Vortec CSFI (1996+), zbiornik toroidalny czy cylindryczny, smarowanie zaworów (Flashlube), koszty w zł, spalanie l/100 km, homologacja R115/R67, badanie roczne, garaże podziemne.',
    Lata: '1988–2000',
    href: '/dla-wlasciciela/lpg',
  },
  {
    id: 'guide:import',
    Slowa: 'import sprowadzenie sprowadzenie auta z usa auto z usa akcyza cło vat opłata recyklingowa kalkulator koszty opłaty rejestracja auta z usa pierwszy przegląd przegląd techniczny auta z usa badanie techniczne przed rejestracją tłumaczenia pozwolenie czasowe termin 30 dni pickup ciężarowy N1 osobowy zabytek 9705 USA Niemcy Holandia tahoe suburban silverado sierra yukon blazer z usa',
    Nazwa: 'Poradnik: sprowadzenie i rejestracja GMT400 z USA/UE — cło, VAT, akcyza, opłaty',
    Typ: 'Poradnik',
    Model: 'Chevrolet/GMC GMT400 (C/K, Silverado, Sierra, Suburban, Tahoe, Yukon, Blazer)',
    Opis: 'Import z USA i UE do Polski: cło osobowy vs pickup N1, VAT, akcyza i jej podstawa, opłata recyklingowa, pierwsze badanie, tłumaczenia, opłaty rejestracyjne, termin 30 dni i kara, zabytek CN 9705, trasa USA–DE/NL–PL, kalkulator kosztów.',
    Lata: '1988–2002',
    href: '/dla-wlasciciela/import',
  },
  {
    id: 'guide:swiatla-eu',
    Slowa: 'światła przeróbka świateł usa na eu lampy usa kierunkowskazy usa czerwone kierunkowskazy pomarańczowe kierunkowskazy migacze reflektory lampy tylne tylne światła światła stop zielona żarówka e-code badanie techniczne schemat połączeń tahoe suburban silverado sierra yukon blazer',
    Nazwa: 'Poradnik: przeróbka świateł GMT400 na europejskie — wymagania, części, schemat',
    Typ: 'Poradnik',
    Model: 'Chevrolet/GMC GMT400 (C/K, Silverado, Sierra, Suburban, Tahoe, Yukon, Blazer)',
    Opis: 'Światła na europejskie: co sprawdza badanie techniczne, C/K vs Suburban/Tahoe vs Blazer, numery części (reflektory E-code, lampy tylne), gdzie kupić, triki użytkowników (zielona żarówka w czerwonym kloszu) z oceną legalności, schemat połączeń.',
    Lata: '1988–2000',
    href: '/dla-wlasciciela/swiatla-eu',
  },
  {
    id: 'guide:zolte-tablice',
    Slowa: 'żółte tablice tablice zabytkowe zabytek auto zabytkowe pojazd zabytkowy rejestracja zabytku 25 lat ewidencja zabytków WUOZ biała karta rzeczoznawca oskp opłaty OC akcyza SCT LPG tahoe suburban silverado sierra yukon blazer historyczny',
    Nazwa: 'Poradnik: żółte tablice (zabytek) dla GMT400 — kryteria, procedura, koszty',
    Typ: 'Poradnik',
    Model: 'Chevrolet/GMC GMT400 (C/K, Silverado, Sierra, Suburban, Tahoe, Yukon, Blazer)',
    Opis: 'Żółte tablice zabytkowe: kryteria wieku wg województw, ewidencja zabytków WUOZ, biała karta, rzeczoznawca, badanie OSKP, opłaty w zł, rodzaje tablic, plusy (OC, badania, akcyza, SCT) i minusy (LPG, użytek zarobkowy).',
    Lata: '1988–2002',
    href: '/dla-wlasciciela/zolte-tablice',
  },
];
