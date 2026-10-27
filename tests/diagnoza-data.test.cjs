// Spójność danych narzędzia /diagnoza (src/lib/diagnosis.ts): unikalne id, poprawne odpowiedzi, linki, brak zakazanych kolorów.
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
const D = load('src/lib/diagnosis.ts');
const OBD_SOURCE = fs.readFileSync('src/lib/obd-codes.ts', 'utf8');
const ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const REQUESTED = ['nie-odpala', 'szarpie-gasnie', 'check-engine', 'wycieki', 'halasy', 'hamulce', 'skrzynia', 'klima-ogrzewanie', 'elektryka', 'przegrzewanie', 'paliwo-dym'];

test('wszystkie 11 kategorii objawów, unikalne id, 1–2 pytania', () => {
  assert.deepEqual(D.SYMPTOMS.map(s => s.id), REQUESTED);
  for (const s of D.SYMPTOMS) {
    assert.ok(s.label && s.hint && s.icon, s.id);
    assert.ok(s.questions.length >= 1 && s.questions.length <= 2, `${s.id}: liczba pytań`);
    const qids = s.questions.map(q => q.id);
    assert.equal(new Set(qids).size, qids.length, `${s.id}: pytania`);
    for (const q of s.questions) {
      assert.ok(q.options.length >= 2, `${s.id}/${q.id}: opcje`);
      assert.equal(new Set(q.options.map(o => o.id)).size, q.options.length, `${s.id}/${q.id}: unikalne opcje`);
    }
    const cids = s.causes.map(c => c.id);
    assert.equal(new Set(cids).size, cids.length, `${s.id}: unikalne przyczyny`);
  }
});

test('match/only odwołują się do istniejących pytań i odpowiedzi; każda przyczyna ma link', () => {
  for (const s of D.SYMPTOMS) {
    assert.ok(s.causes.length >= 3, `${s.id}: za mało przyczyn`);
    for (const c of s.causes) {
      assert.ok(c.title.length > 8, c.id);
      assert.ok(c.links.length >= 1, `${s.id}/${c.id}: brak linków (luka ma być w „gaps”, nie pustą przyczyną)`);
      for (const rule of [c.match, c.only]) for (const [qid, opts] of Object.entries(rule || {})) {
        const q = s.questions.find(x => x.id === qid);
        assert.ok(q, `${s.id}/${c.id}: pytanie ${qid}`);
        for (const o of opts) assert.ok(q.options.some(x => x.id === o), `${s.id}/${c.id}: odpowiedź ${qid}=${o}`);
      }
    }
  }
});

test('linki: poprawne id Notion i istniejące adresy wewnętrzne, kody OBD z kart', () => {
  for (const s of D.SYMPTOMS) for (const c of s.causes) for (const l of c.links) {
    if ('id' in l) { assert.match(l.id, ID, `${c.id}: id`); continue; }
    assert.match(l.href, /^\/[a-z0-9\-\/]*$/, `${c.id}: href ${l.href}`);
    assert.ok(l.label && ['Kod OBD', 'Poradnik', 'Narzędzie'].includes(l.kind), `${c.id}: etykieta`);
    const m = l.href.match(/^\/kody-obd\/([a-z0-9]+)$/);
    if (m && m[1] !== 'obd1') assert.ok(new RegExp(`['"]${m[1]}['"]`, 'i').test(OBD_SOURCE), `brak karty kodu ${m[1]}`);
  }
});

test('ranking: odpowiedzi podbijają pasujące przyczyny, diesel wyklucza przyczyny „tylko benzyna”, bez odpowiedzi zachowana kolejność', () => {
  const s = D.SYMPTOMS.find(x => x.id === 'nie-odpala');
  const none = D.rankCauses(s, {});
  assert.deepEqual(none.map(r => r.cause.id), s.causes.map(c => c.id));
  const diesel = D.rankCauses(s, { silnik: 'diesel' });
  assert.ok(diesel.length < none.length, 'diesel powinien odfiltrować część przyczyn');
  for (const r of diesel) assert.ok(!r.cause.only || !r.cause.only.silnik || r.cause.only.silnik.includes('diesel'));
  const withMatch = s.causes.find(c => c.match);
  const [qid, opts] = Object.entries(withMatch.match)[0];
  const ranked = D.rankCauses(s, { [qid]: opts[0] });
  assert.ok(ranked.findIndex(r => r.cause.id === withMatch.id) <= s.causes.indexOf(withMatch));
  assert.ok(ranked.find(r => r.cause.id === withMatch.id).matched.length >= 1);
});

test('statystyki i liczba wpisów Notion', () => {
  const st = D.diagnosisStats();
  assert.equal(st.symptoms, 11);
  assert.ok(st.causes >= 40 && st.uniqueNotion >= 100, JSON.stringify(st));
  assert.equal(D.allNotionIds().length, st.uniqueNotion);
});

test('bez czerwieni/bursztynu/żółci w interfejsie narzędzia i ikonach', () => {
  const files = ['src/app/diagnoza/DiagnozaTool.tsx', 'src/app/diagnoza/page.tsx'];
  for (const f of files) assert.doesNotMatch(fs.readFileSync(f, 'utf8'), /\b(?:red|amber|yellow|orange|rose|danger)-\d{2,3}\b|text-red|bg-red/, f);
});

test('luki treści są opisane jawnie (bez surowych identyfikatorów)', () => {
  for (const s of D.SYMPTOMS) for (const g of s.gaps) { assert.ok(g.length > 20); assert.doesNotMatch(g, /@[0-9a-f]{12}/); }
  assert.ok(D.SYMPTOMS.reduce((n, s) => n + s.gaps.length, 0) >= 5);
});
