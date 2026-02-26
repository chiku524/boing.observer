import type { Metadata } from "next";
import "./globals.css";
import { NetworkProvider } from "@/context/network-context";
import { Header } from "@/components/header";

const SITE_URL = "https://boing.observer";

// Verification codes from Google Search Console, Bing Webmaster Tools, etc.
// Set in env: NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION, NEXT_PUBLIC_BING_SITE_VERIFICATION
const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
const bingVerification = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Boing Observer — Blockchain Explorer | Boing Network",
    template: "%s | Boing Observer",
  },
  description:
    "Explore blocks, transactions, and accounts on Boing Network. Browse the blockchain on testnet and mainnet. Search by block height, block hash, or account address at boing.observer.",
  keywords: [
    "Boing Network",
    "blockchain explorer",
    "blocks",
    "transactions",
    "accounts",
    "Boing",
    "crypto",
    "block explorer",
    "testnet",
    "mainnet",
  ],
  authors: [{ name: "Boing Network", url: SITE_URL }],
  creator: "Boing Network",
  publisher: "Boing Network",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Boing Observer",
    title: "Boing Observer — Blockchain Explorer | Boing Network",
    description:
      "Explore blocks, transactions, and accounts on Boing Network. Browse blocks, transactions, and account balances on testnet and mainnet.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Boing Observer — Blockchain Explorer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Boing Observer — Blockchain Explorer | Boing Network",
    description: "Explore blocks, transactions, and accounts on Boing Network.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: SITE_URL,
  },
  category: "technology",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  ...((googleVerification || bingVerification) && {
    verification: {
      ...(googleVerification && { google: googleVerification }),
      ...(bingVerification && { other: { "msvalidate.01": bingVerification } }),
    },
  }),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "Boing Observer",
        description: "Blockchain explorer for Boing Network. Browse blocks, transactions, and accounts.",
        publisher: {
          "@type": "Organization",
          "@id": `${SITE_URL}/#organization`,
          name: "Boing Network",
          url: SITE_URL,
        },
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Boing Network",
        url: SITE_URL,
        slogan: "Authentic. Decentralized. Optimal. Sustainable.",
      },
    ],
  };

  return (
    <html lang="en" className="min-h-full">
      <body className="min-h-full antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <NetworkProvider>
          <Header />
          <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>
          <footer className="mt-auto border-t border-[var(--border-color)] py-6 text-center text-sm text-[var(--text-muted)]">
            Boing Network — Authentic. Decentralized. Optimal. Sustainable.
          </footer>
        </NetworkProvider>
      </body>
    </html>
  );
}
