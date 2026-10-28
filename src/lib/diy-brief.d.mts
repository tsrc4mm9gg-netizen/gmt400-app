export type BriefSafety = { text: string; tag: string };
export type BriefSource = { text: string; urls: string[] };
export type DiyBrief = { applies: boolean; safety: BriefSafety[]; tools: string[]; parts: string[]; toolsLabel: string; isProcedure: boolean; sources: BriefSource[]; paraphrase: boolean };
export function extractDiyBrief(entry: { Typ?: string; Opis?: string; Objawy?: string; Rozwiązanie?: string }, extraText?: string): DiyBrief;
export function blocksToBriefText(blocks: unknown): string;
