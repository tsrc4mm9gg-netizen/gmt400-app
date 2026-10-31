// Harmonogram przeglądów GMT400 — WYŁĄCZNIE z instrukcji obsługi GM (Owner's Manual 1995–1999,
// rozdz. 7 „Maintenance Schedule”; kopie w folderze Google Drive „Dokumenty GMT400 / 01 Instrukcje obsługi”).
// Interwały w milach jak w instrukcji; km liczone z mil (1 mila = 1,609344 km) i zaokrąglane:
// < 10 000 km do 500 km, < 50 000 km do 1 000 km, wyżej do 5 000 km. Gdzie instrukcja milczy — „brak danych w dokumentach”.

export const MI_KM = 1.609344;
export const NO_DATA = 'brak danych w dokumentach';
export const CHECK = 'Sprawdź w swoim aucie — interwał zależy od rocznika, GVWR, silnika i warunków jazdy.';

export function roundKm(km) {
  const step = km < 10000 ? 500 : km < 50000 ? 1000 : 5000;
  return Math.round(km / step) * step;
}
export const milesToKm = mi => roundKm(mi * MI_KM);
export const formatNumber = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0');

export const SCHEDULE_SOURCES = {
  OM95: { label: 'GM Owner’s Manual 1995 Chevrolet C/K', url: 'https://assets.gm.com/manuals/chevrolet/1995_chevrolet_1500_owners.pdf', drive: 'Instrukcja obsługi Chevrolet C-K 1995 (cz. 2)' },
  OM96: { label: 'GM Owner’s Manual 1996 Chevrolet C/K', url: 'https://assets.gm.com/manuals/chevrolet/1996_chevrolet_1500_owners.pdf', drive: 'Instrukcja obsługi Chevrolet C-K 1996' },
  OM97: { label: 'GM Owner’s Manual 1997 Chevrolet C/K', url: 'https://assets.gm.com/manuals/chevrolet/1997_chevrolet_1500_owners.pdf', drive: 'Instrukcja obsługi Chevrolet C-K 1997' },
  OM98: { label: 'GM Owner’s Manual 1998 Chevrolet C/K', url: 'https://assets.gm.com/manuals/chevrolet/1998_chevrolet_1500_owners.pdf', drive: 'Instrukcja obsługi Chevrolet C-K 1998' },
  OM99: { label: 'GM Owner’s Manual 1999 Chevrolet Tahoe/Suburban', url: 'https://assets.gm.com/manuals/chevrolet/1999_chevrolet_suburban_owners.pdf', drive: 'Instrukcja obsługi Chevrolet Tahoe i Suburban 1999' },
};

// Definicje harmonogramów z instrukcji (1995: Schedule I/II, 1996+: Short Trip/City i Long Trip/Highway).
export const SEVERE_DEFINITION = 'Ciężkie warunki (Schedule I / Short Trip–City): większość tras krótsza niż 8–16 km (5–10 mil), zwłaszcza przy mrozie; długa praca na biegu jałowym i jazda „stop-and-go”; częsta jazda w kurzu lub w terenie; częste holowanie przyczepy; użycie jako dostawczy, taxi, policja. Harmonogramu normalnego nie stosuj przy holowaniu, kurzu ani jeździe terenowej.';
export const NORMAL_DEFINITION = 'Normalny (Schedule II / Long Trip–Highway): tylko gdy żaden z warunków ciężkich nie występuje — głównie dłuższe trasy.';

const r = (mi, months = null, extra = {}) => ({ mi, km: mi == null ? null : milesToKm(mi), months, ...extra });
const months = m => ({ mi: null, km: null, months: m });
const both = rule => ({ normal: rule, severe: rule });

const AXLE_NOTE = 'Przy każdej wymianie oleju silnikowego: kontrola poziomu i uzupełnienie w moście (w 4WD także przednim), kontrola przegubów i uszczelniaczy półosi. Most z blokadą (G80): olej spuścić i wymienić przy pierwszej wymianie oleju silnikowego.';
const AXLE_CHANGE_NOTE = 'Tylko przy jeździe w kurzu lub holowaniu przyczepy: wymiana oleju w moście co 24 000 km (15 000 mil). Bez tych warunków instrukcja podaje tylko kontrolę poziomu.';
const CHASSIS_NOTE = 'Zawieszenie przednie, sworznie zwrotnic, drążki kierownicze, cięgna zmiany biegów i skrzyni rozdzielczej, prowadnice linki hamulca postojowego, wielowypusty wałów, sprężyny pedałów. Sworzni kulistych nie smaruj poniżej −12 °C.';
const BRAKE_FLUID = { id: 'plyn-hamulcowy', group: 'Hamulce', label: 'Płyn hamulcowy', normal: null, severe: null, info: `Wymiana: ${NO_DATA} (instrukcja podaje tylko specyfikację DOT-3). Kontrola hamulców przy rotacji opon i w przeglądzie co najmniej 2 razy w roku (Part C).` };
const TRANSFER = { id: 'skrzynia-rozdzielcza', group: 'Napęd 4WD', label: 'Olej skrzyni rozdzielczej', drive: '4WD', normal: null, severe: null, info: `Wymiana: ${NO_DATA}. Cięgno skrzyni rozdzielczej smaruje się przy smarowaniu podwozia.` };

function gas9699(year) {
  const src = year === 1996 ? 'OM96' : year === 1997 ? 'OM97' : year === 1998 ? 'OM98' : 'OM99';
  const sum = { OM96: 's. 7-4–7-6', OM97: 's. 7-5–7-6', OM98: 's. 7-5–7-7', OM99: 's. 7-5–7-7' }[src];
  const partB = { OM96: 's. 7-43', OM97: 's. 7-46', OM98: 's. 7-41', OM99: 's. 7-39' }[src];
  const partC = { OM96: 's. 7-46–7-47', OM97: 'Part C', OM98: 's. 7-44', OM99: 's. 7-42–7-43' }[src];
  const partD = { OM96: 's. 7-48', OM97: 'Part D', OM98: 's. 7-46', OM99: 's. 7-44' }[src];
  const atfPage = { OM96: 's. 7-28', OM97: sum, OM98: 's. 7-26–7-27', OM99: 's. 7-26' }[src];
  const atfNormal = year >= 1998 ? r(100000) : null;
  return {
    source: src,
    items: [
      { id: 'olej', group: 'Silnik', label: 'Olej silnikowy + filtr', normal: r(7500, 12), severe: r(3000, 3), page: sum },
      { id: 'smarowanie', group: 'Podwozie', label: 'Smarowanie podwozia (przeguby, sworznie)', normal: r(7500, 12), severe: r(3000, 3), page: sum, note: CHASSIS_NOTE },
      { id: 'most-kontrola', group: 'Napęd', label: 'Most napędowy — kontrola oleju', normal: r(7500), severe: r(3000, 3), page: sum, note: AXLE_NOTE },
      { id: 'most-wymiana', group: 'Napęd', label: 'Most napędowy — wymiana oleju (kurz, przyczepa)', normal: null, severe: r(15000), page: sum, info: AXLE_CHANGE_NOTE, note: 'Modele 3500 HD przy ekstremalnym obciążeniu lub holowaniu i długotrwałej jeździe powyżej 72 km/h (45 mph): wymiana co 48 000 km (30 000 mil).' },
      { id: 'opony', group: 'Koła', label: 'Rotacja opon (+ kontrola hamulców)', normal: year === 1996 ? r(15000, null, { firstMi: 7500 }) : r(7500), severe: year === 1996 ? r(12000, null, { firstMi: 6000 }) : r(6000), page: sum },
      { id: 'filtr-paliwa', group: 'Silnik', label: 'Filtr paliwa', ...both(r(30000)), page: sum },
      { id: 'filtr-powietrza', group: 'Silnik', label: 'Filtr powietrza — kontrola wskaźnika zabrudzenia', ...both(months(6)), page: partB, note: 'Wskaźnik na obudowie filtra sprawdzaj co najmniej 2 razy w roku lub przy wymianie oleju; częściej w kurzu. Wymiana według wskaźnika — stałego interwału wymiany instrukcja nie podaje.' },
      { id: 'swiece', group: 'Zapłon', label: 'Świece zapłonowe — wymiana', ...both(r(100000)), page: sum },
      { id: 'przewody', group: 'Zapłon', label: 'Przewody zapłonowe — kontrola', ...both(r(100000)), page: sum },
      { id: 'pasek', group: 'Silnik', label: 'Pasek osprzętu, zbiornik i przewody paliwa, EGR, EVAP — kontrola', ...both(r(60000)), page: sum },
      { id: 'pcv', group: 'Silnik', label: 'Zawór PCV — kontrola', ...both(r(100000)), page: sum },
      { id: 'atf', group: 'Skrzynia', label: 'ATF + filtr (automat 4L60-E / 4L80-E)', transmission: 'auto', normal: atfNormal, severe: r(50000), page: atfPage,
        info: year >= 1998 ? undefined : 'W harmonogramie normalnym płyn i filtr nie wymagają wymiany — chyba że GVWR auta przekracza 8 600 lb (3 900 kg); wtedy co 80 000 km (50 000 mil).',
        note: 'Ciężkie warunki dla ATF: gęsty ruch miejski przy temperaturze regularnie od 32 °C, teren górzysty, częste holowanie, taxi/policja/dostawy — albo GVWR powyżej 8 600 lb (3 900 kg).' },
      { id: 'skrzynia-reczna', group: 'Skrzynia', label: 'Olej skrzyni ręcznej', transmission: 'manual', normal: null, severe: null, page: atfPage, info: 'Instrukcja: olej w skrzyni ręcznej nie wymaga wymiany. Poziom sprawdzaj według Part B.' },
      TRANSFER,
      { id: 'lozyska', group: 'Podwozie', label: 'Łożyska przednich kół — czyszczenie i smarowanie (2WD)', drive: '2WD', normal: r(30000), severe: r(15000), page: sum, note: 'Albo przy każdej wymianie okładzin hamulcowych — co nastąpi wcześniej.' },
      { id: 'chlodzenie', group: 'Chłodzenie', label: 'Płyn chłodniczy DEX-COOL — wymiana z płukaniem', ...both(year === 1996 ? r(100000, 60) : r(150000, 60)), page: `${sum}; Part D ${partD}`, note: 'DEX-COOL (pomarańczowy, bez krzemianów, GM 6277M), mieszanka 50/50 z wodą destylowaną. Przy wymianie: kontrola węży, czyszczenie chłodnicy, próba ciśnieniowa układu i korka.' },
      { ...BRAKE_FLUID, page: `Part C ${partC}; Part D ${partD}` },
      { id: 'przeglad-c', group: 'Przegląd', label: 'Przegląd okresowy: hamulce, zawieszenie, układ kierowniczy, wydech', ...both(months(6)), page: `Part C ${partC}`, note: 'Instrukcja: co najmniej 2 razy w roku (np. wiosną i jesienią).' },
    ],
  };
}

function y1995(kind) {
  const P = { LD: 's. 7-4–7-6', HD: 's. 7-6–7-8', D: 's. 7-9–7-11' }[kind];
  const foot = 's. 7-12';
  const coolantNote = 'Zielony płyn na bazie glikolu etylenowego (GM 6038-M) 50/50 z wodą — nie DEX-COOL. Przy wymianie: kontrola węży, czyszczenie chłodnicy, próba ciśnieniowa.';
  const common = [
    { ...BRAKE_FLUID, page: 'Part C s. 7-96; Part D s. 7-97' },
    { id: 'skrzynia-reczna', group: 'Skrzynia', label: 'Olej skrzyni ręcznej', transmission: 'manual', normal: null, severe: null, page: 's. 7-23', info: 'Instrukcja: olej w skrzyni ręcznej nie wymaga wymiany.' },
    TRANSFER,
    { id: 'przeglad-c', group: 'Przegląd', label: 'Przegląd okresowy: hamulce, zawieszenie, układ kierowniczy, wydech', ...both(months(6)), page: 'Part C s. 7-96', note: 'Instrukcja: co najmniej 2 razy w roku (np. wiosną i jesienią).' },
  ];
  const axleChange = { id: 'most-wymiana', group: 'Napęd', label: 'Most napędowy — wymiana oleju (kurz, przyczepa)', normal: null, severe: r(15000), page: foot, info: AXLE_CHANGE_NOTE, note: 'Modele 3500 HD przy ekstremalnym obciążeniu lub holowaniu i długotrwałej jeździe powyżej 72 km/h (45 mph): wymiana co 5 000 km (3 000 mil) lub 3 mies. albo syntetyczny olej 75W-140 zgodny ze specyfikacją GM.' };
  const clutch = { id: 'sprzeglo', group: 'Skrzynia', label: 'Smarowanie sworznia widełek sprzęgła', transmission: 'manual', ...both(r(30000)), page: P, note: kind === 'LD' ? 'Tylko 5-biegowa skrzynia ręczna z biegiem „deep low”.' : undefined };
  if (kind === 'LD') return { source: 'OM95', items: [
    { id: 'olej', group: 'Silnik', label: 'Olej silnikowy + filtr', normal: r(7500, 12), severe: r(3000, 3), page: P },
    { id: 'smarowanie', group: 'Podwozie', label: 'Smarowanie podwozia (przeguby, sworznie)', normal: r(7500, 12), severe: r(3000, 3), page: P, note: CHASSIS_NOTE },
    { id: 'most-kontrola', group: 'Napęd', label: 'Most napędowy — kontrola oleju', normal: r(7500), severe: r(3000, 3), page: P, note: `${AXLE_NOTE} Harmonogram normalny: przy 12 000 km (7 500 mil) wymiana oleju w moście z mechanizmem o ograniczonym poślizgu.` },
    axleChange,
    { id: 'opony', group: 'Koła', label: 'Rotacja opon', normal: r(15000, null, { firstMi: 7500 }), severe: r(12000, null, { firstMi: 6000 }), page: P },
    { id: 'filtr-powietrza', group: 'Silnik', label: 'Filtr powietrza — wymiana', ...both(r(30000)), page: P, note: 'Ciężkie warunki: w kurzu kontrola co 24 000 km (15 000 mil).' },
    { id: 'swiece', group: 'Zapłon', label: 'Świece zapłonowe — wymiana', ...both(r(30000)), page: P },
    { id: 'filtr-paliwa', group: 'Silnik', label: 'Filtr paliwa', ...both(r(30000)), page: P },
    { id: 'pasek', group: 'Silnik', label: 'Pasek osprzętu, przewody zapłonowe, zapłon, zbiornik i przewody paliwa — kontrola', ...both(r(60000)), page: P },
    { id: 'atf', group: 'Skrzynia', label: 'ATF + filtr (automat)', transmission: 'auto', normal: null, severe: r(50000), page: P, info: 'Instrukcja wpisuje wymianę ATF z dopiskiem „severe conditions” — tylko przy ciężkich warunkach. Bez nich płyn i filtr nie wymagają wymiany.' },
    clutch,
    { id: 'lozyska', group: 'Podwozie', label: 'Łożyska przednich kół — czyszczenie i smarowanie (2WD)', drive: '2WD', ...both(r(15000)), page: P, note: 'Albo przy każdej wymianie okładzin hamulcowych.' },
    { id: 'chlodzenie', group: 'Chłodzenie', label: 'Płyn chłodniczy (zielony) — wymiana z płukaniem', ...both(r(30000, 24)), page: `${P}; Part D s. 7-97`, note: coolantNote },
    ...common,
  ] };
  if (kind === 'HD') return { source: 'OM95', items: [
    { id: 'olej', group: 'Silnik', label: 'Olej silnikowy + filtr', normal: r(6000, 3), severe: r(3000, 3), page: P },
    { id: 'smarowanie', group: 'Podwozie', label: 'Smarowanie podwozia (przeguby, sworznie)', normal: r(6000, 3), severe: r(3000, 3), page: P, note: CHASSIS_NOTE },
    { id: 'most-kontrola', group: 'Napęd', label: 'Most napędowy — kontrola oleju', normal: r(6000), severe: r(3000), page: P, note: AXLE_NOTE },
    axleChange,
    { id: 'opony', group: 'Koła', label: 'Rotacja opon', ...both(r(12000, null, { firstMi: 6000 })), page: P },
    { id: 'filtr-powietrza', group: 'Silnik', label: 'Filtr powietrza — wymiana', ...both(r(24000)), page: P, note: 'Ciężkie warunki: w kurzu kontrola co 19 000 km (12 000 mil).' },
    { id: 'swiece', group: 'Zapłon', label: 'Świece zapłonowe — wymiana', ...both(r(27000)), page: P },
    { id: 'filtr-paliwa', group: 'Silnik', label: 'Filtr paliwa', normal: r(24000), severe: r(12000), page: P },
    { id: 'pasek', group: 'Silnik', label: 'Pasek osprzętu, osłony termiczne, wentylator — kontrola', ...both(r(12000)), page: P },
    { id: 'emisja', group: 'Silnik', label: 'Przewody zapłonowe, EGR, EVAP, zbiornik i przewody paliwa — kontrola', ...both(r(60000)), page: P },
    { id: 'atf', group: 'Skrzynia', label: 'ATF + filtr (automat)', transmission: 'auto', ...both(r(50000)), page: P },
    clutch,
    { id: 'lozyska', group: 'Podwozie', label: 'Łożyska przednich kół — czyszczenie i smarowanie (2WD)', drive: '2WD', normal: r(24000), severe: r(12000), page: P, note: 'Albo przy każdej wymianie okładzin hamulcowych.' },
    { id: 'chlodzenie', group: 'Chłodzenie', label: 'Płyn chłodniczy (zielony) — wymiana z płukaniem', ...both(r(24000, 24)), page: `${P}; Part D s. 7-97`, note: coolantNote },
    ...common,
  ] };
  return { source: 'OM95', items: [
    { id: 'olej', group: 'Silnik', label: 'Olej silnikowy + filtr (diesel)', normal: r(5000, 12), severe: r(2500, 3), page: P },
    { id: 'smarowanie', group: 'Podwozie', label: 'Smarowanie podwozia (przeguby, sworznie)', normal: r(5000, 12), severe: r(2500, 3), page: P, note: CHASSIS_NOTE },
    { id: 'most-kontrola', group: 'Napęd', label: 'Most napędowy — kontrola oleju', ...both(r(5000)), page: P, note: AXLE_NOTE },
    axleChange,
    { id: 'opony', group: 'Koła', label: 'Rotacja opon', normal: r(10000, null, { firstMi: 5000 }), severe: r(15000, null, { firstMi: 7500 }), page: P },
    { id: 'filtr-powietrza', group: 'Silnik', label: 'Filtr powietrza — wymiana', normal: r(30000), severe: r(15000), page: P, note: 'Ciężkie warunki: kontrola co 4 000 km (2 500 mil) w ekstremalnym kurzu, co 12 000 km (7 500 mil) w kurzu.' },
    { id: 'filtr-paliwa', group: 'Silnik', label: 'Filtr paliwa', ...both(r(30000)), page: P },
    { id: 'pasek', group: 'Silnik', label: 'Pasek osprzętu, zawór CDRV, EGR, zawór ciśnienia wydechu — kontrola', ...both(r(60000)), page: P },
    { id: 'atf', group: 'Skrzynia', label: 'ATF + filtr (automat)', transmission: 'auto', ...both(r(50000)), page: P },
    clutch,
    { id: 'lozyska', group: 'Podwozie', label: 'Łożyska przednich kół — czyszczenie i smarowanie (2WD)', drive: '2WD', normal: r(30000), severe: r(15000), page: P, note: 'Albo przy każdej wymianie okładzin hamulcowych.' },
    { id: 'chlodzenie', group: 'Chłodzenie', label: 'Płyn chłodniczy (zielony) — wymiana z płukaniem', ...both(r(30000, 24)), page: `${P}; Part D s. 7-97`, note: coolantNote },
    ...common,
  ] };
}

const AUTO = new Set(['4L60E', '4L80E', 'M30', 'MT1', 'MX0', 'MXO', 'MX1', '4L60', '700R4', 'TH400']);
const MANUAL = new Set(['M50', 'MG5', 'MM4', 'MM5', 'MT8', 'MW3', 'NV4500', 'NV3500', 'SM465']);
const DIESEL = new Set(['L49', 'L56', 'L57', 'L65', 'LH6', 'LL4']);

export function transmissionKind(value) {
  const v = String(value || '').toUpperCase().replace(/[\s-]/g, '');
  if (!v) return '';
  if (AUTO.has(v) || /^4L[68]0/.test(v)) return 'auto';
  if (MANUAL.has(v) || /MANUAL|RĘCZN|RECZN/.test(v)) return 'manual';
  if (/AUTO/.test(v)) return 'auto';
  return '';
}
export const isDiesel = engine => DIESEL.has(String(engine || '').toUpperCase().trim()) || /diesel/i.test(String(engine || ''));

/**
 * Zwraca harmonogram dla auta. `emissions` (LD/HD) dotyczy tylko benzyny z instrukcji 1995.
 * Roczniki 1988–1994 i 2000: brak instrukcji w dokumentach — pokazujemy najbliższy rocznik jako odniesienie (`reference`).
 */
export function getSchedule({ year, engine, transmission, drive, emissions } = {}) {
  const y = Number(year) || 0;
  const diesel = isDiesel(engine);
  const kind = transmissionKind(transmission);
  let basisYear = y >= 1995 && y <= 1999 ? y : y && y < 1995 ? 1995 : y >= 2000 ? 1999 : 0;
  const reference = Boolean(y) && basisYear !== y;
  let notice = '';
  if (reference) notice = `Dla rocznika ${y} nie ma instrukcji obsługi w dokumentach (${NO_DATA}). Poniżej harmonogram z instrukcji ${basisYear} — tylko jako odniesienie.`;
  if (!y) { basisYear = 0; }
  if (diesel && basisYear >= 1996) {
    return { basisYear, reference, diesel, emissions: '', notice: `Silnik diesla ${y}: instrukcja odsyła do osobnego dodatku „Diesel Engine Supplement”, którego nie ma w dokumentach — ${NO_DATA}.`, source: basisYear === 1999 ? 'OM99' : `OM${String(basisYear).slice(2)}`, items: [] };
  }
  if (!basisYear) return { basisYear, reference: false, diesel, emissions: '', notice: 'Brak rocznika — uzupełnij rocznik w Moje auto, żeby zobaczyć harmonogram.', source: '', items: [] };
  const em = basisYear === 1995 ? (diesel ? 'D' : emissions === 'HD' ? 'HD' : 'LD') : '';
  const base = basisYear === 1995 ? y1995(em) : gas9699(basisYear);
  const items = base.items.filter(it => (!it.drive || !drive || it.drive === drive) && (!it.transmission || !kind || it.transmission === kind));
  return { basisYear, reference, diesel, emissions: em, notice, source: base.source, items };
}

const DAY = 86400000;
export function addMonths(isoDate, m) {
  const [Y, M, D] = isoDate.split('-').map(Number);
  const d = new Date(Date.UTC(Y, M - 1 + m, 1));
  const last = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate();
  d.setUTCDate(Math.min(D, last));
  return d.toISOString().slice(0, 10);
}
const daysBetween = (a, b) => Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / DAY);
export const isIsoDate = v => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(`${v}T00:00:00Z`));

/**
 * Stan pozycji. base = ostatnie wykonanie {km?, date?}; odoKm = obecny licznik; today = 'YYYY-MM-DD'.
 * zalegle: termin minął (km albo data); wkrotce: zostało ≤ 1 000 km (lub 10% interwału, gdy mniejszy) albo ≤ 30 dni; ok; brak: brak danych do wyliczenia.
 */
export function itemStatus(rule, base, odoKm, today, kmPerYear) {
  if (!rule) return { state: 'info' };
  const hasKm = rule.km != null && Number.isFinite(base?.km) && Number.isFinite(odoKm);
  const hasDate = rule.months != null && isIsoDate(base?.date);
  if (!hasKm && !hasDate) return { state: 'brak' };
  let dueKm = null, kmLeft = null, dueDate = null, daysLeft = null;
  if (hasKm) {
    const firstKm = rule.firstMi != null ? milesToKm(rule.firstMi) : null;
    dueKm = firstKm != null && base.km < firstKm ? firstKm : base.km + rule.km;
    kmLeft = dueKm - odoKm;
  }
  if (hasDate) { dueDate = addMonths(base.date, rule.months); daysLeft = daysBetween(today, dueDate); }
  let estDate = dueDate;
  if (hasKm && Number(kmPerYear) > 0) {
    const byKm = new Date(Date.parse(`${today}T00:00:00Z`) + Math.max(0, kmLeft) / Number(kmPerYear) * 365 * DAY).toISOString().slice(0, 10);
    if (!estDate || byKm < estDate) estDate = byKm;
  }
  const soonKm = rule.km != null ? Math.min(1000, Math.round(rule.km * 0.1)) : 0;
  const state = (kmLeft != null && kmLeft <= 0) || (daysLeft != null && daysLeft <= 0) ? 'zalegle'
    : (kmLeft != null && kmLeft <= soonKm) || (daysLeft != null && daysLeft <= 30) ? 'wkrotce' : 'ok';
  return { state, dueKm, kmLeft, dueDate, daysLeft, reminderDate: estDate };
}

export function intervalText(rule) {
  if (!rule) return '';
  const parts = [];
  if (rule.km != null) parts.push(`${rule.firstMi != null ? `pierwsza przy ${formatNumber(milesToKm(rule.firstMi))} km (${formatNumber(rule.firstMi)} mil), potem ` : ''}co ${formatNumber(rule.km)} km (${formatNumber(rule.mi)} mil)`);
  if (rule.months != null) parts.push(`${parts.length ? 'lub ' : 'co '}${rule.months} mies.`);
  return parts.join(' ');
}

// ---------- iCalendar (.ics) — RFC 5545, działa w Kalendarzu iPhone'a ----------
const esc = s => String(s).replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1');
function fold(line) {
  const out = [];
  let cur = '', bytes = 0;
  for (const ch of line) {
    const b = new TextEncoder().encode(ch).length;
    if (bytes + b > (out.length ? 74 : 75)) { out.push(cur); cur = ''; bytes = 0; }
    cur += ch; bytes += b;
  }
  out.push(cur);
  return out.join('\r\n ');
}
const ymd = iso => iso.replace(/-/g, '');
export function buildIcs(events, now = new Date()) {
  const stamp = now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//gmt400.pl//Harmonogram przegladow//PL', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH'];
  for (const e of events) {
    const end = new Date(Date.parse(`${e.date}T00:00:00Z`) + DAY).toISOString().slice(0, 10);
    lines.push('BEGIN:VEVENT', `UID:${e.uid}@gmt400.pl`, `DTSTAMP:${stamp}`, `DTSTART;VALUE=DATE:${ymd(e.date)}`, `DTEND;VALUE=DATE:${ymd(end)}`,
      `SUMMARY:${esc(e.summary)}`, `DESCRIPTION:${esc(e.description || '')}`, 'TRANSP:TRANSPARENT',
      'BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${esc(e.summary)}`, 'TRIGGER:-P7D', 'END:VALARM',
      'BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${esc(e.summary)}`, 'TRIGGER:PT9H', 'END:VALARM',
      'END:VEVENT');
  }
  lines.push('END:VCALENDAR');
  return lines.map(fold).join('\r\n') + '\r\n';
}
