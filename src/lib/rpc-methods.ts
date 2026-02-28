/**
 * Boing RPC method wrappers for the explorer.
 */

import { rpcCall, getRpcBaseUrl } from "./rpc-client";
import type { Block, Account } from "./rpc-types";

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

export async function fetchAccount(
  network: NetworkId,
  hexAccountId: string
): Promise<Account> {
  const base = getRpcBaseUrl(network);
  const id = hexAccountId.startsWith("0x") ? hexAccountId : `0x${hexAccountId}`;
  return rpcCall<Account>(base, "boing_getAccount", [id]);
}

export interface QaCheckResult {
  result: "allow" | "reject" | "unsure";
  rule_id?: string;
  message?: string;
}

export async function qaCheck(
  network: NetworkId,
  hexBytecode: string,
  purposeCategory?: string,
  descriptionHash?: string
): Promise<QaCheckResult> {
  const base = getRpcBaseUrl(network);
  const params: string[] = [hexBytecode.startsWith("0x") ? hexBytecode : `0x${hexBytecode}`];
  if (purposeCategory != null && purposeCategory !== "") {
    params.push(purposeCategory);
    if (descriptionHash != null && descriptionHash !== "") {
      params.push(descriptionHash.startsWith("0x") ? descriptionHash : `0x${descriptionHash}`);
    }
  }
  return rpcCall<QaCheckResult>(base, "boing_qaCheck", params);
}

export interface FaucetResult {
  ok: boolean;
  amount?: string;
  to?: string;
  message?: string;
}

export async function faucetRequest(
  network: NetworkId,
  hexAccountId: string
): Promise<FaucetResult> {
  const base = getRpcBaseUrl(network);
  const id = hexAccountId.startsWith("0x") ? hexAccountId : `0x${hexAccountId}`;
  return rpcCall<FaucetResult>(base, "boing_faucetRequest", [id]);
}
