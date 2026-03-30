/** Canonical site URL for metadata, links, and structured data. */
export const SITE_URL = "https://boing.observer";

/** Canonical Boing Network website URL. */
export const WEBSITE_URL = "https://boing.network";

/** Canonical Boing Wallet (boing.express). */
export const WALLET_URL = "https://boing.express";

/**
 * GitHub `owner/repo` where `main` contains `docs/` (RPC spec, canonical QA JSON, alignment docs).
 * Default is the repo that actually hosts these paths today. Override at build time when docs live
 * elsewhere, e.g. `NEXT_PUBLIC_BOING_PROTOCOL_DOCS_REPO=boing-network/boing.network`.
 */
const rawRepo = process.env.NEXT_PUBLIC_BOING_PROTOCOL_DOCS_REPO?.trim();
/** Non-empty `owner/repo` only; otherwise default development repo where `docs/` exists on `main`. */
export const BOING_PROTOCOL_DOCS_REPO =
  rawRepo && rawRepo.includes("/") ? rawRepo : "chiku524/boing.network";

/** Base URL for external Boing Network docs (GitHub blob UI). */
export const DOCS_BASE = `https://github.com/${BOING_PROTOCOL_DOCS_REPO}/blob/main/docs`;

/** Canonical QA documentation page in the Boing Network repo. */
export const QA_DOC_URL = `${DOCS_BASE}/QUALITY-ASSURANCE-NETWORK.md`;

/** JSON-RPC reference (QA methods, error codes, operator auth). */
export const RPC_SPEC_URL = `${DOCS_BASE}/RPC-API-SPEC.md`;

/** Raw files on `main` (browser / fetch friendly). */
export const DOCS_RAW_BASE = `https://raw.githubusercontent.com/${BOING_PROTOCOL_DOCS_REPO}/main/docs`;

/** Canonical baseline QA registry JSON (code default; live nodes may differ). */
export const CANONICAL_QA_REGISTRY_JSON_URL = `${DOCS_RAW_BASE}/config/qa_registry.canonical.json`;

/** Canonical baseline pool governance JSON (production default shape). */
export const CANONICAL_QA_POOL_CONFIG_JSON_URL = `${DOCS_RAW_BASE}/config/qa_pool_config.canonical.json`;

/** Explains canonical vs live QA config and links to RPC. */
export const CANONICAL_QA_DOC_URL = `${DOCS_BASE}/config/CANONICAL-QA-REGISTRY.md`;

/** Local VibeMiner / localhost:8545 vs public testnet RPC (THREE-CODEBASE-ALIGNMENT §2.1). */
export const QA_RPC_TWO_SURFACES_DOC_URL = `${DOCS_BASE}/THREE-CODEBASE-ALIGNMENT.md#21-qa-registry-rpc-boing_getqaregistry--two-different-surfaces`;

/** Canonical public faucet page on boing.network. */
export const NETWORK_FAUCET_URL = `${WEBSITE_URL}/faucet`;

/** Canonical public “Join testnet” hub on boing.network (portal home is /testnet). */
export const NETWORK_TESTNET_URL = `${WEBSITE_URL}/testnet/join`;
