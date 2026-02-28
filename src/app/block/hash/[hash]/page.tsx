"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useNetwork } from "@/context/network-context";
import { fetchBlockByHash } from "@/lib/rpc-methods";
import type { Block, BlockTransaction } from "@/lib/rpc-types";
import { shortenHash, hexForLink } from "@/lib/rpc-types";
import { getTxPayloadKind, getTxPayloadSummary } from "@/lib/tx-payload";
import { getFriendlyRpcErrorMessage } from "@/lib/rpc-status";
import { CopyButton } from "@/components/copy-button";

function TxRow({ tx, index, network }: { tx: BlockTransaction; index: number; network: string }) {
  const kind = getTxPayloadKind(tx.payload);
  const summary = getTxPayloadSummary(tx.payload);
  const sender = hexForLink(tx.sender);

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

export default function BlockByHashPage() {
  const params = useParams();
  const { network } = useNetwork();
  const hashParam = params?.hash as string;
  const hash = hashParam ? (hashParam.startsWith("0x") ? hashParam.slice(2) : hashParam) : "";
  const [block, setBlock] = useState<Block | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hash || hash.length !== 64) {
      setLoading(false);
      setError("Invalid block hash");
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchBlockByHash(network, hash)
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
  }, [network, hash]);

  if (!hash || hash.length !== 64) {
    return (
      <div className="space-y-4">
        <Link href="/" className="text-network-cyan hover:underline text-sm">← Home</Link>
        <p className="text-red-400">Invalid block hash (must be 64 hex characters).</p>
      </div>
    );
  }

  const proposerHex = block ? hexForLink(block.header.proposer) : "";
  const parentHash = block ? hexForLink(block.header.parent_hash) : "";

  return (
    <div className="space-y-6">
      <Link href="/" className="text-network-cyan hover:underline text-sm">← Home</Link>

      <h1 className="font-display text-2xl font-bold text-[var(--text-primary)]">
        Block by hash
      </h1>
      <div className="flex items-center gap-2 flex-wrap">
        <p className="hash text-sm text-[var(--text-muted)] break-all">{hash}</p>
        <CopyButton value={`0x${hash}`} label="Copy hash" />
      </div>

      {loading && (
        <div className="space-y-4 animate-pulse" aria-busy="true">
          <div className="h-8 bg-white/5 rounded w-48" />
          <div className="h-64 bg-white/5 rounded" />
          <div className="h-48 bg-white/5 rounded" />
        </div>
      )}
      {error && <p className="text-amber-300" role="alert">{error}</p>}
      {!loading && !error && !block && <p className="text-[var(--text-muted)]">Block not found.</p>}

      {block && (
        <>
          <div className="glass-card p-6 space-y-4">
            <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">Header</h2>
            <dl className="grid gap-2 text-sm">
              <div className="flex flex-wrap gap-x-2">
                <dt className="text-[var(--text-muted)]">Hash</dt>
                <dd className="hash text-[var(--text-secondary)]">{block.hash ?? "—"}</dd>
              </div>
              <div className="flex flex-wrap gap-x-2">
                <dt className="text-[var(--text-muted)]">Height</dt>
                <dd className="font-mono">
                  <Link href={`/block/${block.header.height}?network=${network}`} className="text-network-cyan hover:underline">
                    {block.header.height}
                  </Link>
                </dd>
              </div>
              <div className="flex flex-wrap gap-x-2">
                <dt className="text-[var(--text-muted)]">Timestamp</dt>
                <dd className="font-mono">
                  {block.header.timestamp != null
                    ? new Date(Number(block.header.timestamp) * 1000).toLocaleString()
                    : "—"}
                </dd>
              </div>
              <div className="flex flex-wrap gap-x-2 items-center gap-y-1">
                <dt className="text-[var(--text-muted)]">Proposer</dt>
                <dd className="flex items-center gap-2 flex-wrap">
                  {proposerHex ? (
                    <>
                      <Link href={`/account/${proposerHex}?network=${network}`} className="address-link">
                        {shortenHash(block.header.proposer)}
                      </Link>
                      <CopyButton value={`0x${proposerHex}`} label="Copy address" />
                    </>
                  ) : (
                    "—"
                  )}
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
