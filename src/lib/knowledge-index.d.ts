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
  href?: string;
  applicability?: Applicability;
}

export interface IndexedKnowledge extends KnowledgeEntry {
  searchId: string;
  searchTitle: string;
  searchBody: string;
  searchKeywords: string[];
}

export function toSearchDocument(entry: KnowledgeEntry): IndexedKnowledge;
export function buildKnowledgeIndex(entries: readonly KnowledgeEntry[]): IndexedKnowledge[];
export function searchKnowledge(index: readonly IndexedKnowledge[], query: string): KnowledgeEntry[];
export function getObdEntries(): KnowledgeEntry[];
export function getKnowledgeEntries(items?: readonly KnowledgeEntry[]): KnowledgeEntry[];
