"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useNetwork } from "@/context/network-context";
import { fetchBlockByHeight } from "@/lib/rpc-methods";
import type { Block, BlockTransaction } from "@/lib/rpc-types";
import { shortenHash, formatBalance } from "@/lib/rpc-types";
import { getTxPayloadKind, getTxPayloadSummary } from "@/lib/tx-payload";
import { getFriendlyRpcErrorMessage } from "@/lib/rpc-status";

function TxRow({ tx, index, network }: { tx: BlockTransaction; index: number; network: string }) {
  const kind = getTxPayloadKind(tx.payload);
  const summary = getTxPayloadSummary(tx.payload);
  const sender = typeof tx.sender === "string" ? (tx.sender.startsWith("0x") ? tx.sender.slice(2) : tx.sender) : "";

  return (
    <tr className="border-b border-[var(--border-color)]/60 hover:bg-white/5">
      <td className="py-2 pr-4 font-mono text-sm text-[var(--text-muted)]">{index}</td>
      <td className="py-2 pr-4">
        <span className="rounded bg-boing-navy-mid px-2 py-0.5 text-xs font-medium text-network-cyan">
          {kind}
        </span>
      </td>
      <td className="py-2 pr-4">
        <Link href={`/account/${sender}?network=${network}`} className="address-link">
          {shortenHash(sender || "0")}
        </Link>
      </td>
      <td className="py-2 text-sm text-[var(--text-secondary)]">{summary}</td>
    </tr>
  );
}

export default function BlockByHeightPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { network } = useNetwork();
  const heightParam = params?.height as string;
  const height = heightParam ? parseInt(heightParam, 10) : NaN;
  const [block, setBlock] = useState<Block | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (Number.isNaN(height) || height < 0) {
      setLoading(false);
      setError("Invalid block height");
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchBlockByHeight(network, height)
      .then((b) => {
        if (!cancelled) setBlock(b ?? null);
      })
      .catch((e) => {
        if (!cancelled) setError(getFriendlyRpcErrorMessage(e, network, "block"));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [network, height]);

  if (Number.isNaN(height) || height < 0) {
    return (
      <div className="space-y-4">
        <Link href="/" className="text-network-cyan hover:underline text-sm">← Home</Link>
        <p className="text-red-400">Invalid block height.</p>
      </div>
    );
  }

  const proposerHex = block?.header?.proposer != null
    ? (String(block.header.proposer).startsWith("0x") ? String(block.header.proposer).slice(2) : String(block.header.proposer))
    : "";
  const parentHash = block?.header?.parent_hash != null
    ? (String(block.header.parent_hash).startsWith("0x") ? String(block.header.parent_hash).slice(2) : String(block.header.parent_hash))
    : "";
  const blockHash = block?.hash ? (block.hash.startsWith("0x") ? block.hash.slice(2) : block.hash) : "";

  return (
    <div className="space-y-6">
      <Link href="/" className="text-network-cyan hover:underline text-sm">← Home</Link>

      <h1 className="font-display text-2xl font-bold text-[var(--text-primary)]">
        Block #{height.toLocaleString()}
      </h1>

      {loading && <p className="text-[var(--text-muted)]">Loading…</p>}
      {error && <p className="text-amber-300" role="alert">{error}</p>}
      {!loading && !error && !block && <p className="text-[var(--text-muted)]">Block not found.</p>}

      {block && (
        <>
          <div className="glass-card p-6 space-y-4">
            <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">Header</h2>
            <dl className="grid gap-2 text-sm">
              <div className="flex flex-wrap gap-x-2">
                <dt className="text-[var(--text-muted)]">Hash</dt>
                <dd className="hash text-[var(--text-secondary)]">
                  {block.hash ? (
                    <Link href={`/block/hash/${blockHash}?network=${network}`} className="text-network-cyan hover:underline">
                      {block.hash}
                    </Link>
                  ) : "—"}
                </dd>
              </div>
              <div className="flex flex-wrap gap-x-2">
                <dt className="text-[var(--text-muted)]">Height</dt>
                <dd className="font-mono">{block.header.height}</dd>
              </div>
              <div className="flex flex-wrap gap-x-2">
                <dt className="text-[var(--text-muted)]">Timestamp</dt>
                <dd className="font-mono">
                  {block.header.timestamp != null
                    ? new Date(Number(block.header.timestamp) * 1000).toLocaleString()
                    : "—"}
                </dd>
              </div>
              <div className="flex flex-wrap gap-x-2">
                <dt className="text-[var(--text-muted)]">Proposer</dt>
                <dd>
                  <Link href={`/account/${proposerHex}?network=${network}`} className="address-link">
                    {block.header.proposer != null ? String(block.header.proposer) : "—"}
                  </Link>
                </dd>
              </div>
              <div className="flex flex-wrap gap-x-2">
                <dt className="text-[var(--text-muted)]">Parent hash</dt>
                <dd className="hash">
                  {parentHash ? (
                    <Link href={`/block/hash/${parentHash}?network=${network}`} className="text-network-cyan hover:underline">
                      {block.header.parent_hash}
                    </Link>
                  ) : "—"}
                </dd>
              </div>
              <div className="flex flex-wrap gap-x-2">
                <dt className="text-[var(--text-muted)]">State root</dt>
                <dd className="hash text-[var(--text-secondary)]">{block.header.state_root ?? "—"}</dd>
              </div>
              <div className="flex flex-wrap gap-x-2">
                <dt className="text-[var(--text-muted)]">Tx root</dt>
                <dd className="hash text-[var(--text-secondary)]">{block.header.tx_root ?? "—"}</dd>
              </div>
            </dl>
          </div>

          <div className="glass-card p-6">
            <h2 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
              Transactions ({block.transactions?.length ?? 0})
            </h2>
            {!block.transactions?.length ? (
              <p className="text-[var(--text-muted)]">No transactions.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px]">
                  <thead>
                    <tr className="border-b border-[var(--border-color)] text-left text-sm text-[var(--text-muted)]">
                      <th className="pb-2 pr-4">#</th>
                      <th className="pb-2 pr-4">Type</th>
                      <th className="pb-2 pr-4">Sender</th>
                      <th className="pb-2">Summary</th>
                    </tr>
                  </thead>
                  <tbody>
                    {block.transactions.map((tx, i) => (
                      <TxRow key={i} tx={tx} index={i} network={network} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
