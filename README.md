# Boing Observer — Blockchain Explorer

Blockchain explorer for **Boing Network** at **boing.observer**. Browse blocks, transactions, and accounts on testnet today, with mainnet support enabled when a distinct mainnet RPC is configured.

## Features

- **Network selector** — Testnet by default; Mainnet only appears as active when a distinct mainnet RPC is configured.
- **Home** — Current chain height and list of latest blocks.
- **Block page** — By height (`/block/:height`) or hash (`/block/hash/:hash`): header (hash, height, timestamp, proposer, parent hash, roots) and transaction list with type/sender/summary.
- **Account page** — Balance, nonce, and stake for a 32-byte hex address (`/account/:address`).
- **Search** — By block height (number), block hash (64 hex), or account address (64 hex). Dispatches to the appropriate page (64-hex tries block-by-hash first, then account).
- **QA Check** — Pre-flight `boing_qaCheck` with optional purpose category, description hash, and advanced asset metadata fields, aligned to the canonical QA docs in `boing.network`.
- **Faucet helper** — Direct testnet RPC helper for `boing_faucetRequest`; the canonical public faucet landing page lives on `boing.network/faucet`, and the site navigation now points there first.

## Tech stack

- **Next.js 15** (App Router), React 18, TypeScript
- **Tailwind CSS** with Boing design tokens (Cosmic Foundation: dark theme, Orbitron/Inter/JetBrains Mono, glass cards)
- **RPC** — Plain `fetch()` JSON-RPC 2.0 to Boing node (no SDK)
- **Cloudflare** — Deploy via [OpenNext Cloudflare adapter](https://opennext.js.org/cloudflare) to Workers; custom domain **boing.observer**

## Setup

1. Clone and install:

   ```bash
   npm install --legacy-peer-deps
   ```

   (Use `--legacy-peer-deps` because the Cloudflare adapter targets Next 15+; see [Hosting on Cloudflare](#hosting-on-cloudflare-boingobserver).)

2. Copy env (includes live testnet RPC by default):

   ```bash
   cp .env.example .env.local
   ```

3. Run:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Config

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_TESTNET_RPC` | Testnet RPC base URL (e.g. `https://testnet-rpc.boing.network/`). |
| `NEXT_PUBLIC_MAINNET_RPC` | Mainnet RPC base URL. **Leave unset** until a distinct mainnet endpoint is published — never set this to the testnet URL ([THREE-CODEBASE-ALIGNMENT.md](https://github.com/chiku524/boing.network/blob/main/docs/THREE-CODEBASE-ALIGNMENT.md)). |

No API keys required for read-only RPC. Do not hardcode production RPC URLs in the repo; use `.env.local` or hosting env.

Important: if `NEXT_PUBLIC_MAINNET_RPC` is unset or equals the testnet URL, the explorer keeps users on testnet and does not treat “mainnet” as live.

## Testnet launch readiness

For the Boing incentivized testnet launch, the following must be in place for the explorer (and other apps) to work:

| Item | Status | Notes |
|------|--------|-------|
| **Public testnet RPC** | Required | At least one stable URL (e.g. `https://testnet-rpc.boing.network`). Set in `NEXT_PUBLIC_TESTNET_RPC`. |
| **boing-node** | Required | Validators and full nodes must run `boing-node`; RPC on port 8545. |
| **Genesis / chain ID** | Required | Chain must be live and producing blocks. |
| **Faucet** | Recommended | Testnet BOING for validators and developers. |
| **Explorer configured** | Ready | Set `NEXT_PUBLIC_TESTNET_RPC` in Cloudflare Worker variables or GitHub Actions **Variables** / **Secrets** (see [INFRASTRUCTURE-SETUP.md](https://github.com/chiku524/boing.network/blob/main/docs/INFRASTRUCTURE-SETUP.md)). |

Until public RPC nodes are available, the explorer shows a friendly message: *"Boing Network nodes are not yet available"* and suggests running `boing-node` locally. When RPC is reachable, the status banner hides automatically.

## Hosting on Cloudflare (boing.observer)

This project is set up to deploy to **Cloudflare Workers** using the [OpenNext Cloudflare adapter](https://opennext.js.org/cloudflare), so you can serve the explorer at **boing.observer**.

### Prerequisites

- [Wrangler](https://developers.cloudflare.com/workers/wrangler/) (included as dev dependency; v4.x).
- A Cloudflare account.
- The domain **boing.observer** added to Cloudflare (DNS managed by Cloudflare).

### Deploy from your machine

1. Log in to Cloudflare (first time only):

   ```bash
   npx wrangler login
   ```

2. Set production env (for the Worker’s runtime). Either:
   - Add `NEXT_PUBLIC_TESTNET_RPC` and `NEXT_PUBLIC_MAINNET_RPC` in **Cloudflare Dashboard** → Workers & Pages → your Worker → Settings → Variables, or  
   - Use [Wrangler secrets](https://developers.cloudflare.com/workers/configuration/secrets/) if you prefer CLI.
   - Optional: `NEXT_PUBLIC_BOING_PROTOCOL_DOCS_REPO` = `owner/repo` for GitHub links on `/qa` (defaults to `chiku524/boing.network` if unset).

3. Build and deploy:

   ```bash
   npm run deploy
   ```

   This runs `opennextjs-cloudflare build` then deploys the Worker. The first time, Wrangler will create a new Worker named **boing-observer** (see `wrangler.jsonc`).

4. Attach the custom domain **boing.observer**:
   - In **Cloudflare Dashboard** go to **Workers & Pages** → **boing-observer** → **Settings** → **Domains & Routes**.
   - Click **Add** and add **boing.observer** (and optionally **www.boing.observer**).  
   Cloudflare will create the DNS record and serve the explorer at **https://boing.observer**.

### Deploy from Git (GitHub Actions)

This repo includes a GitHub Actions workflow that deploys on every push to `main`. One-time setup:

1. **Create a Cloudflare API token** — [Cloudflare Dashboard](https://dash.cloudflare.com/) → **My Profile** → **API Tokens** → **Create Token** (use **Edit Cloudflare Workers** template).
2. **Get your Account ID** — In Cloudflare Dashboard, select any domain; Account ID is in the right sidebar under **API**.
3. **Add GitHub credentials** — Repo → **Settings** → **Secrets and variables** → **Actions**:
   - **Secrets (required):** `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`
   - **Variables (recommended for public RPC URLs):** `NEXT_PUBLIC_TESTNET_RPC` = `https://testnet-rpc.boing.network` or `https://testnet-rpc.boing.network/`; optional `NEXT_PUBLIC_MAINNET_RPC` only when mainnet RPC is live (must differ from testnet). The workflow uses **Variables first**, then **Secrets**, for those two `NEXT_PUBLIC_*` keys.
4. **Attach custom domain** (first deploy) — **Workers & Pages** → **boing-observer** → **Settings** → **Domains & Routes** → add **boing.observer**.

Pushes to `main` trigger deployment; see **Actions** tab for status.

### Useful commands

| Command | Description |
|--------|-------------|
| `npm run dev` | Local Next.js dev server. |
| `npm run build` | Next.js production build only. |
| `npm run preview` | Build with OpenNext and run locally in Workers runtime. |
| `npm run deploy` | Build and deploy to Cloudflare. |
| `npm run upload` | Build and upload a new version (for gradual deployments). |
| `npm run cf-typegen` | Generate Cloudflare env types into `cloudflare-env.d.ts`. |

### Worker size

Workers have a [size limit](https://developers.cloudflare.com/workers/platform/limits/#worker-size) (e.g. 3 MiB compressed on Free, 10 MiB on Paid). After `npm run deploy`, Wrangler prints the compressed size; if you hit the limit, consider moving to a Paid plan or trimming dependencies.

### Note on Next.js 14 and install

This app uses **Next.js 14**. The OpenNext Cloudflare adapter’s current release targets Next 15/16, so:

- Install with **`npm install --legacy-peer-deps`** to resolve peer dependency conflicts.
- Deploy scripts pass **`--dangerouslyUseUnsupportedNextVersion`** to the OpenNext build so the adapter accepts Next 14. When you upgrade to Next 15+, you can remove that flag and re-evaluate `--legacy-peer-deps`.

## SEO

The explorer is optimized for search engines and social sharing:

- **Metadata** — Title, description, keywords, Open Graph, and Twitter cards in the root layout.
- **Dynamic metadata** — Block and account pages get unique titles and descriptions from route params.
- **robots.txt** — Generated at `/robots.txt` (allows all, points to sitemap).
- **Sitemap** — Generated at `/sitemap.xml` (home page).
- **Structured data** — JSON-LD WebSite and Organization schema for rich search results.
- **Manifest** — PWA manifest at `/manifest.json`.
- **Icons** — Uses the checked-in `public/favicon.svg` plus the manifest.

### Optional richer assets

If you later want richer social cards or platform-specific icon assets, add them explicitly under `public/` and update `src/app/layout.tsx` to reference them. The current repo only relies on assets that are already checked in.

### Search engine verification

Add verification codes from [Google Search Console](https://search.google.com/search-console) or [Bing Webmaster Tools](https://www.bing.com/webmasters) via environment variables:

```
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-google-code
NEXT_PUBLIC_BING_SITE_VERIFICATION=your-bing-code
```

## Reference

- **RPC spec / QA docs:** linked from the app using `NEXT_PUBLIC_BOING_PROTOCOL_DOCS_REPO` (default `chiku524/boing.network` on `main` under `docs/`).
- **Wallet/auth alignment:** See [HANDOFF.md](HANDOFF.md) (sync review and wallet integration notes).
- **Design system / explorer prompt:** under `docs/` in the same GitHub repo as above (see boing.network monorepo).

---

*Boing Network — Authentic. Decentralized. Optimal. Sustainable.*
