// Mechanizm ścieżek diagnostycznych (src/lib/diagnosis-flow.ts): walidator, dopasowanie wersji, brak odblokowania przez deklarację.
// UWAGA: wszystkie ścieżki w tym pliku to DANE TESTOWE. To nie jest instrukcja diagnostyczna dla użytkownika.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');

function load(file, req = () => ({})) {
  const mod = { exports: {} };
  const js = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  new Function('exports', 'module', 'require', js)(mod.exports, mod, req);
  return mod.exports;
}
const F = load('src/lib/diagnosis-flow.ts');

const SRC = { label: 'DANE TESTOWE', url: 'https://example.com/test', kind: 'kopia dokumentu', applicability: 'ustalona', applicabilityNote: 'DANE TESTOWE: stosowalność ustalona (dane testowe)', scope: 'DANE TESTOWE', vehicleScope: [{ models: ['Suburban 1500'], yearFrom: 1999, yearTo: 1999, drives: ['4WD'] }] };
const car = (over = {}) => ({ brand: 'Chevrolet', platform: 'Suburban', model: 'Suburban 1500', year: '1999', engine: '5.7L', drive: '4WD', transmission: 'automatyczna', rpoCodes: [], ...over });
const base = () => ({
  id: 'test-flow', symptomId: 'nie-odpala', title: 'DANE TESTOWE', start: 'q0',
  scope: [{ models: ['Suburban 1500'], yearFrom: 1999, yearTo: 1999, drives: ['4WD'] }],
  nodes: {
    q0: { id: 'q0', kind: 'question', neutral: true, title: 'DANE TESTOWE: pytanie', text: 'DANE TESTOWE', sources: [], parts: [], answers: [{ id: 'a', label: 'A', next: 'c1' }] },
    c1: { id: 'c1', kind: 'check', level: 'każdy', title: 'DANE TESTOWE: sprawdzenie', text: 'DANE TESTOWE', sources: [SRC], parts: [], answers: [{ id: 'ok', label: 'OK', next: 'r1' }],
      requires: [{ key: 'skrzynia', label: 'Skrzynia', profileField: 'transmission', options: [{ id: 'automatyczna', label: 'Automatyczna' }, { id: 'manualna', label: 'Manualna' }] }] },
    r1: { id: 'r1', kind: 'result', outcome: 'konieczny-kolejny-test', title: 'DANE TESTOWE: wynik', text: 'DANE TESTOWE', sources: [SRC], parts: [], excluded: [], notChecked: ['DANE TESTOWE'] },
  },
});

test('poprawna ścieżka testowa przechodzi walidację', () => {
  assert.deepEqual(F.validateFlow(base()), []);
});

test('twierdzenie diagnostyczne bez źródła jest odrzucone, neutralna etykieta UI bez źródła jest dozwolona', () => {
  const ok = base();
  assert.deepEqual(F.validateFlow(ok), [], 'neutralne pytanie bez źródła');
  const noSourceCheck = base(); noSourceCheck.nodes.c1.sources = [];
  assert.ok(F.validateFlow(noSourceCheck).some(e => /bez źródła/.test(e)));
  const noSourceResult = base(); noSourceResult.nodes.r1.sources = [];
  assert.ok(F.validateFlow(noSourceResult).some(e => /bez źródła/.test(e)));
  const nonNeutralQuestion = base(); delete nonNeutralQuestion.nodes.q0.neutral;
  assert.ok(F.validateFlow(nonNeutralQuestion).some(e => /bez źródła/.test(e)));
});

test('wynik diagnostyczny jest osobną osią od źródła', () => {
  const bad = base(); bad.nodes.r1.outcome = 'potwierdzone-w-źródle';
  assert.ok(F.validateFlow(bad).some(e => /nieznany wynik diagnostyczny/.test(e)));
  const asKind = base(); asKind.nodes.r1.outcome = 'oryginał producenta';
  assert.ok(F.validateFlow(asKind).some(e => /nieznany wynik diagnostyczny/.test(e)));
  const strength = base(); strength.nodes.c1.sources = [{ ...SRC, strength: 'wskazanie-przyczyny' }];
  assert.ok(F.validateFlow(strength).some(e => /nieznane pole/.test(e)));
  const noStatus = base(); noStatus.nodes.c1.sources = [{ ...SRC, applicability: undefined }];
  assert.ok(F.validateFlow(noStatus).some(e => /stosowalności/.test(e)));
  for (const o of F.DIAGNOSTIC_OUTCOMES) { const f = base(); f.nodes.r1.outcome = o; if (o === 'nierozstrzygnięte') f.nodes.r1.sources = []; assert.deepEqual(F.validateFlow(f), [], o); }
});

test('pole parts musi być puste w etapie 1', () => {
  const f = base(); f.nodes.c1.parts = [{ name: 'DANE TESTOWE' }];
  assert.ok(F.validateFlow(f).some(e => /parts/.test(e)));
});

test('graf: nieistniejący następny węzeł, węzeł nieosiągalny i pętla są odrzucone', () => {
  const dead = base(); dead.nodes.c1.answers[0].next = 'brak';
  assert.ok(F.validateFlow(dead).some(e => /nieistniejącego/.test(e)));
  const orphan = base(); orphan.nodes.x = { ...orphan.nodes.r1, id: 'x' };
  assert.ok(F.validateFlow(orphan).some(e => /nieosiągalny/.test(e)));
  const loop = base(); loop.nodes.c1.answers.push({ id: 'again', label: 'Jeszcze raz', next: 'q0' });
  assert.ok(F.validateFlow(loop).some(e => /pętl/.test(e)));
});

test('komunikat bezpieczeństwa wymaga źródła; widoczna jest tylko parafraza źródła, nie propozycja', () => {
  const f = base(); f.nodes.c1.safety = { text: 'DANE TESTOWE', form: 'propozycja do akceptacji' };
  assert.deepEqual(F.validateFlow(f), []);
  assert.equal(F.visibleSafety(f.nodes.c1), null);
  f.nodes.c1.safety.form = 'parafraza źródła';
  assert.equal(F.visibleSafety(f.nodes.c1), 'DANE TESTOWE');
  const noSrc = base(); noSrc.nodes.q0.safety = { text: 'DANE TESTOWE', form: 'parafraza źródła' };
  assert.ok(F.validateFlow(noSrc).some(e => /bezpieczeństwa bez źródła/.test(e)));
});

test('dopasowanie wersji: nieznana dana nigdy nie daje „pasuje”, błędna wersja daje „brak”', () => {
  const flow = base();
  assert.deepEqual(F.matchVehicle(car(), flow), { status: 'pasuje', missing: [] });
  assert.equal(F.matchVehicle(car({ year: '' }), flow).status, 'częściowo');
  assert.deepEqual(F.matchVehicle(car({ year: '' }), flow).missing, ['rok']);
  assert.equal(F.matchVehicle(car({ drive: '' }), flow).status, 'częściowo');
  assert.equal(F.matchVehicle(car({ year: '1998' }), flow).status, 'brak');
  assert.equal(F.matchVehicle(car({ drive: '2WD' }), flow).status, 'brak');
  assert.equal(F.matchVehicle(null, flow).status, 'częściowo');
});

test('wymagana dana: z profilu tylko przy dokładnym trafieniu w opcję, w przeciwnym razie pytanie; nieznana dana blokuje tylko zależne sprawdzenie', () => {
  const flow = base();
  const check = flow.nodes.c1;
  assert.deepEqual(F.nodeAvailability(check, car(), {}, flow), { available: true });
  const unknown = F.nodeAvailability(check, car({ transmission: '' }), {}, flow);
  assert.equal(unknown.available, false);
  assert.equal(unknown.reason, 'brak-danych');
  assert.equal(unknown.missing[0].key, 'skrzynia');
  assert.equal(F.nodeAvailability(check, car({ transmission: 'CVT?' }), {}, flow).available, false);
  assert.equal(F.nodeAvailability(check, car({ transmission: '' }), { skrzynia: 'manualna' }, flow).available, true);
  assert.equal(F.nodeAvailability(check, car({ transmission: '' }), { skrzynia: 'wymyślona' }, flow).available, false);
  assert.equal(F.nodeAvailability(flow.nodes.q0, car({ transmission: '' }), {}, flow).available, true, 'obserwacje wspólne zostają dostępne');
});

test('brak pasującej wersji: test niedostępny, a deklaracja doświadczenia niczego nie odblokowuje', () => {
  const flow = base();
  const wrong = car({ year: '1996' });
  for (const declared of [undefined, false, true]) {
    const r = F.nodeAvailability(flow.nodes.c1, wrong, { skrzynia: 'automatyczna' }, flow, declared);
    assert.equal(r.available, false);
    assert.equal(r.reason, 'brak-pasującego-źródła');
  }
});

test('przejścia: następny węzeł według odpowiedzi, wynik nie ma następnika', () => {
  const flow = base();
  assert.equal(F.nextNodeId(flow.nodes.q0, 'a'), 'c1');
  assert.equal(F.nextNodeId(flow.nodes.q0, 'nieznana'), null);
  assert.equal(F.nextNodeId(flow.nodes.r1, 'a'), null);
});

test('rejestr produkcyjny ma jedną ścieżkę (nie-odpala-kreci), pozostałe objawy bez ścieżki', () => {
  const R = load('src/lib/diagnosis-flows.ts', () => ({ FLOW_NIE_ODPALA_KRECI: load('src/lib/flows/nie-odpala-kreci-5-7-1999.ts', () => F).FLOW_NIE_ODPALA_KRECI }));
  assert.equal(R.FLOWS.length, 1);
  const D = load('src/lib/diagnosis.ts');
  for (const s of D.SYMPTOMS) assert.equal(R.flowForSymptom(s.id) !== undefined, s.id === R.FLOWS[0].symptomId, s.id);
});

// ---- Bramki runtime (dane testowe): stosowalność źródła, wersja auta, niezależność od wersji, unieważnianie, stop, wykluczenia ----
const unestablished = () => ({ ...SRC, applicability: 'nieustalona', applicabilityNote: 'DANE TESTOWE: nieustalona' });

test('źródło o nieustalonej stosowalności blokuje krok i wynik z twierdzeniem (runtime, nie tylko etykieta)', () => {
  const flow = base();
  flow.nodes.c1.sources = [unestablished()];
  const r = F.nodeAvailability(flow.nodes.c1, car(), { skrzynia: 'automatyczna' }, flow);
  assert.equal(r.available, false);
  assert.equal(r.reason, 'źródło-bez-ustalonej-stosowalności');
  flow.nodes.r1.sources = [unestablished()];
  assert.equal(F.nodeAvailability(flow.nodes.r1, car(), {}, flow).available, false);
  // jedno źródło o ustalonej stosowalności wystarcza do odblokowania tylko gdy faktycznie istnieje
  flow.nodes.c1.sources = [unestablished(), SRC];
  assert.equal(F.nodeAvailability(flow.nodes.c1, car(), { skrzynia: 'automatyczna' }, flow).available, true);
  // ścieżka zatrzymuje się przed zablokowanym krokiem: nie da się go „przejść” odpowiedziami z adresu
  flow.nodes.c1.sources = [unestablished()];
  const replay = F.replayPath(flow, car(), { skrzynia: 'automatyczna' }, ['a', 'ok']);
  assert.equal(replay.currentId, 'c1');
  assert.deepEqual(replay.path.map(p => p.answerId), ['a']);
});

test('bez profilu auta żaden krok nie jest dostępny, chyba że jawnie niezależny od wersji', () => {
  const flow = base();
  for (const id of ['q0', 'c1', 'r1']) {
    const r = F.nodeAvailability(flow.nodes[id], null, {}, flow);
    assert.equal(r.available, false, id);
    assert.equal(r.reason, 'brak-wersji', id);
  }
  flow.nodes.q0.versionIndependent = true;
  assert.deepEqual(F.validateFlow(flow), []);
  assert.equal(F.nodeAvailability(flow.nodes.q0, null, {}, flow).available, true);
  assert.equal(F.nodeAvailability(flow.nodes.c1, null, {}, flow).available, false);
  assert.equal(F.flowHasVersionIndependent(flow), true);
});

test('niezależność od wersji dopuszczalna tylko dla neutralnego pytania bez wniosków', () => {
  const f1 = base(); f1.nodes.c1.versionIndependent = true;
  assert.ok(F.validateFlow(f1).some(e => /tylko pytanie/.test(e)));
  const f2 = base(); f2.nodes.q0.versionIndependent = true; delete f2.nodes.q0.neutral; f2.nodes.q0.sources = [SRC];
  assert.ok(F.validateFlow(f2).some(e => /niezależne od wersji/.test(e)));
  const f3 = base(); f3.nodes.q0.versionIndependent = true; f3.nodes.q0.answers[0].excludes = ['DANE TESTOWE'];
  assert.ok(F.validateFlow(f3).some(e => /niezależne od wersji/.test(e)));
});

test('częściowe dane wersji (np. brak roku) blokują krok zależny od wersji', () => {
  const flow = base();
  const r = F.nodeAvailability(flow.nodes.q0, car({ year: '' }), {}, flow);
  assert.equal(r.available, false);
  assert.equal(r.reason, 'brak-danych-wersji');
  assert.deepEqual(r.missingVersion, ['rok']);
});

test('zmiana wersji unieważnia ścieżkę: odtworzenie odpowiedzi dla innej wersji zatrzymuje się na starcie', () => {
  const flow = base();
  const ok = F.replayPath(flow, car(), { skrzynia: 'automatyczna' }, ['a', 'ok']);
  assert.deepEqual(ok.path.map(p => p.answerId), ['a', 'ok']);
  assert.equal(ok.currentId, 'r1');
  const other = F.replayPath(flow, car({ drive: '2WD' }), { skrzynia: 'automatyczna' }, ['a', 'ok']);
  assert.deepEqual(other.path, []);
  assert.equal(other.currentId, 'q0');
  const none = F.replayPath(flow, null, {}, ['a', 'ok']);
  assert.deepEqual(none.path, []);
  // nieznana odpowiedź z adresu jest odrzucona
  assert.deepEqual(F.replayPath(flow, car(), {}, ['zmyślona']).path, []);
});

test('stop: odpowiedź zatrzymująca wymaga komunikatu ze źródłem; propozycja nie jest widoczna, parafraza tak; ścieżka kończy się', () => {
  const flow = base();
  flow.nodes.c1.answers.push({ id: 'stop', label: 'DANE TESTOWE: stop', next: '', stop: true });
  assert.ok(F.validateFlow(flow).some(e => /komunikatu stop/.test(e)));
  flow.nodes.c1.stop = { text: 'DANE TESTOWE: stop', form: 'propozycja do akceptacji' };
  assert.deepEqual(F.validateFlow(flow), []);
  assert.equal(F.visibleStop(flow.nodes.c1), null);
  flow.nodes.c1.stop.form = 'parafraza źródła';
  assert.equal(F.visibleStop(flow.nodes.c1), 'DANE TESTOWE: stop');
  const r = F.replayPath(flow, car(), { skrzynia: 'automatyczna' }, ['a', 'stop', 'ok']);
  assert.equal(r.stopped, true);
  assert.deepEqual(r.path.map(p => p.answerId), ['a', 'stop']);
  const noSrc = base(); noSrc.nodes.q0.stop = { text: 'x', form: 'parafraza źródła' };
  assert.ok(F.validateFlow(noSrc).some(e => /stop bez źródła/.test(e)));
});

test('wykluczenia: zbierane z odpowiedzi na ścieżce, wymagają źródła, unieważniane razem ze ścieżką', () => {
  const flow = base();
  flow.nodes.c1.answers[0].excludes = ['DANE TESTOWE: A', 'DANE TESTOWE: B'];
  assert.deepEqual(F.validateFlow(flow), []);
  const r = F.replayPath(flow, car(), { skrzynia: 'automatyczna' }, ['a', 'ok']);
  assert.deepEqual(F.collectExclusions(flow, r.path), ['DANE TESTOWE: A', 'DANE TESTOWE: B']);
  const other = F.replayPath(flow, car({ drive: '2WD' }), { skrzynia: 'automatyczna' }, ['a', 'ok']);
  assert.deepEqual(F.collectExclusions(flow, other.path), []);
  const noSrc = base(); noSrc.nodes.q0.answers[0].excludes = ['x'];
  assert.ok(F.validateFlow(noSrc).some(e => /wykluczenie bez źródła/.test(e)));
});

test('źródło z flagą „ustalona” dla INNEGO auta nie odblokowuje kroku (zakres źródła vs bieżąca wersja)', () => {
  const flow = base();
  const other = (over) => ({ ...SRC, vehicleScope: [{ models: ['Suburban 1500'], yearFrom: 1999, yearTo: 1999, drives: ['4WD'], ...over }] });
  const cases = [{ drives: ['2WD'] }, { yearFrom: 1995, yearTo: 1996 }, { models: ['C1500'] }];
  for (const over of cases) {
    flow.nodes.c1.sources = [other(over)]; flow.nodes.r1.sources = [other(over)];
    const r = F.nodeAvailability(flow.nodes.c1, car(), { skrzynia: 'automatyczna' }, flow);
    assert.equal(r.available, false, JSON.stringify(over));
    assert.equal(r.reason, 'źródło-dla-innej-wersji');
    assert.equal(F.nodeAvailability(flow.nodes.r1, car(), {}, flow).available, false);
    assert.equal(F.replayPath(flow, car(), { skrzynia: 'automatyczna' }, ['a', 'ok']).currentId, 'c1');
  }
  // źródło z zakresem wymagającym silnika: nieznany silnik w aucie = brak dopasowania źródła
  flow.nodes.c1.sources = [other({ engines: ['5.7L'] })];
  assert.equal(F.nodeAvailability(flow.nodes.c1, car({ engine: '' }), { skrzynia: 'automatyczna' }, flow).available, false);
  assert.equal(F.nodeAvailability(flow.nodes.c1, car({ engine: '5.7L' }), { skrzynia: 'automatyczna' }, flow).available, true);
  // jedno źródło pasujące wystarcza, źródło dla innego auta obok niego nie szkodzi
  flow.nodes.c1.sources = [other({ drives: ['2WD'] }), SRC];
  assert.equal(F.nodeAvailability(flow.nodes.c1, car(), { skrzynia: 'automatyczna' }, flow).available, true);
});

test('walidator: stosowalność „ustalona” bez zakresu wersji aut jest odrzucona', () => {
  const f = base(); f.nodes.c1.sources = [{ ...SRC, vehicleScope: undefined }];
  assert.ok(F.validateFlow(f).some(e => /vehicleScope/.test(e)));
  const g = base(); g.nodes.c1.sources = [{ ...SRC, vehicleScope: [] }];
  assert.ok(F.validateFlow(g).some(e => /vehicleScope/.test(e)));
});

// ===== Ścieżka produkcyjna: nie-odpala-kreci-5-7-1999 (Suburban 1500 1999, 5.7 L31) =====
const REAL = load('src/lib/flows/nie-odpala-kreci-5-7-1999.ts').FLOW_NIE_ODPALA_KRECI;
const realCar = (over = {}) => car({ engine: 'L31', ...over });
const walkReal = (answers, profile = realCar()) => { const r = F.replayPath(REAL, profile, {}, answers); return { r, n: REAL.nodes[r.currentId] }; };
const PRE = ['normalnie', 'tak', 'slychac', 'tak', 'nieaktywny', 'oba-ok', 'jest'];

test('ścieżka nie-odpala: walidator bez błędów i bez wskazań przyczyn, części i wykluczeń', () => {
  assert.deepEqual(F.validateFlow(REAL), []);
  for (const n of Object.values(REAL.nodes)) {
    assert.deepEqual(n.parts, [], n.id);
    if (n.kind === 'result') assert.notEqual(n.outcome, 'wskazanie-przyczyny', n.id);
    for (const a of n.answers || []) assert.equal(a.excludes, undefined, n.id);
  }
});
test('ścieżka nie-odpala: dopasowanie wersji (L31, 1999, Suburban 1500, 2WD i 4WD)', () => {
  for (const d of ['2WD', '4WD']) for (const m of ['Suburban 1500', 'Suburban 2500', 'Tahoe 2-door', 'Tahoe 4-door', 'Yukon 2-door', 'Yukon 4-door']) assert.equal(F.matchVehicle(realCar({ model: m, drive: d }), REAL).status, 'pasuje', m + ' ' + d);
  for (const o of [{ year: '1998' }, { year: '2000' }, { model: 'C1500' }, { engine: 'L29' }, { engine: '5.7L' }]) assert.equal(F.matchVehicle(realCar(o), REAL).status, 'brak');
  assert.equal(walkReal(['normalnie', 'tak', 'slychac', 'nie']).r.currentId, 'r_obd_ccnr');
  assert.notEqual(F.matchVehicle(realCar({ engine: '' }), REAL).status, 'pasuje');
  assert.notEqual(F.matchVehicle(null, REAL).status, 'pasuje');
});
test('ścieżka nie-odpala: owner robi tylko warunki i nasłuch, reszta to wynik warsztatu', () => {
  for (const n of Object.values(REAL.nodes)) if (n.kind === 'check' && !['c1', 'c2'].includes(n.id)) assert.equal(n.level, 'warsztat', n.id);
});
test('ścieżka nie-odpala: gałęzie kroków 1-8 CCNR', () => {
  assert.equal(walkReal(['normalnie', 'tak', 'cisza']).r.currentId, 'r_pompa');
  assert.equal(walkReal(['normalnie', 'tak', 'slychac', 'tak', 'aktywny']).r.currentId, 'r_vtd');
  assert.equal(walkReal(['normalnie', 'tak', 'slychac', 'tak', 'nieaktywny', 'tp']).r.currentId, 'r_tp');
  assert.equal(walkReal(['normalnie', 'tak', 'slychac', 'tak', 'nieaktywny', 'ect']).r.currentId, 'r_ect');
  assert.equal(walkReal(['normalnie', 'tak', 'slychac', 'tak', 'nieaktywny', 'oba-ok', 'brak']).r.currentId, 'r_zaplon');
  for (const a of [['normalnie', 'tak', 'slychac', 'tak', 'brak'], ['normalnie', 'tak', 'slychac', 'tak', 'nieaktywny', 'brak'], [...PRE.slice(0, 6), 'brak-wyniku'], [...PRE, 'brak-wyniku']]) assert.equal(walkReal(a).r.currentId, 'r_warsztat');
  assert.equal(walkReal([...PRE, 'w-zakresie', 'miga']).r.currentId, 'r_dalej');
  assert.equal(walkReal([...PRE, 'w-zakresie', 'nie-miga']).r.currentId, 'r_wtrysk');
});
test('ścieżka nie-odpala: krok 7 CCNR poza zakresem prowadzi do FSD, w zakresie do kroku 8; nie jest utożsamiany z FSD krok 3', () => {
  assert.equal(walkReal([...PRE, 'poza']).r.currentId, 'f1');
  assert.equal(walkReal([...PRE, 'w-zakresie']).r.currentId, 'c8');
  assert.match(REAL.nodes.c6.details, /nie jest tym samym co kroki 2 i 3/);
});
test('ścieżka nie-odpala: trasy tabeli Fuel System Diagnosis (kroki źródła)', () => {
  // trasa = lista par węzeł:odpowiedź od wejścia f1; test sprawdza, że kolejne węzły zgadzają się z grafem
  const routes = [
    ['f1:nie', 'r_obd'],
    ['f1:tak f2:tak f3:tak f5:tak f27:tak', 'r_f28'],
    ['f1:tak f2:tak f3:tak f5:tak f27:nie', 'f12'],
    ['f1:tak f2:tak f3:tak f5:nie f26:tak', 'r_f26'],
    ['f1:tak f2:tak f3:tak f5:nie f26:nie f27:tak', 'r_f28'],
    ['f1:tak f2:tak f3:nie f4:tak', 'f12'],
    ['f1:tak f2:tak f3:nie f4:nie f6:tak', 'r_f25'],
    ['f1:tak f2:tak f3:nie f4:nie f6:nie f7:tak', 'r_regulator'],
    ['f1:tak f2:tak f3:nie f4:nie f6:nie f7:nie', 'r_f29'],
    ['f1:tak f2:nie f8:nie f9:nie', 'r_przekaznik'],
    ['f1:tak f2:nie f8:nie f9:tak f10:tak', 'r_f11'],
    ['f1:tak f2:nie f8:nie f9:tak f10:nie', 'f12'],
    ['f1:tak f2:nie f8:tak f13:tak f14:tak', 'r_f16'],
    ['f1:tak f2:nie f8:tak f13:tak f14:nie f17:tak', 'r_f18'],
    ['f1:tak f2:nie f8:tak f13:tak f14:nie f17:nie', 'r_regulator'],
    ['f1:tak f2:nie f8:tak f13:nie f15:tak f19:tak', 'r_f20'],
    ['f1:tak f2:nie f8:tak f13:nie f15:tak f19:nie f21:tak', 'r_regulator'],
    ['f1:tak f2:nie f8:tak f13:nie f15:tak f19:nie f21:nie f23:tak', 'r_f24'],
    ['f1:tak f2:nie f8:tak f13:nie f15:tak f19:nie f21:nie f23:nie', 'f12'],
    ['f1:tak f2:nie f8:tak f13:nie f15:nie f30:tak', 'r_dtc'],
    ['f1:tak f2:nie f8:tak f13:nie f15:nie f30:nie', 'r_ok'],
  ];
  for (const [path, expected] of routes) {
    const steps = path.split(' ').map(p => p.split(':'));
    const ids = steps.map(([, a]) => a);
    const r = F.replayPath(REAL, realCar(), {}, [...PRE, 'poza', ...ids]);
    assert.equal(r.currentId, expected, path);
    let id = 'f1';
    for (const [node, ans] of steps) { assert.equal(id, node, path); id = F.nextNodeId(REAL.nodes[node], ans); }
    assert.equal(id, expected, path);
  }
});
test('ścieżka nie-odpala: praca przy paliwie ma ostrzeżenie, stop i odpowiedź "nie robię"; nie ma poleceń wykonania dla właściciela', () => {
  for (const id of ['c6', 'f2', 'f3', 'f4', 'f7', 'f8', 'f13', 'f14', 'f15', 'f21', 'f26']) {
    const n = REAL.nodes[id];
    assert.ok(n.safety && n.safety.form === 'parafraza źródła', id);
    assert.ok(n.stop && n.stop.text, id);
    assert.ok(n.answers.some(a => a.stop), id);
  }
  const r = F.replayPath(REAL, realCar(), {}, [...PRE, 'poza', 'tak', 'nie-robie']);
  assert.equal(r.stopped, true); assert.equal(r.currentId, 'f2');
});
test('ścieżka nie-odpala: liczby ciśnienia tylko tam, gdzie źródło podaje je jako wartości kroku; brak wymyślonej tolerancji lub czasu', () => {
  for (const n of Object.values(REAL.nodes)) assert.doesNotMatch(n.text + (n.details || ''), /\+\/-|±|dopuszczalny spadek wynosi/i, n.id);
  assert.match(REAL.nodes.f3.details, /nie podaje czasu utrzymania ani dopuszczalnego spadku/);
  assert.match(REAL.nodes.c6.details, /nie określa, czy pompa pracuje/);
});
test('ścieżka nie-odpala: każdy węzeł osiągalny z q0 i każdy wynik ma notChecked', () => {
  const seen = new Set(); const go = id => { if (seen.has(id)) return; seen.add(id); for (const a of REAL.nodes[id].answers || []) if (!a.stop) go(a.next); }; go(REAL.start);
  assert.deepEqual(Object.keys(REAL.nodes).filter(k => !seen.has(k)), []);
  for (const n of Object.values(REAL.nodes)) if (n.kind === 'result') assert.ok(n.notChecked.length > 0, n.id);
});

test('ścieżka nie-odpala: treść kroku to pytanie o wynik, bez listy czynności pomiaru (opis w szczegółach), z ostrzeżeniem przy paliwie', () => {
  const steps = /wypuszczen|odłączon|opróżnion|\bowin|ściereczk|włączyć kilka razy|zamknięci[ea] zaworu|uruchomieni[ea] silnika na/i;
  for (const n of Object.values(REAL.nodes)) {
    assert.doesNotMatch(n.text, steps, n.id);
    assert.ok(n.text.length <= 420, n.id + ' tekst za długi: ' + n.text.length);
    if (n.safety) assert.doesNotMatch(n.safety.text, /ściereczk|pojemnik/i, n.id);
  }
  assert.match(REAL.nodes.f2.text, /Czy ciśnienie/);
  assert.ok(REAL.nodes.f2.safety && REAL.nodes.f2.stop);
  assert.match(REAL.nodes.f2.details, /Ścieżka nie opisuje wykonania pomiaru/);
});
test('ścieżka nie-odpala: silnik L31 ma czytelną etykietę w wyborze wersji (kod L31 bez zgadywania z tekstu)', () => {
  const runner = fs.readFileSync('src/app/diagnoza/FlowRunner.tsx', 'utf8');
  assert.match(runner, /L31: 'L31 \(Vortec 5\.7, 8\. znak VIN: R\)'/);
  assert.match(runner, /value=\{o\}>\{labels\[o\] \?\? o\}/);
  assert.match(runner, /Jeśli w Twoim VIN-ie 8\. znak to R, wybierz L31/);
  assert.deepEqual(REAL.scope[0].engines, ['L31']);
});
test('ścieżka nie-odpala: dotychczasowa lista przyczyn zostaje widoczna pod ścieżką (nie jest chowana)', () => {
  const tool = fs.readFileSync('src/app/diagnoza/DiagnozaTool.tsx', 'utf8');
  assert.doesNotMatch(tool, /\{!flow && \(<>/);
  assert.match(tool, /data-testid="legacy-heading"/);
});
