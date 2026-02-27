/**
 * Infer transaction payload type from payload object for display.
 * Matches spec: Transfer, Bond, Unbond, ContractCall, ContractDeploy, ContractDeployWithPurpose.
 */

import type { TxPayloadKind } from "./rpc-types";

export function getTxPayloadKind(payload: unknown): TxPayloadKind {
  if (!payload || typeof payload !== "object") return "Unknown";
  const p = payload as Record<string, unknown>;
  if ("bytecode" in p) {
    return "purpose_category" in p ? "ContractDeployWithPurpose" : "ContractDeploy";
  }
  if ("contract" in p) return "ContractCall";
  if ("to" in p && "amount" in p) return "Transfer";
  if ("amount" in p && Object.keys(p).length <= 2) {
    if ("amount" in p && !("to" in p)) {
      const keys = Object.keys(p).sort().join(",");
      if (keys === "amount" || keys === "amount,unbond" || keys === "unbond,amount") return "Unbond";
      return "Bond";
    }
  }
  if ("amount" in p && !("to" in p) && !("contract" in p)) {
    return "Unbond";
  }
  if ("amount" in p && !("to" in p)) return "Bond";
  return "Unknown";
}

export function getTxPayloadSummary(payload: unknown): string {
  const kind = getTxPayloadKind(payload);
  if (kind === "Unknown") return "—";
  const p = payload as Record<string, unknown>;
  switch (kind) {
    case "Transfer":
      return `to ${formatShortAddr(String(p.to))} · ${formatAmount(String(p.amount))} BOING`;
    case "Bond":
      return `${formatAmount(String(p.amount))} BOING stake`;
    case "Unbond":
      return `unbond ${formatAmount(String(p.amount))} BOING`;
    case "ContractCall":
      return `contract ${formatShortAddr(String(p.contract))}`;
    case "ContractDeploy":
      return "deploy contract";
    case "ContractDeployWithPurpose":
      return `deploy contract · ${formatPurpose(String(p.purpose_category ?? "other"))}`;
    default:
      return "—";
  }
}

function formatShortAddr(hex: string): string {
  const h = hex.startsWith("0x") ? hex.slice(2) : hex;
  return h.length > 12 ? `${h.slice(0, 6)}…${h.slice(-4)}` : h;
}

function formatPurpose(cat: string): string {
  if (!cat || cat === "other") return "other";
  return cat.toLowerCase();
}

function formatAmount(raw: string): string {
  if (!/^\d+$/.test(raw)) return raw;
  const decimals = 18;
  if (raw === "0") return "0";
  let padded = raw.padStart(decimals + 1, "0");
  const intPart = padded.slice(0, -decimals).replace(/^0+/, "") || "0";
  const fracPart = padded.slice(-decimals).replace(/0+$/, "").slice(0, 4);
  return fracPart ? `${intPart}.${fracPart}` : intPart;
}
