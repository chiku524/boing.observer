import type { Metadata } from "next";

const SITE_URL = "https://boing.observer";

type Props = {
  params: Promise<{ hash: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { hash } = await params;
  const shortHash = hash.length > 16 ? `${hash.slice(0, 16)}...` : hash;
  const title = `Block ${shortHash}`;
  const description = `View block by hash ${shortHash} on Boing Network. See block details and transactions.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
    twitter: {
      title,
      description,
    },
    alternates: {
      canonical: `${SITE_URL}/block/hash/${hash}`,
    },
  };
}

export default async function BlockHashLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ hash: string }>;
}) {
  const { hash } = await params;
  const shortHash = hash.length > 16 ? `${hash.slice(0, 16)}...` : hash;
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: `Block ${shortHash}`, item: `${SITE_URL}/block/hash/${hash}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      {children}
    </>
  );
}
