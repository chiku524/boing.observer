/**
 * Pure helpers for token index disk cache (testable without filesystem).
 */

export function tokenIndexCacheFileBaseName(network: string, fromHeight: number, toHeight: number): string {
  const safeNet = network.replace(/[^a-z0-9_-]/gi, "_");
  return `${safeNet}_${fromHeight}_${toHeight}`;
}

export function isCacheFresh(savedAtIso: string, ttlSeconds: number, nowMs: number = Date.now()): boolean {
  if (ttlSeconds <= 0) return false;
  const t = Date.parse(savedAtIso);
  if (Number.isNaN(t)) return false;
  return nowMs - t < ttlSeconds * 1000;
}

export function defaultTokenIndexCacheTtlSeconds(): number {
  const raw = process.env.TOKEN_INDEX_CACHE_TTL_SEC ?? process.env.TOKEN_INDEX_CACHE_TTL_SECONDS;
  if (raw == null || raw === "") return 600;
  const n = parseInt(raw, 10);
  if (!Number.isFinite(n) || n < 0) return 600;
  return Math.min(n, 86400 * 7);
}
