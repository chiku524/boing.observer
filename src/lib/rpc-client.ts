/**
 * Boing JSON-RPC client (HTTP POST). No SDK required.
 * Base URL from config (e.g. NEXT_PUBLIC_TESTNET_RPC).
 */

import type { JsonRpcRequest, JsonRpcResponse } from "./rpc-types";

let rpcId = 0;

export async function rpcCall<T>(
  baseUrl: string,
  method: string,
  params: unknown[] = []
): Promise<T> {
  const req: JsonRpcRequest = {
    jsonrpc: "2.0",
    id: ++rpcId,
    method,
    params,
  };

  const res = await fetch(baseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });

  if (!res.ok) {
    throw new Error(`RPC HTTP ${res.status}: ${res.statusText}`);
  }

  const data = (await res.json()) as JsonRpcResponse<T>;
  if ("error" in data) {
    throw new Error(data.error.message || `RPC error ${data.error.code}`);
  }
  return data.result;
}

export function getRpcBaseUrl(network: "testnet" | "mainnet"): string {
  if (typeof window !== "undefined") {
    const testnet = process.env.NEXT_PUBLIC_TESTNET_RPC;
    const mainnet = process.env.NEXT_PUBLIC_MAINNET_RPC;
    if (network === "testnet" && testnet) return testnet.replace(/\/$/, "");
    if (network === "mainnet" && mainnet) return mainnet.replace(/\/$/, "");
  }
  const testnet = process.env.NEXT_PUBLIC_TESTNET_RPC || "http://localhost:8545";
  const mainnet =
    process.env.NEXT_PUBLIC_MAINNET_RPC || process.env.NEXT_PUBLIC_TESTNET_RPC || "http://localhost:8545";
  return network === "testnet" ? testnet.replace(/\/$/, "") : mainnet.replace(/\/$/, "");
}
