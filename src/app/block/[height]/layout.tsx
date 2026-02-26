import type { Metadata } from "next";

const SITE_URL = "https://boing.observer";

type Props = {
  params: Promise<{ height: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { height } = await params;
  const title = `Block #${height}`;
  const description = `View block ${height} on Boing Network. See block header, transactions, proposer, and more.`;
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
      canonical: `${SITE_URL}/block/${height}`,
    },
  };
}

export default async function BlockLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ height: string }>;
}) {
  const { height } = await params;
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: `Block #${height}`, item: `${SITE_URL}/block/${height}` },
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
