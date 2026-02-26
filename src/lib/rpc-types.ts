/**
 * Types for Boing JSON-RPC API (see boing-network/docs/RPC-API-SPEC.md).
 */

export type NetworkId = "testnet" | "mainnet";

export interface JsonRpcRequest {
  jsonrpc: "2.0";
  id: number;
  method: string;
  params: unknown[];
}

export interface JsonRpcSuccess<T> {
  jsonrpc: "2.0";
  id: number;
  result: T;
}

export interface JsonRpcError {
  jsonrpc: "2.0";
  id: number;
  error: { code: number; message: string; data?: unknown };
}

export type JsonRpcResponse<T> = JsonRpcSuccess<T> | JsonRpcError;

export function isJsonRpcError<T>(r: JsonRpcResponse<T>): r is JsonRpcError {
  return "error" in r;
}

/** Block header as returned by node (hex or number per node serialization). */
export interface BlockHeader {
  parent_hash: string;
  height: number;
  timestamp: number;
  proposer: string;
  tx_root: string;
  state_root: string;
}

/** Transaction payload types for display. */
export type TxPayloadKind =
  | "Transfer"
  | "Bond"
  | "Unbond"
  | "ContractCall"
  | "ContractDeploy"
  | "Unknown";

export interface TxPayloadTransfer {
  to: string;
  amount: string;
}

export interface TxPayloadBond {
  amount: string;
}

export interface TxPayloadUnbond {
  amount: string;
}

export interface TxPayloadContractCall {
  contract: string;
  calldata?: string;
}

export interface TxPayloadContractDeploy {
  bytecode?: string;
}

/** Transaction as in block (node may use different field names). */
export interface BlockTransaction {
  nonce?: number;
  sender: string;
  payload: unknown;
  access_list?: unknown;
}

/** Block object from boing_getBlockByHeight / boing_getBlockByHash. */
export interface Block {
  hash: string;
  header: BlockHeader;
  transactions: BlockTransaction[];
}

export interface AccountBalance {
  balance: string;
}

export interface Account {
  balance: string;
  nonce: number;
  stake: string;
}

/** Normalize address to 64 hex chars (no 0x) for links and display. */
export function normalizeAddress(addr: string): string {
  const hex = addr.startsWith("0x") ? addr.slice(2) : addr;
  return hex.padStart(64, "0").toLowerCase().slice(-64);
}

/** Format u128 decimal string with decimals (e.g. 18) for display. */
const DECIMALS = 18;

export function formatBalance(raw: string, decimals: number = DECIMALS): string {
  const s = raw.trim();
  if (!/^\d+$/.test(s)) return raw;
  if (s === "0") return "0";
  let padded = s.padStart(decimals + 1, "0");
  const intPart = padded.slice(0, -decimals).replace(/^0+/, "") || "0";
  const fracPart = padded.slice(-decimals).replace(/0+$/, "");
  return fracPart ? `${intPart}.${fracPart}` : intPart;
}

/** Shorten hash/address for display (first 10 + ... + last 8). */
export function shortenHash(hash: string, head = 10, tail = 8): string {
  const h = hash.startsWith("0x") ? hash.slice(2) : hash;
  if (h.length <= head + tail) return hash;
  return `${h.slice(0, head)}…${h.slice(-tail)}`;
}
