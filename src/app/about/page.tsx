import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = "https://boing.observer";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Boing Network's pillars: True Quality Assurance, decentralization, optimal performance, and sustainability. Assets are rejected, approved, or sent to the consensus pool.",
  openGraph: {
    title: "About Boing Network | Boing Observer",
    description:
      "True QA, decentralization, optimal performance, sustainability. Boing Network — Authentic. Decentralized. Optimal. Sustainable.",
  },
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
};

export default function AboutPage() {
  return (
    <div className="space-y-10 max-w-3xl">
      <nav aria-label="Breadcrumb" className="text-sm">
        <ol className="flex items-center gap-2 text-[var(--text-muted)]" itemScope itemType="https://schema.org/BreadcrumbList">
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <Link href="/" className="text-network-cyan hover:text-network-cyan-light hover:underline" itemProp="item">
              <span itemProp="name">Home</span>
            </Link>
            <meta itemProp="position" content="1" />
          </li>
          <li aria-hidden="true">/</li>
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <span className="text-[var(--text-primary)]" itemProp="name">About</span>
            <meta itemProp="position" content="2" />
          </li>
        </ol>
      </nav>

      <header>
        <h1 className="font-display text-3xl font-bold tracking-tight text-[var(--text-primary)]">
          About Boing Network
        </h1>
        <p className="mt-2 text-[var(--text-secondary)]">
          Boing Network — <em>Authentic. Decentralized. Optimal. Sustainable.</em>
        </p>
      </header>

      <section className="space-y-6">
        <h2 className="font-display text-xl font-semibold text-[var(--text-primary)]">
          Our pillars
        </h2>
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="font-display font-semibold text-network-cyan mb-2">
              True quality assurance
            </h3>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Every asset on Boing Network undergoes automated quality assurance. Assets are either{" "}
              <strong className="text-[var(--text-primary)]">rejected</strong>,{" "}
              <strong className="text-[var(--text-primary)]">approved</strong>, or sent to a{" "}
              <strong className="text-[var(--text-primary)]">consensus pool</strong> for further validation. This ensures only genuine, high-quality content and data reach the network, building trust at the protocol level.
            </p>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-display font-semibold text-network-cyan mb-2">
              Decentralized
            </h3>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              No single entity controls the network. Validators, stakers, and participants work together to secure the chain and reach consensus.
            </p>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-display font-semibold text-network-cyan mb-2">
              Optimal
            </h3>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Designed for performance and low latency. Boing Network aims for efficient block production and minimal friction for developers and users.
            </p>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-display font-semibold text-network-cyan mb-2">
              Sustainable
            </h3>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Energy-efficient consensus and resource-conscious design to ensure long-term viability.
            </p>
          </div>
        </div>
      </section>

      <section className="glass-card p-6">
        <h2 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-4">
          Boing Observer
        </h2>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          Boing Observer is the official blockchain explorer for Boing Network. Search by block height, block hash, or account address. Switch between Testnet and Mainnet to explore the chain.
        </p>
        <Link
          href="/"
          className="mt-4 inline-flex items-center gap-2 text-network-cyan hover:text-network-cyan-light font-medium transition-colors"
        >
          Explore the blockchain →
        </Link>
      </section>
    </div>
  );
}
