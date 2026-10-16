export type ModelRecord = { id?: string; Nazwa: string; Typ: string; Model: string; Lata?: string; Opis?: string };
export type ModelFamily<T> = { id: string; label: string; technical: boolean; entries: T[]; variants: { label: string; entries: T[] }[] };
export const normalizeModel = (value: string) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/g, 'l').replace(/\s+/g, ' ').trim();
const DEFINITIONS = [['tahoe','Chevrolet Tahoe'], ['suburban','Suburban'], ['pickups','C/K i GMC Sierra'], ['yukon','GMC Yukon'], ['blazer','Blazer — do weryfikacji'], ['engines','Silniki — dane techniczne'], ['other','Pozostałe wpisy']] as const;
export function modelWarning(item: ModelRecord): string { return /yukon\s*xl|\bk5\b|blazer/.test(normalizeModel(item.Nazwa)) ? 'Nazwa lub generacja wymaga weryfikacji. Zachowano oryginalny wpis.' : ''; }
function family(item: ModelRecord): string {
  const name = normalizeModel(item.Nazwa), model = normalizeModel(item.Model);
  if (/^silnik\b/.test(name)) return 'engines';
  if (/\bblazer\b|\bk5\b/.test(name)) return 'blazer';
  if (model === 'suburban' || /suburban|yukon\s*xl/.test(name)) return 'suburban';
  if (model === 'tahoe' || name.includes('tahoe')) return 'tahoe';
  if (model === 'yukon' || name.includes('yukon')) return 'yukon';
  if (model === 'c/k' || /sierra|c\/k/.test(name)) return 'pickups';
  return 'other';
}
function variant(item: ModelRecord, group: string): string {
  const name = normalizeModel(item.Nazwa);
  if (group === 'tahoe' || group === 'yukon') {
    const two = /2[ -]*drzw/.test(name), four = /4[ -]*drzw/.test(name);
    return two && four ? '2 / 4 drzwi — opis zbiorczy' : two ? '2 drzwi' : four ? '4 drzwi' : 'Opis ogólny';
  }
  const series = [...new Set(name.match(/\b(?:1500|2500|3500)\b/g) || [])].join(' / ');
  if (group === 'suburban') return series || (name.includes('gmc') ? 'Wpisy GMC — nazwa do sprawdzenia' : 'Opis ogólny');
  if (group === 'pickups') return [name.includes('sierra') ? 'GMC Sierra' : 'C/K', series, name.includes('regular cab') ? 'Regular Cab' : name.includes('extended cab') ? 'Extended Cab' : '', name.includes('dually') ? 'Dually' : ''].filter(Boolean).join(' · ');
  if (group === 'engines') { const size = name.match(/\b([4576][.,][03457])\s*l\b/); return size ? size[1].replace(',', '.') + ' L' : 'Pozostałe opisy silników'; }
  return item.Nazwa.replace(/\s*[—–]\s*pełny opis.*$/i, '').trim();
}
export function groupModels<T extends ModelRecord>(items: T[]): ModelFamily<T>[] {
  return DEFINITIONS.map(([id, label]): ModelFamily<T> => {
    const entries = items.filter(item => family(item) === id);
    const variants = new Map<string, T[]>();
    for (const entry of entries) { const label = variant(entry, id); variants.set(label, [...(variants.get(label) || []), entry]); }
    return { id, label, technical: id === 'engines', entries, variants: [...variants].map(([label, entries]) => ({ label, entries })) };
  }).filter(group => group.entries.length > 0);
}
