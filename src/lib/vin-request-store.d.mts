import type { RequestStatus, VinRequestRecord } from './vin-request.mjs';
export class StoreError extends Error { code: string }
export type StoreRecord = VinRequestRecord & { pageId: string; results: (import('./apibara.mjs').AuctionData) | null };
export function packResults(obj: unknown): { type: 'text'; text: { content: string } }[] | null;
export function parseResults(prop: unknown): import('./apibara.mjs').AuctionData | null;
export function storeConfig(env?: Record<string, string | undefined>): { token: string; db: string; apiBase: string } | null;
export function toRecord(page: unknown): StoreRecord;
export type VinRequestStore = {
  create(r: { id: string; vin: string; codeHash: string; ipHash: string }): Promise<StoreRecord>;
  findByCodeHash(codeHash: string): Promise<StoreRecord | null>;
  countRecentByIp(ipHash: string, sinceIso: string): Promise<number>;
  pendingCount(): Promise<number>;
  list(limit?: number): Promise<StoreRecord[]>;
  setStatus(id: string, status: RequestStatus, nowIso?: string): Promise<StoreRecord | null>;
  setResults(pageId: string, results: import('./apibara.mjs').AuctionData): Promise<boolean>;
};
export function createNotionStore(o: { token: string; db: string; apiBase?: string; fetchImpl?: typeof fetch }): VinRequestStore;
