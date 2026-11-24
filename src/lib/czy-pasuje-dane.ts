/**
 * Baza reguł zamienności części GMT400
 * Źródło: opublikowana Paczka 5 Encyklopedii GMT400 (wpisy 01-05):
 * 01 - Zasady i rozpoznanie rocznika
 * 02 - Nadwozie i blacharka
 * 03 - Skrzynia 4L60E - zamienność rocznikowa
 * 04 - Skrzynia rozdzielcza i osie
 * 05 - FAQ Czy ta część pasuje i luki
 */

export type Verdict = 'PASUJE' | 'WARUNKOWO' | 'NIE PASUJE' | 'BRAK DANYCH';

export type SourceStatus =
  | 'Potwierdzone (2+ źródła)'
  | 'Opinia (forum)'
  | 'Opinia (jedno źródło)'
  | 'NIE POTWIERDZONO';

export interface CompatibilityRule {
  id: string;
  category: string;
  part: string;
  donorConditions: string;
  recipientConditions: string;
  verdict: Verdict;
  sourceStatus: SourceStatus;
  sourceSlug: string;
  sourceTitle: string;
  justification: string;
  notes?: string;
  isGap?: boolean;
}

export const SOURCE_ENTRIES = {
  zasady: {
    slug: 'zamiennosc-gmt400-01-zasady-i-rozpoznanie-rocznika',
    title: 'Zamienność GMT400 - 01 Zasady i rozpoznanie rocznika',
    href: '/baza/zamiennosc-gmt400-01-zasady-i-rozpoznanie-rocznika',
  },
  nadwozie: {
    slug: 'zamiennosc-gmt400-02-nadwozie-i-blacharka',
    title: 'Zamienność GMT400 - 02 Nadwozie i blacharka',
    href: '/baza/zamiennosc-gmt400-02-nadwozie-i-blacharka',
  },
  skrzynia: {
    slug: 'zamiennosc-gmt400-03-skrzynia-4l60e-zamiennosc-rocznikowa',
    title: 'Zamienność GMT400 - 03 Skrzynia 4L60E - zamienność rocznikowa',
    href: '/baza/zamiennosc-gmt400-03-skrzynia-4l60e-zamiennosc-rocznikowa',
  },
  reduktor_osie: {
    slug: 'zamiennosc-gmt400-04-skrzynia-rozdzielcza-i-osie',
    title: 'Zamienność GMT400 - 04 Skrzynia rozdzielcza i osie',
    href: '/baza/zamiennosc-gmt400-04-skrzynia-rozdzielcza-i-osie',
  },
  faq_luki: {
    slug: 'zamiennosc-gmt400-05-faq-czy-ta-czesc-pasuje-i-luki',
    title: 'Zamienność GMT400 - 05 FAQ Czy ta część pasuje i luki',
    href: '/baza/zamiennosc-gmt400-05-faq-czy-ta-czesc-pasuje-i-luki',
  },
} as const;

export const COMPATIBILITY_RULES: CompatibilityRule[] = [
  // ==========================================
  // NADWOZIE I BLACHARKA (Wpis 02 i 01)
  // ==========================================
  {
    id: 'maska_ten_sam_okres',
    category: 'Nadwozie i blacharka',
    part: 'Maska silnika',
    donorConditions: 'GMT400 standard (nie Escalade/Denali), ten sam okres stylistyki przodu (1988-1993 lub 1994-2000)',
    recipientConditions: 'GMT400 standard (nie Escalade/Denali), ten sam okres stylistyki przodu (1988-1993 lub 1994-2000)',
    verdict: 'PASUJE',
    sourceStatus: 'Opinia (forum)',
    sourceSlug: SOURCE_ENTRIES.nadwozie.slug,
    sourceTitle: SOURCE_ENTRIES.nadwozie.title,
    justification: 'Maska jest zamienna w obrębie platformy GMT400 do 2000 roku przy zgodnym okresie przodu.',
    notes: 'Źródło: GMT400 — Fender, Door & Hood.',
  },
  {
    id: 'maska_mieszany_okres',
    category: 'Nadwozie i blacharka',
    part: 'Maska silnika',
    donorConditions: 'Mieszanie roczników 1988-1993 z 1994-2000',
    recipientConditions: 'Pojazd z innego okresu stylistyki przodu niż dawca',
    verdict: 'WARUNKOWO',
    sourceStatus: 'Opinia (forum)',
    sourceSlug: SOURCE_ENTRIES.nadwozie.slug,
    sourceTitle: SOURCE_ENTRIES.nadwozie.title,
    justification: 'Przód 1988-93 różni się od 1994-98 (atrapa, lampy). Wymaga weryfikacji numeru części i spasowania z atrapą.',
    notes: 'Źródła: FullSizeChevy, gmt400.com.',
  },
  {
    id: 'maska_escalade_denali',
    category: 'Nadwozie i blacharka',
    part: 'Maska silnika',
    donorConditions: 'Cadillac Escalade lub GMC Yukon Denali 1999-2000',
    recipientConditions: 'Standardowy GMT400 (C/K 1500/2500/3500, standardowy Tahoe, Yukon, Suburban)',
    verdict: 'NIE PASUJE',
    sourceStatus: 'Potwierdzone (2+ źródła)',
    sourceSlug: SOURCE_ENTRIES.nadwozie.slug,
    sourceTitle: SOURCE_ENTRIES.nadwozie.title,
    justification: 'Maska Escalade/Denali 1999-2000 jest unikalna i nie pasuje do standardowego przodu GMT400.',
    notes: 'Potwierdzone w: Wikipedia — Cadillac Escalade, GMT400 — Denali/Escalade Thread.',
  },
  {
    id: 'klips_calosc',
    category: 'Nadwozie i blacharka',
    part: 'Przedni klips (kompletny przód)',
    donorConditions: 'Kompletny klips przodu z GMT400 standard 1988-2000 (maska, błotniki, pas, atrapa, lampy)',
    recipientConditions: 'GMT400 standard 1988-2000',
    verdict: 'PASUJE',
    sourceStatus: 'Opinia (forum)',
    sourceSlug: SOURCE_ENTRIES.nadwozie.slug,
    sourceTitle: SOURCE_ENTRIES.nadwozie.title,
    justification: 'Przy wymianie całego przedniego klipsa elementy pasują między rocznikami GMT400 do 2000 (z wyjątkiem Escalade/Denali).',
    notes: 'Źródła: GMT400 — Fender, Door & Hood, FullSizeChevy.',
  },
  {
    id: 'klips_czesciowy_mieszany',
    category: 'Nadwozie i blacharka',
    part: 'Przedni klips (kompletny przód)',
    donorConditions: 'Pojedyncze elementy przodu mieszane między okresami 1988-1993 a 1994-1998',
    recipientConditions: 'Standardowy GMT400',
    verdict: 'WARUNKOWO',
    sourceStatus: 'Opinia (forum)',
    sourceSlug: SOURCE_ENTRIES.nadwozie.slug,
    sourceTitle: SOURCE_ENTRIES.nadwozie.title,
    justification: 'Przód 1988-93 różni się od 1994-98 (atrapa, lampy). Źródła wskazują, że przy zmianie rocznika należy zamieniać cały klips w całości.',
    notes: 'Źródło: FullSizeChevy — GMT400 Parts Interchange Guide.',
  },
  {
    id: 'klips_escalade_denali',
    category: 'Nadwozie i blacharka',
    part: 'Przedni klips (kompletny przód)',
    donorConditions: 'Pojedyncze elementy przodu z Escalade / Yukon Denali 1999-2000',
    recipientConditions: 'Standardowy GMT400 (bez kompletnego swapu)',
    verdict: 'NIE PASUJE',
    sourceStatus: 'Potwierdzone (2+ źródła)',
    sourceSlug: SOURCE_ENTRIES.nadwozie.slug,
    sourceTitle: SOURCE_ENTRIES.nadwozie.title,
    justification: 'Przód Escalade/Denali (maska, błotniki, atrapa, reflektory, zderzak) jest odrębny i nie jest zamienny na poziomie pojedynczych elementów.',
    notes: 'Potwierdzone w 2+ źródłach.',
  },
  {
    id: 'drzwi_przod_ten_sam_okres',
    category: 'Nadwozie i blacharka',
    part: 'Przednie drzwi',
    donorConditions: 'GMT400 z tego samego okresu wnętrza (1988-1994 lub 1995-2000), nie Escalade/Denali',
    recipientConditions: 'GMT400 z tego samego okresu wnętrza (1988-1994 lub 1995-2000)',
    verdict: 'PASUJE',
    sourceStatus: 'Opinia (forum)',
    sourceSlug: SOURCE_ENTRIES.nadwozie.slug,
    sourceTitle: SOURCE_ENTRIES.nadwozie.title,
    justification: 'Przednie drzwi są zamienne w obrębie roczników GMT400; źródła zalecają dobierać drzwi z rocznika jak najbliższego.',
    notes: 'Źródło: GMT400 — Fender, Door & Hood.',
  },
  {
    id: 'drzwi_przod_mieszany_okres',
    category: 'Nadwozie i blacharka',
    part: 'Przednie drzwi',
    donorConditions: 'GMT400 1988-1994',
    recipientConditions: 'GMT400 1995-2000 (lub odwrotnie)',
    verdict: 'WARUNKOWO',
    sourceStatus: 'Opinia (forum)',
    sourceSlug: SOURCE_ENTRIES.nadwozie.slug,
    sourceTitle: SOURCE_ENTRIES.nadwozie.title,
    justification: 'Inna konstrukcja wewnętrzna drzwi wcześniejszych (1988-94) vs późniejszych (1995+). Nie mieszać bez potwierdzenia numeru części.',
    notes: 'Forum radzi brać drzwi 1995+ i rocznik jak najbliższy.',
  },
  {
    id: 'drzwi_przod_escalade_denali',
    category: 'Nadwozie i blacharka',
    part: 'Przednie drzwi',
    donorConditions: 'Cadillac Escalade / GMC Yukon Denali 1999-2000',
    recipientConditions: 'Standardowy GMT400',
    verdict: 'NIE PASUJE',
    sourceStatus: 'Opinia (forum)',
    sourceSlug: SOURCE_ENTRIES.nadwozie.slug,
    sourceTitle: SOURCE_ENTRIES.nadwozie.title,
    justification: 'Źródła odradzają montaż drzwi z Escalade/Denali ze względu na odmienne poszycia, listwy i wykończenia.',
    notes: 'Źródło: GMT400 — Fender, Door & Hood.',
  },
  {
    id: 'blotniki_przod_ten_sam_okres',
    category: 'Nadwozie i blacharka',
    part: 'Błotniki przednie',
    donorConditions: 'GMT400 standard 1988-1998 lub SUV 1999-2000 z tego samego okresu (1988-94 lub 1995+)',
    recipientConditions: 'GMT400 standard z tego samego okresu',
    verdict: 'PASUJE',
    sourceStatus: 'Opinia (forum)',
    sourceSlug: SOURCE_ENTRIES.nadwozie.slug,
    sourceTitle: SOURCE_ENTRIES.nadwozie.title,
    justification: 'Błotniki są ogólnie zamienne w obrębie GMT400 1988-98 oraz SUV 1999-2000 przy zachowaniu zgodności okresu.',
    notes: 'Źródła: GMT400 — Fender, Door & Hood, FullSizeChevy.',
  },
  {
    id: 'blotniki_przod_mieszany_okres',
    category: 'Nadwozie i blacharka',
    part: 'Błotniki przednie',
    donorConditions: 'Błotniki 1988-1994',
    recipientConditions: 'Pojazd 1995-2000 (lub odwrotnie)',
    verdict: 'WARUNKOWO',
    sourceStatus: 'Opinia (forum)',
    sourceSlug: SOURCE_ENTRIES.nadwozie.slug,
    sourceTitle: SOURCE_ENTRIES.nadwozie.title,
    justification: 'Nie mieszać roczników 1988-94 z 1995+ bez potwierdzenia numeru części. Należy zwracać uwagę na wewnętrzne otwory montażowe.',
    notes: 'Źródło: FullSizeChevy — Parts Interchange Guide.',
  },
  {
    id: 'blotniki_przod_escalade_denali',
    category: 'Nadwozie i blacharka',
    part: 'Błotniki przednie',
    donorConditions: 'Błotniki Escalade / Yukon Denali 1999-2000',
    recipientConditions: 'Standardowy GMT400',
    verdict: 'NIE PASUJE',
    sourceStatus: 'Potwierdzone (2+ źródła)',
    sourceSlug: SOURCE_ENTRIES.nadwozie.slug,
    sourceTitle: SOURCE_ENTRIES.nadwozie.title,
    justification: 'Błotniki przednie Escalade i Denali mają inną linię przetłoczeń pod unikalne reflektory i zderzak.',
    notes: 'Potwierdzone w 2+ źródłach.',
  },
  {
    id: 'zderzaki_luka',
    category: 'Nadwozie i blacharka',
    part: 'Zderzaki (przednie / tylne)',
    donorConditions: 'Dowolny zderzak GMT400 (pickup lub SUV)',
    recipientConditions: 'Dowolny pojazd GMT400',
    verdict: 'BRAK DANYCH',
    sourceStatus: 'NIE POTWIERDZONO',
    sourceSlug: SOURCE_ENTRIES.faq_luki.slug,
    sourceTitle: SOURCE_ENTRIES.faq_luki.title,
    justification: 'LUKA W ŹRÓDŁACH: Żadne źródło nie potwierdza zamienności zderzaków między rocznikami i wersjami. Nie zakładać z pickupa do SUV-a ani 1988-93 do 1994+ bez sprawdzenia numeru części / manuala.',
    notes: 'Pozycja wprost wymieniona w tabeli luk paczki 5.',
    isGap: true,
  },
  {
    id: 'drzwi_tyl_suburban_crewcab',
    category: 'Nadwozie i blacharka',
    part: 'Tylne drzwi boczne (Suburban vs Crew Cab)',
    donorConditions: 'Suburban lub C/K Crew Cab',
    recipientConditions: 'C/K Crew Cab lub Suburban (odpowiednio)',
    verdict: 'WARUNKOWO',
    sourceStatus: 'Opinia (forum)',
    sourceSlug: SOURCE_ENTRIES.nadwozie.slug,
    sourceTitle: SOURCE_ENTRIES.nadwozie.title,
    justification: 'Zamienne mechanicznie, lecz Crew Cab nie posiada fabrycznych głośników w tylnych drzwiach.',
    notes: 'Źródło: GMT400 — Fender, Door & Hood.',
  },
  {
    id: 'drzwi_tyl_tahoe_do_suburban',
    category: 'Nadwozie i blacharka',
    part: 'Tylne drzwi boczne (Tahoe/Yukon do Suburban)',
    donorConditions: 'Tahoe / Yukon 4-drzwiowy',
    recipientConditions: 'Suburban lub Crew Cab',
    verdict: 'NIE PASUJE',
    sourceStatus: 'Opinia (forum)',
    sourceSlug: SOURCE_ENTRIES.nadwozie.slug,
    sourceTitle: SOURCE_ENTRIES.nadwozie.title,
    justification: 'Nie zakładać tylnych drzwi bocznych z Tahoe/Yukona do Suburbana — inna geometria nadkola i długość poszycia.',
    notes: 'Źródło: GMT400 — Fender, Door & Hood.',
  },
  {
    id: 'drzwi_tyl_tahoe_yukon_zgodne',
    category: 'Nadwozie i blacharka',
    part: 'Tylne drzwi boczne (Tahoe vs Yukon)',
    donorConditions: 'Chevrolet Tahoe 4-drzwiowy',
    recipientConditions: 'GMC Yukon 4-drzwiowy (lub odwrotnie)',
    verdict: 'PASUJE',
    sourceStatus: 'Opinia (forum)',
    sourceSlug: SOURCE_ENTRIES.nadwozie.slug,
    sourceTitle: SOURCE_ENTRIES.nadwozie.title,
    justification: 'Tylne drzwi boczne są takie same między Chevrolet Tahoe a GMC Yukon.',
    notes: 'Źródło: GMT400 — Fender, Door & Hood.',
  },
  {
    id: 'drzwi_tyl_suburban_do_tahoe',
    category: 'Nadwozie i blacharka',
    part: 'Tylne drzwi boczne (Suburban do Tahoe/Yukon)',
    donorConditions: 'Suburban',
    recipientConditions: 'Tahoe lub Yukon 4-drzwiowy',
    verdict: 'NIE PASUJE',
    sourceStatus: 'Opinia (forum)',
    sourceSlug: SOURCE_ENTRIES.nadwozie.slug,
    sourceTitle: SOURCE_ENTRIES.nadwozie.title,
    justification: 'Nie zakładać tylnych drzwi bocznych z Suburbana do Tahoe/Yukona bez potwierdzenia numeru części.',
    notes: 'Źródło: GMT400 — Fender, Door & Hood.',
  },
  {
    id: 'drzwi_barn_doors_suv_zgodne',
    category: 'Nadwozie i blacharka',
    part: 'Tylne drzwi bagażnika dwuskrzydłowe (barn doors)',
    donorConditions: 'Suburban z nadwoziem barn doors',
    recipientConditions: 'Tahoe lub Yukon z nadwoziem barn doors (lub odwrotnie)',
    verdict: 'PASUJE',
    sourceStatus: 'Opinia (forum)',
    sourceSlug: SOURCE_ENTRIES.nadwozie.slug,
    sourceTitle: SOURCE_ENTRIES.nadwozie.title,
    justification: 'Drzwi dwuskrzydłowe tylne (barn doors) są zamienne między Suburbanem a Tahoe/Yukon przy tym samym typie nadwozia.',
    notes: 'Źródło: GMT400 — Fender, Door & Hood.',
  },
  {
    id: 'drzwi_barn_doors_do_tailgate',
    category: 'Nadwozie i blacharka',
    part: 'Tylne drzwi bagażnika (barn doors vs klapa tailgate)',
    donorConditions: 'Drzwi barn doors (dwuskrzydłowe)',
    recipientConditions: 'Nadwozie z opuszczaną klapą (tailgate) lub pickup',
    verdict: 'NIE PASUJE',
    sourceStatus: 'Opinia (forum)',
    sourceSlug: SOURCE_ENTRIES.nadwozie.slug,
    sourceTitle: SOURCE_ENTRIES.nadwozie.title,
    justification: 'Inne punkty mocowania zawiasów, rygli i wytłoczeń tylnego otworu nadwozia.',
    notes: 'Źródło: GMT400 — Fender, Door & Hood.',
  },
  {
    id: 'atrapa_ten_sam_okres_88_93',
    category: 'Nadwozie i blacharka',
    part: 'Atrapa chłodnicy (grill)',
    donorConditions: 'GMT400 1988-1993',
    recipientConditions: 'GMT400 1988-1993',
    verdict: 'PASUJE',
    sourceStatus: 'Potwierdzone (2+ źródła)',
    sourceSlug: SOURCE_ENTRIES.nadwozie.slug,
    sourceTitle: SOURCE_ENTRIES.nadwozie.title,
    justification: 'Atrapa pasuje w obrębie generacji przodu 1988-1993.',
    notes: 'Źródła: Street Trucks, FullSizeChevy.',
  },
  {
    id: 'atrapa_ten_sam_okres_94_98',
    category: 'Nadwozie i blacharka',
    part: 'Atrapa chłodnicy (grill)',
    donorConditions: 'GMT400 1994-1998 (oraz standardowe SUV 1999-2000)',
    recipientConditions: 'GMT400 1994-1998 (oraz standardowe SUV 1999-2000)',
    verdict: 'PASUJE',
    sourceStatus: 'Potwierdzone (2+ źródła)',
    sourceSlug: SOURCE_ENTRIES.nadwozie.slug,
    sourceTitle: SOURCE_ENTRIES.nadwozie.title,
    justification: 'Nowy wygląd atrapy wprowadzony w 1994 roku pasuje do roczników 1994-1998 i późniejszych SUV.',
    notes: 'Źródła: Street Trucks, FullSizeChevy.',
  },
  {
    id: 'atrapa_mieszany_okres',
    category: 'Nadwozie i blacharka',
    part: 'Atrapa chłodnicy (grill)',
    donorConditions: 'Atrapa 1988-1993',
    recipientConditions: 'Pojazd 1994-1998 (lub odwrotnie)',
    verdict: 'NIE PASUJE',
    sourceStatus: 'Potwierdzone (2+ źródła)',
    sourceSlug: SOURCE_ENTRIES.nadwozie.slug,
    sourceTitle: SOURCE_ENTRIES.nadwozie.title,
    justification: 'Atrapa 1994-98 ma nowy wygląd i inny profil mocowań w porównaniu z 1988-93. Nie mieszać bez wymiany reszty przodu.',
    notes: 'Potwierdzone w 2+ źródłach.',
  },
  {
    id: 'klosze_lamp_luka',
    category: 'Nadwozie i blacharka',
    part: 'Klosze i reflektory przednie',
    donorConditions: 'Dowolne reflektory/klosze przednie GMT400',
    recipientConditions: 'Dowolny pojazd GMT400',
    verdict: 'BRAK DANYCH',
    sourceStatus: 'NIE POTWIERDZONO',
    sourceSlug: SOURCE_ENTRIES.faq_luki.slug,
    sourceTitle: SOURCE_ENTRIES.faq_luki.title,
    justification: 'LUKA W ŹRÓDŁACH: Zakres lat zmiany lamp jest sporny (FullSizeChevy podaje 1994, Street Trucks kompozyty od 1990). Sprawdź numer części / manual.',
    notes: 'Wpisana luka w paczce 5.',
    isGap: true,
  },

  // ==========================================
  // SKRZYNIA BIEGÓW 4L60E (Wpis 03)
  // ==========================================
  {
    id: 'skrzynia_4l60e_92_94_zgodna',
    category: 'Skrzynia biegów (4L60-E)',
    part: 'Skrzynia biegów 4L60E (kompletny zespół)',
    donorConditions: '4L60E rocznik 1992-1994',
    recipientConditions: 'GMT400 rocznik 1992-1994',
    verdict: 'PASUJE',
    sourceStatus: 'Potwierdzone (2+ źródła)',
    sourceSlug: SOURCE_ENTRIES.skrzynia.slug,
    sourceTitle: SOURCE_ENTRIES.skrzynia.title,
    justification: 'Zespoły są zamienne jako całość między pojazdami z tych lat (zawory, pompa, płyta separacyjna bez PWM, wiązka).',
    notes: 'Potwierdzone w: gmt400.com, Core Transmission Parts.',
  },
  {
    id: 'skrzynia_4l60e_92_94_do_95_plus',
    category: 'Skrzynia biegów (4L60-E)',
    part: 'Skrzynia biegów 4L60E (kompletny zespół)',
    donorConditions: '4L60E rocznik 1992-1994',
    recipientConditions: 'GMT400 rocznik 1995 lub 1996+',
    verdict: 'NIE PASUJE',
    sourceStatus: 'Potwierdzone (2+ źródła)',
    sourceSlug: SOURCE_ENTRIES.skrzynia.slug,
    sourceTitle: SOURCE_ENTRIES.skrzynia.title,
    justification: 'Brak sterowania TCC PWM oraz brak portów pod MLPS (1996+). Nie mieszać z 1995 i 1996+ bez wymiany części wewnętrznych.',
    notes: 'Potwierdzone w: gmt400.com, Core Transmission Parts.',
  },
  {
    id: 'skrzynia_4l60e_95_zgodna',
    category: 'Skrzynia biegów (4L60-E)',
    part: 'Skrzynia biegów 4L60E (kompletny zespół)',
    donorConditions: '4L60E rocznik 1995 (z odlewem PWM)',
    recipientConditions: 'GMT400 rocznik 1995',
    verdict: 'PASUJE',
    sourceStatus: 'Potwierdzone (2+ źródła)',
    sourceSlug: SOURCE_ENTRIES.skrzynia.slug,
    sourceTitle: SOURCE_ENTRIES.skrzynia.title,
    justification: 'Skrzynia 1995 pasuje do rocznika 1995 (TCC sterowane PWM od 1995).',
    notes: 'Potwierdzone w: gmt400.com, Core Transmission Parts.',
  },
  {
    id: 'skrzynia_4l60e_95_mieszana',
    category: 'Skrzynia biegów (4L60-E)',
    part: 'Skrzynia biegów 4L60E (kompletny zespół)',
    donorConditions: '4L60E rocznik 1995',
    recipientConditions: 'GMT400 rocznik 1992-1994 lub 1996-1997',
    verdict: 'WARUNKOWO',
    sourceStatus: 'Potwierdzone (2+ źródła)',
    sourceSlug: SOURCE_ENTRIES.skrzynia.slug,
    sourceTitle: SOURCE_ENTRIES.skrzynia.title,
    justification: 'Rocznik przejściowy. Wymaga wymiany pompy, korpusu zaworów, płyty separacyjnej, wiązki i solenoidu przy przejściu na lub z innego rocznika.',
    notes: 'Potwierdzone w: gmt400.com, Core Transmission Parts.',
  },
  {
    id: 'skrzynia_4l60e_96_97_zgodna',
    category: 'Skrzynia biegów (4L60-E)',
    part: 'Skrzynia biegów 4L60E (kompletny zespół)',
    donorConditions: '4L60E rocznik 1996-1997',
    recipientConditions: 'GMT400 rocznik 1996-1997',
    verdict: 'PASUJE',
    sourceStatus: 'Potwierdzone (2+ źródła)',
    sourceSlug: SOURCE_ENTRIES.skrzynia.slug,
    sourceTitle: SOURCE_ENTRIES.skrzynia.title,
    justification: 'Obudowa z gwintowanymi portami pod czujnik pozycji dźwigni (MLPS); zaktualizowany obwód solenoidu 3-2.',
    notes: 'Podział na roczniki potwierdzony w 2 źródłach.',
  },
  {
    id: 'skrzynia_4l60e_obudowa_92_95_do_96',
    category: 'Skrzynia biegów (4L60-E)',
    part: 'Obudowa skrzyni 4L60E',
    donorConditions: 'Obudowa 4L60E 1992-1995 (bez portów MLPS)',
    recipientConditions: 'Pojazd GMT400 rocznik 1996+',
    verdict: 'NIE PASUJE',
    sourceStatus: 'Opinia (forum)',
    sourceSlug: SOURCE_ENTRIES.skrzynia.slug,
    sourceTitle: SOURCE_ENTRIES.skrzynia.title,
    justification: 'Obudowy 1992-95 nie pasują do pojazdów 1996+ ze względu na brak punktów montażowych czujnika MLPS.',
    notes: 'Źródło: gmt400.com.',
  },
  {
    id: 'skrzynia_4l60e_dzwon_staly_do_ls',
    category: 'Skrzynia biegów (4L60-E)',
    part: 'Skrzynia biegów 4L60E (obudowa ze stałym dzwonem)',
    donorConditions: '4L60E rocznik 1996-1997 z wbudowanym (niedemontowalnym) dzwonem',
    recipientConditions: 'Pojazd z silnikiem Gen 3 (LS swap)',
    verdict: 'NIE PASUJE',
    sourceStatus: 'Opinia (forum)',
    sourceSlug: SOURCE_ENTRIES.skrzynia.slug,
    sourceTitle: SOURCE_ENTRIES.skrzynia.title,
    justification: 'Obudowa 1996-97 ze stałym dzwonem nie pasuje za silnik Gen 3 (LS). Do silnika LS wymagana jest wersja z odejmowanym dzwonem (od 1998).',
    notes: 'Źródła: gmt400.com, Core Transmission Parts.',
  },
  {
    id: 'konwerter_4l60e_298_vs_300',
    category: 'Skrzynia biegów (4L60-E)',
    part: 'Konwerter momentu 4L60E (298 mm vs 300 mm)',
    donorConditions: 'Konwerter 298 mm (1984-1997) lub 300 mm (od 1998)',
    recipientConditions: 'Skrzynia biegów o przeciwnej konstrukcji wałka/pompy',
    verdict: 'NIE PASUJE',
    sourceStatus: 'Potwierdzone (2+ źródła)',
    sourceSlug: SOURCE_ENTRIES.skrzynia.slug,
    sourceTitle: SOURCE_ENTRIES.skrzynia.title,
    justification: 'Nie zakładać konwertera 298 mm (1984-97) i 300 mm (od 1998) zamiennie. Od 1998 roku występuje inna pompa i wał wejściowy.',
    notes: 'Konwerter 300 mm od 1998 potwierdzony w 2+ źródłach.',
  },
  {
    id: 'wal_wejsciowy_4l60e_98_06',
    category: 'Skrzynia biegów (4L60-E)',
    part: 'Wał wejściowy 4L60E (1998-2006)',
    donorConditions: 'Wał wejściowy 1998-2006',
    recipientConditions: 'Skrzynia 4L60E w GMT400',
    verdict: 'WARUNKOWO',
    sourceStatus: 'Opinia (forum)',
    sourceSlug: SOURCE_ENTRIES.skrzynia.slug,
    sourceTitle: SOURCE_ENTRIES.skrzynia.title,
    justification: 'Wał zamienny między rocznikami, z zastrzeżeniem specyficznych wersji F-body/Corvette. W autach innych niż Corvette/F-body wał 300 mm wchodził od końca 2000.',
    notes: 'Źródło: gmt400.com.',
  },
  {
    id: 'mlps_96_03_zgodny',
    category: 'Skrzynia biegów (4L60-E)',
    part: 'Czujnik pozycji dźwigni MLPS (4L60E)',
    donorConditions: 'Czujnik MLPS rocznik 1996-2003 (z dwoma złączami Park i Neutral)',
    recipientConditions: 'GMT400 rocznik 1996-2000',
    verdict: 'PASUJE',
    sourceStatus: 'Opinia (forum)',
    sourceSlug: SOURCE_ENTRIES.skrzynia.slug,
    sourceTitle: SOURCE_ENTRIES.skrzynia.title,
    justification: 'Pierwszy typ z dwoma złączami pasuje do instalacji GMT400 1996-2000.',
    notes: 'Źródło: opis z gmt400.com.',
  },
  {
    id: 'mlps_96_03_do_2004',
    category: 'Skrzynia biegów (4L60-E)',
    part: 'Czujnik pozycji dźwigni MLPS (4L60E)',
    donorConditions: 'Czujnik MLPS z pojazdu 2004+',
    recipientConditions: 'GMT400 rocznik 1996-2000',
    verdict: 'NIE PASUJE',
    sourceStatus: 'Opinia (forum)',
    sourceSlug: SOURCE_ENTRIES.skrzynia.slug,
    sourceTitle: SOURCE_ENTRIES.skrzynia.title,
    justification: 'Nie mieszać typu z dwoma złączami (1996-2003) z późniejszymi typami jednozłączowymi z lat 2004+.',
    notes: 'Źródło: gmt400.com.',
  },
  {
    id: 'plyty_separacyjne_4l60e_mieszanie',
    category: 'Skrzynia biegów (4L60-E)',
    part: 'Płyta separacyjna i uszczelki 4L60E',
    donorConditions: 'Płyta separacyjna 1992-1994, 1995 lub 1996+',
    recipientConditions: 'Skrzynia 4L60E z innego zakresu lat',
    verdict: 'NIE PASUJE',
    sourceStatus: 'Opinia (forum)',
    sourceSlug: SOURCE_ENTRIES.skrzynia.slug,
    sourceTitle: SOURCE_ENTRIES.skrzynia.title,
    justification: 'Płyty separacyjne pod PWM (1995+) różnią się od wcześniejszych. Nie mieszać płyt między rocznikami 1992-94, 1995 i 1996+.',
    notes: 'Wewnętrzna niespójność źródeł co do uszczelek — zalecana ostrożność.',
  },
  {
    id: 'opornosc_solenoidu_3_2_luka',
    category: 'Skrzynia biegów (4L60-E)',
    part: 'Solenoid 3-2 4L60E (oporność 1996+)',
    donorConditions: 'Solenoid 3-2 do skrzyni 1996+',
    recipientConditions: '4L60E rocznik 1996+',
    verdict: 'BRAK DANYCH',
    sourceStatus: 'NIE POTWIERDZONO',
    sourceSlug: SOURCE_ENTRIES.faq_luki.slug,
    sourceTitle: SOURCE_ENTRIES.faq_luki.title,
    justification: 'LUKA W ŹRÓDŁACH: Źródła podają sprzeczne wartości oporności (gmt400.com: 18-21 omów, Core/Sonnax: 20-31 omów). Mierz i dobieraj do korpusu zaworów / sprawdź manual.',
    notes: 'Wpisana luka w paczce 5.',
    isGap: true,
  },
  {
    id: 'skrzynia_4l80e_zamiast_4l60e',
    category: 'Skrzynia biegów (4L60-E)',
    part: 'Skrzynia biegów 4L80E zamiast 4L60E (wałek wypustów)',
    donorConditions: 'Skrzynia 4L80E',
    recipientConditions: 'Pojazd ze skrzynią fabryczną 4L60E',
    verdict: 'NIE PASUJE',
    sourceStatus: 'NIE POTWIERDZONO',
    sourceSlug: SOURCE_ENTRIES.skrzynia.slug,
    sourceTitle: SOURCE_ENTRIES.skrzynia.title,
    justification: 'Nie mieszać 4L80E z 4L60E. Odmienne wymiary, liczba wypustów wałka wyjściowego (32 vs 27) i sterowanie. Liczba wypustów 4L80E usunięta z zakresu.',
    notes: '4L80E nie jest tematem paczki 5.',
  },

  // ==========================================
  // SKRZYNIA ROZDZIELCZA I OSIE (Wpis 04)
  // ==========================================
  {
    id: 'np241_27_spline_zgodna',
    category: 'Skrzynia rozdzielcza i osie',
    part: 'Skrzynia rozdzielcza NP241 / NP241C (dźwignia)',
    donorConditions: 'NP241 z wejściem 27 wypustów (splines)',
    recipientConditions: 'GMT400 4x4 ze skrzynią 4L60E (wyjście 27 wypustów) i dźwignią mechaniczną',
    verdict: 'PASUJE',
    sourceStatus: 'Opinia (forum)',
    sourceSlug: SOURCE_ENTRIES.reduktor_osie.slug,
    sourceTitle: SOURCE_ENTRIES.reduktor_osie.title,
    justification: 'Warunek to zgodna liczba wypustów (27 dla 4L60E) oraz sterowanie dźwignią mechaniczną.',
    notes: 'Źródła: gmt400.com, Pirate4x4, Offroad Motorist.',
  },
  {
    id: 'np241_32_spline_do_4l60e',
    category: 'Skrzynia rozdzielcza i osie',
    part: 'Skrzynia rozdzielcza NP241 (z wersji 4L80E/manual)',
    donorConditions: 'NP241 z wejściem 32 wypusty (np. z 2500/3500 z 4L80E lub manualem)',
    recipientConditions: 'GMT400 ze skrzynią 4L60E (wyjście 27 wypustów)',
    verdict: 'NIE PASUJE',
    sourceStatus: 'Opinia (forum)',
    sourceSlug: SOURCE_ENTRIES.reduktor_osie.slug,
    sourceTitle: SOURCE_ENTRIES.reduktor_osie.title,
    justification: 'Niezgodna liczba wypustów wałka (32 vs 27). Nie pasuje bezpośrednio bez przebudowy wałka wejściowego reduktora.',
    notes: 'Źródła: Pirate4x4, Offroad Motorist.',
  },
  {
    id: 'np243_27_spline_zgodna',
    category: 'Skrzynia rozdzielcza i osie',
    part: 'Skrzynia rozdzielcza NP243 (sterowanie elektryczne)',
    donorConditions: 'NP243 z wejściem 27 wypustów',
    recipientConditions: 'GMT400 4x4 ze skrzynią 4L60E (27 wypustów) i instalacją sterowania elektrycznego NP243',
    verdict: 'PASUJE',
    sourceStatus: 'Opinia (forum)',
    sourceSlug: SOURCE_ENTRIES.reduktor_osie.slug,
    sourceTitle: SOURCE_ENTRIES.reduktor_osie.title,
    justification: 'Zgodna liczba 27 wypustów oraz typ sterowania elektrycznego przyciskiem.',
    notes: 'Źródło: gmt400.com.',
  },
  {
    id: 'np243_32_spline_do_4l60e',
    category: 'Skrzynia rozdzielcza i osie',
    part: 'Skrzynia rozdzielcza NP243 (z 4L80E)',
    donorConditions: 'NP243 z wejściem 32 wypusty',
    recipientConditions: 'GMT400 ze skrzynią 4L60E (27 wypustów)',
    verdict: 'NIE PASUJE',
    sourceStatus: 'Opinia (forum)',
    sourceSlug: SOURCE_ENTRIES.reduktor_osie.slug,
    sourceTitle: SOURCE_ENTRIES.reduktor_osie.title,
    justification: 'Niezgodna liczba wypustów wałka (32 vs 27). Wymaga przebudowy wejścia reduktora.',
    notes: 'Źródła: Pirate4x4, Offroad Motorist.',
  },
  {
    id: 'np246_np8_zgodna',
    category: 'Skrzynia rozdzielcza i osie',
    part: 'Skrzynia rozdzielcza NP246 / NV246 (AutoTrac, RPO NP8)',
    donorConditions: 'NP246 (27 wypustów) z roczników 1998+',
    recipientConditions: 'GMT400 1998+ z kodem RPO NP8 (AutoTrac z przyciskiem AUTO)',
    verdict: 'PASUJE',
    sourceStatus: 'Opinia (forum)',
    sourceSlug: SOURCE_ENTRIES.reduktor_osie.slug,
    sourceTitle: SOURCE_ENTRIES.reduktor_osie.title,
    justification: 'Skrzynia rozdzielcza AutoTrac (od 1998 r.) pasuje do pojazdów z opcją NP8 przy zgodnej liczbie 27 wypustów.',
    notes: 'Opis NP8 potwierdzony w 2+ źródłach; wypusty: forum.',
  },
  {
    id: 'np246_zamiana_na_np241_np243',
    category: 'Skrzynia rozdzielcza i osie',
    part: 'Skrzynia rozdzielcza NP246 zamiana na NP241 / NP243',
    donorConditions: 'NP246 (NV246 AutoTrac)',
    recipientConditions: 'GMT400 ze starszym układem NP241 (dźwignia) lub NP243 (klasyczny przycisk)',
    verdict: 'WARUNKOWO',
    sourceStatus: 'Opinia (forum)',
    sourceSlug: SOURCE_ENTRIES.reduktor_osie.slug,
    sourceTitle: SOURCE_ENTRIES.reduktor_osie.title,
    justification: 'NP246 nie jest zamienna bez przeróbki przełącznika, wiązki i modułu TCCM. Zamiana na mechaniczną NP241 wymaga dźwigni, linkage i napędu przedniego.',
    notes: 'Źródła: Pirate4x4, Offroad Motorist. Brak oficjalnego dokumentu GM.',
  },
  {
    id: 'np241_np243_zakres_lat_luka',
    category: 'Skrzynia rozdzielcza i osie',
    part: 'Rocznikowe zakresy skrzyń rozdzielczych NP241 / NP243',
    donorConditions: 'Dowolna skrzynia NP241 lub NP243',
    recipientConditions: 'GMT400',
    verdict: 'BRAK DANYCH',
    sourceStatus: 'NIE POTWIERDZONO',
    sourceSlug: SOURCE_ENTRIES.faq_luki.slug,
    sourceTitle: SOURCE_ENTRIES.faq_luki.title,
    justification: 'LUKA W ŹRÓDŁACH: Brak potwierdzonych dokładnych zakresów rocznikowych dla NP241 i NP243 w źródłach. Sprawdź tabliczkę znamionową reduktora (numer NP) i manual.',
    notes: 'Wpisana luka w paczce 5.',
    isGap: true,
  },
  {
    id: 'os_tyl_10_bolt_8_5_ck1500',
    category: 'Skrzynia rozdzielcza i osie',
    part: 'Tylna oś 8.5" 10-bolt',
    donorConditions: 'Oś 8.5" 10-bolt z C/K 1500',
    recipientConditions: 'C/K 1500',
    verdict: 'WARUNKOWO',
    sourceStatus: 'Potwierdzone (2+ źródła)',
    sourceSlug: SOURCE_ENTRIES.reduktor_osie.slug,
    sourceTitle: SOURCE_ENTRIES.reduktor_osie.title,
    justification: 'Typowa dla C/K 1500, lecz poszczególne mosty 10-bolt różnią się przełożeniem, szerokością, hamulcami i liczbą wypustów półosi. Nie mylić z osią samochodową 8.5".',
    notes: 'Potwierdzone w: gmt400.info, gm-trucks.com.',
  },
  {
    id: 'os_tyl_14_bolt_9_5_semi_float',
    category: 'Skrzynia rozdzielcza i osie',
    part: 'Tylna oś 9.5" 14-bolt semi-float',
    donorConditions: 'Oś 9.5" 14-bolt semi-float z 1500 HD lub 2500 LD 2WD',
    recipientConditions: 'C/K 1500 2WD',
    verdict: 'WARUNKOWO',
    sourceStatus: 'Potwierdzone (2+ źródła)',
    sourceSlug: SOURCE_ENTRIES.reduktor_osie.slug,
    sourceTitle: SOURCE_ENTRIES.reduktor_osie.title,
    justification: '14-śrubowa półpływająca oś to bezpośrednia wymiana mechaniczna poza koniecznością zastosowania przejściówki przegubu wału (conversion U-joint).',
    notes: 'Potwierdzone w: gm-trucks.com, gmt400.info.',
  },
  {
    id: 'os_tyl_9_5_zamiast_10_5',
    category: 'Skrzynia rozdzielcza i osie',
    part: 'Tylna oś 9.5" semi-float vs 10.5" full-float',
    donorConditions: 'Oś 9.5" 14-bolt semi-float',
    recipientConditions: 'Pojazd wymagający osi 10.5" full-float (C/K 2500 HD / 3500)',
    verdict: 'NIE PASUJE',
    sourceStatus: 'Potwierdzone (2+ źródła)',
    sourceSlug: SOURCE_ENTRIES.reduktor_osie.slug,
    sourceTitle: SOURCE_ENTRIES.reduktor_osie.title,
    justification: 'Nie mylić 14-bolt 9.5" z 14-bolt full-float 10.5" — to zupełnie odmienne osie o innej nośności, piaście i łożyskowaniu.',
    notes: 'Potwierdzone w 2+ źródłach.',
  },
  {
    id: 'os_tyl_14_bolt_10_5_full_float',
    category: 'Skrzynia rozdzielcza i osie',
    part: 'Tylna oś 10.5" 14-bolt full-float',
    donorConditions: 'Oś 10.5" 14-bolt full-float z C/K 2500 lub 3500 (lub Suburban 2500)',
    recipientConditions: 'C/K 2500, 3500, Cab & Chassis lub Suburban 2500',
    verdict: 'PASUJE',
    sourceStatus: 'Potwierdzone (2+ źródła)',
    sourceSlug: SOURCE_ENTRIES.reduktor_osie.slug,
    sourceTitle: SOURCE_ENTRIES.reduktor_osie.title,
    justification: 'Montowana w C/K 2500/3500 i Cab & Chassis; ta sama obudowa w pickupie i Suburbanie 2500.',
    notes: 'Potwierdzone w: gmt400.info, gm-trucks.com.',
  },
  {
    id: 'os_tyl_9_5_zakres_lat_luka',
    category: 'Skrzynia rozdzielcza i osie',
    part: 'Zakres lat tylnej osi 9.5" 14-bolt',
    donorConditions: 'Oś 9.5" 14-bolt',
    recipientConditions: 'GMT400',
    verdict: 'BRAK DANYCH',
    sourceStatus: 'NIE POTWIERDZONO',
    sourceSlug: SOURCE_ENTRIES.faq_luki.slug,
    sourceTitle: SOURCE_ENTRIES.faq_luki.title,
    justification: 'LUKA W ŹRÓDŁACH: Zakres lat 1988-98 dla osi 9.5" 14-bolt nie został potwierdzony w 2 niezależnych źródłach. Sprawdź kody RPO i manual.',
    notes: 'Wpisana luka w paczce 5.',
    isGap: true,
  },
  {
    id: 'osie_przednie_ifs_luka',
    category: 'Skrzynia rozdzielcza i osie',
    part: 'Przednie osie napędowe (IFS 8.25" / 9.25")',
    donorConditions: 'Przednia oś IFS',
    recipientConditions: 'GMT400 4x4',
    verdict: 'BRAK DANYCH',
    sourceStatus: 'NIE POTWIERDZONO',
    sourceSlug: SOURCE_ENTRIES.faq_luki.slug,
    sourceTitle: SOURCE_ENTRIES.faq_luki.title,
    justification: 'LUKA W ŹRÓDŁACH: Brak tabeli rocznikowej przednich osi (IFS). Przednie osie nie były badane w źródłach paczki 5. Sprawdź katalogi GM Heritage i manual.',
    notes: 'Wpisana luka w paczce 5.',
    isGap: true,
  },

  // ==========================================
  // ROZPOZNANIE PLATFORMY 1999-2000 I FAQ (Wpisy 01 i 05)
  // ==========================================
  {
    id: 'platforma_silverado_sierra_99_00',
    category: 'Identyfikacja platformy (1999-2000)',
    part: 'Części platformy: Silverado / Sierra (1999-2000)',
    donorConditions: 'Chevrolet Silverado 1500/2500 lub GMC Sierra 1500/2500 rocznik 1999-2000',
    recipientConditions: 'GMT400 (C/K 1988-2000, Tahoe, Yukon, Suburban)',
    verdict: 'NIE PASUJE',
    sourceStatus: 'Potwierdzone (2+ źródła)',
    sourceSlug: SOURCE_ENTRIES.zasady.slug,
    sourceTitle: SOURCE_ENTRIES.zasady.title,
    justification: 'Pickupy Silverado i Sierra 1500/2500 od rocznika 1999 to zupełnie nowa platforma GMT800. Elementy nadwozia i podwozia nie pasują do GMT400.',
    notes: 'Potwierdzone w: Wikipedia — Chevrolet Silverado, OBS Clash — 95-98+ OBS.',
  },
  {
    id: 'platforma_suv_99_00',
    category: 'Identyfikacja platformy (1999-2000)',
    part: 'Części platformy: Suburban / Tahoe / Yukon (1999-2000)',
    donorConditions: 'Suburban, Tahoe (w tym Tahoe Limited 2000), Yukon, Yukon Denali, Escalade z lat 1999-2000',
    recipientConditions: 'GMT400 (SUV 1988-1998)',
    verdict: 'PASUJE',
    sourceStatus: 'Potwierdzone (2+ źródła)',
    sourceSlug: SOURCE_ENTRIES.zasady.slug,
    sourceTitle: SOURCE_ENTRIES.zasady.title,
    justification: 'SUV-y Suburban, Tahoe i Yukon w latach 1999-2000 były nadal produkowane na platformie GMT400 (OBS). Części platformowe są zamienne.',
    notes: 'Potwierdzone w 2+ źródłach.',
  },
  {
    id: 'platforma_classic_ck_99_00',
    category: 'Identyfikacja platformy (1999-2000)',
    part: 'Części platformy: Klasyczne C/K 1500 "Classic" (1999-2000)',
    donorConditions: 'C/K 1500 z roczników 1999-2000',
    recipientConditions: 'GMT400',
    verdict: 'WARUNKOWO',
    sourceStatus: 'Opinia (jedno źródło)',
    sourceSlug: SOURCE_ENTRIES.zasady.slug,
    sourceTitle: SOURCE_ENTRIES.zasady.title,
    justification: 'Lekkie C/K 1500 produkowane równolegle w 1999-2000 podaje tylko jedno źródło (Wikipedia). Wymaga bezwzględnej weryfikacji 10. znaku VIN i naklejki SPID przed zakupem.',
    notes: 'Opinia (Wikipedia, jedno źródło). Ciężkie 2500/3500 HD do 2000 potwierdzone w 2+ źródłach.',
  },
  {
    id: 'lata_tahoe_yukon_2d_4d_luka',
    category: 'Identyfikacja platformy (1999-2000)',
    part: 'Lata wprowadzenia Tahoe / Yukon (2-drzwiowe vs 4-drzwiowe)',
    donorConditions: 'Tahoe / Yukon 2-drzwiowy lub 4-drzwiowy',
    recipientConditions: 'GMT400',
    verdict: 'BRAK DANYCH',
    sourceStatus: 'NIE POTWIERDZONO',
    sourceSlug: SOURCE_ENTRIES.faq_luki.slug,
    sourceTitle: SOURCE_ENTRIES.faq_luki.title,
    justification: 'LUKA W ŹRÓDŁACH: Dokładne lata wprowadzenia wersji 2- i 4-drzwiowych nie zostały potwierdzone w źródłach paczki 5. Sprawdź VIN i RPO.',
    notes: 'Wpisana luka w paczce 5.',
    isGap: true,
  },
  {
    id: 'wnetrze_paczka_5_luka',
    category: 'Identyfikacja platformy (1999-2000)',
    part: 'Elementy wnętrza (deska rozdzielcza, boczki, fotele)',
    donorConditions: 'Elementy wnętrza dowolnego rocznika',
    recipientConditions: 'GMT400',
    verdict: 'BRAK DANYCH',
    sourceStatus: 'Potwierdzone (2+ źródła)',
    sourceSlug: SOURCE_ENTRIES.faq_luki.slug,
    sourceTitle: SOURCE_ENTRIES.faq_luki.title,
    justification: 'POZA ZAKRESEM PACZKI 5: Różnice wnętrza 1988-94 vs 1995+ opisuje osobny wpis "Wnętrze GMT400" (paczka 4). Paczka 5 nie powtarza tych danych.',
    notes: 'Odsyła do osobnego wpisu paczki 4.',
    isGap: true,
  },
];

export interface CompatibilityStats {
  total: number;
  byVerdict: Record<Verdict, number>;
  byStatus: Record<SourceStatus, number>;
  gapsCount: number;
}

export function getCompatibilityStats(): CompatibilityStats {
  const byVerdict: Record<Verdict, number> = {
    'PASUJE': 0,
    'WARUNKOWO': 0,
    'NIE PASUJE': 0,
    'BRAK DANYCH': 0,
  };
  const byStatus: Record<SourceStatus, number> = {
    'Potwierdzone (2+ źródła)': 0,
    'Opinia (forum)': 0,
    'Opinia (jedno źródło)': 0,
    'NIE POTWIERDZONO': 0,
  };

  let gapsCount = 0;
  for (const rule of COMPATIBILITY_RULES) {
    byVerdict[rule.verdict]++;
    byStatus[rule.sourceStatus]++;
    if (rule.isGap || rule.verdict === 'BRAK DANYCH') {
      gapsCount++;
    }
  }

  return {
    total: COMPATIBILITY_RULES.length,
    byVerdict,
    byStatus,
    gapsCount,
  };
}

export interface RecipientVehicleInput {
  model?: string;
  year?: string;
  drivetrain?: string;
  bodyType?: string;
  transmission?: string;
}

export interface DonorPartInput {
  partType: string;
  donorModel?: string;
  donorYear?: string;
  donorSpec?: string;
}

export interface CompatibilityEvaluation {
  verdict: Verdict;
  sourceStatus: SourceStatus;
  ruleTitle: string;
  justification: string;
  sourceSlug: string;
  sourceTitle: string;
  sourceHref: string;
  isGap: boolean;
}

/**
 * Ocena dopasowania na podstawie reguł paczki 5.
 * ZASADA WERDYKTU: PASUJE wolno wydać wyłącznie, gdy reguła ze źródeł
 * jawnie obejmuje podaną kombinację obu stron. W razie braku danych, niepełności
 * lub luk wydawany jest werdykt BRAK DANYCH lub WARUNKOWO.
 */
export function evaluateCompatibility(
  ruleId: string,
  recipient: RecipientVehicleInput,
  donor: DonorPartInput
): CompatibilityEvaluation {
  const rule = COMPATIBILITY_RULES.find(r => r.id === ruleId);

  if (!rule) {
    return {
      verdict: 'BRAK DANYCH',
      sourceStatus: 'NIE POTWIERDZONO',
      ruleTitle: 'Nieznana kombinacja części',
      justification: 'Ta kombinacja nie występuje w opublikowanych tabelach zamienności paczki 5. Zgodnie z zasadą bezpieczeństwa: sprawdź numer części w katalogu lub manualu.',
      sourceSlug: SOURCE_ENTRIES.faq_luki.slug,
      sourceTitle: SOURCE_ENTRIES.faq_luki.title,
      sourceHref: SOURCE_ENTRIES.faq_luki.href,
      isGap: true,
    };
  }

  // Jeśli reguła wprost jest luką lub niepotwierdzona
  if (rule.isGap || rule.verdict === 'BRAK DANYCH') {
    return {
      verdict: 'BRAK DANYCH',
      sourceStatus: rule.sourceStatus,
      ruleTitle: rule.part,
      justification: rule.justification,
      sourceSlug: rule.sourceSlug,
      sourceTitle: rule.sourceTitle,
      sourceHref: `/baza/${rule.sourceSlug}`,
      isGap: true,
    };
  }

  // Wymóg kompletności obu stron
  const hasRecipientInfo = Boolean(recipient.year || recipient.model);
  const hasDonorInfo = Boolean(donor.donorYear || donor.donorModel || donor.donorSpec);

  if (!hasRecipientInfo || !hasDonorInfo) {
    return {
      verdict: 'BRAK DANYCH',
      sourceStatus: 'NIE POTWIERDZONO',
      ruleTitle: rule.part,
      justification: 'Niepełne dane o pojeździe lub dawcy. PASUJE wolno wydać wyłącznie przy pełnej zgodności warunków obu stron ze źródłami paczki 5. Sprawdź rocznik i wersję obu aut.',
      sourceSlug: SOURCE_ENTRIES.faq_luki.slug,
      sourceTitle: SOURCE_ENTRIES.faq_luki.title,
      sourceHref: SOURCE_ENTRIES.faq_luki.href,
      isGap: false,
    };
  }

  return {
    verdict: rule.verdict,
    sourceStatus: rule.sourceStatus,
    ruleTitle: rule.part,
    justification: rule.justification,
    sourceSlug: rule.sourceSlug,
    sourceTitle: rule.sourceTitle,
    sourceHref: `/baza/${rule.sourceSlug}`,
    isGap: Boolean(rule.isGap),
  };
}

/**
 * Zwraca tekst nagłówka wyniku dopasowania uwzględniający stopień pewności źródła.
 * Przy opiniach z forum lub pojedynczych źródłach nie używa kategorycznego "WERDYKT: PASUJE",
 * lecz precyzuje "Według relacji właścicieli pasuje".
 */
export function verdictHeadline(verdict: Verdict, sourceStatus: SourceStatus): string {
  const isUncertain = sourceStatus === 'Opinia (forum)' || sourceStatus === 'Opinia (jedno źródło)';
  if (verdict === 'PASUJE' && isUncertain) {
    return 'Według relacji właścicieli pasuje';
  }
  if (verdict === 'WARUNKOWO' && isUncertain) {
    return 'Według relacji właścicieli pasuje warunkowo';
  }
  return `WERDYKT: ${verdict}`;
}

/**
 * Zwraca etykietę znacznika werdyktu uwzględniającą stopień pewności źródła.
 * Dla pozycji opartych na opinii z forum lub pojedynczym źródle dodaje dopisek "WG RELACJI"
 * (np. "PASUJE WG RELACJI", "WARUNKOWO WG RELACJI", "NIE PASUJE WG RELACJI").
 * Pozycje potwierdzone (2+ źródła) oraz BRAK DANYCH pozostają bez zmian.
 */
export function verdictBadgeLabel(verdict: Verdict, sourceStatus: SourceStatus): string {
  const isUncertain = sourceStatus === 'Opinia (forum)' || sourceStatus === 'Opinia (jedno źródło)';
  if (isUncertain && verdict !== 'BRAK DANYCH') {
    return `${verdict} WG RELACJI`;
  }
  return verdict;
}
