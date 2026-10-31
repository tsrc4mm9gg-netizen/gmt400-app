export interface SymptomEntry { id?: string; Nazwa: string; Typ?: string; Objawy?: string; Opis?: string; [key: string]: unknown }
export interface SymptomTerm { kind: 'concept' | 'word'; key: string; raw: string }
export interface SymptomDoc<E extends SymptomEntry = SymptomEntry> { entry: E; fields: { words: string[]; concepts: Set<string> }[] }
export declare const SYMPTOM_CONCEPTS: { id: string; label: string; stems: string[] }[];
export declare function normalizeText(value: unknown): string;
export declare function stem(word: string): string;
export declare function conceptOf(word: string): string | null;
export declare function parseSymptomQuery(query: string): SymptomTerm[];
export declare function buildSymptomIndex<E extends SymptomEntry>(entries: readonly E[]): SymptomDoc<E>[];
export declare function searchSymptoms<E extends SymptomEntry>(index: readonly SymptomDoc<E>[], query: string, limits?: { faults?: number; diy?: number }): { terms: SymptomTerm[]; faults: E[]; diy: E[] };
export declare function termLabels(terms: readonly SymptomTerm[]): string[];
