import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
export const maxDuration = 30;
const bad = (message: string, status = 400) => NextResponse.json({ error: message }, { status, headers: { 'Cache-Control': 'no-store' } });
async function handle(p: URLSearchParams, privateVin = false) {
 try {
  const action = p.get('action') || '';
  const year = p.get('year') || '';
  const make = p.get('make') || '';
  const model = p.get('model') || '';
  let source: URL;
  let list = false;
  if (action === 'vin') {
   if (!privateVin) return bad('VIN przesyłaj metodą POST.');
   const vin = (p.get('vin') || '').toUpperCase();
   if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) return bad('VIN musi mieć 17 znaków bez I, O i Q.');
   if (!/^(198[89]|199[0-9]|2000)$/.test(year)) return bad('Podaj rok modelowy 1988–2000.');
   source = new URL('https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/' + vin);
   source.search = new URLSearchParams({ format: 'json', modelyear: year }).toString();
  } else if (action === 'epaVehicle') {
   const id = p.get('id') || '';
   if (!/^[0-9]{1,7}$/.test(id)) return bad('Nieprawidłowy identyfikator EPA.');
   source = new URL('https://www.fueleconomy.gov/ws/rest/vehicle/' + id);
  } else {
   if (!/^(198[89]|199[0-9]|2000)$/.test(year) || !['Chevrolet', 'GMC'].includes(make)) return bad('Wybierz Chevrolet/GMC i rocznik 1988–2000.');
   if (['recallModels', 'complaintModels'].includes(action)) {
    source = new URL('https://api.nhtsa.gov/products/vehicle/models');
    source.search = new URLSearchParams({ modelYear: year, make, issueType: action === 'recallModels' ? 'r' : 'c' }).toString(); list = true;
   } else if (['recalls', 'complaints'].includes(action)) {
    if (!model.trim() || model.length > 100) return bad('Wybierz model z listy NHTSA.');
    source = new URL('https://api.nhtsa.gov/' + (action === 'recalls' ? 'recalls/recallsByVehicle' : 'complaints/complaintsByVehicle'));
    source.search = new URLSearchParams({ make, model, modelYear: year }).toString();
   } else if (['epaModels', 'epaOptions'].includes(action)) {
    source = new URL('https://www.fueleconomy.gov/ws/rest/vehicle/menu/' + (action === 'epaModels' ? 'model' : 'options'));
    source.search = new URLSearchParams({ year, make }).toString();
    if (action === 'epaOptions') { if (!model.trim() || model.length > 100) return bad('Wybierz model EPA.'); source.searchParams.set('model', model); }
    list = true;
   } else return bad('Nieznane działanie.');
  }
  const response = await fetch(source, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(12000), ...(privateVin ? { cache: 'no-store' as const } : { next: { revalidate: 86400 } }) });
  if (!response.ok) return bad('Dostawca danych zwrócił HTTP ' + response.status + '. Spróbuj ponownie później.', 502);
  const raw = await response.json();
  let data: unknown;
  if (action.startsWith('epa')) {
   if (list) {
    if (!raw || typeof raw !== 'object' || (!('menuItem' in raw) && Object.keys(raw).length !== 0)) throw new Error('schema');
    const items = raw.menuItem == null ? [] : Array.isArray(raw.menuItem) ? raw.menuItem : [raw.menuItem];
    data = items.map((r: { text?: unknown; value?: unknown }) => { if (typeof r.text !== 'string' || !['string', 'number'].includes(typeof r.value)) throw new Error('schema'); return { text: r.text, value: String(r.value) }; });
   } else {
    if (!raw || !['Chevrolet', 'GMC'].includes(raw.make) || Number(raw.year) < 1988 || Number(raw.year) > 2000 || !raw.model) return bad('Rekord EPA jest poza zakresem Chevrolet/GMC 1988–2000.', 422);
    data = raw;
   }
  } else {
   const records = raw.results ?? raw.Results;
   if (!Array.isArray(records)) throw new Error('schema');
   if (action === 'vin') { if (!records[0]) throw new Error('schema'); data = records[0]; }
   else if (list) data = records.map((r: { model?: unknown; Model?: unknown }) => { const text = r.model ?? r.Model; if (typeof text !== 'string') throw new Error('schema'); return { text, value: text }; });
   else data = records;
  }
  return NextResponse.json({ data, source: action === 'vin' ? 'https://vpic.nhtsa.dot.gov/api/' : source.toString(), fetchedAt: new Date().toISOString(), cacheNote: privateVin ? 'VIN bez zapisu w cache aplikacji.' : 'Odpowiedź dostawcy może pochodzić z cache do 24 godzin.' }, { headers: { 'Cache-Control': 'no-store' } });
 } catch { return bad('Nie udało się pobrać lub odczytać danych dostawcy. To nie oznacza braku wyników. Spróbuj ponownie.', 502); }
}
export async function GET(request: Request) { return handle(new URL(request.url).searchParams); }
export async function POST(request: Request) {
 try { if (Number(request.headers.get('content-length') || 0) > 2048) return bad('Zbyt duże żądanie.', 413); const body = await request.json(); if (body.action !== 'vin') return bad('Nieznane działanie.'); return handle(new URLSearchParams({ action: 'vin', vin: String(body.vin || ''), year: String(body.year || '') }), true); } catch { return bad('Nieprawidłowy JSON.'); }
}
