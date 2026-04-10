import "server-only";

import { mkdir, readFile, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { defaultTokenIndexCacheTtlSeconds, isCacheFresh, tokenIndexCacheFileBaseName } from "./cache-logic";
import type { TokenIndexCacheMeta, TokenIndexResult } from "./types";

const ENVELOPE_VERSION = 1 as const;

export type TokenIndexDiskEnvelopeV1 = {
  v: typeof ENVELOPE_VERSION;
  network: string;
  fromHeight: number;
  toHeight: number;
  savedAt: string;
  ttlSeconds: number;
  /** Chain tip from `getNetworkInfo` immediately after the scan completed. */
  headHeightWhenBuilt: number;
  note: string;
  result: TokenIndexResult;
};

export type ReadDiskCacheResult =
  | { ok: true; envelope: TokenIndexDiskEnvelopeV1 }
  | { ok: false; reason: "disabled" | "missing" | "expired" | "corrupt" };

/**
 * Cache directory: `TOKEN_INDEX_CACHE_DIR` if set (absolute path), else `<cwd>/.cache/token-index`.
 * Set `TOKEN_INDEX_CACHE_DIR=off` to disable. On read-only or unsupported filesystems (some serverless), writes fail silently.
 */
export function resolveTokenIndexCacheDir(): string | null {
  const flag = process.env.TOKEN_INDEX_CACHE_DIR;
  if (flag === "off" || flag === "false" || flag === "0") return null;
  if (flag?.trim()) return path.resolve(flag.trim());
  return path.join(process.cwd(), ".cache", "token-index");
}

export async function readTokenIndexDiskCache(
  network: string,
  fromHeight: number,
  toHeight: number,
): Promise<ReadDiskCacheResult> {
  const dir = resolveTokenIndexCacheDir();
  if (!dir) return { ok: false, reason: "disabled" };

  const fp = path.join(dir, `${tokenIndexCacheFileBaseName(network, fromHeight, toHeight)}.json`);
  try {
    const raw = await readFile(fp, "utf8");
    const parsed = JSON.parse(raw) as TokenIndexDiskEnvelopeV1;
    if (parsed.v !== 1 || !parsed.result || typeof parsed.savedAt !== "string") {
      return { ok: false, reason: "corrupt" };
    }
    const ttl = typeof parsed.ttlSeconds === "number" ? parsed.ttlSeconds : defaultTokenIndexCacheTtlSeconds();
    if (!isCacheFresh(parsed.savedAt, ttl)) return { ok: false, reason: "expired" };
    return { ok: true, envelope: parsed };
  } catch (e) {
    const err = e as NodeJS.ErrnoException;
    if (err.code === "ENOENT") return { ok: false, reason: "missing" };
    return { ok: false, reason: "corrupt" };
  }
}

export async function writeTokenIndexDiskCache(envelope: Omit<TokenIndexDiskEnvelopeV1, "v">): Promise<boolean> {
  const dir = resolveTokenIndexCacheDir();
  if (!dir) return false;

  const full: TokenIndexDiskEnvelopeV1 = { v: ENVELOPE_VERSION, ...envelope };
  const base = tokenIndexCacheFileBaseName(full.network, full.fromHeight, full.toHeight);
  const fp = path.join(dir, `${base}.json`);
  const tmp = path.join(dir, `.${base}.${process.pid}.tmp`);
  try {
    await mkdir(dir, { recursive: true });
    await writeFile(tmp, JSON.stringify(full), "utf8");
    await rename(tmp, fp);
    return true;
  } catch {
    try {
      await unlink(tmp);
    } catch {
      /* ignore */
    }
    return false;
  }
}

export function assembleTokenIndexCacheMeta(p: {
  backend: "file" | "none";
  hit: boolean;
  rpcRefreshed: boolean;
  ttlSeconds: number;
  savedAt: string | null;
  headWhenBuilt: number;
  currentHead: number;
  scannedToHeight: number;
  snapshotPersisted: boolean | null;
}): TokenIndexCacheMeta {
  const staleAfterApprox =
    p.savedAt && p.ttlSeconds > 0
      ? new Date(Date.parse(p.savedAt) + p.ttlSeconds * 1000).toISOString()
      : null;
  return {
    backend: p.backend,
    hit: p.hit,
    rpcRefreshed: p.rpcRefreshed,
    savedAt: p.savedAt,
    staleAfterApprox,
    ttlSeconds: p.ttlSeconds,
    headHeightWhenBuilt: p.headWhenBuilt,
    currentHeadHeight: p.currentHead,
    blocksPastScanTip: Math.max(0, p.currentHead - p.scannedToHeight),
    snapshotPersisted: p.snapshotPersisted,
  };
}
