// Lekki indeks globalnej wyszukiwarki w nagłówku (SearchOverlay): tytuł, krótki opis, adres i zakres (model/lata).
// Zamiast pełnego /api/notion (~0,9 MB) — tylko to, czego potrzeba do natychmiastowych wyników.
import { BODY_STYLES } from './body-styles';
import { getGuideEntries, getObdEntries, type KnowledgeEntry } from './knowledge-index';
import { findRpo } from './rpo-catalog';
import { getGuide } from './guides';

export type SearchGroup = 'usterki' | 'diy' | 'obd' | 'modele' | 'poradniki' | 'strony';

export type SearchIndexDoc = {
  /** Grupa wyników. */ g: SearchGroup;
  /** Klucz jak w /szukaj (href lub id) — te same podbicia tematów. */ k: string;
  /** Tytuł. */ t: string;
  /** Adres strony. */ u: string;
  /** Krótki opis (≤ 140 znaków). */ s: string;
  /** Tekst do dopasowania (bez polskich znaków, przycięty). */ b: string;
  /** Lata (tekst z bazy). */ y?: string;
  /** Modele z bazy. */ m?: string[];
  /** Zastosowanie: model / lata. */ am?: string[]; ay?: string[];
  /** Typ ogólny (OBD, poradnik, strona) — bez filtrowania po aucie. */ x?: 1;
};

export type SearchIndex = { version: 1; partial: boolean; docs: SearchIndexDoc[]; engines: Record<string, string> };

/** Strony i narzędzia serwisu (adresy istnieją w src/app). */
export const SEARCH_PAGES: { u: string; t: string; s: string; w: string }[] = [
  { u: '/narzedzia/rpo', t: 'Kody RPO — dekoder tabliczki', s: 'Odczytaj kody wyposażenia z tabliczki SPID i sprawdź ich znaczenie po polsku.', w: 'rpo kody wyposazenia tabliczka spid naklejka schowek g80 z71 gu6 opcje fabryczne' },
  { u: '/przeglady', t: 'Harmonogram przeglądów', s: 'Interwały z instrukcji GM dla Twojego rocznika: olej, ATF, świece, płyn chłodniczy.', w: 'przeglad przeglady serwis interwal harmonogram wymiana oleju atf plyn swiece filtr maintenance schedule' },
  { u: '/pojemnosci', t: 'Pojemności i płyny', s: 'Pojemności oleju, chłodzenia, skrzyń, mostów, zbiorników i A/C 1988–1999 z instrukcji GM, numery filtrów.', w: 'pojemnosc pojemnosci ile oleju plyn chlodniczy atf dexron skrzynia rozdzielcza most olej przekladniowy zbiornik paliwa klimatyzacja r134a filtr pf35 pf52 capacities fluids' },
  { u: '/poradnik-kupujacego', t: 'Poradnik kupującego', s: 'Na co patrzeć przy zakupie GMT400: rdza, rama, silnik, skrzynia, papiery.', w: 'zakup kupno kupic poradnik kupujacego ogledziny rdza rama checklista' },
  { u: '/schematy', t: 'Schematy', s: 'Schematy i punkty masy, bezpieczniki, przekaźniki.', w: 'schemat schematy elektryka masa punkty masy bezpieczniki przekazniki instalacja elektryczna wiring' },
  { u: '/vin', t: 'Sprawdź VIN', s: 'Dekodowanie 17-znakowego VIN: marka, model, rocznik, silnik.', w: 'vin dekoder numer nadwozia rocznik silnik fabryka dekodowanie' },
  { u: '/narzedzia/historia-vin', t: 'Historia VIN', s: 'Akcje serwisowe i skargi w bazie NHTSA oraz linki do archiwów aukcji.', w: 'historia vin nhtsa akcje serwisowe recall skargi aukcje raport' },
  { u: '/moj-samochod', t: 'Mój samochód', s: 'Profil auta: model, rocznik, silnik, RPO — dopasowane materiały i przeglądy.', w: 'moj samochod moje auto profil auta garaz pojazd' },
  { u: '/kody-obd', t: 'Kody OBD', s: 'Lista kodów błędów OBD z opisem, przyczynami i pierwszymi krokami.', w: 'kody obd bledy check engine kontrolka skaner obd1 obd2 obdii' },
  { u: '/diagnoza', t: 'Diagnoza objawów', s: 'Od objawu do przyczyny: krok po kroku, co sprawdzić najpierw.', w: 'diagnoza objaw objawy usterka nie odpala stuk wibracje diagnostyka' },
  { u: '/usterki', t: 'Usterki — lista', s: 'Typowe usterki GMT400 z objawami i rozwiązaniami.', w: 'usterki awarie problemy typowe usterki' },
  { u: '/diy', t: 'DIY / Porady — lista', s: 'Naprawy i porady krok po kroku do zrobienia samemu.', w: 'diy porady naprawa samemu krok po kroku' },
  { u: '/narzedzia', t: 'Narzędzia', s: 'RPO, kody OBD, kalkulator opon, historia VIN, dobór części.', w: 'narzedzia kalkulator dekoder' },
  { u: '/narzedzia/kalkulatory', t: 'Kalkulator opon', s: 'Porównaj opony: średnica, prędkościomierz, przełożenie osi.', w: 'kalkulator opon opony rozmiar srednica predkosciomierz przelozenie felgi kola' },
  { u: '/narzedzia/czesci', t: 'Dobór części', s: 'Referencyjne informacje o częściach według modelu, rocznika i silnika.', w: 'czesci dobor czesci numer czesci zamienniki parts' },
  { u: '/narzedzia/dane-pojazdu', t: 'Dane pojazdu', s: 'Oficjalne dane pojazdu i specyfikacje.', w: 'dane pojazdu specyfikacja parametry dane techniczne' },
  { u: '/narzedzia/diagnostyka', t: 'Kody błędów — wyszukiwarka', s: 'Sprawdź znaczenie kodu ze skanera i pierwsze czynności.', w: 'diagnostyka kody bledow obd skaner p0300 p0171' },
  { u: '/dla-wlasciciela', t: 'Dla właściciela w PL', s: 'Rejestracja, przegląd, LPG, światła, żółte tablice, homologacja.', w: 'wlasciciel rejestracja urzad przepisy polska' },
  { u: '/dla-wlasciciela/przeglady', t: 'Badanie techniczne w PL', s: 'Okresowe badanie techniczne auta z USA w Polsce.', w: 'badanie techniczne stacja kontroli pojazdow skp przeglad rejestracyjny' },
  { u: '/dla-wlasciciela/zolte-tablice', t: 'Żółte tablice (pojazd zabytkowy)', s: 'Rejestracja GMT400 jako pojazd zabytkowy.', w: 'zolte tablice zabytek pojazd zabytkowy konserwator' },
  { u: '/dla-wlasciciela/homologacja', t: 'Homologacja', s: 'Homologacja i dopuszczenie auta z USA w Polsce.', w: 'homologacja dopuszczenie tdt' },
  { u: '/baza', t: 'Baza wiedzy', s: 'Wszystkie materiały: usterki, DIY, kody, modele.', w: 'baza wiedzy encyklopedia materialy' },
  { u: '/modele', t: 'Modele GMT400', s: 'Tahoe, Suburban, Yukon, C/K, Sierra, Blazer — roczniki i wersje.', w: 'modele nadwozia wersje tahoe suburban yukon blazer sierra silverado ck pickup' },
  { u: '/swiat-gmt400', t: 'Świat GMT400', s: 'Historia, ciekawostki i kultura wokół GMT400.', w: 'swiat historia ciekawostki kultura' },
];

const fold = (value: unknown) => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/gi, 'l').toLowerCase().replace(/\s+/g, ' ').trim();
const snippet = (value: unknown, max = 140) => {
  const text = String(value ?? '').replace(/\s+/g, ' ').trim();
  return text.length > max ? `${text.slice(0, max - 1).replace(/\s+\S*$/, '')}…` : text;
};
const body = (parts: unknown[], max = 1200) => fold(parts.filter(Boolean).join(' ')).slice(0, max);
/** Wpisy Notion: unikalne słowa całej treści (bez krótkich spójników), żeby nakładka znajdowała to samo co /szukaj (np. „termostat” w dalszej części opisu), a indeks pozostał lekki. */
const keywords = (parts: unknown[], max = 3200) => {
  const seen = new Set<string>();
  for (const word of fold(parts.filter(Boolean).join(' ')).match(/[a-z0-9][a-z0-9./–-]*[a-z0-9]|[a-z0-9]/g) || []) if (word.length >= 3 || /^\d+$/.test(word)) seen.add(word);
  return [...seen].join(' ').slice(0, max);
};
const ENGINE_CODES = ['L03', 'L05', 'L19', 'L29', 'L30', 'L31', 'L35', 'L56', 'L65', 'LB4', 'LH6', 'LL4'];

type NotionLike = KnowledgeEntry & { id?: string; Modele?: string[] };
const GROUP_BY_TYPE: Record<string, SearchGroup> = { Usterka: 'usterki', Porada: 'diy', 'Kod błędu': 'obd', Model: 'modele' };

export function buildSearchIndex(notion: NotionLike[] | null): SearchIndex {
  const docs: SearchIndexDoc[] = [];
  for (const e of notion ?? []) {
    if (!e?.id || !e.Nazwa) continue;
    const doc: SearchIndexDoc = {
      g: GROUP_BY_TYPE[e.Typ] ?? 'diy', k: e.id, t: e.Nazwa, u: `/baza/${encodeURIComponent(e.id)}`,
      s: snippet(e.Opis || e.Objawy || e.Rozwiązanie),
      b: keywords([e.Typ, e.Model, e.Lata, e.Opis, e.Objawy, e.Rozwiązanie]),
    };
    if (e.Lata) doc.y = e.Lata;
    if (Array.isArray(e.Modele) && e.Modele.length) doc.m = e.Modele;
    if (e.applicability?.model?.length) doc.am = e.applicability.model;
    if (e.applicability?.years?.length) doc.ay = e.applicability.years;
    docs.push(doc);
  }
  for (const e of getObdEntries()) docs.push({ g: 'obd', k: e.href!, t: e.Nazwa, u: e.href!, s: snippet(e.Opis), b: body([e.Typ, e.Opis, e.Objawy], 600), x: 1 });
  for (const e of getGuideEntries()) docs.push({ g: 'poradniki', k: e.href!, t: e.Nazwa, u: e.href!, s: snippet(e.Opis), b: body([e.Typ, e.Opis, e.Slowa], 1500), x: 1 });
  for (const b of BODY_STYLES) docs.push({ g: 'modele', k: `/modele/${b.id}`, t: b.name, u: `/modele/${b.id}`, s: `${b.from}–${b.to}${b.note ? ` · ${b.note}` : ''}`, b: body(['model nadwozie', b.note]), y: `${b.from}–${b.to}`, m: [b.name] });
  // Szkice poradników (/dla-wlasciciela/…, `draft: true`) zwracają 404 — nie pokazujemy ich w wynikach.
  const isDraftGuide = (u: string) => { const m = /^\/dla-wlasciciela\/([^/]+)$/.exec(u); return !!m && !getGuide(m[1]); };
  for (const p of SEARCH_PAGES) if (!isDraftGuide(p.u)) docs.push({ g: 'strony', k: p.u, t: p.t, u: p.u, s: p.s, b: body([p.s, p.w]), x: 1 });
  const engines: Record<string, string> = {};
  for (const code of ENGINE_CODES) { const liters = findRpo(code)?.original.match(/(\d\.\d)L/)?.[1]; if (liters) engines[code] = liters; }
  return { version: 1, partial: notion === null, docs, engines };
}
