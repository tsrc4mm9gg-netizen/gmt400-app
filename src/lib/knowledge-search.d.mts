export interface SearchDocument {
  id: string;
  title: string;
  description?: string;
  keywords?: readonly string[];
}
export function normalizeSearch(value: unknown): string;
export function tokenizeSearch(query: string): string[];
export function searchDocuments<T extends SearchDocument>(documents: readonly T[], query: string): Array<{ document: T; score: number; index: number }>;
export function searchNote(query: string): string | null;
