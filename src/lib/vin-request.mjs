// Prośby o historię VIN: czysta logika (bez Next.js), żeby `node --test` działało na Node 22 i 24.
// Zasada: wyniki (linki do aukcji + liczniki NHTSA) powstają WYŁĄCZNIE dla prośby w statusie „approved” — decyduje serwer.
import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { decodeVin } from './vin-decode.mjs';

export const STATUSES = ['pending', 'approved', 'rejected'];
export const CODE_RE = /^[A-Za-z0-9_-]{22}$/;
export const ID_RE = /^HV-[0-9A-F]{8}$/;
export const IP_LIMIT_PER_HOUR = 5;
export const MAX_PENDING = 100;

/** VIN z formularza → { ok, vin } albo { ok:false, error }. Wymaga 17 znaków, bez I/O/Q i poprawnej cyfry kontrolnej. */
export function validateVinForRequest(input) {
  if (typeof input !== 'string' || input.length > 40) return { ok: false, error: 'Nieprawidłowy VIN.' };
  const r = decodeVin(input);
  if (!r.ok) return { ok: false, error: r.errors[0] || 'Nieprawidłowy VIN.' };
  if (!r.check.ok) return { ok: false, error: 'Cyfra kontrolna (9. znak) się nie zgadza.' };
  return { ok: true, vin: r.vin };
}

export const newRequestCode = () => randomBytes(16).toString('base64url');
export const hashCode = code => createHash('sha256').update(String(code)).digest('hex');
export const publicId = codeHash => 'HV-' + String(codeHash).slice(0, 8).toUpperCase();
export const hashIp = (ip, salt = '') => createHash('sha256').update(`gmt400-ip|${salt}|${ip}`).digest('hex').slice(0, 32);

/** IP klienta: Vercel ustawia x-forwarded-for / x-real-ip po swojej stronie. */
export function clientIp(headers) {
  const xf = headers.get('x-forwarded-for');
  const ip = (xf ? xf.split(',')[0] : headers.get('x-real-ip') || '').trim();
  return ip.slice(0, 64) || 'unknown';
}

/** Prosty limiter w pamięci instancji (pierwsza, tania linia obrony; trwały limit na IP jest w magazynie). */
export function createLimiter({ max, windowMs, now = () => Date.now() }) {
  const hits = new Map();
  return {
    take(key) {
      const t = now();
      const arr = (hits.get(key) || []).filter(x => t - x < windowMs);
      if (arr.length >= max) { hits.set(key, arr); return { ok: false, retryAfterSec: Math.max(1, Math.ceil((windowMs - (t - arr[0])) / 1000)) }; }
      arr.push(t); hits.set(key, arr);
      if (hits.size > 5000) for (const [k, v] of hits) if (!v.some(x => t - x < windowMs)) hits.delete(k);
      return { ok: true };
    },
    reset(key) { hits.delete(key); },
  };
}

/** Treść odpowiedzi o statusie. `loadResults` jest wywoływane tylko dla „approved” — inaczej wyniki nie istnieją w odpowiedzi. */
export async function buildStatusBody(record, loadResults) {
  const base = { id: record.id, vin: record.vin, status: record.status, createdAt: record.createdAt };
  if (record.status !== 'approved') return base;
  return { ...base, results: await loadResults(record.vin) };
}

/** Podpisana sesja admina: `exp.nonce.hmac`; klucz = SHA-256 hasła, więc zmiana hasła unieważnia wszystkie sesje. */
const sessionKey = password => createHash('sha256').update('gmt400-admin-session-v1|' + password).digest();
export function signSession(password, { now = Date.now(), ttlMs = 8 * 3600 * 1000 } = {}) {
  const payload = `${now + ttlMs}.${randomBytes(12).toString('base64url')}`;
  return `${payload}.${createHmac('sha256', sessionKey(password)).update(payload).digest('base64url')}`;
}
export function verifySession(password, token, now = Date.now()) {
  if (!password || typeof token !== 'string' || token.length > 200) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const [exp, nonce, mac] = parts;
  if (!/^\d{10,16}$/.test(exp) || Number(exp) < now) return false;
  const expected = createHmac('sha256', sessionKey(password)).update(`${exp}.${nonce}`).digest();
  let given; try { given = Buffer.from(mac, 'base64url'); } catch { return false; }
  return given.length === expected.length && timingSafeEqual(given, expected);
}
/** Porównanie hasła w stałym czasie (przez skróty SHA-256 o równej długości). */
export function passwordMatches(given, expected) {
  if (typeof given !== 'string' || !expected) return false;
  const a = createHash('sha256').update(given).digest(), b = createHash('sha256').update(expected).digest();
  return timingSafeEqual(a, b);
}
