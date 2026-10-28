import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { MAX_CODES, extractVin, normalizeRpoInput, parseStickerText, suggestKnown } from '../src/lib/rpo-sticker.mjs';

const data = JSON.parse(readFileSync(new URL('../src/data/rpo-gmt400.json', import.meta.url), 'utf8'));
const KNOWN = new Set(data.codes.map(c => c.c));
const isKnown = code => KNOWN.has(code);
const codes = text => parseStickerText(text, isKnown).codes;

test('wyłuskuje kody RPO z bazy i oznacza je jako znane', () => {
  const r = codes('YE9  Z71  G80\nGU6 L31 M30');
  assert.deepEqual(r.map(c => c.code), ['YE9', 'Z71', 'G80', 'GU6', 'L31', 'M30']);
  assert.ok(r.every(c => c.known));
});

test('kod spoza bazy z literą i cyfrą zostaje jako „brak w bazie”, bez wymyślania opisu', () => {
  const r = codes('YE9 QQ7');
  assert.deepEqual(r, [{ code: 'YE9', known: true }, { code: 'QQ7', known: false }]);
});

test('szum: słowa z naklejki, same litery, same cyfry i za krótkie/długie tokeny są pomijane', () => {
  const text = 'SERVICE PARTS IDENTIFICATION THE VIN GVW LBS MFG 6100 03 96 ABC XYZ 1234 CK10543 G80';
  const r = codes(text);
  assert.deepEqual(r.map(c => c.code), ['G80']);
});

test('kod z bazy złożony z samych liter lub cyfr nadal jest przyjęty', () => {
  const pure = [...KNOWN].find(c => /^[A-Z]{3}$/.test(c)) ?? [...KNOWN].find(c => /^\d{3}$/.test(c));
  if (pure) assert.deepEqual(codes(`x ${pure} y`).map(c => c.code), [pure]);
});

test('duplikaty są scalane, wielkość liter nie ma znaczenia', () => {
  assert.deepEqual(codes('g80 G80 g80 z71').map(c => c.code), ['G80', 'Z71']);
});

test('sklejone kody są rozbijane tylko gdy każdy kawałek jest w bazie', () => {
  assert.deepEqual(codes('G80Z71').map(c => c.code), ['G80', 'Z71']);
  assert.deepEqual(codes('G80QQ7').map(c => c.code), []);
});

test('limit liczby kodów', () => {
  const many = Array.from({ length: 300 }, (_, i) => `X${String(i).padStart(2, '0')}`).join(' ');
  assert.ok(codes(many).length <= MAX_CODES);
});

test('puste i dziwne wejście nie rzuca wyjątku', () => {
  assert.deepEqual(parseStickerText('', isKnown), { codes: [], ignored: [], vin: null });
  assert.deepEqual(parseStickerText(undefined, isKnown).codes, []);
  assert.deepEqual(parseStickerText('!!! ??? ---', isKnown).codes, []);
});

test('VIN: poprawna cyfra kontrolna', () => {
  assert.deepEqual(extractVin('VIN 1GCEK14K7TZ123456 MODEL'), { vin: '1GCEK14K7TZ123456', checkOk: true });
});

test('VIN: O/Q/I z OCR zamieniane na 0/1; zła cyfra kontrolna jest zgłaszana', () => {
  const v = extractVin('1GCEK14K7TZ123456'.replace('0', 'O').replace('1', 'I'));
  assert.equal(v?.vin.length, 17);
  const bad = extractVin('1GCEK14K0TZ123456');
  assert.deepEqual(bad, { vin: '1GCEK14K0TZ123456', checkOk: false });
});

test('VIN: brak VIN → null; 17 znaków nie-GM bez cyfry kontrolnej nie jest brany', () => {
  assert.equal(extractVin('SERVICE PARTS IDENTIFICATION'), null);
  assert.equal(extractVin('ABCDEFGHJKLMNPRST'), null);
});

test('VIN nie jest traktowany jak kody RPO', () => {
  const r = parseStickerText('1GCEK14K7TZ123456 G80', isKnown);
  assert.deepEqual(r.codes.map(c => c.code), ['G80']);
  assert.equal(r.vin?.vin, '1GCEK14K7TZ123456');
});

test('normalizeRpoInput: dokładnie 3 znaki alfanumeryczne', () => {
  assert.equal(normalizeRpoInput(' ye9 '), 'YE9');
  assert.equal(normalizeRpoInput('Z-71'), 'Z71');
  assert.equal(normalizeRpoInput('AB'), null);
  assert.equal(normalizeRpoInput('ABCD'), null);
  assert.equal(normalizeRpoInput(''), null);
});

test('typowe pomyłki OCR: GUG→GU6, PO6→P06 są podpowiedzią, nie cichą poprawką', () => {
  assert.equal(suggestKnown('GUG', isKnown), 'GU6');
  assert.equal(suggestKnown('PO6', isKnown), 'P06');
  assert.equal(suggestKnown('QQ7', isKnown), null);
  const r = codes('GUG PO6');
  assert.deepEqual(r, [{ code: 'GUG', known: false }, { code: 'PO6', known: false }]);
});

test('kod ze zbłąkanym znakiem („YE9Q”) daje kod z bazy, ale „M360” bez jednoznacznego okna jest pomijane', () => {
  assert.deepEqual(codes('YE9Q').map(c => c.code), ['YE9']);
  const r = parseStickerText('ZZ9Q', isKnown);
  assert.deepEqual(r.codes, []);
  assert.ok(r.ignored.includes('ZZ9Q'));
});

test('całe zdanie z naklejki nie daje fałszywych kodów', () => {
  const text = 'SERVICE PARTS IDENTIFICATION\nTHIS VEHICLE WAS MANUFACTURED BY GENERAL MOTORS CORP\nVIN 1GCEK14K7TZ123456\nMODEL CK10543\nGVW 6100 LBS\nMFG 03/96\nTHE PARTS ABOVE ARE ORIGINAL EQUIPMENT';
  assert.deepEqual(codes(text), []);
});
