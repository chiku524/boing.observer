import type { Metadata } from "next";

const SITE_URL = "https://boing.observer";

type Props = {
  params: Promise<{ address: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { address } = await params;
  const shortAddr = address.length > 16 ? `${address.slice(0, 16)}...` : address;
  const title = `Account ${shortAddr}`;
  const description = `View account ${shortAddr} on Boing Network. Check balance, nonce, and stake.`;
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
      canonical: `${SITE_URL}/account/${address}`,
    },
  };
}

export default async function AccountLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ address: string }>;
}) {
  const { address } = await params;
  const shortAddr = address.length > 16 ? `${address.slice(0, 16)}...` : address;
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: `Account ${shortAddr}`, item: `${SITE_URL}/account/${address}` },
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
