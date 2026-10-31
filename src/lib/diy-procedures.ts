export type DiyProcedure = {
  id: string;
  title: string;
  scope: string;
  safety: string[];
  tools: string[];
  parts: string[];
  steps: string[];
  specs: string[];
  control: string;
  source: string;
  sourceTitle: string;
  note: string;
  image?: string;
};

export const DIY_PROCEDURES: DiyProcedure[] = [
  {
    id: 'engine-oil-change',
    title: 'Wymiana oleju silnikowego (1988–2000)',
    scope: 'Wszystkie GMT400 1988–2000; różnice TBI (do 1995) vs Vortec (1996+).',
    safety: ['Pracuj na zimnym silniku lub po kilku minutach od wyłączenia.', 'Ustaw auto na równym podłożu, zabezpiecz przed stoczeniem.', 'Zużyty olej i filtr oddaj do punktu zbiórki.'],
    tools: ['Klucz do korka spustowego', 'Klucz do filtra', 'Lejek', 'Pojemnik na olej', 'Nowa podkładka korka'],
    parts: ['Olej zgodny z instrukcją właściwego rocznika', 'Filtr: PF1218 (2WD) / PF52 (4WD) dla Vortec'],
    steps: ['Rozgrzej silnik krótko, wyłącz i odczekaj.', 'Podstaw pojemnik, odkręć korek spustowy i spuść olej.', 'Wymień podkładkę korka, dokręć korek.', 'Wymień filtr oleju (lekko nasmaruj uszczelkę).', 'Wlej olej zgodnie z pojemnością, odczekaj i sprawdź poziom.', 'Uruchom silnik, sprawdź wycieki, wyłącz i ponownie sprawdź poziom.'],
    specs: ['4.3L V6: 4,3 L (4,5 qt) z filtrem', '5.0/5.7L V8: 4,7 L (5 qt) z filtrem', '6.5L diesel: 6,6 L (7 qt) z filtrem', '7.4L V8: 6,6 L (7 qt) z filtrem'],
    control: 'Poziom na bagnecie po kilku minutach, brak wycieków przy korku i filtrze.',
    source: 'https://assets.gm.com/manuals/chevrolet/1995_chevrolet_1500_owners.pdf',
    sourceTitle: 'OM95 — 1995 Chevrolet C/K 1500 Owners Manual',
    note: 'Sprawdź w swoim aucie / manualu — GMT400 ma wiele wariantów (rocznik, GVWR, silnik, skrzynia, RPO).'
  },
  {
    id: 'coolant-change',
    title: 'Wymiana płynu chłodniczego (1988–2000)',
    scope: '1995: zielony płyn długowieczny GM, wymiana 48 000 km (30 000 mil) / 24 mies. 1999: DEX-COOL, pierwsza wymiana 240 000 km (150 000 mil) / 60 mies.',
    safety: ['Nigdy nie otwieraj korka na gorącym silniku.', 'Płyn chłodniczy jest toksyczny — przechowuj i utylizuj zgodnie z przepisami.'],
    tools: ['Klucz do korka spustowego', 'Lejek', 'Pojemnik', 'Nowa uszczelka korka'],
    parts: ['1995: zielony płyn długowieczny GM', '1999: DEX-COOL'],
    steps: ['Odczekaj aż silnik ostygnie.', 'Otwórz korek zbiornika, odkręć korek spustowy i spuść płyn.', 'Wymień uszczelkę, zakręć korek.', 'Wlej nowy płyn zgodnie z pojemnością, odpowietrz układ.', 'Uruchom silnik, sprawdź poziom i wycieki.'],
    specs: ['4.3L: 12,3 L (13 qt)', '5.0/5.7L: 16,6 L (17,5 qt)', '6.5L: 22,2 L (23,5 qt)', '7.4L: 23,7 L (25 qt)', '1999 L31 5.7L: 16,6 L (17,5 qt); z tylną nagrzewnicą 18,9 L (20 qt)', '1999 7.4L: 23,7 L (25 qt); z tylną nagrzewnicą 26 L (27,5 qt)'],
    control: 'Poziom na zimnym silniku, brak wycieków, brak powietrza w układzie.',
    source: 'https://www.chevrolet.com/ownercenter/content/dam/gmownercenter/gmna/dynamic/manuals/1999/chevrolet/suburban/1999_chevrolet_suburban_owners.pdf',
    sourceTitle: 'OM99 — 1999 Chevrolet Suburban Owners Manual',
    note: 'Nie mieszaj technologii płynów. Sprawdź w swoim aucie / manualu — GMT400 ma wiele wariantów (rocznik, GVWR, silnik, skrzynia, RPO).'
  },
  {
    id: 'atf-4l60e-change',
    title: 'Wymiana ATF w 4L60-E (1993–2000, 1500)',
    scope: '4L60-E, 1993–2000, 1500.',
    safety: ['Pracuj na zimnej skrzyni lub po krótkiej jeździe.', 'Ustaw auto poziomo, zabezpiecz przed stoczeniem.'],
    tools: ['Klucz do korka spustowego', 'Lejek', 'Pojemnik', 'Nowa uszczelka miski'],
    parts: ['ATF DEXRON-III', 'Filtr skrzyni i uszczelka miski'],
    steps: ['Odkręć korek spustowy i spuść ATF.', 'Zdejmij miskę, wymień filtr i uszczelkę.', 'Załóż miskę, dokręć śruby równomiernie.', 'Wlej ATF, uruchom silnik, sprawdź poziom zgodnie z procedurą i temperaturą.'],
    specs: ['Interwał: 160 000 km (100 000 mil) normalnie, 80 000 km (50 000 mil) przy ciężkiej eksploatacji', 'Poziom sprawdzać zgodnie z procedurą i temperaturą płynu'],
    control: 'Poziom na bagnecie po rozgrzaniu, brak wycieków przy misce i filtrze.',
    source: 'https://assets.gm.com/manuals/chevrolet/1995_chevrolet_1500_owners.pdf',
    sourceTitle: 'OM95 — 1995 Chevrolet C/K 1500 Owners Manual',
    note: 'Sprawdź w swoim aucie / manualu — GMT400 ma wiele wariantów (rocznik, GVWR, silnik, skrzynia, RPO).'
  },
  {
    id: 'transfer-case-fluid-change',
    title: 'Olej w skrzyni rozdzielczej (1988–2000)',
    scope: 'NP241C / NP243C: DEXRON-III. NV246 AutoTrac: GM Automatic Transfer Case Fluid 12378396 (zastąpiony przez GM 12378508 Auto-Trak II).',
    safety: ['Pracuj na zimnym reduktorze, auto poziomo.'],
    tools: ['Klucz do korków', 'Lejek', 'Pojemnik'],
    parts: ['Właściwy płyn zgodnie z modelem reduktora'],
    steps: ['Odkręć korek spustowy i spuść płyn.', 'Zakręć korek spustowy.', 'Wlej płyn przez korek wlewowy do poziomu.', 'Zakręć korek wlewowy.'],
    specs: ['Pojemność zależna od modelu reduktora — potwierdź w instrukcji'],
    control: 'Poziom na korku wlewowym, brak wycieków.',
    source: 'https://www.chevrolet.com/ownercenter/content/dam/gmownercenter/gmna/dynamic/manuals/1999/chevrolet/suburban/1999_chevrolet_suburban_owners.pdf',
    sourceTitle: 'OM99 — 1999 Chevrolet Suburban Owners Manual',
    note: 'Sprawdź w swoim aucie / manualu — GMT400 ma wiele wariantów (rocznik, GVWR, silnik, skrzynia, RPO).'
  },
  {
    id: 'differential-fluid-change',
    title: 'Olej w mostach (1988–2000)',
    scope: 'Przedni i tylny mechanizm różnicowy.',
    safety: ['Pracuj na zimnym moście, auto poziomo.'],
    tools: ['Klucz do korków', 'Lejek', 'Pojemnik'],
    parts: ['SAE 80W-90 GL-5 (GM 1052271)', 'G80: tylko 1052271, bez dodatku tarciowego'],
    steps: ['Odkręć korek spustowy i spuść olej.', 'Zakręć korek spustowy.', 'Wlej olej przez korek wlewowy do poziomu.', 'Zakręć korek wlewowy.'],
    specs: ['Pojemność zależna od mostu — potwierdź w instrukcji'],
    control: 'Poziom na korku wlewowym, brak wycieków.',
    source: 'https://assets.gm.com/manuals/chevrolet/1995_chevrolet_1500_owners.pdf',
    sourceTitle: 'OM95 — 1995 Chevrolet C/K 1500 Owners Manual',
    note: 'Sprawdź w swoim aucie / manualu — GMT400 ma wiele wariantów (rocznik, GVWR, silnik, skrzynia, RPO).'
  },
  {
    id: 'brake-pads-change',
    title: 'Wymiana klocków hamulcowych (1988–2000)',
    scope: 'Przednia oś, wszystkie GMT400.',
    safety: ['Zabezpiecz auto na podnośniku / kobyłkach.', 'Nie wciskaj pedału hamulca przy zdjętym zacisku.', 'Sprawdź poziom płynu w zbiorniku przed wciskaniem tłoczków.'],
    tools: ['Klucz do zacisków', 'C-clamp lub narzędzie do tłoczków', 'Smar do prowadnic', 'Szczotka druciana'],
    parts: ['Klocki hamulcowe', 'Opcjonalnie tarcze', 'Smar miedziany / silikonowy do prowadnic'],
    steps: ['Unieś auto, zdejmij koło.', 'Odkręć zacisk, podeprzyj go.', 'Wyjmij stare klocki, oczyść prowadnice.', 'Wciśnij tłoczek, załóż nowe klocki.', 'Zamontuj zacisk, dokręć śruby.', 'Załóż koło, opuść auto, kilkukrotnie wciśnij pedał hamulca.'],
    specs: ['Moment śrub zacisku: sprawdź w manualu (zwykle 30–40 Nm)', 'Moment kół: OM95 120 lb-ft / OM99 140 lb-ft (zależnie od rozmiaru śrub)'],
    control: 'Pedal twardy, brak wycieków, równomierne hamowanie.',
    source: 'https://assets.gm.com/manuals/chevrolet/1995_chevrolet_1500_owners.pdf',
    sourceTitle: 'OM95 — 1995 Chevrolet C/K 1500 Owners Manual',
    note: 'Sprawdź w swoim aucie / manualu — GMT400 ma wiele wariantów (rocznik, GVWR, silnik, skrzynia, RPO).'
  }
];

export function findDiyProcedures(parameters: { id?: string; query?: string }) {
  const id = parameters.id?.toLowerCase().trim() ?? '';
  const query = parameters.query?.toLowerCase().trim() ?? '';
  return DIY_PROCEDURES.filter(item => {
    const idMatch = !id || item.id === id;
    const queryMatch = !query || item.title.toLowerCase().includes(query) || item.scope.toLowerCase().includes(query);
    return idMatch && queryMatch;
  });
}
