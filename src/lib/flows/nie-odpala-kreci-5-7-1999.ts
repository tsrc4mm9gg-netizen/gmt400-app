import type { Flow, FlowAnswer, FlowNode, FlowSafety, FlowSource } from '../diagnosis-flow';

/**
 * Ścieżka diagnostyczna (etap 2: kroki 1-8 tabeli Engine Cranks But Does Not Run oraz pełna tabela Fuel System Diagnosis kroki 1-30, dla warsztatu).
 * Ścieżka: „Nie odpala: silnik kręci normalnie, ale nie zapala”, benzyna 5.7 Vortec (VIN R, Central SFI), 1999.
 * Zakres: Suburban 1500 i 2500, Tahoe 2/4-drzwiowe (Chevrolet) oraz Yukon 2/4-drzwiowe (GMC), 2WD i 4WD.
 * Silnik w profilu zapisywany jest jako kod RPO (L31 = Vortec 5700), tak jak daje go dekoder VIN i lista silników w profilu auta.
 * Kopie podręcznika to kopie osób trzecich (Operation CHARM, LEMON Manuals), nie potwierdzenie GM.
 */

const VERSION = [{ models: ['Suburban 1500', 'Suburban 2500', 'Tahoe 2-door', 'Tahoe 4-door', 'Yukon 2-door', 'Yukon 4-door'], yearFrom: 1999, yearTo: 1999, engines: ['L31'], drives: ['2WD', '4WD'] }];

const CCNR_4WD: FlowSource = {
  label: 'GM 1999 K 1500 Suburban 4WD V8-5.7L VIN R: Engine Cranks But Does Not Run (kopia Operation CHARM)',
  url: 'https://charm.li/Chevrolet/1999/K%201500%20Suburban%204WD%20V8-5.7L%20VIN%20R/Repair%20and%20Diagnosis/Powertrain%20Management/Computers%20and%20Control%20Systems/Testing%20and%20Inspection/Symptom%20Related%20Diagnostic%20Procedures/Engine%20Cranks%20But%20Does%20Not%20Run/',
  kind: 'kopia dokumentu', applicability: 'ustalona',
  applicabilityNote: 'Kopia jest opisana jako 1999 K 1500 Suburban 4WD 5.7L VIN R. To zgodność z opisem kopii, nie potwierdzenie przez GM. Tabela kroków (obrazek) została odczytana w całości, kroki 1-8, z wartościami i odsyłaczami.',
  scope: 'Suburban 1500 4WD, 1999, 5.7L (VIN R)', vehicleScope: [{ models: ['Suburban 1500'], yearFrom: 1999, yearTo: 1999, engines: ['L31'], drives: ['4WD'] }],
};
const CCNR_2WD: FlowSource = {
  label: 'GM 1999 C 1500 Suburban 2WD V8-5.7L VIN R: Engine Cranks But Does Not Run (kopia LEMON Manuals)',
  url: 'https://lemon-manuals.la/Chevrolet/1999/C%201500%20Suburban%202WD%20V8-5.7L%20VIN%20R/Repair%20and%20Diagnosis/Powertrain%20Management/Computers%20and%20Control%20Systems/Testing%20and%20Inspection/Symptom%20Related%20Diagnostic%20Procedures/Engine%20Cranks%20But%20Does%20Not%20Run/',
  kind: 'kopia dokumentu', applicability: 'ustalona',
  applicabilityNote: 'Kopia opisana jako 1999 C 1500 Suburban 2WD 5.7L VIN R; tekst opisowy identyczny z kopią 4WD, a obrazki tabel pobrane z tej kopii są bajt w bajt identyczne z obrazkami kopii 4WD (porównanie plików), więc odczytane tabele obowiązują w obu kopiach. Zgodność z opisem kopii, nie potwierdzenie GM.',
  scope: 'Suburban 1500 2WD, 1999, 5.7L (VIN R)', vehicleScope: [{ models: ['Suburban 1500'], yearFrom: 1999, yearTo: 1999, engines: ['L31'], drives: ['2WD'] }],
};
const FSD_4WD: FlowSource = {
  label: 'GM 1999 K 1500 Suburban 4WD V8-5.7L VIN R: Fuel System Diagnosis (kopia Operation CHARM)',
  url: 'https://charm.li/Chevrolet/1999/K%201500%20Suburban%204WD%20V8-5.7L%20VIN%20R/Repair%20and%20Diagnosis/Powertrain%20Management/Computers%20and%20Control%20Systems/Testing%20and%20Inspection/Component%20Tests%20and%20General%20Diagnostics/Fuel%20System%20Diagnosis/',
  kind: 'kopia dokumentu', applicability: 'ustalona',
  applicabilityNote: 'Kopia opisana jako 1999 K 1500 Suburban 4WD 5.7L VIN R, układ Central SFI. Zgodność z opisem kopii, nie potwierdzenie GM. Tabele kroków 1-30 (obrazki) zostały odczytane w całości.',
  scope: 'Suburban 1500 4WD, 1999, 5.7L (VIN R), Central SFI', vehicleScope: [{ models: ['Suburban 1500'], yearFrom: 1999, yearTo: 1999, engines: ['L31'], drives: ['4WD'] }],
};
const FSD_2WD: FlowSource = {
  label: 'GM 1999 C 1500 Suburban 2WD V8-5.7L VIN R: Fuel System Diagnosis (kopia LEMON Manuals)',
  url: 'https://lemon-manuals.la/Chevrolet/1999/C%201500%20Suburban%202WD%20V8-5.7L%20VIN%20R/Repair%20and%20Diagnosis/Powertrain%20Management/Computers%20and%20Control%20Systems/Testing%20and%20Inspection/Component%20Tests%20and%20General%20Diagnostics/Fuel%20System%20Diagnosis/',
  kind: 'kopia dokumentu', applicability: 'ustalona',
  applicabilityNote: 'Kopia opisana jako 1999 C 1500 Suburban 2WD 5.7L VIN R, Central SFI, tekst opisowy identyczny z kopią 4WD, a wszystkie 7 obrazków tej strony jest bajt w bajt identycznych z obrazkami kopii 4WD (porównanie plików), więc odczytane tabele kroków 1-30 obowiązują w obu kopiach.',
  scope: 'Suburban 1500 2WD, 1999, 5.7L (VIN R), Central SFI', vehicleScope: [{ models: ['Suburban 1500'], yearFrom: 1999, yearTo: 1999, engines: ['L31'], drives: ['2WD'] }],
};

const scope1999 = (models: string[], drives: string[]) => [{ models, yearFrom: 1999, yearTo: 1999, engines: ['L31'], drives }];
const CHARMcmp = ' Tekst i obrazy tabel są identyczne z referencyjnym wariantem Chevrolet K 1500 Suburban 4WD 1999 5.7L VIN R w tej samej kopii (porównanie skrótów SHA-256 tekstu i obrazów; 24 z 24 stron bez różnic). To zgodność kopii, nie potwierdzenie GM.';
const BODY_NOTE = ' Zakres nadwozi: katalog ma jedną pozycję Tahoe/Yukon na napęd, bez podziału 2/4-drzwiowego; w drzewie jest jedna strona CCNR i FSD, bez wariantu nadwoziowego. To wniosek z budowy podręcznika, nie deklaracja GM.';

const charm = (variantPath: string, procedure: 'CCNR' | 'FSD', models: string[], drives: string[], extra = ''): FlowSource => {
  const slug = procedure === 'CCNR'
    ? 'Symptom%20Related%20Diagnostic%20Procedures/Engine%20Cranks%20But%20Does%20Not%20Run'
    : 'Component%20Tests%20and%20General%20Diagnostics/Fuel%20System%20Diagnosis';
  const variant = variantPath.replace(/%20/g, ' ').replace(/%2F/g, '/');
  return {
    label: `GM 1999 ${variant}: ${procedure === 'CCNR' ? 'Engine Cranks But Does Not Run' : 'Fuel System Diagnosis'} (kopia Operation CHARM)`,
    url: `https://charm.li/${variantPath}/Repair%20and%20Diagnosis/Powertrain%20Management/Computers%20and%20Control%20Systems/Testing%20and%20Inspection/${slug}/`,
    kind: 'kopia dokumentu', applicability: 'ustalona',
    applicabilityNote: `Kopia osoby trzeciej (Operation CHARM) opisana jako 1999 ${variant}.${CHARMcmp}${extra}`,
    scope: `${variant}, 1999, 5.7L (VIN R)${procedure === 'FSD' ? ', Central SFI' : ''}`,
    vehicleScope: scope1999(models, drives),
  };
};

const SRC_CCNR: FlowSource[] = [
  CCNR_4WD,
  CCNR_2WD,
  charm('Chevrolet/1999/C%201500%20Suburban%202WD%20V8-5.7L%20VIN%20R', 'CCNR', ['Suburban 1500'], ['2WD']),
  charm('Chevrolet/1999/C%202500%20Suburban%202WD%20V8-5.7L%20VIN%20R', 'CCNR', ['Suburban 2500'], ['2WD']),
  charm('Chevrolet/1999/K%202500%20Suburban%204WD%20V8-5.7L%20VIN%20R', 'CCNR', ['Suburban 2500'], ['4WD']),
  charm('Chevrolet/1999/C%20Tahoe%202WD%20V8-5.7L%20VIN%20R', 'CCNR', ['Tahoe 2-door', 'Tahoe 4-door'], ['2WD'], BODY_NOTE),
  charm('Chevrolet/1999/K%20Tahoe%204WD%20V8-5.7L%20VIN%20R', 'CCNR', ['Tahoe 2-door', 'Tahoe 4-door'], ['4WD'], BODY_NOTE),
  charm('GMC/1999/C%20Yukon%202WD%20V8-5.7L%20VIN%20R', 'CCNR', ['Yukon 2-door', 'Yukon 4-door'], ['2WD'], BODY_NOTE),
  charm('GMC/1999/K%20Yukon%2FDenali%204WD%20V8-5.7L%20VIN%20R', 'CCNR', ['Yukon 2-door', 'Yukon 4-door'], ['4WD'], BODY_NOTE),
  charm('GMC/1999/C%201500%20Suburban%202WD%20V8-5.7L%20VIN%20R', 'CCNR', ['Suburban 1500'], ['2WD']),
  charm('GMC/1999/K%201500%20Suburban%204WD%20V8-5.7L%20VIN%20R', 'CCNR', ['Suburban 1500'], ['4WD']),
  charm('GMC/1999/C%202500%20Suburban%202WD%20V8-5.7L%20VIN%20R', 'CCNR', ['Suburban 2500'], ['2WD']),
  charm('GMC/1999/K%202500%20Suburban%204WD%20V8-5.7L%20VIN%20R', 'CCNR', ['Suburban 2500'], ['4WD']),
];
const SRC_FSD: FlowSource[] = [
  FSD_4WD,
  FSD_2WD,
  charm('Chevrolet/1999/C%201500%20Suburban%202WD%20V8-5.7L%20VIN%20R', 'FSD', ['Suburban 1500'], ['2WD']),
  charm('Chevrolet/1999/C%202500%20Suburban%202WD%20V8-5.7L%20VIN%20R', 'FSD', ['Suburban 2500'], ['2WD']),
  charm('Chevrolet/1999/K%202500%20Suburban%204WD%20V8-5.7L%20VIN%20R', 'FSD', ['Suburban 2500'], ['4WD']),
  charm('Chevrolet/1999/C%20Tahoe%202WD%20V8-5.7L%20VIN%20R', 'FSD', ['Tahoe 2-door', 'Tahoe 4-door'], ['2WD'], BODY_NOTE),
  charm('Chevrolet/1999/K%20Tahoe%204WD%20V8-5.7L%20VIN%20R', 'FSD', ['Tahoe 2-door', 'Tahoe 4-door'], ['4WD'], BODY_NOTE),
  charm('GMC/1999/C%20Yukon%202WD%20V8-5.7L%20VIN%20R', 'FSD', ['Yukon 2-door', 'Yukon 4-door'], ['2WD'], BODY_NOTE),
  charm('GMC/1999/K%20Yukon%2FDenali%204WD%20V8-5.7L%20VIN%20R', 'FSD', ['Yukon 2-door', 'Yukon 4-door'], ['4WD'], BODY_NOTE),
  charm('GMC/1999/C%201500%20Suburban%202WD%20V8-5.7L%20VIN%20R', 'FSD', ['Suburban 1500'], ['2WD']),
  charm('GMC/1999/K%201500%20Suburban%204WD%20V8-5.7L%20VIN%20R', 'FSD', ['Suburban 1500'], ['4WD']),
  charm('GMC/1999/C%202500%20Suburban%202WD%20V8-5.7L%20VIN%20R', 'FSD', ['Suburban 2500'], ['2WD']),
  charm('GMC/1999/K%202500%20Suburban%204WD%20V8-5.7L%20VIN%20R', 'FSD', ['Suburban 2500'], ['4WD']),
];
const NOT_AUTHORED = 'Dalszej procedury, do której odsyła źródło, ta ścieżka jeszcze nie zawiera.';
const WS = 'warsztat' as const;
const FUEL_SAFETY: FlowSafety = { form: 'parafraza źródła', text: 'Według źródła przed pracą przy układzie paliwowym trzeba zdjąć z niego ciśnienie (tej procedury ta ścieżka nie zawiera), mieć w pobliżu gaśnicę proszkową klasy B i zapewnić wentylację. Ciśnienie nie może przekroczyć 75 psi (517 kPa), bo można uszkodzić regulator.' };
const FUEL_STOP: FlowSafety = { form: 'parafraza źródła', text: 'To jest praca przy paliwie pod ciśnieniem. Źródło wskazuje ryzyko pożaru i obrażeń, a ta ścieżka nie zawiera procedury zdjęcia ciśnienia. Nie rób tego samodzielnie: zleć warsztatowi i wróć z jego wynikiem.' };
const NO_SELF: FlowAnswer = { id: 'nie-robie', label: 'Nie robię tego samodzielnie', next: '', stop: true };
const FSD_NOTE = 'Krok z tabeli Fuel System Diagnosis. Ta ścieżka podaje tylko pytanie z tabeli i wynik, nie opisuje wykonania pomiaru.';

/** Węzeł wyniku pomiaru przy paliwie: ostrzeżenie, stop i odpowiedź "nie robię". */
const fuelCheck = (id: string, title: string, text: string, answers: FlowAnswer[], details = FSD_NOTE): FlowNode => ({ id, kind: 'check', level: WS, title, sources: SRC_FSD, parts: [], safety: FUEL_SAFETY, stop: FUEL_STOP, text, details, answers: [...answers, NO_SELF] });
/** Węzeł wyniku oględzin lub sprawdzenia bez pomiaru ciśnienia. */
const inspect = (id: string, title: string, text: string, answers: FlowAnswer[], details = FSD_NOTE): FlowNode => ({ id, kind: 'check', level: WS, title, sources: SRC_FSD, parts: [], text, details, answers });
const result = (id: string, title: string, text: string, notChecked: string[], outcome: 'nieprawidłowy-wynik-testu' | 'konieczny-kolejny-test' | 'nierozstrzygnięte' | 'obserwacja' = 'konieczny-kolejny-test', src: FlowSource[] = SRC_FSD, details?: string): FlowNode => ({ id, kind: 'result', outcome, title, text, sources: src, parts: [], excluded: [], notChecked, ...(details ? { details } : {}) });
const AFTER = ' Po naprawie tabela kieruje do kroku 30 (odczyt zapisanych informacji i sprawdzenie niezdiagnozowanych kodów DTC).';
const NO_PARTS = ' Ścieżka nie wskazuje części ani sposobu naprawy.';

export const FLOW_NIE_ODPALA_KRECI: Flow = {
  id: 'nie-odpala-kreci-5-7-1999', symptomId: 'nie-odpala', title: 'Nie odpala, silnik kręci normalnie (5.7 Vortec, 1999)',
  scope: VERSION, start: 'q0',
  nodes: {
    q0: { id: 'q0', kind: 'question', neutral: true, versionIndependent: true, title: 'Jak kręci rozrusznik?', text: 'Ta ścieżka dotyczy silnika, który kręci się normalnym tempem, ale nie zaskakuje.', sources: [], parts: [],
      answers: [{ id: 'normalnie', label: 'Kręci normalnie, ale nie zapala', next: 'c1' }, { id: 'inaczej', label: 'Kręci wolno, tylko klika albo nie kręci', next: 'r_inny' }] },
    c1: { id: 'c1', kind: 'check', level: 'każdy', title: 'Trzy warunki wstępne', sources: SRC_CCNR, parts: [],
      text: 'Zanim zaczniesz szukać dalej, według źródła muszą być spełnione trzy rzeczy: akumulator jest dobrze naładowany, rozrusznik kręci silnik dość szybko i w baku jest dość paliwa (nie ufaj samemu wskaźnikowi; uwaga o drugim zbiorniku pochodzi z tabeli Fuel System Diagnosis, krok 10).',
      answers: [{ id: 'tak', label: 'Według mnie wszystkie trzy są spełnione', next: 'c2' }, { id: 'nie', label: 'Któryś nie jest spełniony albo nie wiem', next: 'r_warunki' }] },
    c2: { id: 'c2', kind: 'check', level: 'każdy', title: 'Czy słychać pompę paliwa po włączeniu zapłonu?', sources: SRC_FSD, parts: [],
      text: 'Przekręć kluczyk na ON bez rozruchu i posłuchaj od strony zbiornika. Według źródła pompa powinna pracować około 2 sekundy.',
      details: 'To tylko obserwacja: słyszalna pompa nie mówi nic o ciśnieniu paliwa. Dalsze kroki źródła wymagają skanera, narzędzi specjalnych lub pracy przy paliwie, więc dalej wpisujesz wyniki podane przez warsztat.',
      answers: [{ id: 'slychac', label: 'Słychać pompę przez ok. 2 sekundy', next: 'c1a' }, { id: 'cisza', label: 'Nie słychać pompy', next: 'r_pompa' }, { id: 'nie-wiem', label: 'Nie jestem pewien', next: 'c1a' }] },
    c1a: { id: 'c1a', kind: 'check', level: WS, title: 'Wynik warsztatu: kontrola układu diagnostycznego (OBD)', sources: SRC_CCNR, parts: [],
      text: 'Czy warsztat wykonał kontrolę Powertrain On-Board Diagnostic (OBD) System Check?',
      details: 'Krok 1 tabeli „Engine Cranks But Does Not Run”. Przed kasowaniem kodów DTC źródło każe zapisać dane ramki zamrożonej i rekordy usterek, bo kasowanie je usuwa. Jeśli kontroli nie wykonano, tabela odsyła do niej.',
      answers: [{ id: 'tak', label: 'Warsztat: kontrola wykonana', next: 'c3' }, { id: 'nie', label: 'Kontrola nie była wykonana', next: 'r_obd_ccnr' }] },
    c3: { id: 'c3', kind: 'check', level: WS, title: 'Wynik warsztatu: parametr VTD Fuel Disabled', sources: SRC_CCNR, parts: [],
      text: 'Czy skaner pokazał parametr „VTD Fuel Disabled” jako active podczas kręcenia silnika?',
      details: 'Krok 3 tabeli „Engine Cranks But Does Not Run”. Źródło mówi o układzie antykradzieżowym (VTD) „jeśli jest w wyposażeniu”; czy to auto go ma, nie jest ustalone. Brak wyniku lub parametru nie oznacza ani braku układu, ani jego poprawnej pracy.',
      answers: [{ id: 'aktywny', label: 'Warsztat: parametr był active', next: 'r_vtd' }, { id: 'nieaktywny', label: 'Warsztat: parametr był widoczny i nie był active', next: 'c4' }, { id: 'brak', label: 'Nie mam wyniku albo parametru nie było', next: 'r_warsztat' }] },
    c4: { id: 'c4', kind: 'check', level: WS, title: 'Wynik warsztatu: TP i ECT', sources: SRC_CCNR, parts: [],
      text: 'Czy skaner pokazał TP powyżej 2,5 V przy zamkniętej przepustnicy albo ECT poniżej -30 °C (-22 °F)?',
      details: 'Kroki 4 i 5 tabeli „Engine Cranks But Does Not Run”. Według źródła TP powyżej 2,5 V może oznaczać tryb czyszczenia zalania (odsyła do kodu P0121), a ECT poniżej -30 °C powoduje mocne zalanie silnika (odsyła do kodu P0118).',
      answers: [{ id: 'oba-ok', label: 'Warsztat: TP nie więcej niż 2,5 V i ECT nie poniżej -30 °C', next: 'c5' }, { id: 'tp', label: 'Warsztat: TP powyżej 2,5 V', next: 'r_tp' }, { id: 'ect', label: 'Warsztat: ECT poniżej -30 °C', next: 'r_ect' }, { id: 'brak', label: 'Nie mam wyniku', next: 'r_warsztat' }] },
    c5: { id: 'c5', kind: 'check', level: WS, title: 'Wynik warsztatu: iskra na dwóch przewodach świec', sources: SRC_CCNR, parts: [],
      text: 'Czy warsztat stwierdził iskrę na dwóch sprawdzonych przewodach świec?',
      details: 'Krok 6 tabeli „Engine Cranks But Does Not Run” (test specjalnym testerem iskry, w źródle J 26792). Źródło uznaje brak iskry za podstawową usterkę zapłonu. Odczytany tekst nie opisuje bezpiecznego wykonania tego testu, więc ścieżka go nie podaje. Iskra na dwóch przewodach nie oznacza, że cały zapłon jest sprawny.',
      answers: [{ id: 'jest', label: 'Warsztat: iskra była na obu przewodach', next: 'c6' }, { id: 'brak', label: 'Warsztat: brak iskry na którymś przewodzie', next: 'r_zaplon' }, { id: 'brak-wyniku', label: 'Nie mam wyniku', next: 'r_warsztat' }] },
    c6: { id: 'c6', kind: 'check', level: WS, title: 'Wynik warsztatu: ciśnienie paliwa, zapłon ON, silnik wyłączony', sources: [...SRC_CCNR], parts: [], safety: FUEL_SAFETY, stop: FUEL_STOP,
      text: 'Czy manometr pokazał ciśnienie paliwa w zakresie 55-60 psi (379-413 kPa) przy włączonym zapłonie i wyłączonym silniku?',
      details: 'Krok 7 tabeli „Engine Cranks But Does Not Run”. Tabela nie określa, czy pompa pracuje w chwili odczytu, ani czasu utrzymania czy tolerancji. Ten krok nie jest tym samym co kroki 2 i 3 tabeli Fuel System Diagnosis, które mają własne warunki. Odpowiedź „w zakresie” prowadzi według źródła do kroku 8, „poza zakresem” do tabeli Fuel System Diagnosis.',
      answers: [{ id: 'w-zakresie', label: 'Warsztat: ciśnienie w zakresie', next: 'c8' }, { id: 'poza', label: 'Warsztat: ciśnienie poza zakresem', next: 'f1' }, { id: 'brak-wyniku', label: 'Nie mam wyniku', next: 'r_warsztat' }, NO_SELF] },
    c8: { id: 'c8', kind: 'check', level: WS, title: 'Wynik warsztatu: lampka kontrolna wtryskiwaczy', sources: SRC_CCNR, parts: [],
      stop: { form: 'parafraza źródła', text: 'Ten test wymaga odłączenia złącza wtryskiwaczy i lampki kontrolnej z wyposażenia warsztatu. Zleć go warsztatowi.' },
      text: 'Czy lampka kontrolna migała w obwodzie każdego wtryskiwacza podczas kręcenia silnika? Miganie oznacza według źródła, że komputer steruje wtryskiwaczem.',
      details: 'Krok 8 tabeli „Engine Cranks But Does Not Run” (lampka J 34730-375 przy odłączonym złączu wtryskiwaczy). Ścieżka nie opisuje wykonania testu.',
      answers: [{ id: 'miga', label: 'Warsztat: lampka migała w każdym obwodzie', next: 'r_dalej' }, { id: 'nie-miga', label: 'Warsztat: nie migała w którymś obwodzie', next: 'r_wtrysk' }, { id: 'brak-wyniku', label: 'Nie mam wyniku', next: 'r_warsztat' }, NO_SELF] },

    // ===== Fuel System Diagnosis (kopia dokumentu), kroki 1-30. Wejście z kroku 7 CCNR odpowiedzią „poza zakresem”. =====
    f1: inspect('f1', 'Wynik warsztatu: kontrola układu diagnostycznego (OBD)', 'Czy warsztat wykonał kontrolę Powertrain On-Board Diagnostic (OBD) System Check?', [{ id: 'tak', label: 'Warsztat: kontrola wykonana', next: 'f2' }, { id: 'nie', label: 'Kontrola nie była wykonana', next: 'r_obd' }], 'Krok 1 tabeli Fuel System Diagnosis. Jeśli kontroli nie wykonano, tabela odsyła do niej.'),
    f2: fuelCheck('f2', 'Wynik warsztatu: ciśnienie przy pompie włączonej skanerem', 'Czy ciśnienie przy pracującej pompie (włączonej skanerem) mieści się w zakresie 60-66 psi (413-455 kPa)?', [{ id: 'tak', label: 'Warsztat: mieści się', next: 'f3' }, { id: 'nie', label: 'Warsztat: nie mieści się', next: 'f8' }], 'Krok 2 tabeli Fuel System Diagnosis, wartość dla układu Central SFI. Źródło zaznacza, że pompę czasem trzeba włączyć kilka razy, żeby uzyskać maksymalne ciśnienie. Ścieżka nie opisuje wykonania pomiaru.'),
    f3: fuelCheck('f3', 'Wynik warsztatu: czy ciśnienie trzyma po zatrzymaniu pompy', 'Czy po zatrzymaniu pompy ciśnienie trzyma stabilnie w zakresie 55-60 psi (379-413 kPa)?', [{ id: 'tak', label: 'Warsztat: trzyma stabilnie', next: 'f5' }, { id: 'nie', label: 'Warsztat: ciśnienie spada', next: 'f4' }], 'Krok 3 tabeli Fuel System Diagnosis. Tabela nie podaje czasu utrzymania ani dopuszczalnego spadku; ocena „trzyma stabilnie” należy do warsztatu.'),
    f4: fuelCheck('f4', 'Wynik warsztatu: ciśnienie po odizolowaniu filtra adapterem', 'Czy po izolowaniu odcinka adapterem odcinającym ciśnienie zostaje stałe w zakresie 55-60 psi (379-413 kPa)?', [{ id: 'tak', label: 'Warsztat: zostaje stałe', next: 'f12' }, { id: 'nie', label: 'Warsztat: dalej spada', next: 'f6' }], 'Krok 4 tabeli Fuel System Diagnosis. Opis źródła: ciśnienie, które stale spada, powodują moduł pompy w zbiorniku niezdolny do utrzymania ciśnienia, nieszczelny zawór regulatora, nieszczelny wtryskiwacz Central SFI albo nieszczelna linia. Ścieżka nie opisuje wykonania pomiaru.'),
    f5: inspect('f5', 'Czy ciśnienie paliwa spada w czasie jazdy?', 'Czy podejrzewasz spadek ciśnienia paliwa podczas przyspieszania, jazdy ze stałą prędkością lub ostrego pokonywania zakrętów?', [{ id: 'tak', label: 'Tak, podejrzewam spadek w jeździe', next: 'f27' }, { id: 'nie', label: 'Nie', next: 'f26' }], 'Krok 5 tabeli Fuel System Diagnosis. To pytanie o objaw z jazdy, nie o wynik pomiaru.'),
    f6: inspect('f6', 'Wynik warsztatu: przewód zasilający za adapterem', 'Czy warsztat znalazł problem w przewodzie zasilającym między adapterem odcinającym a przewodami paliwowymi silnika?', [{ id: 'tak', label: 'Warsztat: znaleziono problem', next: 'r_f25' }, { id: 'nie', label: 'Warsztat: nie znaleziono', next: 'f7' }], 'Krok 6 tabeli Fuel System Diagnosis (oględziny).'),
    f7: fuelCheck('f7', 'Wynik warsztatu: ciśnienie po odizolowaniu powrotu adapterem', 'Czy po izolowaniu linii powrotnej adapterem odcinającym ciśnienie zostaje stałe?', [{ id: 'tak', label: 'Warsztat: zostaje stałe', next: 'r_regulator' }, { id: 'nie', label: 'Warsztat: nie zostaje stałe', next: 'r_f29' }], 'Krok 7 tabeli Fuel System Diagnosis. Ścieżka nie opisuje wykonania pomiaru.'),
    f8: fuelCheck('f8', 'Wynik warsztatu: czy po zatrzymaniu pompy jest jakieś ciśnienie', 'Czy po zatrzymaniu pompy (włączonej skanerem przy zapłonie ON) jest jakiekolwiek ciśnienie?', [{ id: 'tak', label: 'Warsztat: ciśnienie jest', next: 'f13' }, { id: 'nie', label: 'Warsztat: ciśnienia brak', next: 'f9' }], 'Krok 8 tabeli Fuel System Diagnosis. Według źródła pompa powinna po poleceniu pracować 2 sekundy i wyłączyć się.'),
    f9: inspect('f9', 'Wynik warsztatu: czy pompa pracuje po poleceniu ze skanera', 'Czy pompa pracuje, gdy warsztat włącza ją skanerem przy zapłonie ON?', [{ id: 'tak', label: 'Warsztat: pompa pracuje', next: 'f10' }, { id: 'nie', label: 'Warsztat: pompa nie pracuje', next: 'r_przekaznik' }], 'Krok 9 tabeli Fuel System Diagnosis.'),
    f10: inspect('f10', 'Wynik warsztatu: brak paliwa, filtr, sitko, linia', 'Czy warsztat znalazł brak paliwa w baku, zapchany filtr, uszkodzone lub zapchane sitko pompy albo zatkaną linię?', [{ id: 'tak', label: 'Warsztat: znaleziono problem', next: 'r_f11' }, { id: 'nie', label: 'Warsztat: nie znaleziono', next: 'f12' }], 'Krok 10 tabeli Fuel System Diagnosis. Źródło: nie polegać na wskaźniku paliwa; przy dwóch zbiornikach sprawdzić też dodatkowy (jeśli go brak, odsyła do kodu P0461).'),
    f12: inspect('f12', 'Wynik warsztatu: nieszczelność przewodu do modułu pompy', 'Czy warsztat znalazł nieszczelność przewodu zasilającego do modułu pompy w zbiorniku?', [{ id: 'nieszczelnosc', label: 'Warsztat: znaleziono nieszczelność', next: 'r_f12_przewod' }, { id: 'brak', label: 'Warsztat: nie ma nieszczelności', next: 'r_f12_modul' }], 'Krok 12 tabeli Fuel System Diagnosis. Bez nieszczelności tabela każe wymienić moduł pompy.'),
    f13: fuelCheck('f13', 'Wynik warsztatu: czy ciśnienie przekracza 66 psi', 'Czy ciśnienie przy pracującej pompie (włączonej skanerem) jest powyżej 66 psi (455 kPa)?', [{ id: 'tak', label: 'Warsztat: powyżej 66 psi', next: 'f14' }, { id: 'nie', label: 'Warsztat: nie powyżej', next: 'f15' }], 'Krok 13 tabeli Fuel System Diagnosis.'),
    f14: fuelCheck('f14', 'Wynik warsztatu: ciśnienie przy odłączonej linii powrotnej', 'Czy po odłączeniu linii powrotnej ciśnienie przy pracującej pompie mieści się w 60-66 psi (413-455 kPa)?', [{ id: 'tak', label: 'Warsztat: mieści się', next: 'r_f16' }, { id: 'nie', label: 'Warsztat: nie mieści się', next: 'f17' }], 'Krok 14 tabeli Fuel System Diagnosis. Ścieżka nie opisuje wykonania pomiaru.'),
    f15: fuelCheck('f15', 'Wynik warsztatu: czy ciśnienie jest poniżej 60 psi', 'Czy ciśnienie przy pracującej pompie (włączonej skanerem) jest poniżej 60 psi (413 kPa)?', [{ id: 'tak', label: 'Warsztat: poniżej 60 psi', next: 'f19' }, { id: 'nie', label: 'Warsztat: nie poniżej', next: 'f30' }], 'Krok 15 tabeli Fuel System Diagnosis.'),
    f17: inspect('f17', 'Wynik warsztatu: wylot rury powrotnej silnika', 'Czy warsztat znalazł zatkanie wylotu rury powrotnej silnika?', [{ id: 'tak', label: 'Warsztat: znaleziono zatkanie', next: 'r_f18' }, { id: 'nie', label: 'Warsztat: nie znaleziono', next: 'r_regulator' }], 'Krok 17 tabeli Fuel System Diagnosis (oględziny).'),
    f19: inspect('f19', 'Wynik warsztatu: zatkana linia lub filtr w linii', 'Czy warsztat znalazł zatkaną linię paliwową albo zatkany filtr w linii?', [{ id: 'tak', label: 'Warsztat: znaleziono problem', next: 'r_f20' }, { id: 'nie', label: 'Warsztat: nie znaleziono', next: 'f21' }], 'Krok 19 tabeli Fuel System Diagnosis.'),
    f21: fuelCheck('f21', 'Wynik warsztatu: test regulatora przy przymykaniu powrotu', 'Czy przy powolnym przymykaniu powrotu ciśnienie rośnie powyżej 66 psi (455 kPa)?', [{ id: 'tak', label: 'Warsztat: rośnie powyżej 66 psi', next: 'r_regulator' }, { id: 'nie', label: 'Warsztat: nie rośnie', next: 'f23' }], 'Krok 21 tabeli Fuel System Diagnosis. Źródło ostrzega, że ciśnienie nie może przekroczyć 75 psi (517 kPa). Ścieżka nie opisuje wykonania testu.'),
    f23: inspect('f23', 'Wynik warsztatu: zasilanie, masa, sitko i pompa', 'Czy warsztat znalazł problem z napięciem zasilania pompy (niskie lub wysokie), masą pompy, sitkiem, typem pompy albo samą pompą?', [{ id: 'tak', label: 'Warsztat: znaleziono problem', next: 'r_f24' }, { id: 'nie', label: 'Warsztat: nie znaleziono', next: 'f12' }], 'Krok 23 tabeli Fuel System Diagnosis. Źródło wymienia: słabe połączenia o wysokiej rezystancji (niskie napięcie pompy), zacieranie się pompy (wysokie napięcie), słabą masę, częściowo zatkane sitko, niewłaściwy typ pompy i uszkodzoną pompę.'),
    f26: fuelCheck('f26', 'Wynik warsztatu: ciśnienie przy gwałtownym otwarciu przepustnicy', 'Czy przy szybkim otwarciu przepustnicy (silnik rozgrzany, bieg jałowy) ciśnienie szybko rośnie w kierunku 60-66 psi (413-455 kPa)?', [{ id: 'tak', label: 'Warsztat: rośnie szybko', next: 'r_f26' }, { id: 'nie', label: 'Warsztat: nie rośnie szybko', next: 'f27' }], 'Krok 26 tabeli Fuel System Diagnosis. Ścieżka nie opisuje wykonania pomiaru.'),
    f27: inspect('f27', 'Wynik warsztatu: ograniczenie przepływu w układzie', 'Czy warsztat znalazł problem w filtrze, przewodzie zasilającym, sitku, elastycznym przewodzie pompy, doborze pompy lub przewodach elektrycznych pompy?', [{ id: 'tak', label: 'Warsztat: znaleziono problem', next: 'r_f28' }, { id: 'nie', label: 'Warsztat: nie znaleziono', next: 'f12' }], 'Krok 27 tabeli Fuel System Diagnosis (oględziny). Źródło wymienia też zatkanie filtra w linii, nieprzesunięte sitko, nieszczelność elastycznego przewodu i wysoką rezystancję przewodów elektrycznych pompy.'),
    f30: inspect('f30', 'Wynik warsztatu: zapisane informacje i kody DTC', 'Czy skaner pokazał niezdiagnozowane kody DTC?', [{ id: 'tak', label: 'Warsztat: są niezdiagnozowane kody', next: 'r_dtc' }, { id: 'nie', label: 'Warsztat: nie ma', next: 'r_ok' }], 'Krok 30 tabeli Fuel System Diagnosis (odczyt funkcji Capture Information i Review Capture Information).'),

    r_inny: { id: 'r_inny', kind: 'result', outcome: 'nierozstrzygnięte', title: 'Ta ścieżka nie dotyczy tego objawu', text: 'Wolny rozruch lub brak kręcenia to inna ścieżka. Użyj dotychczasowej listy możliwych przyczyn dla objawu „Nie odpala”.', sources: [], parts: [], excluded: [], notChecked: ['wszystko, bo objaw jest inny niż w tej ścieżce'] },
    r_warunki: result('r_warunki', 'Najpierw spełnij warunki wstępne', 'Źródło wymaga naładowanego akumulatora, dostatecznej prędkości rozruchu i dość paliwa w baku, zanim zacznie się diagnozę braku zapłonu. Przy wolnym rozruchu użyj dotychczasowej listy przyczyn dla objawu.', ['układ zasilania i zapłonu: czekają na spełnienie warunków wstępnych'], 'konieczny-kolejny-test', SRC_CCNR),
    r_pompa: result('r_pompa', 'Nie słychać pompy paliwa po włączeniu zapłonu', 'To obserwacja, nie przyczyna. Według źródła (Fuel System Diagnosis, krok 9) przy braku pracy pompy po poleceniu ze skanera tabela odsyła do diagnozy obwodu przekaźnika pompy. ' + NOT_AUTHORED, ['bezpiecznik, przekaźnik i przewody pompy', 'sama pompa', 'ciśnienie paliwa', 'iskra', 'wtryskiwacze'], 'obserwacja'),
    r_vtd: result('r_vtd', 'Parametr VTD Fuel Disabled był aktywny', 'Według kroku 3 źródła aktywny parametr kieruje do diagnozy układu antykradzieżowego (Theft Deterrent), a nie do zwykłej diagnozy braku rozruchu. Źródło nie wskazuje tu konkretnej części. ' + NOT_AUTHORED, ['przyczyna aktywnej blokady w układzie antykradzieżowym'], 'nieprawidłowy-wynik-testu', SRC_CCNR),
    r_tp: result('r_tp', 'TP powyżej 2,5 V przy zamkniętej przepustnicy', 'Źródło wiąże to z możliwym trybem czyszczenia zalania i odsyła do diagnozy kodu P0121 (wydajność czujnika położenia przepustnicy). ' + NOT_AUTHORED, ['czujnik TP i jego obwód'], 'nieprawidłowy-wynik-testu', SRC_CCNR),
    r_ect: result('r_ect', 'ECT poniżej -30 °C', 'Źródło wiąże to z mocnym zalaniem silnika i odsyła do diagnozy kodu P0118 (czujnik ECT, wysokie napięcie obwodu). ' + NOT_AUTHORED, ['czujnik ECT i jego obwód'], 'nieprawidłowy-wynik-testu', SRC_CCNR),
    r_zaplon: result('r_zaplon', 'Brak iskry na sprawdzonym przewodzie', 'Źródło uznaje to za podstawową usterkę zapłonu i odsyła do diagnozy rozszerzonej (Enhanced Ignition System Diagnosis). ' + NOT_AUTHORED, ['konkretna część zapłonu', 'ciśnienie paliwa', 'wtryskiwacze'], 'nieprawidłowy-wynik-testu', SRC_CCNR, 'Wśród wskazówek źródło wymienia m.in. kopułkę i palec rozdzielacza, przewody zapłonowe, obwód sygnału sterowania zapłonem IC zwarty do masy i obwód obrotomierza zwarty do masy. To lista wskazówek z tabeli, nie wskazanie przyczyny.'),
    r_wtrysk: result('r_wtrysk', 'Komputer nie steruje wtryskiwaczem', 'Brak migania lampki w obwodzie wtryskiwacza oznacza według źródła, że komputer nie steruje tym obwodem. Źródło odsyła do diagnozy obwodu wtryskiwacza (Fuel Injector Circuit Diagnosis). ' + NOT_AUTHORED, ['wtryskiwacze i ich przewody', 'komputer VCM'], 'nieprawidłowy-wynik-testu', SRC_CCNR),
    r_dalej: result('r_dalej', 'Kroki 1-8 tabeli nie wskazały przyczyny', 'Gdy kroki 1-8 wypadły w normie, źródło odsyła do listy wskazówek diagnostycznych. To lista wskazówek, nie wskazanie przyczyny. ' + NOT_AUTHORED, ['test cewek wtryskiwaczy', 'EGR', 'układ wydechowy', 'kompresja i rozrząd', 'świece i elementy zapłonu'], 'konieczny-kolejny-test', SRC_CCNR, 'Lista ze źródła: test cewek wtryskiwaczy, antykradzieżowy system dodatkowy (jeśli jest), zabrudzone świece, zawór EGR zablokowany w pozycji otwartej, woda lub zanieczyszczenia w paliwie, zwarty do masy sygnał IC, zatkany układ wydechowy, elementy zapłonu (kopułka, palec, przewody), na końcu mechanika silnika (rozrząd, łańcuch, kompresja, wałek, zawory).'),
    r_warsztat: result('r_warsztat', 'Brakuje wyniku od warsztatu', 'Dalsze kroki źródła wymagają skanera i narzędzi warsztatowych. Dotychczasowe odpowiedzi nie wskazują przyczyny i nie uzasadniają kupowania części na próbę.', ['kroki wymagające sprzętu'], 'konieczny-kolejny-test', SRC_CCNR),
    r_obd_ccnr: result('r_obd_ccnr', 'Najpierw kontrola OBD (Engine Cranks But Does Not Run)', 'Tabela „Engine Cranks But Does Not Run” odsyła przy braku kontroli do Powertrain On-Board Diagnostic (OBD) System Check. ' + NOT_AUTHORED, ['kontrola OBD', 'dalsze kroki tabeli'], 'konieczny-kolejny-test', SRC_CCNR),
    r_obd: result('r_obd', 'Najpierw kontrola OBD', 'Tabela Fuel System Diagnosis odsyła przy braku tej kontroli do Powertrain On-Board Diagnostic (OBD) System Check. ' + NOT_AUTHORED, ['kontrola OBD', 'ciśnienie paliwa']),
    r_przekaznik: result('r_przekaznik', 'Pompa nie pracuje po poleceniu ze skanera', 'Tabela (krok 9) odsyła do diagnozy obwodu przekaźnika pompy paliwa (Fuel Pump Relay Circuit Diagnosis). ' + NOT_AUTHORED, ['przekaźnik, bezpiecznik, przewody i masa pompy', 'sama pompa'], 'nieprawidłowy-wynik-testu'),
    r_f11: result('r_f11', 'Znaleziono brak paliwa, zatkany filtr lub sitko albo zatkaną linię', 'Tabela (kroki 10-11) każe naprawić lub wymienić znaleziony element.' + AFTER + NO_PARTS, ['dalsze kroki po naprawie'], 'nieprawidłowy-wynik-testu'),
    r_f12_przewod: result('r_f12_przewod', 'Nieszczelny przewód zasilający do modułu pompy', 'Tabela (krok 12) każe naprawić nieszczelność.' + AFTER + NO_PARTS, ['sam moduł pompy'], 'nieprawidłowy-wynik-testu'),
    r_f12_modul: result('r_f12_modul', 'Tabela każe wymienić moduł pompy paliwa', 'Według kroku 12, gdy przewód jest szczelny, tabela każe wymienić moduł pompy w zbiorniku (procedury wymiany ta ścieżka nie zawiera). To wniosek tabeli po wcześniejszych krokach tej gałęzi, nie wynik pojedynczego pomiaru. Nie kupuj części bez potwierdzenia dopasowania.' + AFTER, ['wymiana modułu pompy: procedura nieopracowana', 'dobór części: brak potwierdzonego numeru'], 'nieprawidłowy-wynik-testu'),
    r_f16: result('r_f16', 'Ciśnienie wraca do normy po odłączeniu linii powrotnej', 'Tabela (krok 16) każe zlokalizować i usunąć ograniczenie w linii powrotnej; gdy tej czynności nie da się zakończyć, tabela kieruje do kroku 17.' + AFTER, ['miejsce ograniczenia w linii powrotnej'], 'nieprawidłowy-wynik-testu'),
    r_f18: result('r_f18', 'Zatkanie wylotu rury powrotnej silnika', 'Tabela (krok 18) każe wymienić przewody paliwowe silnika (procedury wymiany ta ścieżka nie zawiera).' + AFTER, ['procedura wymiany przewodów: nieopracowana'], 'nieprawidłowy-wynik-testu'),
    r_f20: result('r_f20', 'Zatkana linia lub filtr w linii', 'Tabela (krok 20) każe naprawić lub wymienić zatkaną linię paliwową lub filtr w linii.' + AFTER + NO_PARTS, ['dalsze kroki po naprawie'], 'nieprawidłowy-wynik-testu'),
    r_regulator: result('r_regulator', 'Tabela kieruje do wymiany regulatora ciśnienia', 'Tabela (krok 22) każe wymienić regulator ciśnienia paliwa (procedury wymiany ta ścieżka nie zawiera). To wniosek tabeli po wcześniejszych krokach tej gałęzi, nie wynik pojedynczego pomiaru. Nie kupuj części bez potwierdzenia dopasowania.' + AFTER, ['wymiana regulatora: procedura nieopracowana', 'dobór części: brak potwierdzonego numeru'], 'nieprawidłowy-wynik-testu'),
    r_f24: result('r_f24', 'Problem z zasilaniem, masą, sitkiem lub pompą', 'Tabela (krok 24) każe naprawić lub wymienić znaleziony element.' + AFTER + NO_PARTS, ['dalsze kroki po naprawie'], 'nieprawidłowy-wynik-testu'),
    r_f25: result('r_f25', 'Problem w przewodzie zasilającym', 'Tabela (krok 25) każe wymienić przewód zasilający paliwa.' + AFTER, ['dobór części: brak potwierdzonego numeru'], 'nieprawidłowy-wynik-testu'),
    r_f26: result('r_f26', 'Ciśnienie rośnie szybko przy gwałtownym otwarciu przepustnicy', 'Tabela (krok 26) odsyła do diagnozy objawów prowadzenia (Driveability Symptoms). ' + NOT_AUTHORED, ['objawy prowadzenia'], 'konieczny-kolejny-test'),
    r_f28: result('r_f28', 'Znaleziono ograniczenie przepływu, nieszczelność lub błąd w zasilaniu pompy', 'Tabela (krok 28) każe naprawić znaleziony problem.' + AFTER + NO_PARTS, ['dalsze kroki po naprawie'], 'nieprawidłowy-wynik-testu'),
    r_f29: result('r_f29', 'Ciśnienie nie zostaje stałe przy zamkniętym powrocie', 'Tabela (krok 29) każe znaleźć i wymienić nieszczelne lub zwarte do masy wtryskiwacze (diagnoza obwodu wtryskiwacza); po zakończeniu tej czynności tabela kieruje do kroku 30. Gdy czynności nie da się zakończyć, tabela odsyła do testu balansu wtryskiwaczy skanerem Tech 2. ' + NOT_AUTHORED + AFTER, ['wtryskiwacze', 'regulator ciśnienia: powolny przeciek membrany'], 'nieprawidłowy-wynik-testu', SRC_FSD, 'Źródło zaznacza też, że przy nieszczelnych wtryskiwaczach trzeba je wyjąć i sprawdzić pod ciśnieniem, a gdy nie przeciekają i ciśnienie dalej nie trzyma, sprawdzić regulator pod kątem powolnego przecieku membrany.'),
    r_dtc: result('r_dtc', 'Są niezdiagnozowane kody DTC', 'Tabela (krok 30) odsyła do odpowiedniej tabeli kodu. ' + NOT_AUTHORED, ['kody DTC'], 'konieczny-kolejny-test'),
    r_ok: result('r_ok', 'Tabela uznaje układ za w porządku', 'Według kroku 30, gdy nie ma niezdiagnozowanych kodów, tabela kończy się wynikiem „System OK”. To wynik tabeli dla jej zakresu, nie gwarancja, że usterka „nie odpala” została usunięta.', ['czy objaw ustąpił'], 'obserwacja'),
  },
};
