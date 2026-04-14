import { normalizeHexData } from "./tx-details";
import { normalizeHex64 } from "./rpc-types";

/** Normalize receipt JSON: some stacks use camelCase `returnData` instead of `return_data`. */
export function receiptReturnDataHex(receipt: unknown): unknown {
  if (!receipt || typeof receipt !== "object") return undefined;
  const r = receipt as Record<string, unknown>;
  if ("return_data" in r) return r.return_data;
  if ("returnData" in r) return r.returnData;
  return undefined;
}

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
