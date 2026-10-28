// Atrapa API Notion do lokalnych testów SSR: node tests/helpers/mock-notion.mjs [plik.json] [port]
// Odtwarza odpowiedź POST /v1/databases/<id>/query (stronicowanie po 100) z migawki /api/notion.
import http from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
const file = process.argv[2] || '/tmp/notion.json';
const port = Number(process.argv[3] || 4010);
const entries = JSON.parse(readFileSync(file, 'utf8')).results;
// Opcjonalne bloki stron: tests/fixtures/notion-blocks.json = { "<id strony bez myślników>": [bloki Notion] }.
const blocksFile = new URL('../fixtures/notion-blocks.json', import.meta.url);
const blocksByPage = existsSync(blocksFile) ? JSON.parse(readFileSync(blocksFile, 'utf8')) : {};
const rt = text => ({ rich_text: text ? [{ plain_text: text }] : [] });
const ms = list => ({ multi_select: (list || []).map(name => ({ name })) });
const page = e => ({ id: e.id, properties: {
  Nazwa: { title: [{ plain_text: e.Nazwa }] }, Typ: { select: e.Typ ? { name: e.Typ } : null }, Model: { select: e.Model ? { name: e.Model } : null },
  Modele: ms(e.Modele), Opis: rt(e.Opis), Objawy: rt(e.Objawy), 'Rozwiązanie': rt(e['Rozwiązanie']), Lata: rt(e.Lata),
  Marka: ms(e.applicability?.brand), Silnik: ms(e.applicability?.engine), 'Napęd': ms(e.applicability?.drive), Skrzynia: ms(e.applicability?.transmission),
  ...(e['Trudność'] ? { 'Trudność': { select: { name: e['Trudność'] } } } : {}), ...(e.Czas ? { Czas: rt(e.Czas) } : {}) } });
http.createServer((req, res) => {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    const pm = /\/v1\/pages\/([0-9a-f-]+)$/i.exec(req.url || '');
    if (pm) {
      const e = entries.find(x => x.id.replace(/-/g, '') === pm[1].replace(/-/g, ''));
      res.writeHead(e ? 200 : 404, { 'content-type': 'application/json' });
      return res.end(JSON.stringify(e ? { ...page(e), parent: { database_id: '746973771d604f1e8276502851176af2' }, last_edited_time: '2026-10-27T00:00:00.000Z' } : {}));
    }
    const bm = /\/v1\/blocks\/([0-9a-f-]+)\/children/i.exec(req.url || '');
    if (bm) { res.writeHead(200, { 'content-type': 'application/json' }); return res.end(JSON.stringify({ results: blocksByPage[bm[1].replace(/-/g, '')] || [], has_more: false, next_cursor: null })); }
    if (!/\/v1\/databases\/.+\/query$/.test(req.url || '')) { res.writeHead(404); return res.end('{}'); }
    const start = Number(JSON.parse(body || '{}').start_cursor || 0);
    const slice = entries.slice(start, start + 100);
    const next = start + 100;
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ results: slice.map(page), has_more: next < entries.length, next_cursor: next < entries.length ? String(next) : null }));
  });
}).listen(port, '127.0.0.1', () => console.log('mock notion on', port));
