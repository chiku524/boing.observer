import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL, NETWORK_FAUCET_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Developer tools",
  description:
    "Boing Observer developer utilities: testnet faucet RPC helper and bytecode QA pre-flight check.",
  alternates: { canonical: `${SITE_URL}/tools` },
};

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <nav aria-label="Breadcrumb" className="text-sm">
        <ol className="flex items-center gap-2 text-[var(--text-muted)]">
          <li>
            <Link href="/" className="text-network-cyan hover:underline">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-[var(--text-primary)]">Tools</li>
        </ol>
      </nav>

      <header>
        <h1 className="font-display text-3xl font-bold tracking-tight text-[var(--text-primary)]">
          Developer tools
        </h1>
        <p className="mt-2 max-w-2xl text-[var(--text-secondary)]">
          JSON-RPC helpers in the browser. Public onboarding:{" "}
          <a
            href={NETWORK_FAUCET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-network-cyan hover:underline"
          >
            boing.network/faucet
          </a>
          .
        </p>
      </header>

      <nav aria-labelledby="tools-nav-heading">
        <p id="tools-nav-heading" className="sr-only">
          Available tools
        </p>
        <ul className="grid gap-4 sm:grid-cols-2">
        <li>
          <Link
            href="/faucet"
            className="glass-card block h-full p-5 transition-colors hover:border-[var(--border-hover)]"
          >
            <h2 className="font-display text-lg font-semibold text-network-cyan">Faucet helper</h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
              Call <code className="rounded bg-white/10 px-1 text-xs">boing_faucetRequest</code> directly
              against the selected testnet RPC.
            </p>
          </Link>
        </li>
        <li>
          <Link
            href="/tools/qa-check"
            className="glass-card block h-full p-5 transition-colors hover:border-[var(--border-hover)]"
          >
            <h2 className="font-display text-lg font-semibold text-network-cyan">QA pre-flight</h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
              Run <code className="rounded bg-white/10 px-1 text-xs">boing_qaCheck</code> on bytecode before
              deployment.
            </p>
          </Link>
        </li>
      </ul>
      </nav>

      <p className="text-sm text-[var(--text-muted)]">
        Live pool: <Link href="/qa" className="text-network-cyan hover:underline">QA transparency</Link>
      </p>
    </div>
  );
}
