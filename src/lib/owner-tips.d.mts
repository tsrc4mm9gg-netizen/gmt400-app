export type OwnerTipSource = { doc: string; page: string; url?: string };
export type OwnerTipScope = { platforms?: string[]; modelIncludes?: string[]; drive?: string; years?: number[]; hardYears?: number[]; doors4?: boolean };
export type OwnerTip = OwnerTipScope & {
  id: string; cat: string; title: string; scope: string; steps: string[]; warning?: string;
  sources: OwnerTipSource[]; check?: boolean; fixed?: string;
  image?: { src: string; alt: string }; link?: { href: string; label: string };
};
export type OwnerTipFit = { status: 'match' | 'general' | 'unknown' | 'outside'; reasons: string[] };
export const OWNER_TIP_CATEGORIES: { id: string; label: string }[];
export const OWNER_TIPS: OwnerTip[];
export const ILLUSTRATED_SCOPE: Record<string, OwnerTipScope>;
export const SKIPPED_OLD_CARDS: { card: number; title: string; reason: string }[];
export function ownerTipFit(tip: OwnerTipScope, profile: { platform?: string; model?: string; year?: string; drive?: string } | null): OwnerTipFit;
