"use client";

import React, { createContext, useContext, useCallback, useState, useEffect } from "react";
import type { NetworkId } from "@/lib/rpc-types";

const STORAGE_KEY = "boing-explorer-network";

type NetworkContextValue = {
  network: NetworkId;
  setNetwork: (n: NetworkId) => void;
};

const NetworkContext = createContext<NetworkContextValue | null>(null);

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const [network, setNetworkState] = useState<NetworkId>("testnet");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as NetworkId | null;
      if (stored === "testnet" || stored === "mainnet") setNetworkState(stored);
    } catch {
      // ignore
    }
    setMounted(true);
  }, []);

  const setNetwork = useCallback((n: NetworkId) => {
    setNetworkState(n);
    try {
      localStorage.setItem(STORAGE_KEY, n);
    } catch {
      // ignore
    }
  }, []);

  // Sync from URL searchParams on mount (e.g. ?network=mainnet)
  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const n = params.get("network");
    if (n === "mainnet" || n === "testnet") setNetwork(n);
  }, [mounted, setNetwork]);

  return (
    <NetworkContext.Provider value={{ network, setNetwork }}>
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork(): NetworkContextValue {
  const ctx = useContext(NetworkContext);
  if (!ctx) throw new Error("useNetwork must be used within NetworkProvider");
  return ctx;
}
