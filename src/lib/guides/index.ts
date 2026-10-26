import type { Guide } from './types';
import { LPG_GUIDE } from './lpg';
import { IMPORT_GUIDE } from './import';
import { LIGHTS_GUIDE } from './lights';
import { PLATES_GUIDE } from './plates';
import { HOMOLOGACJA_GUIDE } from './homologacja';
import { PRZEGLADY_GUIDE } from './przeglady';

/** Wszystkie poradniki w repo, także szkice (`draft: true`). */
export const ALL_GUIDES: Guide[] = [LPG_GUIDE, IMPORT_GUIDE, LIGHTS_GUIDE, PLATES_GUIDE, HOMOLOGACJA_GUIDE, PRZEGLADY_GUIDE];
/** Opublikowane poradniki: z nich korzystają hub, strona główna, sitemap, wyszukiwarka i powiązania. */
export const GUIDES: Guide[] = ALL_GUIDES.filter(g => !g.draft);
export const getGuide = (slug: string) => GUIDES.find(g => g.slug === slug) ?? null;
/** Dla stron tras: także szkice (strona szkicu sama zwraca 404). */
export const getAnyGuide = (slug: string) => ALL_GUIDES.find(g => g.slug === slug) ?? null;
export type { Guide, Block, Section, Source } from './types';
