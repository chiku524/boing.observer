import "server-only";

import type { BoingClient } from "boing-sdk";
import { buildNativeDexIntegrationOverridesFromProcessEnv, fetchNativeDexIntegrationDefaults } from "boing-sdk";

/**
 * Native DEX factory for explorer RPC calls — same merge order as boing-sdk
 * (`end_user` hints → embedded testnet constants when chain id matches → process env overrides).
 */
export async function resolveNativeDexFactoryForExplorer(client: BoingClient): Promise<string | null> {
  const ov = buildNativeDexIntegrationOverridesFromProcessEnv();
  const defaults = await fetchNativeDexIntegrationDefaults(client, Object.keys(ov).length ? ov : undefined);
  return defaults.nativeDexFactoryAccountHex;
}
