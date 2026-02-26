/**
 * Boing RPC method wrappers for the explorer.
 */

import { rpcCall, getRpcBaseUrl } from "./rpc-client";
import type { Block, Account, AccountBalance } from "./rpc-types";

export type NetworkId = "testnet" | "mainnet";

export async function fetchChainHeight(network: NetworkId): Promise<number> {
  const base = getRpcBaseUrl(network);
  return rpcCall<number>(base, "boing_chainHeight", []);
}

export async function fetchBlockByHeight(
  network: NetworkId,
  height: number
): Promise<Block | null> {
  const base = getRpcBaseUrl(network);
  return rpcCall<Block | null>(base, "boing_getBlockByHeight", [height]);
}

export async function fetchBlockByHash(
  network: NetworkId,
  hexBlockHash: string
): Promise<Block | null> {
  const base = getRpcBaseUrl(network);
  const hash = hexBlockHash.startsWith("0x") ? hexBlockHash : `0x${hexBlockHash}`;
  return rpcCall<Block | null>(base, "boing_getBlockByHash", [hash]);
}

export async function fetchBalance(
  network: NetworkId,
  hexAccountId: string
): Promise<AccountBalance> {
  const base = getRpcBaseUrl(network);
  const id = hexAccountId.startsWith("0x") ? hexAccountId : `0x${hexAccountId}`;
  return rpcCall<AccountBalance>(base, "boing_getBalance", [id]);
}

export async function fetchAccount(
  network: NetworkId,
  hexAccountId: string
): Promise<Account> {
  const base = getRpcBaseUrl(network);
  const id = hexAccountId.startsWith("0x") ? hexAccountId : `0x${hexAccountId}`;
  return rpcCall<Account>(base, "boing_getAccount", [id]);
}
