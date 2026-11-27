import type { Flow } from './diagnosis-flow';
import { FLOW_NIE_ODPALA_KRECI } from './flows/nie-odpala-kreci-5-7-1999';

/**
 * Rejestr ścieżek diagnostycznych krok po kroku. Objawy bez ścieżki działają dotychczasowym
 * przepływem (pytania i lista możliwych przyczyn). Ścieżka trafia tu dopiero razem ze sprawdzonymi źródłami.
 */
export const FLOWS: Flow[] = [FLOW_NIE_ODPALA_KRECI];

export function flowForSymptom(symptomId: string): Flow | undefined {
  return FLOWS.find(flow => flow.symptomId === symptomId);
}
