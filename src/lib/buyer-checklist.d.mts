export type BuyerItem = { id: string; text: string; page?: string; link?: [string, string] };
export type BuyerSection = { id: string; title: string; image?: { src: string; alt: string }; items: BuyerItem[]; links?: [string, string][] };
export const BUYER_STORAGE_KEY: string;
export const BUYER_SOURCE: { label: string; url: string };
export const BUYER_CHECK: string;
export const BUYER_SECTIONS: BuyerSection[];
export const BUYER_PL_LINKS: [string, string][];
export const BUYER_ITEM_IDS: string[];
export function readChecked(raw: string | null): Record<string, true>;
