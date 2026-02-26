/**
 * Compute network statistics from recent blocks.
 * Used for real-time dashboard (Solscan-style).
 */

import type { Block } from "./rpc-types";

export interface NetworkStats {
  blockHeight: number | null;
  avgBlockTimeSec: number | null;
  tps: number | null;
  txCountLastN: number;
  blocksSampled: number;
}

const BLOCKS_TO_SAMPLE = 20;

export function computeNetworkStats(
  height: number | null,
  blocks: Block[]
): NetworkStats {
  if (!height || blocks.length < 2) {
    const txCount = blocks.reduce((s, b) => s + (b.transactions?.length ?? 0), 0);
    return {
      blockHeight: height ?? null,
      avgBlockTimeSec: null,
      tps: null,
      txCountLastN: txCount,
      blocksSampled: blocks.length,
    };
  }

  const sorted = [...blocks].sort(
    (a, b) => (a.header?.height ?? 0) - (b.header?.height ?? 0)
  );
  const txCount = sorted.reduce((s, b) => s + (b.transactions?.length ?? 0), 0);

  const timestamps = sorted
    .map((b) => (b.header?.timestamp != null ? Number(b.header.timestamp) : 0))
    .filter((t) => t > 0);

  let avgBlockTimeSec: number | null = null;
  let tps: number | null = null;

  if (timestamps.length >= 2) {
    const timeSpan = timestamps[timestamps.length - 1] - timestamps[0];
    avgBlockTimeSec = timeSpan / (timestamps.length - 1);
    tps = timeSpan > 0 ? txCount / timeSpan : 0;
  }

  return {
    blockHeight: height,
    avgBlockTimeSec,
    tps,
    txCountLastN: txCount,
    blocksSampled: blocks.length,
  };
}

export function formatStatValue(
  value: number | null,
  decimals = 2
): string {
  if (value === null) return "—";
  if (value >= 1_000_000) return value.toLocaleString(undefined, { maximumFractionDigits: 0 });
  if (value >= 1) return value.toFixed(decimals);
  if (value > 0) return value.toFixed(Math.min(decimals + 1, 4));
  return "0";
}
