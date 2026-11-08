export type SavedMaterial = { id: string; title: string; href: string; type: string; collectionId: string };
export type SavedCollection = { id: string; name: string };
export const SAVED_STORAGE_KEY = 'gmt400-saved-materials';
export const SAVED_EVENT = 'gmt400-saved-materials-change';
export const SAVED_MAX = 100;
export const DEFAULT_COLLECTION_ID = 'do-sprawdzenia';
const DEFAULT_COLLECTION = { id: DEFAULT_COLLECTION_ID, name: 'Do sprawdzenia' } as const;
type SavedState = { items: SavedMaterial[]; collections: SavedCollection[] };
const emptyState = (): SavedState => ({ items: [], collections: [{ ...DEFAULT_COLLECTION }] });

function parseSaved(raw: string | null): SavedState {
  if (!raw) return emptyState();
  let data: unknown;
  try { data = JSON.parse(raw); } catch { return emptyState(); }
  if (!data || typeof data !== 'object') return emptyState();
  const value = data as { items?: unknown; collections?: unknown };
  const collections: SavedCollection[] = [{ ...DEFAULT_COLLECTION }];
  if (Array.isArray(value.collections)) {
    for (const entry of value.collections) {
      if (!entry || typeof entry !== 'object') continue;
      const { id, name } = entry as Record<string, unknown>;
      if (typeof id !== 'string' || typeof name !== 'string' || !id || !name.trim() || id === DEFAULT_COLLECTION_ID) continue;
      if (collections.some(item => item.id === id)) continue;
      collections.push({ id, name: name.trim().slice(0, 60) });
    }
  }
  const items: SavedMaterial[] = [];
  if (Array.isArray(value.items)) {
    for (const entry of value.items) {
      if (!entry || typeof entry !== 'object') continue;
      const { id, title, href, type, collectionId } = entry as Record<string, unknown>;
      if (typeof id !== 'string' || !id || id.length > 80) continue;
      if (typeof title !== 'string' || !title.trim() || title.length > 160) continue;
      if (typeof href !== 'string' || !/^\/(?!\/)[A-Za-z0-9/_\-.%]*$/.test(href) || href.length > 120) continue;
      if (typeof type !== 'string' || type.length > 24) continue;
      const collection = typeof collectionId === 'string' && collections.some(item => item.id === collectionId) ? collectionId : DEFAULT_COLLECTION_ID;
      if (items.some(item => item.id === id)) continue;
      items.push({ id, title: title.trim(), href, type, collectionId: collection });
      if (items.length >= SAVED_MAX) break;
    }
  }
  return { items, collections };
}

function readForWrite(): SavedState | null {
  if (typeof window === 'undefined') return null;
  try { return parseSaved(window.localStorage.getItem(SAVED_STORAGE_KEY)); } catch { return null; }
}
function writeSaved(state: SavedState): boolean {
  if (typeof window === 'undefined') return false;
  try { window.localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(state)); } catch { return false; }
  window.dispatchEvent(new Event(SAVED_EVENT));
  return true;
}
export function readSaved(): SavedState {
  return readForWrite() ?? emptyState();
}
export function saveMaterial(item: Omit<SavedMaterial, 'collectionId'> & { collectionId?: string }): boolean {
  const state = readForWrite();
  if (!state) return false;
  const collectionId = state.collections.some(collection => collection.id === item.collectionId) ? item.collectionId || DEFAULT_COLLECTION_ID : DEFAULT_COLLECTION_ID;
  const next = parseSaved(JSON.stringify({ collections: state.collections, items: [{ ...item, collectionId }] })).items[0];
  if (!next) return false;
  return writeSaved({ items: [next, ...state.items.filter(entry => entry.id !== next.id)].slice(0, SAVED_MAX), collections: state.collections });
}
export function removeSaved(id: string): boolean {
  const state = readForWrite();
  if (!state) return false;
  return writeSaved({ items: state.items.filter(item => item.id !== id), collections: state.collections });
}
export function clearCollection(collectionId: string): boolean {
  const state = readForWrite();
  if (!state) return false;
  return writeSaved({ items: state.items.filter(item => item.collectionId !== collectionId), collections: state.collections });
}
export function createCollection(name: string): SavedCollection | null {
  if (typeof window === 'undefined') return null;
  const clean = name.trim();
  if (!clean || clean.length > 60) return null;
  const state = readForWrite();
  if (!state) return null;
  const id = clean.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/g, 'l').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || `kolekcja-${Date.now()}`;
  if (state.collections.some(collection => collection.id === id)) return null;
  const collection = { id, name: clean };
  return writeSaved({ items: state.items, collections: [...state.collections, collection] }) ? collection : null;
}
export function removeCollection(id: string): boolean {
  if (id === DEFAULT_COLLECTION_ID) return false;
  const state = readForWrite();
  if (!state) return false;
  return writeSaved({ items: state.items.filter(item => item.collectionId !== id), collections: state.collections.filter(collection => collection.id !== id) });
}
export function changeCollection(id: string, collectionId: string): boolean {
  const state = readForWrite();
  if (!state || !state.collections.some(collection => collection.id === collectionId)) return false;
  return writeSaved({ items: state.items.map(item => item.id === id ? { ...item, collectionId } : item), collections: state.collections });
}
