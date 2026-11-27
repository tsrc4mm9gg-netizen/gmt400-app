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

// ---- Dane testowe: minimalna ścieżka zgodna z walidatorem ----
const SRC = { label: 'Test', url: 'https://example.com/test', kind: 'dokument', applicability: 'uniwersalna' };
const car = (over = {}) => ({ brand: 'Chevrolet', platform: 'Suburban', model: 'Suburban 1500', year: '1999', engine: 'L31', drive: '4WD', transmission: '', rpoCodes: [], ...over });
const base = () => ({
  id: 'test', symptomId: 'nie-odpala', title: 'Test', scope: [{ models: ['Suburban 1500'], yearFrom: 1999, yearTo: 1999, engines: ['L31'], drives: ['4WD'] }], start: 'q0',
  nodes: {
    q0: { id: 'q0', kind: 'question', neutral: true, versionIndependent: true, title: 'Q', text: 'Pytanie', sources: [], parts: [], answers: [{ id: 'a', label: 'A', next: 'c1' }] },
    c1: { id: 'c1', kind: 'check', level: 'każdy', title: 'C1', text: 'Sprawdź', sources: [SRC], parts: [], answers: [{ id: 'tak', label: 'Tak', next: 'r1' }, { id: 'nie', label: 'Nie', next: 'r2', stop: true }] },
    r1: { id: 'r1', kind: 'result', outcome: 'konieczny-kolejny-test', title: 'R1', text: 'Wynik', sources: [SRC], parts: [], excluded: [], notChecked: ['x'] },
    r2: { id: 'r2', kind: 'result', outcome: 'nierozstrzygnięte', title: 'R2', text: 'Stop', sources: [SRC], parts: [], excluded: [], notChecked: ['x'] },
  },
});

test('walidator: poprawna ścieżka przechodzi bez błędów', () => {
  assert.deepEqual(F.validateFlow(base()), []);
});
test('walidator: brak startu, pętla, nieznany następca i brak odpowiedzi są wykrywane', () => {
  const a = base(); delete a.start; assert.ok(F.validateFlow(a).some(e => /start/.test(e)));
  const b = base(); b.nodes.q0.answers[0].next = 'q0'; assert.ok(F.validateFlow(b).some(e => /pętl|cykl/i.test(e)));
  const c = base(); c.nodes.q0.answers[0].next = 'nie-ma'; assert.ok(F.validateFlow(c).some(e => /nie-ma/.test(e)));
  const d = base(); delete d.nodes.c1.answers; assert.ok(F.validateFlow(d).some(e => /answers/.test(e)));
});
test('walidator: wynik bez notChecked, część w etapie 1 i wykluczenie są odrzucane', () => {
  const a = base(); delete a.nodes.r1.notChecked; assert.ok(F.validateFlow(a).some(e => /notChecked/.test(e)));
  const b = base(); b.nodes.r1.parts = [{ name: 'x' }]; assert.ok(F.validateFlow(b).some(e => /parts/.test(e)));
  const c = base(); c.nodes.c1.answers[0].excludes = ['x']; assert.ok(F.validateFlow(c).some(e => /excludes/.test(e)));
});
test('walidator: stosowalność „ustalona” bez zakresu wersji aut jest odrzucana', () => {
  const g = base(); g.nodes.c1.sources = [{ ...SRC, vehicleScope: [] }];
  assert.ok(F.validateFlow(g).some(e => /vehicleScope/.test(e)));
});

test('przejścia: następny węzeł według odpowiedzi, wynik nie ma następnika', () => {
  assert.equal(F.nextNodeId(base().nodes.q0, 'a'), 'c1');
  assert.equal(F.nextNodeId(base().nodes.c1, 'tak'), 'r1');
  assert.equal(F.nextNodeId(base().nodes.r1, 'a'), null);
});

test('rejestr produkcyjny ma jedną ścieżkę (nie-odpala-kreci), pozostałe objawy bez ścieżki', () => {
  const R = load('src/lib/diagnosis-flows.ts', () => ({ FLOW_NIE_ODPALA_KRECI: load('src/lib/flows/nie-odpala-kreci-5-7-1999.ts', () => F).FLOW_NIE_ODPALA_KRECI }));
  assert.equal(R.FLOWS.length, 1);
  const D = load('src/lib/diagnosis.ts');
  for (const s of D.SYMPTOMS) assert.equal(R.flowForSymptom(s.id) !== undefined, s.id === R.FLOWS[0].symptomId, s.id);
});

// ===== Ścieżka produkcyjna: nie-odpala-kreci-5-7-1999 =====
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
test('ścieżka nie-odpala: dopasowanie wersji (L31, 1999; Suburban 1500/2500, Tahoe i Yukon 2/4-drzwiowe; 2WD i 4WD)', () => {
  for (const model of ['Suburban 1500', 'Suburban 2500', 'Tahoe 2-door', 'Tahoe 4-door', 'Yukon 2-door', 'Yukon 4-door'])
    for (const d of ['2WD', '4WD']) assert.equal(F.matchVehicle(realCar({ model, drive: d }), REAL).status, 'pasuje', model + ' ' + d);
  for (const o of [{ year: '1998' }, { engine: 'L29' }, { engine: '5.7L' }]) assert.equal(F.matchVehicle(realCar(o), REAL).status, 'brak', JSON.stringify(o));
  assert.notEqual(F.matchVehicle(realCar({ engine: '' }), REAL).status, 'pasuje');
  assert.notEqual(F.matchVehicle(null, REAL).status, 'pasuje');
});
test('ścieżka nie-odpala: owner robi tylko warunki i nasłuch, reszta to wynik warsztatu', () => {
  for (const n of Object.values(REAL.nodes)) if (n.kind === 'check' && !['c1', 'c2'].includes(n.id)) assert.equal(n.level, 'warsztat', n.id);
});
test('ścieżka nie-odpala: węzeł c1a leży między c2 i c3; „tak” → c3, „nie” → r_obd_ccnr', () => {
  assert.equal(REAL.nodes.c2.answers.find(a => a.id === 'slychac').next, 'c1a');
  assert.equal(REAL.nodes.c2.answers.find(a => a.id === 'nie-wiem').next, 'c1a');
  assert.equal(REAL.nodes.c1a.answers.find(a => a.id === 'tak').next, 'c3');
  assert.equal(REAL.nodes.c1a.answers.find(a => a.id === 'nie').next, 'r_obd_ccnr');
  assert.equal(walkReal(['normalnie', 'tak', 'slychac', 'tak']).r.currentId, 'c3');
  assert.equal(walkReal(['normalnie', 'tak', 'slychac', 'nie']).r.currentId, 'r_obd_ccnr');
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
