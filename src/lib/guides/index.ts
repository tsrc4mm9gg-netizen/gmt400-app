import type { Guide } from './types';
import { LPG_GUIDE } from './lpg';
import { IMPORT_GUIDE } from './import';
import { LIGHTS_GUIDE } from './lights';
import { PLATES_GUIDE } from './plates';
import { HOMOLOGACJA_GUIDE } from './homologacja';
import { PRZEGLADY_GUIDE } from './przeglady';

export const GUIDES: Guide[] = [LPG_GUIDE, IMPORT_GUIDE, LIGHTS_GUIDE, PLATES_GUIDE, HOMOLOGACJA_GUIDE, PRZEGLADY_GUIDE];
export const getGuide = (slug: string) => GUIDES.find(g => g.slug === slug) ?? null;
export type { Guide, Block, Section, Source } from './types';
