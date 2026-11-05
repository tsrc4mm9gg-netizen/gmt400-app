const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

function load(file) {
  const source = fs.readFileSync(path.join(process.cwd(), file), 'utf8');
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const module = { exports: {} };
  new Function('exports', 'module', 'require', js)(module.exports, module, require);
  return module.exports;
}

const H = load('src/lib/service-history.ts');
const valid = {
  id: 'rec-1',
  vehicleId: 'car-1',
  date: '2026-11-05',
  mileageKm: 185000,
  title: 'Wymiana oleju i filtra',
  costPln: 320,
  notes: 'Olej 5W-30, filtr OEM.',
};

test('akceptuje poprawny rekord historii serwisowej', () => {
  const record = H.normalizeServiceRecord(valid);
  assert.deepEqual(record, valid);
});

test('odrzuca rekord bez identyfikatora, auta, daty, przebiegu lub nazwy', () => {
  for (const key of ['id', 'vehicleId', 'date', 'mileageKm', 'title']) {
    const input = { ...valid };
    delete input[key];
    assert.equal(H.normalizeServiceRecord(input), null, key);
  }
});

test('odrzuca niepoprawną datę, ujemny przebieg i ujemny koszt', () => {
  assert.equal(H.normalizeServiceRecord({ ...valid, date: '05-11-2026' }), null);
  assert.equal(H.normalizeServiceRecord({ ...valid, mileageKm: -1 }), null);
  assert.equal(H.normalizeServiceRecord({ ...valid, costPln: -1 }), null);
});

test('normalizuje opcjonalne pola i zachowuje wymagane dane', () => {
  const record = H.normalizeServiceRecord({ ...valid, costPln: null, notes: '  Notatka  ' });
  assert.equal(record.costPln, undefined);
  assert.equal(record.notes, 'Notatka');
});

test('parsuje tylko poprawny format wersji 1 i usuwa duplikaty', () => {
  const raw = JSON.stringify({ version: 1, records: [valid, valid] });
  assert.equal(H.parseServiceHistory(raw).length, 1);
  assert.equal(H.parseServiceHistory(JSON.stringify({ version: 2, records: [valid] })).length, 0);
  assert.equal(H.parseServiceHistory('not-json').length, 0);
});

test('sortuje od najnowszych dat i największego przebiegu', () => {
  const records = H.sortServiceHistory([
    { ...valid, id: 'old', date: '2025-01-01', mileageKm: 100000 },
    valid,
    { ...valid, id: 'same-day', date: '2026-11-05', mileageKm: 180000 },
  ]);
  assert.deepEqual(records.map(r => r.id), ['rec-1', 'same-day', 'old']);
});

test('filtruje historię dla wybranego auta', () => {
  const records = [
    valid,
    { ...valid, id: 'other', vehicleId: 'car-2' },
  ];
  assert.deepEqual(H.filterServiceHistory(records, 'car-1').map(r => r.id), ['rec-1']);
});

test('dodaje lub aktualizuje rekord bez duplikatów', () => {
  const first = H.upsertServiceHistory([], valid);
  assert.equal(first.records.length, 1);
  const updated = H.upsertServiceHistory(first.records, { ...valid, mileageKm: 186000 });
  assert.equal(updated.records.length, 1);
  assert.equal(updated.records[0].mileageKm, 186000);
  assert.equal(H.upsertServiceHistory([], { ...valid, mileageKm: -1 }).record, null);
});

test('usuwa rekord po identyfikatorze', () => {
  const records = H.removeServiceRecord([valid], 'rec-1');
  assert.equal(records.length, 0);
});

test('eksportuje wszystkie lub wybrane auta w czytelnym JSON', () => {
  const records = [valid, { ...valid, id: 'other', vehicleId: 'car-2' }];
  const all = JSON.parse(H.exportServiceHistory(records));
  const one = JSON.parse(H.exportServiceHistory(records, 'car-1'));
  assert.equal(all.records.length, 2);
  assert.equal(one.records.length, 1);
  assert.equal(one.records[0].vehicleId, 'car-1');
});
