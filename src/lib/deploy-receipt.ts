import { normalizeHexData } from "./tx-details";
import { normalizeHex64 } from "./rpc-types";

/**
 * Best-effort parse of the newly created AccountId from a successful contract-deploy receipt.
 * Nodes may return a raw 32-byte word or a longer ABI-style buffer; we accept the last 32 bytes when longer.
 */
export function tryParseCreatedAccountIdFromDeployReturnData(returnData: unknown): string | null {
  const { prefixed, bytes } = normalizeHexData(returnData);
  if (!prefixed || bytes === 0) return null;
  const h = prefixed.replace(/^0x/i, "");
  if (!/^[0-9a-f]*$/i.test(h) || h.length % 2 !== 0) return null;
  if (h.length === 64) {
    const n = normalizeHex64(h);
    return n || null;
  }
  if (h.length > 64) {
    const last = h.slice(-64);
    const n = normalizeHex64(last);
    return n || null;
  }
  return null;
}
