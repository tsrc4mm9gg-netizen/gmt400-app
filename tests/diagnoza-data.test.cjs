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

// ── Etap 2: kroki, nagłówek wpisu, „Najczęstsze problemy” ──
const S = load('src/lib/diagnosis-steps.ts');
const H = load('src/lib/entry-header-meta.ts');
const P = load('src/lib/home-problems.ts');

test('id pytania nigdy nie jest „objaw” (kolidowałoby z parametrem objawu w adresie)', () => {
  for (const s of D.SYMPTOMS) for (const q of s.questions) assert.notEqual(q.id, 'objaw', `${s.id}: id pytania „objaw”`);
});

test('„Najczęstsze problemy”: 3–6 kafli, każdy adres = istniejący objaw, pytania i odpowiedzi, a wynik ma przyczyny z linkami', () => {
  assert.ok(P.HOME_PROBLEMS.length >= 3 && P.HOME_PROBLEMS.length <= 6);
  assert.equal(new Set(P.HOME_PROBLEMS.map(p => p.id)).size, P.HOME_PROBLEMS.length);
  for (const p of P.HOME_PROBLEMS) {
    const url = new URL(p.href, 'https://x.test');
    assert.equal(url.pathname, '/diagnoza', p.id);
    const symptom = D.SYMPTOMS.find(s => s.id === url.searchParams.get('objaw'));
    assert.ok(symptom, `${p.id}: nieznany objaw`);
    const answers = {};
    for (const [key, value] of url.searchParams) {
      if (key === 'objaw') continue;
      const q = symptom.questions.find(x => x.id === key);
      assert.ok(q, `${p.id}: nieznane pytanie ${key}`);
      assert.ok(q.options.some(o => o.id === value), `${p.id}: nieznana odpowiedź ${key}=${value}`);
      answers[key] = value;
    }
    const ranked = D.rankCauses(symptom, answers);
    assert.ok(ranked.length >= 2, `${p.id}: za mało przyczyn po filtrach`);
    assert.ok(ranked[0].cause.links.length >= 1);
    assert.ok(p.title && p.hint && p.icon);
  }
});

test('extractSteps: tylko jawnie ponumerowane kroki, skrót pierwszego zdania, bez ucinania na skrótach', () => {
  const r = S.extractSteps('Wstęp.\n1. Sprawdź bezpiecznik ok. 15 min po wyłączeniu zapłonu. Dalszy opis.\n2. Zmierz napięcie akumulatora multimetrem.\n3. Wymień przekaźnik pompy paliwa.\nNarzędzia: multimetr, klucz 10 mm');
  assert.deepEqual(r.steps, ['Sprawdź bezpiecznik ok. 15 min po wyłączeniu zapłonu.', 'Zmierz napięcie akumulatora multimetrem.', 'Wymień przekaźnik pompy paliwa.']);
  assert.equal(r.tools, 'multimetr, klucz 10 mm');
  assert.equal(S.extractSteps('Napraw to. Potem sprawdź. Gotowe.').steps.length, 0, 'bez numeracji nie ma kroków');
  assert.equal(S.extractSteps('1. Jeden krok tylko opisany długo.').steps.length, 0, 'minimum 2 kroki');
  assert.equal(S.extractSteps('1. bieg: przełożenie 3,06\n2. bieg: przełożenie 1,63\n3. bieg: 1,00').steps.length, 0, 'tabela przełożeń to nie kroki');
  const many = S.extractSteps(Array.from({ length: 9 }, (_, i) => `${i + 1}. Krok numer ${i + 1} do wykonania.`).join('\n'));
  assert.equal(many.steps.length, 4);
  const long = S.extractSteps('1. ' + 'słowo '.repeat(60) + '\n2. Drugi krok jest krótki.');
  assert.ok(long.steps[0].length <= 135 && long.steps[0].endsWith('…'));
});

test('extractSteps: znaczniki „KROK n —” i brak narzędzi, gdy brak linii „Narzędzia:”', () => {
  const r = S.extractSteps('KROK 1 — odłącz akumulator przed pracą\nKROK 2 — zdemontuj osłonę kolumny\nKROK 3 — wyjmij wkładkę');
  assert.equal(r.steps.length, 3);
  assert.equal(r.tools, '');
});

test('nagłówek wpisu: czas tylko z pola Notion albo z jawnego „Czas robocizny wg GM” — inaczej brak pozycji', () => {
  assert.equal(H.formatEditDate('2026-10-27T10:15:00.000Z'), '27.10.2026');
  assert.equal(H.formatEditDate(''), '');
  assert.equal(H.formatEditDate('nonsens'), '');
  assert.equal(H.labourTimeFromText('Czas robocizny wg GM (C/K): 0,4 h; +0,3 h na kodowanie.'), '0,4 h; +0,3 h na kodowanie');
  assert.equal(H.labourTimeFromText('Zwykły tekst bez czasu. Naprawa trwa zwykle długo.'), '');
  const none = H.headerMeta({ texts: ['nic o czasie'] });
  assert.deepEqual(none.map(i => i.key), [], 'bez daty, trudności i czasu nie ma żadnej pozycji');
  const date = H.headerMeta({ edited: '2026-10-27T10:15:00.000Z', texts: [''] });
  assert.deepEqual(date.map(i => i.key), ['aktualizacja']);
  assert.equal(date[0].value, '27.10.2026');
  const full = H.headerMeta({ edited: '2026-10-27T10:15:00.000Z', difficulty: 'Średni', time: '1–2 h', texts: [''] });
  assert.deepEqual(full.map(i => i.key), ['trudnosc', 'czas', 'aktualizacja']);
  assert.equal(full[0].label, 'Poziom trudności');
  assert.match(full[1].note || '', /orientacyjnie/);
  const derived = H.headerMeta({ texts: ['Czas robocizny wg GM (C/K): 0,4 h.'] });
  assert.deepEqual(derived.map(i => i.key), ['czas']);
  assert.match(derived[0].note || '', /orientacyjnie/);
});
