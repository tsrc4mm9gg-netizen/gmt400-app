// Magazyn próśb o historię VIN w bazie Notion (istniejąca integracja NOTION_TOKEN; baza wskazana przez NOTION_VIN_REQUESTS_DB).
// Właściwości bazy: Nazwa (title) · VIN (tekst) · Status (select: pending/approved/rejected) · KodHash (tekst) · IPHash (tekst) · Decyzja (data) · Wyniki (tekst — techniczny cache wyniku Apibara, JSON bez zdjęć).
// Czas utworzenia = created_time strony. Kod prośby nigdy nie jest zapisywany — tylko jego SHA-256.
import { MAX_PENDING } from './vin-request.mjs';

const VERSION = '2022-06-28';
const text = s => ({ rich_text: [{ type: 'text', text: { content: String(s) } }] });
const plain = p => (p?.rich_text ?? p?.title ?? []).map(x => x.plain_text ?? x.text?.content ?? '').join('');

export class StoreError extends Error { constructor(message, code = 'store') { super(message); this.code = code; } }

export function storeConfig(env = process.env) {
  const token = env.NOTION_TOKEN, db = (env.NOTION_VIN_REQUESTS_DB || '').replace(/-/g, '');
  if (!token || !/^[0-9a-f]{32}$/i.test(db)) return null;
  return { token, db, apiBase: env.NOTION_API_BASE || 'https://api.notion.com' };
}

const CHUNK = 1900, MAX_CHUNKS = 90;
/** JSON → kawałki rich_text (limit Notion: 2000 znaków na element, 100 elementów). Zbyt duży wynik nie jest zapisywany (null). */
export function packResults(obj) {
  const raw = JSON.stringify(obj);
  if (raw.length > CHUNK * MAX_CHUNKS) return null;
  const parts = [];
  for (let i = 0; i < raw.length; i += CHUNK) parts.push({ type: 'text', text: { content: raw.slice(i, i + CHUNK) } });
  return parts;
}
export function parseResults(prop) {
  const raw = plain(prop);
  if (!raw) return null;
  try { const v = JSON.parse(raw); return v && typeof v === 'object' && typeof v.state === 'string' ? v : null; } catch { return null; }
}

export function toRecord(page) {
  const p = page.properties || {};
  const status = p.Status?.select?.name;
  return {
    pageId: page.id, id: plain(p.Nazwa), vin: plain(p.VIN),
    status: status === 'approved' || status === 'rejected' ? status : 'pending',
    createdAt: page.created_time || '', decidedAt: p['Decyzja']?.date?.start ?? null, results: parseResults(p.Wyniki),
  };
}

export function createNotionStore({ token, db, apiBase = 'https://api.notion.com', fetchImpl = fetch }) {
  const call = async (path, init = {}) => {
    let res;
    try {
      res = await fetchImpl(apiBase + path, {
        ...init, cache: 'no-store', signal: AbortSignal.timeout(8000),
        headers: { Authorization: `Bearer ${token}`, 'Notion-Version': VERSION, 'Content-Type': 'application/json' },
      });
    } catch { throw new StoreError('Notion nie odpowiada.', 'unavailable'); }
    if (!res.ok) throw new StoreError('Notion odrzucił żądanie (HTTP ' + res.status + ').', res.status === 404 || res.status === 400 ? 'schema' : 'unavailable');
    return res.json();
  };
  const query = body => call(`/v1/databases/${db}/query`, { method: 'POST', body: JSON.stringify(body) });
  return {
    async create({ id, vin, codeHash, ipHash }) {
      const page = await call('/v1/pages', { method: 'POST', body: JSON.stringify({ parent: { database_id: db }, properties: {
        Nazwa: { title: [{ type: 'text', text: { content: id } }] }, VIN: text(vin), Status: { select: { name: 'pending' } }, KodHash: text(codeHash), IPHash: text(ipHash),
      } }) });
      return toRecord(page);
    },
    async findByCodeHash(codeHash) {
      const r = await query({ filter: { property: 'KodHash', rich_text: { equals: codeHash } }, page_size: 1 });
      return r.results?.[0] ? toRecord(r.results[0]) : null;
    },
    async countRecentByIp(ipHash, sinceIso) {
      const r = await query({ filter: { and: [{ property: 'IPHash', rich_text: { equals: ipHash } }, { timestamp: 'created_time', created_time: { on_or_after: sinceIso } }] }, page_size: 100 });
      return r.results?.length ?? 0;
    },
    async pendingCount() {
      const r = await query({ filter: { property: 'Status', select: { equals: 'pending' } }, page_size: MAX_PENDING });
      return r.results?.length ?? 0;
    },
    async list(limit = 100) {
      const r = await query({ sorts: [{ timestamp: 'created_time', direction: 'descending' }], page_size: Math.min(limit, 100) });
      return (r.results ?? []).map(toRecord);
    },
    /** Zmiana statusu po publicznym id („HV-…”) — nigdy po dowolnym id strony Notion. */
    async setStatus(id, status, nowIso = new Date().toISOString()) {
      const r = await query({ filter: { property: 'Nazwa', title: { equals: id } }, page_size: 1 });
      const page = r.results?.[0];
      if (!page) return null;
      const updated = await call(`/v1/pages/${page.id}`, { method: 'PATCH', body: JSON.stringify({ properties: { Status: { select: { name: status } }, Decyzja: { date: { start: nowIso } } } }) });
      return toRecord(updated);
    },
    /** Zapis cache wyniku Apibara przy prośbie (po id strony z naszego własnego rekordu). */
    async setResults(pageId, results) {
      const parts = packResults(results);
      if (!parts) return false;
      await call(`/v1/pages/${pageId}`, { method: 'PATCH', body: JSON.stringify({ properties: { Wyniki: { rich_text: parts } } }) });
      return true;
    },
  };
}
