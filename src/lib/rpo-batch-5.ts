import type { RpoEntry } from './rpo-catalog';
const FORUM = 'https://www.gmt400.com/threads/rpo-code-list.37531/';
const NOTE = 'Kod występuje na liście GMT400, ale źródło nie podaje jego opisu. Nie przypisano znaczenia z innych aut GM. Sprawdź instrukcję serwisową właściwego rocznika i modelu oraz tabliczkę pojazdu.';
function entry(code: string): RpoEntry {
 return { code, category: 'Pakiety', description: 'Kod GMT400 bez opisu w źródle', original: code, years: null, models: [], source: FORUM, sourceTitle: 'GMT400.com — RPO Code List, wpis #4; referencja społecznościowa', status: 'reference', notes: NOTE };
}
export const RPO_BATCH_5: RpoEntry[] = [entry('FF8'), entry('FF9')];
