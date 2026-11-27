// Mechanizm ścieżek diagnostycznych (src/lib/diagnosis-flow.ts): walidator, dopasowanie wersji, brak odblokowania przez deklarację.
// UWAGA: wszystkie ścieżki w tym pliku to DANE TESTOWE. To nie jest instrukcja diagnostyczna dla użytkownika.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');

function load(file) {
  const mod = { exports: {} };
  const js = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  new Function('exports', 'module', 'require', js)(mod.exports, mod, () => ({}));
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

test('rejestr produkcyjny jest pusty w etapie 1, a żaden objaw nie ma ścieżki', () => {
  const R = load('src/lib/diagnosis-flows.ts');
  assert.deepEqual(R.FLOWS, []);
  const D = load('src/lib/diagnosis.ts');
  for (const s of D.SYMPTOMS) assert.equal(R.flowForSymptom(s.id), undefined, s.id);
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
