import { ARMY_DRAWING, CUTAWAY_4L80, ENTRY_MEDIA, type MediaCredit, type MediaFigure } from './entry-media';

/**
 * Zdjęcia poglądowe tematów (miniatury kafelków DIY/usterek i ilustracja wpisu bez własnej grafiki).
 * Wyłącznie pliki z Wikimedia Commons o wolnej licencji (CC0 / domena publiczna / CC BY / CC BY-SA), zapisane lokalnie
 * jako webp w /public/baza/foto, z widocznym autorem i licencją (lista: docs/photo-credits.md). Bez grafik AI.
 * Temat bez pasującego zdjęcia = srebrna ikona kategorii (nigdy pusty kafelek).
 */

const COMMONS = (file: string) => `https://commons.wikimedia.org/wiki/File:${file}`;
const BY = 'https://creativecommons.org/licenses/by/2.0';
const BYSA2 = 'https://creativecommons.org/licenses/by-sa/2.0';
const BYSA3 = 'https://creativecommons.org/licenses/by-sa/3.0';
const BYSA4 = 'https://creativecommons.org/licenses/by-sa/4.0';
const CC0 = 'https://creativecommons.org/publicdomain/zero/1.0/';
const credit = (author: string, licence: string, licenceUrl: string | undefined, file: string): MediaCredit =>
  ({ author, licence, licenceUrl, sourceUrl: COMMONS(file), sourceLabel: 'Wikimedia Commons' });

const photo = (slug: string, width: number, height: number, alt: string, caption: string, c: MediaCredit): MediaFigure =>
  ({ src: `/baza/foto/${slug}.webp`, width, height, alt, caption, credit: c });

export const TOPIC_PHOTOS = {
  brakes: photo('hamulce-przod-suburban-1998', 960, 720,
    'Przednia tarcza i zacisk hamulca Chevroleta Suburban K2500 z 1998 roku na podnośniku',
    'Przednie hamulce Suburbana K2500 1998 (GMT400) po wymianie tarcz i zacisków na zamienniki — zdjęcie poglądowe, sprawdź w swoim aucie / manualu.',
    credit('simonov', 'CC BY-SA 2.0', BYSA2, 'New_front_brakes_-_49020391443.jpg')),
  frontAxle: photo('zawieszenie-przod-ifs-suburban-1998', 960, 720,
    'Przednie zawieszenie niezależne z półosią i wahaczami Chevroleta Suburban z 1998 roku, widok spod auta',
    'Przednie zawieszenie 4×4 (IFS) Suburbana 1998 po wymianie półosi — zdjęcie poglądowe, sprawdź w swoim aucie / manualu.',
    credit('simonov', 'CC BY-SA 2.0', BYSA2, "New_front_axles_assembly-_driver's_side.jpg")),
  engine: photo('silnik-v8-c1500-1990', 960, 640,
    'Komora silnika Chevroleta C1500 z 1990 roku z silnikiem V8 i otwartym filtrem powietrza',
    'Komora silnika Chevroleta C1500 1990 (GMT400) z przeróbkami właściciela (filtr powietrza, przewody) — zdjęcie poglądowe, sprawdź w swoim aucie / manualu.',
    credit('Michael Barera', 'CC BY-SA 4.0', BYSA4, "2017_Bois_d'Arc_Spring_Car_Show_50_(1990_Chevrolet_1500_engine).jpg")),
  coolant: photo('plyn-chlodniczy-chlodnica', 960, 720,
    'Zielony płyn chłodniczy widoczny w otwartym wlewie chłodnicy',
    'Płyn chłodniczy we wlewie chłodnicy (inne auto) — zdjęcie poglądowe; typ płynu i pojemność sprawdź w swoim aucie / manualu.',
    credit('EvelynGiggles', 'CC BY 2.0', BY, 'Antifreeze_in_the_radiator.jpg')),
  plugs: photo('swiece-zaplonowe', 960, 611,
    'Stara i nowa świeca zapłonowa na czerwonej szmatce',
    'Zużyta i nowa świeca zapłonowa — zdjęcie poglądowe; typ świecy i przerwę sprawdź w swoim aucie / manualu.',
    credit('Myke2020', 'domena publiczna', undefined, 'Spark_plugs_old_and_replacement_7058.JPG')),
  interior: photo('wnetrze-c1500', 960, 720,
    'Wnętrze Chevroleta C1500 Sport: deska rozdzielcza, kierownica i fotele',
    'Wnętrze Chevroleta C1500 Sport (GMT400) — zdjęcie poglądowe; wyposażenie różni się wg rocznika, sprawdź w swoim aucie.',
    credit('TKOIII', 'CC BY-SA 4.0', BYSA4, 'Chevrolet_C1500_Sport_Interior.jpg')),
  body: photo('nadwozie-tahoe-1997', 960, 591,
    'Dwudrzwiowy Chevrolet Tahoe z 1997 roku w kolorze Dark Cherry Metallic, widok z przodu z prawej',
    'Chevrolet Tahoe 2-drzwiowy 1997 (GMT400) — zdjęcie poglądowe nadwozia, sprawdź w swoim aucie.',
    credit('Cutlass', 'CC0 1.0', CC0, '1997_Chevrolet_Tahoe_2-door_in_Dark_Cherry_Metallic,_front_right,_2-19-2022.jpg')),
  towing: photo('hak-przyczepa', 960, 701,
    'Hak kulowy z zaczepem przyczepy kempingowej i łańcuchami bezpieczeństwa',
    'Zaczep przyczepy na haku kulowym z łańcuchami bezpieczeństwa (inne auto) — zdjęcie poglądowe; dopuszczalne masy sprawdź w swoim aucie / dowodzie.',
    credit('Tony Webster', 'CC BY 2.0', BY, 'Camping_Trailer_on_Ball_Hitch_-_Towing_with_Safety_Chains_(52953247534).jpg')),
  tires: photo('opona-wskazniki-zuzycia', 960, 641,
    'Bieżnik opony samochodowej z widocznymi wskaźnikami zużycia',
    'Bieżnik opony ze wskaźnikami zużycia — zdjęcie poglądowe; rozmiar i ciśnienie sprawdź na naklejce w swoim aucie.',
    credit('Brianc333a', 'CC BY-SA 4.0', BYSA4, 'BLC_2636.jpg')),
  oilFilter: photo('filtr-oleju', 960, 720,
    'Filtr oleju przykręcony do bloku silnika, widok z dołu',
    'Filtr oleju na bloku silnika (inne auto) — zdjęcie poglądowe; numer filtra i ilość oleju sprawdź w swoim aucie / manualu.',
    credit('Dvortygirl', 'CC BY-SA 3.0', BYSA3, 'Engine_oil_filter.JPG')),
  transmission: CUTAWAY_4L80,
  diesel: ARMY_DRAWING,
} satisfies Record<string, MediaFigure>;

export type TopicPhotoKey = keyof typeof TOPIC_PHOTOS;

/**
 * Reguły tematów (kolejność ma znaczenie — pierwsze dopasowanie wygrywa). `null` = świadomie ikona
 * (tabele, układy bez dobrego wolnego zdjęcia: wydech, paliwo, elektryka, klimatyzacja, OBD, skrzynia rozdzielcza).
 */
const RULES: [TopicPhotoKey | null, string[]][] = [
  [null, ['pojemnoś', 'pojemnos', 'kody rpo', 'moc i moment', 'przełożenia skrzyń', 'przelozenia skrzyn', 'laweta', 'jump start', 'z kabli', 'wały napęd', 'wał napęd', 'waly naped', 'krzyżak', 'krzyzak', 'tylny most', 'mostach', 'mostów', 'układ sterowania silnik', 'uklad sterowania silnik', 'wydech', 'tłumik', 'tlumik', 'katalizator', 'np231', 'np241', 'np205', 'skrzyni rozdziel', 'skrzynia rozdziel', 'reduktor', 'obd', 'klimaty']],
  ['diesel', ['6.5', '6,5', '6.2', '6,2', 'diesel', 'żarow', 'zarow', 'l56', 'l65', 'l57']],
  ['towing', ['przyczep']],
  ['tires', ['opon', 'bieżnik', 'bieznik', 'ciśnienie w koł', 'cisnienie w kol']],
  ['interior', ['kontrolki i wskaźniki', 'zestaw wskaźników', 'zestawu wskaźników']],
  ['body', ['zawias']],
  ['brakes', ['hamul', 'hamow', 'klock', 'zacisk', 'tarcze', 'tarcz hamul', 'abs', 'hydro-boost', 'hydroboost', 'rwal']],
  ['frontAxle', ['zawiesz', 'sworz', 'półoś', 'polos', 'piast', 'ifs', 'amortyz', 'wahacz', 'drążk', 'drazk', 'kierowni', 'kierowa', 'pitman', 'łożysk koła', 'lozysk kola', 'końcówk', 'koncowk', 'stabiliz', 'drążek skrętny', 'drazek skretny']],
  ['transmission', ['4l60', '4l80', '3l80', '700r4', '700-r4', 'th400', 'automat', 'atf', 'skrzyni bieg', 'skrzynia bieg', 'skrzyni 4l', 'skrzynia 4l', 'skrzynie 4l']],
  ['coolant', ['chłodz', 'chlodz', 'chłodnic', 'chlodnic', 'przegrzew', 'termostat', 'pompa wody', 'pompy wody', 'dex-cool', 'dexcool', 'płyn niezamarz']],
  ['plugs', ['świece zapło', 'swiece zaplo', 'świec zapło', 'swiec zaplo', 'świeca zapło', 'swieca zaplo']],
  ['oilFilter', ['oleju silnik', 'olej silnik', 'filtr oleju', 'filtra oleju', 'wymiana oleju', 'ciśnienie oleju', 'cisnienie oleju', 'olej 5w', 'olej 10w']],
  [null, ['paliw', 'zbiornik', 'elektr', 'akumulator', 'alternator', 'rozrusz', 'bezpiecznik', 'przekaźn', 'przekazn', 'instalacj', 'masa ', 'masy', 'mas ', 'uziem', 'reflektor', 'lamp', 'światł', 'swiatl', 'czujnik']],
  ['interior', [' wnętrz', ' wnetrz', 'deska', 'deski', 'kontrolk', 'wskaźnik', 'wskaznik', 'zegar', 'radio', 'przełącznik', 'przelacznik', 'stacyjk', 'fotel', 'pas bezpiecz', 'nagrzewnic', 'dmuchaw', 'ogrzewani', 'airbag', 'poduszk powietrz', 'poduszka powietrz', 'tapicer', 'podsufit']],
  ['body', ['nadwozi', 'drzwi', 'maska', 'maski', 'klapa', 'klapy', 'klap ', 'błotnik', 'blotnik', 'grill', 'atrap', 'lusterk', 'zamek', 'zamk', 'szyba', 'szyby', 'szybę', 'szyb ', 'boczek', 'boczk', 'rdz', 'korozj', 'próg', 'progi', 'progów', 'zawias', 'wycieracz', 'lakier', 'zderzak', 'uszczelki drzwi']],
  ['engine', ['silnik', 'głowic', 'glowic', 'rozrząd', 'rozrzad', 'kolektor', 'zawór', 'zawor', 'tłok', 'tlok', 'panew', 'vortec', 'tbi', 'csfi', 'cpi', 'wtrysk', 'uszczelk', 'pasek wielorowk', 'paska wielorowk', 'napinacz', 'egr', 'pcv', 'przepustnic', 'bieg jałow', 'bieg jalow', 'falowan', 'gaśnie', 'gasnie', 'odpala', 'stuk', 'spalanie oleju', '4.3', '5.0', '5.7', '7.4']],
];

/** Zdjęcie poglądowe tematu po tytule wpisu albo null (wtedy ikona kategorii). */
export function topicPhotoFor(nazwa: string | undefined | null): MediaFigure | null {
  const n = ` ${(nazwa || '').toLowerCase()} `;
  for (const [key, keys] of RULES) if (keys.some(k => n.includes(k))) return key ? TOPIC_PHOTOS[key] : null;
  return null;
}

const BY_SRC: Map<string, MediaFigure> = new Map();
for (const f of Object.values(TOPIC_PHOTOS)) BY_SRC.set(f.src, f);
for (const m of Object.values(ENTRY_MEDIA)) for (const f of m.figures) if (f.credit && !BY_SRC.has(f.src)) BY_SRC.set(f.src, f);

/** Atrybucja zdjęcia po ścieżce (miniatury kafelków); własne rysunki i pliki spoza biblioteki → undefined. */
export function creditForSrc(src: string | null | undefined): MediaCredit | undefined {
  return src ? BY_SRC.get(src)?.credit : undefined;
}

/** Krótka linia atrybucji do kafelka: „Fot. simonov · CC BY-SA 2.0”. */
export function shortCredit(c: MediaCredit): string {
  const lic = /domena publiczna/i.test(c.licence) ? 'domena publiczna' : c.licence;
  return `Fot. ${c.author.replace(/,.*$/, '')} · ${lic}`;
}
