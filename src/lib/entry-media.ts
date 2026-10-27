/**
 * Grafiki i zdjęcia przypisane do konkretnych wpisów encyklopedii (klucz: id strony Notion, małe litery, bez myślników).
 * Zasady: tylko zdjęcia o potwierdzonej wolnej licencji (autor, licencja, URL widoczne przy zdjęciu i w docs/photo-credits.md)
 * oraz własne rysunki wektorowe gmt400.pl zbudowane od nowa z danych podanych w źródłach. Bez grafik AI, bez zdjęć z forów,
 * bez kopiowania ilustracji Haynes/GM. Wpis z `tile: null` ma na liście srebrną ikonę kategorii (nie obraz „po słowach kluczowych”).
 */

export interface MediaCredit {
  author: string;
  licence: string;
  licenceUrl?: string;
  sourceUrl: string;
  sourceLabel: string;
}

export interface MediaFigure {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
  /** Zdjęcie z zewnętrznego źródła — wymaga atrybucji. Bez pola: własny rysunek gmt400.pl. */
  credit?: MediaCredit;
  /** Skąd pochodzą dane własnego rysunku. */
  basis?: string;
}

export interface EntryMedia {
  /** Zdjęcie na miniaturze kafelka listy; null = srebrna ikona kategorii. */
  tile: string | null;
  figures: MediaFigure[];
  /** Id schematów z /schematy do podlinkowania (zastępuje dopasowanie po słowach z tytułu). */
  schematics: string[];
}

const COMMONS = (file: string) => `https://commons.wikimedia.org/wiki/File:${file}`;

const ARMY_DRAWING: MediaFigure = {
  src: '/baza/silnik-6-5-rysunek-army.webp',
  alt: 'Czarno-biały rysunek techniczny silnika Chevrolet 6.2/6.5 L V8 diesel z osprzętem',
  width: 502,
  height: 393,
  caption: 'Rysunek silnika 6.2/6.5 L V8 diesel z wojskowej instrukcji części (wersja militarna — osprzęt może różnić się od GMT400, sprawdź w swoim aucie / manualu).',
  credit: {
    author: 'US Army, TM 9-2320-280-24P-1 (2001)',
    licence: 'domena publiczna (praca rządu USA)',
    sourceUrl: COMMONS('Chevrolet_6.2-6.5L_engine.jpg'),
    sourceLabel: 'Wikimedia Commons',
  },
};

const CUTAWAY_4L80: MediaFigure = {
  src: '/baza/skrzynia-4l80-przekroj.webp',
  alt: 'Skrzynia biegów Hydra-Matic 4L80 w przekroju — eksponat muzealny',
  width: 1280,
  height: 853,
  caption: 'Skrzynia Hydra-Matic 4L80 w przekroju (eksponat muzeum). Oznaczenie modelu pochodzi z opisu na Commons; 4L80-E to wersja ze sterowaniem elektronicznym.',
  credit: {
    author: 'Michael Barera',
    licence: 'CC BY-SA 4.0',
    licenceUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    sourceUrl: COMMONS('Ypsilanti_Automotive_Heritage_Museum_May_2015_064_(Hydra-Matic_4L80_transmission).jpg'),
    sourceLabel: 'Wikimedia Commons (Ypsilanti Automotive Heritage Museum, maj 2015)',
  },
};

const K2500_TD: MediaFigure = {
  src: '/baza/k2500-turbo-diesel-1998.webp',
  alt: 'Czerwony Chevrolet K2500 z 1998 roku (GMT400) z dieslem 6.5 Turbo Diesel, widok z przodu',
  width: 600,
  height: 450,
  caption: 'Chevrolet K2500 z 1998 roku z dieslem 6.5 Turbo Diesel i manualną skrzynią NV4500 (opis pochodzi z Commons) — zdjęcie poglądowe nadwozia.',
  credit: {
    author: 'Angilas89',
    licence: 'domena publiczna (autor zrzekł się praw)',
    sourceUrl: COMMONS('1998_K2500_Turbo_Diesel_with_NV_4500.jpg'),
    sourceLabel: 'Wikimedia Commons',
  },
};

const SUBURBAN_DIESEL: MediaFigure = {
  src: '/baza/k2500-diesel-suburban.webp',
  alt: 'Chevrolet Suburban K2500 z dieslem (GMT400) — widok z przodu',
  width: 640,
  height: 480,
  caption: 'Przykładowy egzemplarz GMT400 (Suburban K2500 Diesel) — zdjęcie poglądowe, nie ilustruje konkretnej usterki.',
  credit: {
    author: 'Angilas89',
    licence: 'domena publiczna (autor zrzekł się praw)',
    sourceUrl: COMMONS('GMT400_K2500_Diesel_Suburban.jpg'),
    sourceLabel: 'Wikimedia Commons',
  },
};

const svg = (file: string, alt: string, height: number, caption: string, basis: string): MediaFigure => ({
  src: `/baza/${file}`, alt, width: 900, height, caption, basis,
});

const FIG = {
  winter: svg('6-5-td-rozruch-zima.svg', 'Tabela czasu podgrzewania bloku diesla 6.5 wg oleju i temperatury oraz siedem kroków odpalania silnika wg GM 1991', 1024, 'Czas podgrzewania bloku i kolejność odpalania — własny rysunek.', 'GM Service Training 6.5L V8 Turbo Diesel, 1991, s. 1-15…1-16, 8-3'),
  transmissions: svg('skrzynie-przed-remontem.svg', 'Cztery poziomy kontroli skrzyni 4L60-E / 4L80-E przed remontem: od taniego sprawdzenia ATF po decyzję o remoncie', 1020, 'Lista kontrolna przed remontem — własny rysunek (kolejność poziomów: własne zestawienie).', 'SM GM 1996, biuletyny GM i ATRA 2000'),
  manifold: svg('kolektor-momenty-kolejnosc.svg', 'Tabela momentów śrub kolektora dolotowego V6/V8 w N·m wg roku i silnika oraz siedem kroków wymiany uszczelek', 1480, 'Momenty i kolejność prac — własny rysunek (bez rysunków kolejności dokręcania Haynes).', 'Haynes 1988–98, s. 2A-3, 2A-7…2A-10'),
  evap: svg('evap-schemat-blokowy.svg', 'Schemat blokowy układu EVAP: zbiornik, kanister, zawór purge, kolektor, zawór vent, czujnik ciśnienia i sterownik PCM', 1040, 'Układ EVAP — własny rysunek poglądowy (położenie elementów zależy od rocznika).', 'Haynes 1988–98, s. 6-22/6-23; GM Mode 6'),
  evapCodes: svg('evap-kody-p0449-p0455-p0505.svg', 'Karty kodów P0449, P0455 i P0505 z opisem wg SAE J2012, odpowiednikami w tabelach GM i listą kontroli', 1080, 'Trzy kody — własny rysunek; P0505 nie jest kodem EVAP.', 'SAE J2012; Haynes 1988–98, s. 6-7…6-23'),
  torques: svg('momenty-plyny-uklad-napedowy.svg', 'Tabele momentów dokręcania wału i tylnego mostu w N·m oraz płynów i pojemności mostu, skrzyni rozdzielczej i skrzyń biegów w litrach', 1767, 'Momenty (N·m) i płyny (litry) — własny rysunek, przeliczenia zaokrąglone.', 'Haynes 1988–98 (8-1, 1-2, 1-19, 1-25), OM C/K 1995 s. 6-33, SM GM 1998–99'),
  rpo: svg('rpo-vin-jak-odczytac.svg', 'Schemat 17 znaków VIN z zaznaczonym 8. (silnik) i 10. (rok) znakiem, tabele kodów roku, silnika i RPO oraz miejsca etykiety w aucie', 1797, 'Jak odczytać silnik, rok i RPO — własny rysunek.', 'instrukcje obsługi GM 1994–99, GM Heritage Center, 49 CFR § 565.15'),
};

const P = '406d7bf1c139';
const entries: Record<string, EntryMedia> = {
  // 6.5 TD — rozruch zimą, podgrzewacz bloku (GM 1991)
  [P + '81c7a5dfcabcd0d06741']: { tile: '/baza/k2500-turbo-diesel-1998.webp', figures: [K2500_TD, FIG.winter], schematics: [] },
  // 6.5 TD — pompa wtryskowa Stanadyne: brak legalnego zdjęcia pompy → ikona
  [P + '81879eddf1c45d619079']: { tile: null, figures: [], schematics: [] },
  // 6.5 TD — indeks usterek wg objawów
  [P + '81feb470c20e56bd41c3']: { tile: '/baza/silnik-6-5-rysunek-army.webp', figures: [ARMY_DRAWING], schematics: [] },
  // Skrzynie: lista kontrolna przed remontem (4L60-E / 4L80-E)
  [P + '813780baf1bdc2e559ca']: { tile: '/baza/skrzynia-4l80-przekroj.webp', figures: [CUTAWAY_4L80, FIG.transmissions], schematics: ['4l60e-atf-filter'] },
  // 4L60E — wskazówki ATRA: brak legalnego zdjęcia 4L60E → ikona
  [P + '81da8762f262b9ebd6b4']: { tile: null, figures: [], schematics: ['4l60e-atf-filter'] },
  // 4L80E — wskazówki ATRA
  [P + '816581f5ede37c7a2714']: { tile: '/baza/skrzynia-4l80-przekroj.webp', figures: [CUTAWAY_4L80], schematics: [] },
  // Wymiana uszczelek kolektora V6/V8
  [P + '815fa311f2d5638e438f']: { tile: null, figures: [FIG.manifold], schematics: ['vortec-intake-gaskets'] },
  // EVAP — diagnostyka
  [P + '81bda56acc366bcee094']: { tile: null, figures: [FIG.evap], schematics: [] },
  // EVAP — P0449, P0455, P0505
  [P + '81f29955ddcf187a821b']: { tile: null, figures: [FIG.evapCodes], schematics: [] },
  // Momenty i płyny — układ napędowy
  [P + '81348c33c1ecd25aca28']: { tile: null, figures: [FIG.torques], schematics: ['fluids-1995-1999'] },
  // RPO / VIN
  [P + '814fa765f9a1370aaf0c']: { tile: null, figures: [FIG.rpo], schematics: [] },
  // Kontrola przed zakupem
  [P + '81f1be71d2de46443215']: { tile: '/baza/k2500-diesel-suburban.webp', figures: [SUBURBAN_DIESEL], schematics: [] },
  // Bezpieczniki i przekaźniki
  [P + '8147a57debe671e1771f']: { tile: null, figures: [], schematics: ['fuse-locations'] },
  // Punkty masy
  [P + '81f09747d6fafbe330b4']: { tile: null, figures: [], schematics: ['ground-points'] },
};

export const ENTRY_MEDIA: Readonly<Record<string, EntryMedia>> = entries;

export function mediaKey(id: string | undefined | null): string {
  return (id || '').replace(/-/g, '').toLowerCase();
}

/** Wpis z rejestru lub undefined (wtedy działa dotychczasowe dopasowanie po słowach kluczowych). */
export function getEntryMedia(id: string | undefined | null): EntryMedia | undefined {
  return ENTRY_MEDIA[mediaKey(id)];
}

/** Miniatura kafelka: rejestr ma pierwszeństwo (null = ikona), w przeciwnym razie `fallback`. */
export function tileImageFor(id: string | undefined | null, fallback: string | null): string | null {
  const m = getEntryMedia(id);
  return m ? m.tile : fallback;
}
