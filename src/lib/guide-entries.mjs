// Statyczne wpisy poradników do wyszukiwarki (zwykły .mjs, by testy Node mogły go importować).
// Zgodność z src/lib/guides/*.ts pilnuje tests/guides.spec.cjs.
export const GUIDE_ENTRIES = [
  {
    id: 'guide:lpg',
    Nazwa: 'Poradnik: LPG w GMT400 — instalacja, zbiornik, zawory, koszty, przepisy',
    Typ: 'Poradnik',
    Model: 'GMT400 (C/K, Suburban, Tahoe, Yukon, Blazer)',
    Opis: 'LPG w GMT400: sekwencja czy mieszalnik, TBI 4.3/5.0/5.7/7.4 (1988–95) i Vortec CSFI (1996+), zbiornik toroidalny czy cylindryczny, smarowanie zaworów (Flashlube), koszty w zł, spalanie l/100 km, homologacja R115/R67, badanie roczne, garaże podziemne.',
    Lata: '1988–2000',
    href: '/dla-wlasciciela/lpg',
  },
  {
    id: 'guide:import',
    Nazwa: 'Poradnik: sprowadzenie i rejestracja GMT400 z USA/UE — cło, VAT, akcyza, opłaty',
    Typ: 'Poradnik',
    Model: 'GMT400 (C/K, Suburban, Tahoe, Yukon, Blazer)',
    Opis: 'Import z USA i UE do Polski: cło osobowy vs pickup N1, VAT, akcyza i jej podstawa, opłata recyklingowa, pierwsze badanie, tłumaczenia, opłaty rejestracyjne, termin 30 dni i kara, zabytek CN 9705, trasa USA–DE/NL–PL, kalkulator kosztów.',
    Lata: '1988–2002',
    href: '/dla-wlasciciela/import',
  },
  {
    id: 'guide:swiatla-eu',
    Nazwa: 'Poradnik: przeróbka świateł GMT400 na europejskie — wymagania, części, schemat',
    Typ: 'Poradnik',
    Model: 'GMT400 (C/K, Suburban, Tahoe, Yukon, Blazer)',
    Opis: 'Światła na europejskie: co sprawdza badanie techniczne, C/K vs Suburban/Tahoe vs Blazer, numery części (reflektory E-code, lampy tylne), gdzie kupić, triki użytkowników (zielona żarówka w czerwonym kloszu) z oceną legalności, schemat połączeń.',
    Lata: '1988–2000',
    href: '/dla-wlasciciela/swiatla-eu',
  },
  {
    id: 'guide:zolte-tablice',
    Nazwa: 'Poradnik: żółte tablice (zabytek) dla GMT400 — kryteria, procedura, koszty',
    Typ: 'Poradnik',
    Model: 'GMT400 (C/K, Suburban, Tahoe, Yukon, Blazer)',
    Opis: 'Żółte tablice zabytkowe: kryteria wieku wg województw, ewidencja zabytków WUOZ, biała karta, rzeczoznawca, badanie OSKP, opłaty w zł, rodzaje tablic, plusy (OC, badania, akcyza, SCT) i minusy (LPG, użytek zarobkowy).',
    Lata: '1988–2002',
    href: '/dla-wlasciciela/zolte-tablice',
  },
];
