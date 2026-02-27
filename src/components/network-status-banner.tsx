"use client";

import { useEffect, useState, useCallback } from "react";
import { useNetwork } from "@/context/network-context";
import { fetchChainHeight } from "@/lib/rpc-methods";
import { isRpcUnreachableError } from "@/lib/rpc-status";

const CHECK_INTERVAL_MS = 30_000;

export function NetworkStatusBanner() {
  const { network } = useNetwork();
  const [unreachable, setUnreachable] = useState<boolean | null>(null);

  const check = useCallback(async () => {
    try {
      await fetchChainHeight(network);
      setUnreachable(false);
    } catch (e) {
      setUnreachable(isRpcUnreachableError(e));
    }
  }, [network]);

  useEffect(() => {
    check();
    const id = setInterval(check, CHECK_INTERVAL_MS);
    return () => clearInterval(id);
  }, [check]);

  if (unreachable !== true) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      className="border-b border-amber-500/40 bg-amber-950/30 px-4 py-3 text-center text-sm text-amber-200"
    >
      <strong>Testnet RPC unavailable.</strong>{" "}
      The Boing Network may be starting up or nodes are not yet deployed. Run
      boing-node locally, or check back when the incentivized testnet launches.
      <a
        href="/about"
        className="ml-2 font-medium text-amber-100 hover:text-amber-50 underline underline-offset-2"
      >
        Learn more
      </a>
    </div>
  );
}
