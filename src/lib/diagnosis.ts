/**
 * Co się dzieje z moim autem? — symptom → pytania → możliwe przyczyny → linki do WPISÓW, które już są w serwisie.
 *
 * Zasady treści:
 *  • Nie wymyślamy faktów. Przyczyny i ich kolejność wynikają z tytułów i opisów istniejących wpisów (Usterki, DIY, Kody błędu) oraz
 *    z poradników i kart kodów OBD w serwisie. Nie ma tu statystyk awaryjności — kolejność = dopasowanie do odpowiedzi użytkownika,
 *    a przy remisie kolejność kontroli przyjęta w tym pliku.
 *  • Tytuły, zakresy modeli/roczników i fragmenty „wg wpisu” pobieramy z Notion w czasie działania (wpis usunięty lub zastąpiony znika).
 *  • Gdzie brakuje wpisu, wpisujemy to jawnie w `gaps` (widoczne w UI) — i w /workspace/gmt400/postep.md.
 */
export type QuestionOption = { id: string; label: string };
export type Question = { id: string; label: string; options: QuestionOption[] };
export type DiagLink =
  | { id: string }
  | { href: string; label: string; kind: 'Kod OBD' | 'Poradnik' | 'Narzędzie' };
export type Cause = {
  id: string;
  title: string;
  /** Twardy filtr: przyczyna znika, gdy odpowiedź na pytanie (np. silnik) jest inna niż wymienione. */
  only?: Record<string, string[]>;
  /** Miękkie dopasowanie: odpowiedź z listy podbija pozycję i daje plakietkę „pasuje: …”. */
  match?: Record<string, string[]>;
  links: DiagLink[];
};
export type SymptomIcon = 'key' | 'wave' | 'engine' | 'drop' | 'sound' | 'brake' | 'gear' | 'snow' | 'bolt' | 'thermo' | 'smoke';
export type Symptom = {
  id: string;
  label: string;
  hint: string;
  icon: SymptomIcon;
  questions: Question[];
  causes: Cause[];
  /** Czego jeszcze nie ma w bazie (pokazywane użytkownikowi jako „brak wpisu”). */
  gaps: string[];
};

const n = (id: string): DiagLink => ({ id });
const kod = (code: string): DiagLink => ({ href: `/kody-obd/${code.toLowerCase()}`, label: code, kind: 'Kod OBD' });
const page = (href: string, label: string, kind: 'Poradnik' | 'Narzędzie'): DiagLink => ({ href, label, kind });

const SILNIK: Question = { id: 'silnik', label: 'Jaki masz silnik?', options: [{ id: 'benzyna', label: 'Benzyna (V6 / V8)' }, { id: 'diesel', label: 'Diesel 6.5 TD' }] };
const B = { silnik: ['benzyna'] };
const D = { silnik: ['diesel'] };

export const SYMPTOMS: Symptom[] = [
  {
    id: 'nie-odpala', label: 'Nie odpala', hint: 'Kręci, klika albo nie reaguje', icon: 'key',
    questions: [SILNIK, { id: 'rozrusznik', label: 'Co robi rozrusznik?', options: [
      { id: 'slabo', label: 'Kręci wolno, klika lub nie kręci' },
      { id: 'nie-lapie', label: 'Kręci normalnie, ale nie zapala' },
      { id: 'dlugo', label: 'Kręci długo, potem zapala' },
    ] }],
    causes: [
      { id: 'akumulator', title: 'Akumulator, ładowanie i kable', match: { rozrusznik: ['slabo'] }, links: [n('402d7bf1-c139-8103-bb85-d3ba6ac83fb6'), n('406d7bf1-c139-811f-b52f-f489214c4558')] },
      { id: 'rozrusznik', title: 'Rozrusznik i spadki napięcia', match: { rozrusznik: ['slabo'] }, links: [n('402d7bf1-c139-81e8-8ef4-ce93ecc0417a'), n('406d7bf1-c139-8100-bb25-ee874c7ef81f')] },
      { id: 'stacyjka', title: 'Wkładka stacyjki', match: { rozrusznik: ['slabo'] }, links: [n('404d7bf1-c139-81cc-bc2b-fd3bf56e2ef7')] },
      { id: 'pompa-paliwa', title: 'Pompa paliwa i ciśnienie paliwa', only: B, match: { rozrusznik: ['nie-lapie', 'dlugo'] }, links: [n('402d7bf1-c139-818a-8ea7-ecfb98ff7d85'), n('406d7bf1-c139-81ca-8770-db744543acc9'), n('402d7bf1-c139-8150-b5bc-ec4be54ae825')] },
      { id: 'przekaznik-pompy', title: 'Przekaźnik i obwód zasilania pompy paliwa', only: B, match: { rozrusznik: ['nie-lapie', 'dlugo'] }, links: [n('402d7bf1-c139-81dd-9a49-f62035636463')] },
      { id: 'pulsator', title: 'Pulsator pompy paliwa (1992–96)', only: B, match: { rozrusznik: ['nie-lapie'] }, links: [n('402d7bf1-c139-81c3-9c55-d9d8c1e25e03')] },
      { id: 'zaplon', title: 'Układ zapłonowy (kopułka, cewka, moduł)', only: B, match: { rozrusznik: ['nie-lapie'] }, links: [n('402d7bf1-c139-81bf-91b9-e67c828a4012'), n('406d7bf1-c139-81f3-b5ef-f2b869eea5a4')] },
      { id: 'ckp-cmp', title: 'Czujniki położenia wału i wałka (CKP / CMP)', only: B, match: { rozrusznik: ['nie-lapie', 'slabo'] }, links: [n('402d7bf1-c139-81a7-9d25-f31d3a26f424'), n('405d7bf1-c139-81b7-bfbc-d102e59e6331'), n('405d7bf1-c139-81a6-b7a7-c9cf996e0837'), kod('P0335'), kod('P0340')] },
      { id: 'diesel-wtrysk', title: '6.5 TD: pompa wtryskowa, czujnik i solenoid', only: D, match: { rozrusznik: ['nie-lapie'] }, links: [n('402d7bf1-c139-818c-9996-e72f26d59c84'), n('406d7bf1-c139-81fe-b470-c20e56bd41c3'), n('406d7bf1-c139-8115-bf74-c84d1702ad13')] },
      { id: 'diesel-zasilanie', title: '6.5 TD: dopływ paliwa i powietrze w układzie', only: D, match: { rozrusznik: ['nie-lapie', 'dlugo'] }, links: [n('406d7bf1-c139-811b-80db-ea4c3e7c643a'), n('406d7bf1-c139-81c2-822c-ea95b16955da')] },
      { id: 'diesel-zimny', title: '6.5 TD: świece żarowe i podgrzewanie przy zimnym rozruchu', only: D, match: { rozrusznik: ['dlugo', 'nie-lapie'] }, links: [n('406d7bf1-c139-81c7-a5df-cabcd0d06741'), n('406d7bf1-c139-81b5-8b76-e89f3c2bd772'), n('405d7bf1-c139-81b3-a502-e52df2f36753')] },
    ],
    gaps: ['Układ antykradzieżowy a brak rozruchu — w bazie jest tylko wzmianka o P1626 we wpisie o kodach, bez osobnej procedury.'],
  },
  {
    id: 'szarpie-gasnie', label: 'Szarpie, gaśnie', hint: 'Nierówny bieg, utrata mocy', icon: 'wave',
    questions: [SILNIK, { id: 'kiedy', label: 'Kiedy to się dzieje?', options: [
      { id: 'zimny', label: 'Zimny silnik / po rozruchu' },
      { id: 'cieply', label: 'Rozgrzany silnik' },
      { id: 'obciazenie', label: 'Pod gazem / obciążeniem' },
      { id: 'jalowy', label: 'Na biegu jałowym' },
      { id: 'odpuszczanie', label: 'Przy odpuszczaniu gazu' },
    ] }],
    causes: [
      { id: 'zaplon', title: 'Układ zapłonowy (przewody, kopułka, cewka, świece)', only: B, match: { kiedy: ['obciazenie', 'jalowy'] }, links: [n('402d7bf1-c139-81bf-91b9-e67c828a4012'), n('406d7bf1-c139-81f3-b5ef-f2b869eea5a4'), kod('P0300'), n('406d7bf1-c139-812c-84fe-e4076107f7a8')] },
      { id: 'csfi-zimny', title: 'Wtrysk Central SFI — wypadanie zapłonów na zimnym silniku', only: B, match: { kiedy: ['zimny'] }, links: [n('402d7bf1-c139-816f-87a0-de785c41eede'), n('406d7bf1-c139-81e8-b98b-da19acd79bbc')] },
      { id: 'csfi-cieply', title: 'Wtrysk Central SFI — szarpanie po rozgrzaniu i przy odpuszczaniu gazu', only: B, match: { kiedy: ['cieply', 'odpuszczanie'] }, links: [n('402d7bf1-c139-8119-840e-f55ae18aae4d'), n('406d7bf1-c139-81e8-b98b-da19acd79bbc')] },
      { id: 'false-air', title: 'Nieszczelny kolektor dolotowy / fałszywe powietrze', only: B, match: { kiedy: ['jalowy'] }, links: [n('402d7bf1-c139-81aa-a6a2-fcab5b0e8d6b'), n('406d7bf1-c139-815f-a311-f2d5638e438f')] },
      { id: 'czujniki', title: 'Czujniki MAP, MAF, IAT i ECT', only: B, match: { kiedy: ['zimny', 'obciazenie'] }, links: [n('406d7bf1-c139-8172-a0f6-ee1cd5ba408e'), kod('P0101'), n('405d7bf1-c139-8120-a07f-c8399aafb31a')] },
      { id: 'paliwo', title: 'Pompa paliwa i ciśnienie paliwa', only: B, match: { kiedy: ['obciazenie', 'zimny'] }, links: [n('402d7bf1-c139-818a-8ea7-ecfb98ff7d85'), n('406d7bf1-c139-81ca-8770-db744543acc9'), n('402d7bf1-c139-8150-b5bc-ec4be54ae825')] },
      { id: 'iac', title: 'Bieg jałowy: IAC i przepustnica', only: B, match: { kiedy: ['jalowy'] }, links: [n('402d7bf1-c139-816e-acf5-e4f4e2003d2b'), n('405d7bf1-c139-8171-9b15-c78125dec748'), kod('P0507')] },
      { id: 'diesel-obj', title: '6.5 TD: gaśnie, nierówny bieg, falujące obroty', only: D, links: [n('402d7bf1-c139-818c-9996-e72f26d59c84'), n('406d7bf1-c139-81fe-b470-c20e56bd41c3'), n('406d7bf1-c139-811b-80db-ea4c3e7c643a')] },
      { id: 'diesel-paliwo', title: '6.5 TD: skażone lub zapowietrzone paliwo', only: D, match: { kiedy: ['obciazenie', 'jalowy'] }, links: [n('406d7bf1-c139-81c2-822c-ea95b16955da'), n('406d7bf1-c139-811b-80db-ea4c3e7c643a')] },
      { id: 'diesel-turbo', title: '6.5 TD: turbosprężarka i brak mocy', only: D, match: { kiedy: ['obciazenie'] }, links: [n('406d7bf1-c139-81a4-8a83-de81dbb37fd2')] },
    ],
    gaps: ['Osobny wpis „szarpanie / dławienie się pod obciążeniem” bez założenia silnika — dziś skład przyczyn wynika z wpisów o zapłonie, wtrysku i paliwie.'],
  },
  {
    id: 'check-engine', label: 'Check Engine', hint: 'Świeci lub miga kontrolka silnika', icon: 'engine',
    questions: [{ id: 'rocznik', label: 'Jaki rocznik?', options: [{ id: 'obd1', label: '1988–95 (OBD-I)' }, { id: 'obd2', label: '1996–2000 (OBD-II)' }] },
      { id: 'kod', label: 'Znasz kod z czytnika?', options: [
        { id: 'zaplony', label: 'P0300–P0308 (wypadanie zapłonów)' },
        { id: 'katalizator', label: 'P0420 (katalizator)' },
        { id: 'mieszanka', label: 'P0171–P0175 (mieszanka)' },
        { id: 'evap', label: 'P0440–P0455 (EVAP)' },
        { id: 'o2', label: 'P013x (sonda O2)' },
        { id: 'powietrze', label: 'P0101–P0121 (MAF / MAP / IAT / ECT / TPS)' },
        { id: 'ckp', label: 'P0320–P0340 (obroty / położenie wału)' },
        { id: 'egr', label: 'P0401 (EGR)' },
        { id: 'skrzynia', label: 'P0700–P0751 (skrzynia)' },
      ] }],
    causes: [
      { id: 'odczyt-obd1', title: 'Jak odczytać kody w OBD-I (do 1995)', match: { rocznik: ['obd1'] }, links: [n('406d7bf1-c139-8129-8b3c-ee11c907b482'), kod('OBD1')] },
      { id: 'odczyt-obd2', title: 'Jak odczytać kody w OBD-II (1996–2000)', match: { rocznik: ['obd2'] }, links: [n('406d7bf1-c139-8113-9454-f41554ff969e'), page('/kody-obd', 'Wszystkie kody OBD', 'Narzędzie')] },
      { id: 'kontrolka', title: 'Co znaczy świecenie albo miganie kontrolki', links: [n('406d7bf1-c139-81ae-b728-fee9c6edd953')] },
      { id: 'zaplony', title: 'Wypadanie zapłonów (P0300–P0308)', match: { kod: ['zaplony'] }, links: [kod('P0300'), kod('P0301'), n('406d7bf1-c139-812c-84fe-e4076107f7a8'), n('402d7bf1-c139-81bf-91b9-e67c828a4012')] },
      { id: 'katalizator', title: 'Sprawność katalizatora (P0420)', match: { kod: ['katalizator'] }, links: [kod('P0420'), n('406d7bf1-c139-812c-84fe-e4076107f7a8'), n('3fad7bf1-c139-8199-ad96-f0cc8d5622ab'), n('402d7bf1-c139-8125-903f-e6a768c34a90')] },
      { id: 'mieszanka', title: 'Mieszanka za uboga lub za bogata (P0171–P0175)', match: { kod: ['mieszanka'] }, links: [kod('P0171'), n('405d7bf1-c139-8120-a07f-c8399aafb31a'), n('3fad7bf1-c139-811f-af6e-df3a88d424da'), n('402d7bf1-c139-81aa-a6a2-fcab5b0e8d6b')] },
      { id: 'evap', title: 'Układ EVAP (P0440–P0455)', match: { kod: ['evap'] }, links: [kod('P0440'), kod('P0455'), n('405d7bf1-c139-8170-999d-ca2ab4e3a136'), n('406d7bf1-c139-81f2-9955-ddcf187a821b'), n('406d7bf1-c139-81bd-a56a-cc366bcee094')] },
      { id: 'o2', title: 'Sonda lambda (czujnik O2)', match: { kod: ['o2'] }, links: [kod('P0131'), n('3fad7bf1-c139-8145-89b2-d93b144ac13b'), n('405d7bf1-c139-8127-8b94-cc54cc433600')] },
      { id: 'powietrze', title: 'Czujniki MAF, MAP, IAT, ECT, TPS', match: { kod: ['powietrze'] }, links: [kod('P0101'), kod('P0113'), kod('P0117'), kod('P0121'), n('406d7bf1-c139-8172-a0f6-ee1cd5ba408e'), n('405d7bf1-c139-81c6-9468-f44c55819983'), n('405d7bf1-c139-8148-bcb1-c339d7396ce5'), n('405d7bf1-c139-8185-85f6-db37c1f29505')] },
      { id: 'ckp', title: 'Czujniki położenia wału i wałka (CKP / CMP)', match: { kod: ['ckp'] }, links: [kod('P0335'), kod('P0340'), n('405d7bf1-c139-81a6-b7a7-c9cf996e0837'), n('402d7bf1-c139-81b7-ba8c-e74b84bbdffa'), n('405d7bf1-c139-8147-9779-d910f530d4d4'), n('3fad7bf1-c139-81af-8235-cd84a6e7c6e7')] },
      { id: 'egr', title: 'Układ EGR (P0401)', match: { kod: ['egr'] }, links: [kod('P0401'), n('405d7bf1-c139-8103-b0e0-cdf14de10362'), n('405d7bf1-c139-81ea-9b6a-f2188bfe62ce')] },
      { id: 'skrzynia', title: 'Skrzynia automatyczna (kody P07xx)', match: { kod: ['skrzynia'] }, links: [kod('P0700'), kod('P0740'), kod('P0751'), n('406d7bf1-c139-8175-958a-d9b9dc9f13bf'), n('402d7bf1-c139-8180-855b-fea500f29c68')] },
      { id: 'diesel-kody', title: 'Diesel 6.5 TD: kody błędów i diagnoza wg objawów', links: [n('406d7bf1-c139-8115-bf74-c84d1702ad13'), n('406d7bf1-c139-81fe-b470-c20e56bd41c3')] },
    ],
    gaps: ['Kody spoza powyższych rodzin (np. P0300–P0308 dla pojedynczego cylindra poza P0301) — sprawdź listę kodów OBD albo wyszukiwarkę; nie każdy kod ma osobny wpis.'],
  },
  {
    id: 'wycieki', label: 'Wycieki', hint: 'Plama pod autem, ubywa płynu', icon: 'drop',
    questions: [{ id: 'plyn', label: 'Co wycieka?', options: [
      { id: 'olej', label: 'Olej silnikowy' },
      { id: 'atf', label: 'Płyn skrzyni (ATF)' },
      { id: 'most', label: 'Olej z mostu / skrzyni rozdzielczej' },
      { id: 'chlodnica', label: 'Płyn chłodzący' },
      { id: 'hamulec', label: 'Płyn hamulcowy' },
      { id: 'wspomaganie', label: 'Płyn wspomagania' },
      { id: 'spryskiwacz', label: 'Płyn do spryskiwaczy' },
      { id: 'paliwo', label: 'Paliwo (zapach)' },
    ] }, SILNIK],
    causes: [
      { id: 'olej-b', title: 'Wycieki oleju silnikowego (benzyna)', only: B, match: { plyn: ['olej'] }, links: [n('406d7bf1-c139-81c2-bc99-cb00bb4258c5'), n('402d7bf1-c139-81aa-a6a2-fcab5b0e8d6b')] },
      { id: 'olej-d', title: '6.5 TD: wycieki oleju i płynów', only: D, match: { plyn: ['olej', 'chlodnica', 'paliwo'] }, links: [n('406d7bf1-c139-811a-9209-db7177d38751')] },
      { id: 'atf', title: 'Wyciek ATF ze skrzyni automatycznej', match: { plyn: ['atf'] }, links: [n('406d7bf1-c139-8182-b0c4-dcb8fa305a1e'), n('406d7bf1-c139-8137-80ba-f1bdc2e559ca')] },
      { id: 'most', title: 'Most, skrzynia rozdzielcza i wały (uszczelniacze)', match: { plyn: ['most'] }, links: [n('406d7bf1-c139-817f-aa33-e67770ea31d2'), n('406d7bf1-c139-811c-8fce-f9b7bdafdc12'), n('402d7bf1-c139-81d6-beeb-da3c05788a92')] },
      { id: 'chlodzenie', title: 'Układ chłodzenia: chłodnica, szyjka, przewody, pompa', only: B, match: { plyn: ['chlodnica'] }, links: [n('406d7bf1-c139-81c1-92ab-ca8e623fc247'), n('402d7bf1-c139-81bd-8aba-ffb0600703b0'), n('402d7bf1-c139-81b4-b968-dfc56370ec5c'), n('406d7bf1-c139-81f6-85b5-f20f15c442cb')] },
      { id: 'chlodzenie-d', title: '6.5 TD: układ chłodzenia', only: D, match: { plyn: ['chlodnica'] }, links: [n('406d7bf1-c139-8142-854b-d6f6a60791a9'), n('406d7bf1-c139-816c-a88c-d7b3100113cd')] },
      { id: 'hamulec', title: 'Przewody, zaciski i pompa hamulcowa', match: { plyn: ['hamulec'] }, links: [n('3fad7bf1-c139-81c7-8ced-dd94fbc30c1f'), n('402d7bf1-c139-81e6-9c48-da28f48479ae'), n('405d7bf1-c139-819d-b12c-d150004650cd'), n('406d7bf1-c139-81b8-a2f9-d2638e744d13'), n('406d7bf1-c139-8196-8ae2-f13d4750dd99')] },
      { id: 'wspomaganie', title: 'Wspomaganie kierownicy: płyn i pompa', match: { plyn: ['wspomaganie'] }, links: [n('402d7bf1-c139-8166-9f8a-ee8f05ebf43e'), n('405d7bf1-c139-816b-b488-c500835a0d3c')] },
      { id: 'spryskiwacz', title: 'Układ spryskiwaczy', match: { plyn: ['spryskiwacz'] }, links: [n('402d7bf1-c139-8157-8fd8-f70d7949ccb3')] },
    ],
    gaps: ['Wyciek paliwa (zbiornik, przewody, korek) — brak osobnego wpisu; wpis o zbiorniku paliwa dotyczy taśm mocujących i wskazania paliwa, nie wycieków.'],
  },
  {
    id: 'halasy', label: 'Hałasy i drgania', hint: 'Stuki, pisk, buczenie, wibracje', icon: 'sound',
    questions: [{ id: 'skad', label: 'Skąd i kiedy?', options: [
      { id: 'silnik-zimny', label: 'Z silnika, po zimnym rozruchu' },
      { id: 'silnik-cieply', label: 'Z silnika, rozgrzanego' },
      { id: 'osprzet', label: 'Pisk / wycie z przodu silnika' },
      { id: 'jazda', label: 'Spod auta, zależnie od prędkości' },
      { id: 'skret', label: 'Przy skręcaniu / na nierównościach' },
      { id: 'hamowanie', label: 'Przy hamowaniu' },
      { id: 'wydech', label: 'Dudnienie / syk z wydechu' },
    ] }, SILNIK],
    causes: [
      { id: 'zimne-stukanie', title: 'Stukanie po zimnym rozruchu: filtr oleju, panewki, luz zaworowy', only: B, match: { skad: ['silnik-zimny'] }, links: [n('405d7bf1-c139-81be-8d03-fcb2d55f1a86'), n('405d7bf1-c139-8143-b1da-e86dce43c2fa')] },
      { id: 'silnik-odglosy', title: 'Odgłosy silnika: łożyska, zawory, łańcuszek rozrządu, tykanie', only: B, match: { skad: ['silnik-cieply', 'silnik-zimny'] }, links: [n('406d7bf1-c139-8165-9ec2-e488575a493f'), n('402d7bf1-c139-8185-8a97-d84b2039be8c')] },
      { id: 'kolektor-74', title: '7.4 L: hałasy od kolektora i dolotu', only: B, match: { skad: ['silnik-zimny'] }, links: [n('405d7bf1-c139-815b-b795-e432f7b3bf19'), n('402d7bf1-c139-81aa-a6a2-fcab5b0e8d6b')] },
      { id: 'air', title: 'Układ AIR (pompa powietrza wtórnego) po zimnym rozruchu', only: B, match: { skad: ['silnik-zimny'] }, links: [n('402d7bf1-c139-8166-bc47-f170b43a1961')] },
      { id: 'evap-tyk', title: 'Tykanie jak detonacja: zawór EVAP (purge)', only: B, links: [n('405d7bf1-c139-81f1-9f02-dea1e48f7d7f'), kod('P0440')] },
      { id: 'diesel-halas', title: '6.5 TD: stuki, świst turbo, pasek', only: D, match: { skad: ['silnik-zimny', 'silnik-cieply', 'osprzet'] }, links: [n('406d7bf1-c139-811c-921b-efe71b2ad390'), n('406d7bf1-c139-81a4-8a83-de81dbb37fd2'), n('406d7bf1-c139-81dc-b635-cb1e77dc1e72')] },
      { id: 'osprzet', title: 'Alternator, pasek, sprężarka klimatyzacji, pompa wspomagania', match: { skad: ['osprzet'] }, links: [n('402d7bf1-c139-8103-bb85-d3ba6ac83fb6'), n('405d7bf1-c139-819b-abb2-f4f035aab320'), n('402d7bf1-c139-81c4-96d9-c54b3cfbbcce'), n('402d7bf1-c139-8166-9f8a-ee8f05ebf43e')] },
      { id: 'naped', title: 'Wały, krzyżaki i układ napędowy', match: { skad: ['jazda'] }, links: [n('402d7bf1-c139-81d6-beeb-da3c05788a92'), n('406d7bf1-c139-819c-b8e5-f5eed4ff3cb0')] },
      { id: 'piasty', title: 'Łożyska piast kół i zużycie opon', match: { skad: ['jazda'] }, links: [n('402d7bf1-c139-81a0-a66d-dbd9486becfc'), n('406d7bf1-c139-81bf-9d1c-ff68bf51b9d5')] },
      { id: 'zawieszenie', title: 'Zawieszenie i układ kierowniczy (luzy, przeguby, amortyzatory)', match: { skad: ['skret'] }, links: [n('402d7bf1-c139-8165-8cdc-e2a28bc3c177'), n('405d7bf1-c139-8149-a2f0-cb4816d502b4'), n('402d7bf1-c139-8157-b58d-de948a027c3d'), n('405d7bf1-c139-819d-8b1c-d292c7fb83c2')] },
      { id: 'hamulce', title: 'Hamulce: pisk, pulsowanie, zacieranie', match: { skad: ['hamowanie'] }, links: [n('406d7bf1-c139-8196-8ae2-f13d4750dd99'), n('402d7bf1-c139-8110-ad21-c60372d502f8'), n('405d7bf1-c139-819d-b12c-d150004650cd')] },
      { id: 'wydech', title: 'Wydech: kolektory, uszczelki, katalizator', match: { skad: ['wydech'] }, links: [n('402d7bf1-c139-8125-903f-e6a768c34a90'), n('402d7bf1-c139-813a-8526-cd4b236989e7'), n('406d7bf1-c139-8116-bf25-e64cf6239c54')] },
    ],
    gaps: ['Wibracje od wału korbowego / koła zamachowego i od opon — brak osobnych wpisów (jest ogólny wpis o oponach i układzie napędowym).'],
  },
  {
    id: 'hamulce', label: 'Hamulce', hint: 'Miękki pedał, pisk, ściąganie', icon: 'brake',
    questions: [{ id: 'objaw', label: 'Co dokładnie?', options: [
      { id: 'miekki', label: 'Miękki pedał / długi skok / opada' },
      { id: 'twardy', label: 'Twardy pedał, duży wysiłek' },
      { id: 'pulsuje', label: 'Pulsuje / drga przy hamowaniu' },
      { id: 'pisk', label: 'Pisk, zacieranie, gorące koła' },
      { id: 'sciaga', label: 'Auto ściąga na bok' },
      { id: 'kontrolka', label: 'Świeci BRAKE lub ABS' },
    ] }, { id: 'kiedy', label: 'Dodatkowa wskazówka', options: [
      { id: 'po-naprawie', label: 'Po niedawnej naprawie hamulców' },
      { id: 'pelny-skret', label: 'Przy pełnym skręcie kół' },
      { id: 'niska-predkosc', label: 'ABS włącza się przy małej prędkości' },
    ] }],
    causes: [
      { id: 'lista', title: 'Podstawowa lista przyczyn: układ hamulcowy GMT400', links: [n('406d7bf1-c139-8196-8ae2-f13d4750dd99')] },
      { id: 'przewody', title: 'Skorodowane przewody i wyciek płynu', match: { objaw: ['miekki'] }, links: [n('3fad7bf1-c139-81c7-8ced-dd94fbc30c1f'), n('402d7bf1-c139-81e6-9c48-da28f48479ae')] },
      { id: 'odpowietrzanie', title: 'Powietrze w układzie / odpowietrzanie', match: { objaw: ['miekki'] }, links: [n('406d7bf1-c139-815d-aeee-d0472900e313')] },
      { id: 'pompa', title: 'Pompa hamulcowa', match: { objaw: ['miekki'] }, links: [n('406d7bf1-c139-81b8-a2f9-d2638e744d13')] },
      { id: 'serwo', title: 'Serwo, Hydro-Boost, bębny tylne i hamulec postojowy', match: { objaw: ['twardy', 'sciaga'] }, links: [n('406d7bf1-c139-8148-a4b9-ed5baf130559')] },
      { id: 'tarcze', title: 'Klocki, tarcze i zaciski', match: { objaw: ['pulsuje', 'pisk', 'sciaga'] }, links: [n('405d7bf1-c139-819d-b12c-d150004650cd'), n('402d7bf1-c139-8110-ad21-c60372d502f8')] },
      { id: 'pelny-skret', title: 'Hydro-Boost: pedał opada lub sam hamuje przy pełnym skręcie', match: { kiedy: ['pelny-skret'] }, links: [n('402d7bf1-c139-8170-8b2e-cb01ac7ba1d1')] },
      { id: 'brake-po', title: 'Kontrolka BRAKE po naprawie hamulców', match: { objaw: ['kontrolka'], kiedy: ['po-naprawie'] }, links: [n('402d7bf1-c139-8166-b632-f360981b422d')] },
      { id: 'abs', title: 'ABS: kontrolka, kody czujników kół, RWAL / 4WAL', match: { objaw: ['kontrolka'] }, links: [n('402d7bf1-c139-8110-9770-e25962ebdc5e'), n('406d7bf1-c139-8170-baaa-e6b530b16491')] },
      { id: 'abs-rdza', title: 'ABS włącza się przy małej prędkości: rdza pod czujnikiem koła', match: { kiedy: ['niska-predkosc'] }, links: [n('402d7bf1-c139-81e0-abc0-fb01fc603140')] },
    ],
    gaps: [],
  },
  {
    id: 'skrzynia', label: 'Skrzynia i napęd', hint: 'Ślizga, szarpie, 4x4, sprzęgło', icon: 'gear',
    questions: [{ id: 'typ', label: 'Jaka skrzynia?', options: [{ id: 'automat', label: 'Automat (4L60-E / 4L80-E)' }, { id: 'manual', label: 'Manual (sprzęgło)' }, { id: '4x4', label: 'Napęd 4x4 / rozdzielcza' }] },
      { id: 'objaw', label: 'Co się dzieje?', options: [
        { id: 'slizga', label: 'Ślizga się / zła zmiana biegów' },
        { id: 'wyciek', label: 'Wyciek płynu' },
        { id: 'kod', label: 'Kontrolka / kod błędu' },
        { id: 'halas', label: 'Hałas, wibracje' },
        { id: 'nie-wlacza', label: '4x4 / bieg się nie włącza' },
      ] }],
    causes: [
      { id: 'atf-serwis', title: 'Poziom i wymiana ATF, filtr', only: { typ: ['automat'] }, match: { objaw: ['slizga'] }, links: [n('402d7bf1-c139-81a4-b345-e9c491a58dce'), n('405d7bf1-c139-81ab-aef5-f93b25478a05')] },
      { id: 'a4l60', title: '4L60-E: usterki i diagnoza', only: { typ: ['automat'] }, match: { objaw: ['slizga', 'kod'] }, links: [n('406d7bf1-c139-81da-8762-f262b9ebd6b4'), n('402d7bf1-c139-8180-855b-fea500f29c68')] },
      { id: 'a4l80', title: '4L80-E: usterki i kody', only: { typ: ['automat'] }, match: { objaw: ['slizga', 'kod'] }, links: [n('406d7bf1-c139-8165-81f5-ede37c7a2714'), n('405d7bf1-c139-8198-9d7a-e16960391d97'), n('406d7bf1-c139-8175-958a-d9b9dc9f13bf')] },
      { id: 'solenoidy', title: 'Solenoidy zmiany biegów', only: { typ: ['automat'] }, match: { objaw: ['kod', 'slizga'] }, links: [n('405d7bf1-c139-8136-9c46-f792e70b2576'), kod('P0751')] },
      { id: 'kody-skrzyni', title: 'Kody P0700 i P0740', only: { typ: ['automat'] }, match: { objaw: ['kod'] }, links: [kod('P0700'), kod('P0740')] },
      { id: 'linka', title: 'Regulacja linki / dźwigni zmiany biegów', only: { typ: ['automat'] }, match: { objaw: ['slizga'] }, links: [n('406d7bf1-c139-8167-84ac-e1937bdbcaa8')] },
      { id: 'wyciek-atf', title: 'Wyciek ATF', only: { typ: ['automat'] }, match: { objaw: ['wyciek'] }, links: [n('406d7bf1-c139-8182-b0c4-dcb8fa305a1e')] },
      { id: 'remont', title: 'Co sprawdzić przed remontem skrzyni', only: { typ: ['automat'] }, match: { objaw: ['slizga'] }, links: [n('406d7bf1-c139-8137-80ba-f1bdc2e559ca')] },
      { id: 'sprzeglo', title: 'Sprzęgło i układ hydrauliczny', only: { typ: ['manual'] }, links: [n('406d7bf1-c139-8107-bbd1-d9387033f320')] },
      { id: 'rozdzielcza', title: 'Skrzynia rozdzielcza i tryby 4x4', only: { typ: ['4x4'] }, match: { objaw: ['nie-wlacza', 'halas', 'wyciek'] }, links: [n('402d7bf1-c139-81e2-8a3a-cc7c931942e8'), n('3fad7bf1-c139-818c-a843-ffc227de415f'), n('3fad7bf1-c139-81da-8607-fb9fe3398b30'), n('406d7bf1-c139-811c-8fce-f9b7bdafdc12')] },
      { id: 'naped', title: 'Układ napędowy: wały, krzyżaki, mosty', match: { objaw: ['halas'] }, links: [n('406d7bf1-c139-819c-b8e5-f5eed4ff3cb0'), n('402d7bf1-c139-81d6-beeb-da3c05788a92')] },
    ],
    gaps: ['Manualna skrzynia (NV3500 / NV4500): brak wpisów diagnostycznych poza sprzęgłem — zgłoś, jeśli jest potrzebna.'],
  },
  {
    id: 'klima-ogrzewanie', label: 'Ogrzewanie i klima', hint: 'Nie grzeje, nie chłodzi, dmuchawa', icon: 'snow',
    questions: [{ id: 'co', label: 'Co nie działa?', options: [
      { id: 'klima', label: 'Klimatyzacja słabo chłodzi' },
      { id: 'sprezarka', label: 'Sprężarka nie załącza się / hałasuje' },
      { id: 'ogrzewanie', label: 'Słabe lub brak ogrzewania' },
      { id: 'dmuchawa', label: 'Dmuchawa / nawiew' },
    ] }, { id: 'uklad', label: 'Układ klimatyzacji', options: [{ id: 'przod', label: 'Jedna klima (przód)' }, { id: 'tyl', label: 'Z tylną klimą (SUV)' }] }],
    causes: [
      { id: 'klima-diag', title: 'Klimatyzacja: diagnostyka układu', match: { co: ['klima'] }, links: [n('406d7bf1-c139-815e-b5dd-f3661067d5e9'), n('404d7bf1-c139-812f-8165-e2b9196cdde6')] },
      { id: 'sprezarka', title: 'Sprężarka, skraplacz i akumulator osuszacza', match: { co: ['sprezarka', 'klima'] }, links: [n('402d7bf1-c139-81c4-96d9-c54b3cfbbcce'), n('406d7bf1-c139-81b6-9872-edf9006c5d2b')] },
      { id: 'tylna', title: 'Tylna klimatyzacja (SUV)', match: { uklad: ['tyl'] }, links: [n('402d7bf1-c139-8166-b709-f14fa49ec96c')] },
      { id: 'nagrzewnica', title: 'Nagrzewnica, siłownik i nawiew', match: { co: ['ogrzewanie', 'dmuchawa'] }, links: [n('406d7bf1-c139-81cc-8a8b-dbfa552bb68f'), n('402d7bf1-c139-81d8-8656-e162cf88d654')] },
      { id: 'termostat', title: 'Termostat i temperatura silnika', match: { co: ['ogrzewanie'] }, links: [n('406d7bf1-c139-81c1-92ab-ca8e623fc247'), n('402d7bf1-c139-8123-a9b4-d311d27200b1')] },
      { id: 'diesel-brak-ciepla', title: '6.5 TD: brak ciepła z nawiewów', match: { co: ['ogrzewanie'] }, links: [n('406d7bf1-c139-811a-9209-db7177d38751')] },
      { id: 'dmuchawa', title: 'Dmuchawa i rezystor / moduł sterowania', match: { co: ['dmuchawa'] }, links: [n('404d7bf1-c139-815b-a9d9-fd1caee6b2c3')] },
    ],
    gaps: [],
  },
  {
    id: 'elektryka', label: 'Elektryka', hint: 'Ładowanie, światła, bezpieczniki', icon: 'bolt',
    questions: [{ id: 'co', label: 'Co nie działa?', options: [
      { id: 'ladowanie', label: 'Akumulator się rozładowuje / kontrolka ładowania' },
      { id: 'swiatla', label: 'Światła i kierunkowskazy' },
      { id: 'wycieraczki', label: 'Wycieraczki, wskaźniki, radio' },
      { id: 'zamki', label: 'Zamki, szyby, drzwi' },
      { id: 'bezpieczniki', label: 'Pali się bezpiecznik / brak zasilania' },
      { id: 'stacyjka', label: 'Stacyjka / klucz' },
    ] }],
    causes: [
      { id: 'ladowanie', title: 'Układ ładowania: alternator, akumulator, kable', match: { co: ['ladowanie'] }, links: [n('402d7bf1-c139-8103-bb85-d3ba6ac83fb6'), n('405d7bf1-c139-81fe-940b-c897ac7382b6'), n('406d7bf1-c139-811f-b52f-f489214c4558')] },
      { id: 'rozladowanie', title: 'Wkładka stacyjki — zasilanie zostaje po wyłączeniu', match: { co: ['ladowanie', 'stacyjka'] }, links: [n('404d7bf1-c139-81cc-bc2b-fd3bf56e2ef7')] },
      { id: 'swiatla', title: 'Światła, żarówki i kierunkowskazy', match: { co: ['swiatla'] }, links: [n('406d7bf1-c139-8171-aa7d-f87b93f833d2'), n('406d7bf1-c139-817a-8ac7-cdfbdc51ba26'), n('405d7bf1-c139-8152-ac4f-e2676be40f81')] },
      { id: 'wycieraczki', title: 'Wycieraczki, wskaźniki i radio', match: { co: ['wycieraczki'] }, links: [n('406d7bf1-c139-81c4-ac83-d25235e2a323'), n('406d7bf1-c139-811a-b584-ddb4e517e60f'), n('406d7bf1-c139-8119-997e-e6ab1983cbee')] },
      { id: 'zamki', title: 'Zamki, szyby i drzwi', match: { co: ['zamki'] }, links: [n('402d7bf1-c139-81f1-9884-e349ab26554e'), n('406d7bf1-c139-811e-9a1b-d710efc17fce'), n('406d7bf1-c139-81e2-8bc2-c1ec46d0c241')] },
      { id: 'bezpieczniki', title: 'Bezpieczniki, przekaźniki i masy', match: { co: ['bezpieczniki'] }, links: [n('406d7bf1-c139-8147-a57d-ebe671e1771f'), n('406d7bf1-c139-81f0-9747-d6fafbe330b4'), page('/schematy', 'Schematy elektryczne', 'Narzędzie')] },
      { id: 'stacyjka', title: 'Stacyjka i przełączniki', match: { co: ['stacyjka'] }, links: [n('404d7bf1-c139-81cc-bc2b-fd3bf56e2ef7'), n('406d7bf1-c139-8119-997e-e6ab1983cbee')] },
      { id: 'poduszki', title: 'Poduszki powietrzne (SIR) — kontrolka AIR BAG', links: [n('406d7bf1-c139-81bf-a68d-d6eab2e69aba')] },
    ],
    gaps: [],
  },
  {
    id: 'przegrzewanie', label: 'Przegrzewanie', hint: 'Temperatura rośnie, ubywa płynu', icon: 'thermo',
    questions: [SILNIK, { id: 'kiedy', label: 'Kiedy rośnie temperatura?', options: [
      { id: 'korek', label: 'W korku / na postoju' },
      { id: 'trasa', label: 'W trasie / z przyczepą' },
      { id: 'ubytek', label: 'Płyn ubywa' },
      { id: 'zawsze', label: 'Od razu po rozruchu' },
    ] }],
    causes: [
      { id: 'chlodzenie', title: 'Termostat, sprzęgło wiskotyczne, pompa wody, chłodnica', only: B, match: { kiedy: ['korek', 'trasa', 'zawsze'] }, links: [n('402d7bf1-c139-81bd-8aba-ffb0600703b0'), n('402d7bf1-c139-8123-a9b4-d311d27200b1'), n('406d7bf1-c139-81f6-85b5-f20f15c442cb')] },
      { id: 'ubytek', title: 'Ubytek płynu: szyjka chłodnicy, przewody, korek', only: B, match: { kiedy: ['ubytek'] }, links: [n('406d7bf1-c139-81c1-92ab-ca8e623fc247'), n('402d7bf1-c139-81b4-b968-dfc56370ec5c')] },
      { id: 'plyn', title: 'Płyn DEX-COOL i jego wymiana', only: B, links: [n('405d7bf1-c139-8187-b30b-ea0bb17d425f')] },
      { id: 'pasek', title: 'Pasek napędu osprzętu', only: B, match: { kiedy: ['korek'] }, links: [n('405d7bf1-c139-819b-abb2-f4f035aab320')] },
      { id: 'silnik-info', title: 'Przegrzewanie i utrata płynu — lista kontrolna Haynes', only: B, match: { kiedy: ['ubytek'] }, links: [n('406d7bf1-c139-8165-9ec2-e488575a493f')] },
      { id: 'diesel-chl', title: '6.5 TD: układ chłodzenia', only: D, links: [n('406d7bf1-c139-8142-854b-d6f6a60791a9'), n('406d7bf1-c139-816c-a88c-d7b3100113cd'), n('406d7bf1-c139-811a-9209-db7177d38751')] },
      { id: 'diesel-pasek', title: '6.5 TD: pasek i pompa wody', only: D, match: { kiedy: ['korek', 'zawsze'] }, links: [n('406d7bf1-c139-81dc-b635-cb1e77dc1e72')] },
    ],
    gaps: [],
  },
  {
    id: 'paliwo-dym', label: 'Paliwo i dymienie', hint: 'Dym z wydechu, zużycie paliwa/oleju', icon: 'smoke',
    questions: [SILNIK, { id: 'co', label: 'Co zauważasz?', options: [
      { id: 'niebieski', label: 'Niebieski dym' },
      { id: 'czarny', label: 'Czarny dym' },
      { id: 'bialy', label: 'Biały lub szary dym' },
      { id: 'paliwo', label: 'Duże zużycie paliwa' },
      { id: 'olej', label: 'Duże zużycie oleju' },
    ] }],
    causes: [
      { id: 'uszczelniacze', title: 'Niebieski dym po rozruchu: uszczelniacze zaworów (4.3)', only: B, match: { co: ['niebieski', 'olej'] }, links: [n('405d7bf1-c139-8119-aea3-eb698ff1667d')] },
      { id: 'olej-74', title: '7.4 L: zużycie oleju', only: B, match: { co: ['olej'] }, links: [n('405d7bf1-c139-8118-8309-de5476a77d0b'), n('406d7bf1-c139-81c2-bc99-cb00bb4258c5')] },
      { id: 'silnik-info', title: 'Zużycie oleju i paliwa — lista kontrolna Haynes', only: B, match: { co: ['olej', 'paliwo', 'niebieski'] }, links: [n('406d7bf1-c139-8165-9ec2-e488575a493f')] },
      { id: 'mieszanka', title: 'Mieszanka za bogata / korekty paliwa', only: B, match: { co: ['czarny', 'paliwo'] }, links: [n('405d7bf1-c139-8120-a07f-c8399aafb31a'), n('406d7bf1-c139-81e8-b98b-da19acd79bbc')] },
      { id: 'spalanie', title: 'Ile pali GMT400: dane EPA i raporty kierowców', match: { co: ['paliwo'] }, links: [n('404d7bf1-c139-8111-96fb-d3ac8b218cfa')] },
      { id: 'diesel-dym', title: '6.5 TD: dym — diagnoza według objawów', only: D, match: { co: ['niebieski', 'czarny', 'bialy'] }, links: [n('406d7bf1-c139-81fe-b470-c20e56bd41c3'), n('406d7bf1-c139-81a9-a9a7-e6a1ed37cc97')] },
      { id: 'diesel-turbo', title: '6.5 TD: turbosprężarka', only: D, match: { co: ['czarny', 'niebieski'] }, links: [n('406d7bf1-c139-81a4-8a83-de81dbb37fd2')] },
      { id: 'diesel-zuzycie', title: '6.5 TD: zużycie oleju, paliwa i płynu', only: D, match: { co: ['olej', 'paliwo'] }, links: [n('406d7bf1-c139-811a-9209-db7177d38751'), n('406d7bf1-c139-81fe-b470-c20e56bd41c3')] },
    ],
    gaps: ['Biały dym w benzynie (para z układu chłodzenia) — brak osobnego wpisu; patrz „Przegrzewanie”.'],
  },
];

export type Answers = Record<string, string | undefined>;
export type RankedCause = { cause: Cause; score: number; matched: string[] };

/** Plakietki „pasuje: …” — tylko dla odpowiedzi, które faktycznie podbiły pozycję. */
function optionLabel(symptom: Symptom, qid: string, oid: string): string {
  return symptom.questions.find(q => q.id === qid)?.options.find(o => o.id === oid)?.label ?? oid;
}

/**
 * Kolejność = dopasowanie do odpowiedzi użytkownika (każda pasująca odpowiedź +2, niepasująca przy zdefiniowanym `match` −1),
 * przy remisie kolejność z tego pliku (kontrola od najprostszej). To NIE jest statystyka awaryjności.
 * Brak odpowiedzi nic nie filtruje. Twardo odpada tylko przyczyna z `only`, której warunek użytkownik wprost wykluczył.
 */
export function rankCauses(symptom: Symptom, answers: Answers): RankedCause[] {
  const ranked: RankedCause[] = [];
  symptom.causes.forEach((cause, index) => {
    for (const [qid, allowed] of Object.entries(cause.only ?? {})) {
      const a = answers[qid];
      if (a && !allowed.includes(a)) return;
    }
    let score = 0;
    const matched: string[] = [];
    for (const [qid, wanted] of Object.entries(cause.match ?? {})) {
      const a = answers[qid];
      if (!a) continue;
      if (wanted.includes(a)) { score += 2; matched.push(optionLabel(symptom, qid, a)); } else score -= 1;
    }
    ranked.push({ cause, score: score - index / 1000, matched });
  });
  return ranked.sort((x, y) => y.score - x.score);
}

export function notionIdsOf(cause: Cause): string[] {
  return cause.links.flatMap(link => ('id' in link ? [link.id] : []));
}
/** Wszystkie id wpisów Notion użyte w narzędziu (bez powtórzeń). */
export function allNotionIds(): string[] {
  return [...new Set(SYMPTOMS.flatMap(s => s.causes.flatMap(notionIdsOf)))];
}
export function diagnosisStats() {
  const causes = SYMPTOMS.reduce((sum, s) => sum + s.causes.length, 0);
  const links = SYMPTOMS.reduce((sum, s) => sum + s.causes.reduce((c, cause) => c + cause.links.length, 0), 0);
  const pageLinks = SYMPTOMS.flatMap(s => s.causes.flatMap(c => c.links)).filter(l => 'href' in l).length;
  return { symptoms: SYMPTOMS.length, causes, links, notionLinks: links - pageLinks, pageLinks, uniqueNotion: allNotionIds().length };
}
