/**
 * Wallet / dApp EIP-155–style chain IDs for Boing L1 (not read from block headers).
 * Internal network identifiers and chain IDs match boing.network THREE-CODEBASE-ALIGNMENT.md §3.
 */
import type { NetworkId } from "./rpc-types";

export const BOING_TESTNET_CHAIN_ID_HEX = "0x1b01";
export const BOING_TESTNET_CHAIN_ID_DECIMAL = 6913;

export const BOING_MAINNET_CHAIN_ID_HEX = "0x1b02";
export const BOING_MAINNET_CHAIN_ID_DECIMAL = 6914;

/** Internal network id (portal / wallet / docs), not a JSON-RPC method. */
export const BOING_TESTNET_NETWORK_ID = "boing-testnet";
export const BOING_MAINNET_NETWORK_ID = "boing-mainnet";

export function boingNetworkId(network: NetworkId): string {
  return network === "mainnet" ? BOING_MAINNET_NETWORK_ID : BOING_TESTNET_NETWORK_ID;
}

/** Short label for the explorer UI (selected RPC network). */
export function boingChainIdLabel(network: NetworkId): string {
  if (network === "mainnet") {
    return `${BOING_MAINNET_CHAIN_ID_DECIMAL} · ${BOING_MAINNET_CHAIN_ID_HEX}`;
  }
  return `${BOING_TESTNET_CHAIN_ID_DECIMAL} · ${BOING_TESTNET_CHAIN_ID_HEX}`;
}
