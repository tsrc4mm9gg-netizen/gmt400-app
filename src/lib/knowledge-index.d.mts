import type { SearchDocument } from './knowledge-search';
import type { Applicability } from './vehicle-compatibility';

export interface KnowledgeEntry {
  id: string;
  Nazwa: string;
  Typ: string;
  Model?: string;
  Opis?: string;
  Objawy?: string;
  Rozwiązanie?: string;
  Lata?: string;
  /** Dodatkowe frazy wyszukiwania (aliasy), niewidoczne w UI. */
  Slowa?: string;
  href?: string;
  applicability?: Applicability;
}

export interface IndexedKnowledge extends SearchDocument {
  entry: KnowledgeEntry;
  href?: string;
}

export function toSearchDocument(entry: KnowledgeEntry): SearchDocument;
export function buildKnowledgeIndex(entries: readonly KnowledgeEntry[]): IndexedKnowledge[];
export function searchKnowledge(index: readonly IndexedKnowledge[], query: string): IndexedKnowledge[];
export function getObdEntries(): KnowledgeEntry[];
export function getKnowledgeEntries(items?: readonly KnowledgeEntry[]): KnowledgeEntry[];
