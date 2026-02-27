"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useNetwork } from "@/context/network-context";
import { SearchBar } from "@/components/search-bar";
import { NetworkStats } from "@/components/network-stats";
import { fetchChainHeight, fetchBlockByHeight } from "@/lib/rpc-methods";
import { getFriendlyRpcErrorMessage } from "@/lib/rpc-status";
import type { Block } from "@/lib/rpc-types";
import { shortenHash } from "@/lib/rpc-types";

export default function HomePage() {
  const { network } = useNetwork();
  const [height, setHeight] = useState<number | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchChainHeight(network)
      .then((h) => {
        if (cancelled) return [];
        setHeight(h);
        return Promise.all(
          Array.from({ length: 12 }, (_, i) =>
            fetchBlockByHeight(network, Math.max(0, h - i))
          )
        );
      })
      .then((results) => {
        if (cancelled || !results) return;
        setBlocks(
          results
            .filter((b): b is Block => b != null && "hash" in b && "header" in b)
            .slice(0, 12)
        );
      })
      .catch((e) => {
        if (!cancelled) setError(getFriendlyRpcErrorMessage(e, network, "general"));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [network]);

  return (
    <div className="space-y-8">
      <section>
        <h1 className="font-display text-3xl font-bold tracking-tight text-[var(--text-primary)]">
          Boing Observer
        </h1>
        <p className="mt-1 text-[var(--text-secondary)]">
          Explore blocks, transactions, and accounts on Boing Network.
        </p>
        <div className="mt-6">
          <SearchBar />
        </div>
      </section>

      {error && (
        <div className="glass-card border-amber-500/40 bg-amber-950/20 p-4 text-amber-200" role="alert">
          {error}
        </div>
      )}

      <NetworkStats />

      <section>
        <h2 className="font-display text-xl font-semibold text-[var(--text-primary)]">
          Chain tip
        </h2>
        {loading ? (
          <p className="mt-2 text-[var(--text-muted)]">Loading…</p>
        ) : height !== null ? (
          <p className="mt-2 font-mono text-lg text-network-cyan">
            Current height: <span className="font-semibold">{height.toLocaleString()}</span>
          </p>
        ) : null}
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-[var(--text-primary)]">
          Latest blocks
        </h2>
        {loading ? (
          <p className="mt-2 text-[var(--text-muted)]">Loading…</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-color)] text-left text-sm text-[var(--text-muted)]">
                  <th className="pb-3 pr-4 font-medium">Height</th>
                  <th className="pb-3 pr-4 font-medium">Hash</th>
                  <th className="pb-3 pr-4 font-medium">Proposer</th>
                  <th className="pb-3 pr-4 font-medium">Txns</th>
                  <th className="pb-3 font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {blocks.map((b) => (
                  <tr
                    key={b.hash}
                    className="border-b border-[var(--border-color)]/60 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-3 pr-4">
                      <Link
                        href={`/block/${b.header.height}?network=${network}`}
                        className="font-mono text-network-cyan hover:text-network-cyan-light underline underline-offset-2"
                      >
                        {b.header.height}
                      </Link>
                    </td>
                    <td className="py-3 pr-4">
                      <Link
                        href={`/block/hash/${b.hash.startsWith("0x") ? b.hash.slice(2) : b.hash}?network=${network}`}
                        className="hash text-[var(--text-secondary)] hover:text-network-primary-light"
                      >
                        {shortenHash(b.hash)}
                      </Link>
                    </td>
                    <td className="py-3 pr-4">
                      <Link
                        href={`/account/${(b.header.proposer || "").startsWith("0x") ? (b.header.proposer as string).slice(2) : b.header.proposer}?network=${network}`}
                        className="hash text-network-cyan hover:underline"
                      >
                        {shortenHash(String(b.header.proposer))}
                      </Link>
                    </td>
                    <td className="py-3 pr-4 font-mono text-sm">
                      {b.transactions?.length ?? 0}
                    </td>
                    <td className="py-3 font-mono text-sm text-[var(--text-muted)]">
                      {b.header.timestamp
                        ? new Date(Number(b.header.timestamp) * 1000).toLocaleString()
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
