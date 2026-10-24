export const NOT_COUNTABLE_REASON: Record<string, string>;
export function selectNhtsaModels(models: unknown[], opts: { platform?: string; year?: string | number }): string[];
export function uniqueCount(lists: unknown[][], key: string): number;
export function badgeText(count: unknown): string | null;
export function sortByHits<T extends { id: string }>(items: T[], counts: Record<string, number | null | undefined> | undefined): T[];
