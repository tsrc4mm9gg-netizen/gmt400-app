export type SavedMaterial = { id: string; title: string; href: string; type: string; collectionId: string };
export type SavedCollection = { id: string; name: string };
export const SAVED_STORAGE_KEY = 'gmt400-saved-materials';
export const SAVED_EVENT = 'gmt400-saved-materials-change';
export const SAVED_MAX = 100;
export const DEFAULT_COLLECTION_ID = 'do-sprawdzenia';
