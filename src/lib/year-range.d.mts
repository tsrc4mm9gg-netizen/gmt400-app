export interface YearRange { from: number; to: number }
export function parseYearRule(value: unknown): YearRange | null;
export function matchesYearRule(year: string | number, rule: unknown): boolean | null;
export function matchesYearRules(year: string | number, rules: readonly string[]): boolean | null;
/** Two values are an inclusive range; other lengths are discrete year lists. */
export function matchesNumericYears(year: string | number, years: readonly number[]): boolean | null;
