// Parsowanie tekstu odczytanego (OCR) z naklejki GM „Service Parts Identification” (SPID).
// Czysta logika bez zależności od przeglądarki — testowana w tests/rpo-sticker.test.mjs.
import { expectedCheckDigit } from './vin-decode.mjs';

/** Trzyliterowe słowa i skróty drukowane na naklejce, które nie są kodami RPO (nie należą do bazy, więc nie kolidują z kodami). */
const NOISE_WORDS = new Set([
  'VIN', 'THE', 'AND', 'FOR', 'GVW', 'GAW', 'GVR', 'LBS', 'KGS', 'PSI', 'TIR', 'TYP', 'GEN', 'ENG', 'TRM', 'MFG', 'DAT', 'USA', 'MAX', 'MIN', 'CAL', 'REF', 'PRT', 'PAR', 'ALL', 'NOT', 'ARE', 'INC', 'GMC', 'DIV', 'CHE', 'SPI', 'SPID', 'OIL', 'AIR',
]);

export const MAX_CODES = 80;

/** Typowe pomyłki OCR: litera ↔ cyfra. Używane tylko do podpowiedzi „Czy chodziło o…”, nigdy do cichej poprawki. */
const SWAPS = { O: ['0'], 0: ['O'], I: ['1'], 1: ['I'], S: ['5'], 5: ['S'], B: ['8'], 8: ['B'], Z: ['2'], 2: ['Z'], G: ['6'], 6: ['G'] };

/** Jedyny kod z bazy, który powstaje z `code` przez zamianę jednego znaku (O/0, I/1, S/5, B/8, Z/2, G/6); inaczej null. */
export function suggestKnown(code, isKnown) {
  const hits = new Set();
  for (let i = 0; i < code.length; i++) for (const alt of SWAPS[code[i]] ?? []) {
    const candidate = code.slice(0, i) + alt + code.slice(i + 1);
    if (isKnown(candidate)) hits.add(candidate);
  }
  return hits.size === 1 ? [...hits][0] : null;
}

const VIN_SHAPE = /^[A-HJ-NPR-Z0-9]{17}$/;
// W VIN nie występują I, O, Q — OCR myli je z 1 i 0.
const fixVin = s => s.replace(/I/g, '1').replace(/[OQ]/g, '0');

/** Szuka 17-znakowego VIN w tekście. Zwraca VIN z informacją, czy zgadza się cyfra kontrolna. */
export function extractVin(text) {
  const tokens = String(text ?? '').toUpperCase().split(/[^A-Z0-9]+/).filter(t => t.length >= 17 && t.length <= 19);
  const found = [];
  for (const raw of tokens) {
    // Token dłuższy o 1–2 znaki (sklejone sąsiednie znaki) sprawdzamy w oknach 17-znakowych.
    for (let start = 0; start + 17 <= raw.length; start++) {
      const vin = fixVin(raw.slice(start, start + 17));
      if (!VIN_SHAPE.test(vin)) continue;
      const check = expectedCheckDigit(vin);
      const checkOk = check !== null && check === vin[8];
      const gmPrefix = /^[123]G/.test(vin);
      if (checkOk || gmPrefix) found.push({ vin, checkOk, gmPrefix });
    }
  }
  found.sort((a, b) => Number(b.checkOk) - Number(a.checkOk) || Number(b.gmPrefix) - Number(a.gmPrefix));
  return found[0] ? { vin: found[0].vin, checkOk: found[0].checkOk } : null;
}

/**
 * Z tekstu OCR wybiera kandydatów na kody RPO (3 znaki A–Z/0–9).
 * - kod z bazy zawsze jest przyjęty;
 * - kod spoza bazy tylko gdy ma literę i cyfrę i nie jest znanym słowem z naklejki (inaczej to szum);
 * - sklejone „G80Z71” rozbijamy na kody, jeśli każdy z kawałków jest w bazie.
 * Nie zgadujemy opisów ani nie poprawiamy kodów po cichu.
 */
export function parseStickerText(text, isKnown) {
  const upper = String(text ?? '').toUpperCase();
  const vin = extractVin(upper);
  const seen = new Set();
  const codes = [];
  const ignored = [];
  const add = (code, known) => { if (!seen.has(code) && codes.length < MAX_CODES) { seen.add(code); codes.push({ code, known }); } };
  const ignore = token => { if (!ignored.includes(token) && ignored.length < 60) ignored.push(token); };
  for (const token of upper.split(/[^A-Z0-9]+/).filter(Boolean)) {
    if (token.length === 3) {
      if (isKnown(token)) add(token, true);
      else if (/[A-Z]/.test(token) && /\d/.test(token) && !NOISE_WORDS.has(token)) add(token, false);
      else if (!NOISE_WORDS.has(token)) { if (suggestKnown(token, isKnown)) add(token, false); else ignore(token); }
    } else if (token.length === 4 && /\d/.test(token) && /[A-Z]/.test(token)) {
      // Sklejony szum: „YE9Q” = kod + zbłąkany znak. Przyjmujemy kod, jeśli dokładnie jedno 3-znakowe okno jest w bazie.
      const windows = [token.slice(0, 3), token.slice(1)].filter(isKnown);
      if (windows.length === 1) add(windows[0], true); else ignore(token);
    } else if (token.length > 3 && token.length <= 12 && token.length % 3 === 0) {
      const parts = token.match(/.{3}/g);
      if (parts.every(isKnown)) parts.forEach(part => add(part, true));
    }
  }
  return { codes, ignored, vin };
}

/** Normalizacja kodu wpisanego ręcznie w polu „Dodaj kod”: wielkie litery, tylko A–Z/0–9, dokładnie 3 znaki. */
export function normalizeRpoInput(value) {
  const code = String(value ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  return /^[A-Z0-9]{3}$/.test(code) ? code : null;
}
