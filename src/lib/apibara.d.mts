export const APIBARA_BASE: string;
export const RESULTS_TTL_MS: number;
export const RETRY_ERROR_AFTER_MS: number;
export type Usd = { sale: number | null; lastSold: number | null; currentBid: number | null; buyNow?: number | null; estimatedRetail?: number | null };
export type AuctionVehicle = { platform: 'copart' | 'iaai' | null; lot: string | null; title: string | null; year: number | null; make: string | null; model: string | null; damage: string | null; lossType: string | null; run: string | null; odometerMi: number | null; odometerKm: number | null; outcome: string | null; auctionAt: string | null; state: string | null; priceUsd: Usd; photoCount: number | null };
export type AuctionHistoryItem = { platform: 'copart' | 'iaai' | null; lot: string | null; date: string | null; priceUsd: number | null; status: string | null };
export type AuctionOtherLot = { platform: 'copart' | 'iaai' | null; lot: string | null; title: string | null; outcome: string | null; auctionAt: string | null; priceUsd: Usd };
export type AuctionData =
  | { state: 'ok'; fetchedAt: string; vehicle: AuctionVehicle | null; history: AuctionHistoryItem[]; otherLots: AuctionOtherLot[] }
  | { state: 'empty' | 'quota' | 'unconfigured'; fetchedAt: string }
  | { state: 'error'; fetchedAt: string; reason?: string };
export function normalizeVehicle(data: unknown): AuctionVehicle | null;
export function normalizeHistory(list: unknown): AuctionHistoryItem[];
export function normalizeOtherLots(list: unknown): AuctionOtherLot[];
export function fetchAuctionData(vin: string, o?: { apiKey?: string; fetchImpl?: typeof fetch; now?: () => string; timeoutMs?: number }): Promise<AuctionData>;
export function needsRefresh(results: unknown, nowMs?: number): boolean;
export function lotUrl(platform: string | null | undefined, lot: string | null | undefined): string | null;
