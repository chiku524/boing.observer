import "server-only";

export function dexDiagnosticsEnabled(): boolean {
  return process.env.BOING_OBSERVER_ALLOW_DEX_DIAGNOSTICS === "1";
}
