export const SUPERSEDED_PREFIX: string;
export function isSuperseded(item: { Opis?: unknown } | null | undefined): boolean;
export function withoutSuperseded<T extends { Opis?: unknown }>(items: readonly T[] | null | undefined): T[];
