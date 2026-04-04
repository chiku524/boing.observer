"use client";

type Props = {
  variant?: "by-hash" | "by-height";
};

/**
 * Clarifies Boing L1 block model: block hash ≠ EVM tx hash; txs live inside the block.
 */
export function BlockExplainerBanner({ variant = "by-hash" }: Props) {
  const isHash = variant === "by-hash";
  return (
    <aside
      className="space-y-2 rounded-xl border border-cyan-500/25 bg-cyan-500/5 px-4 py-3 text-sm text-[var(--text-secondary)]"
      aria-label="How Boing blocks work"
    >
      <p className="font-medium text-[var(--text-primary)]">
        {isHash ? "Block view (BLAKE3 hash)" : "Reading this block"}
      </p>
      <ul className="list-disc space-y-1.5 pl-5 text-[13px] leading-relaxed">
        {isHash ? (
          <li>
            The 64-character id is this block&apos;s <strong>BLAKE3 hash</strong> (optional{" "}
            <code className="text-network-cyan">0x</code> prefix). It is not an EVM tx hash.
          </li>
        ) : null}
        <li>
          State changes are listed under <strong>Transactions</strong>. For a signable payload id, open the{" "}
          <strong>Transaction page</strong> link on a receipt or search 64-character hex (tx is tried
          before block hash).
        </li>
        <li>
          Amounts are whole <strong>BOING</strong> (node RPC units).
        </li>
      </ul>
    </aside>
  );
}
