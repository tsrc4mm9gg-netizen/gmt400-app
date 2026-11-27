import type { Flow } from './diagnosis-flow';

/**
 * Rejestr ścieżek diagnostycznych krok po kroku. W etapie 1 jest PUSTY: wszystkie objawy działają dotychczasowym
 * przepływem (pytania i lista możliwych przyczyn). Ścieżka trafia tu dopiero razem ze sprawdzonymi źródłami.
 */
export const FLOWS: Flow[] = [];

export function flowForSymptom(symptomId: string): Flow | undefined {
  return FLOWS.find(flow => flow.symptomId === symptomId);
}
