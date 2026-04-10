import { normalizeHex64 } from "./rpc-types";

/** Primary explorer URL for any 32-byte on-chain address (EOA, contract, token, NFT). */
export function explorerAssetHref(addressHex64: string, network: string): string {
  const h = normalizeHex64(addressHex64);
  if (!h) return "/";
  return `/asset/${h}?network=${encodeURIComponent(network)}`;
}
