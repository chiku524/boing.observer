import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";
import { buildBreadcrumbJsonLd, toSafeJsonScript } from "@/lib/breadcrumb-jsonld";

type Props = {
  params: Promise<{ address: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { address } = await params;
  const shortAddr = address.length > 16 ? `${address.slice(0, 16)}...` : address;
  const title = `Asset ${shortAddr}`;
  const description = `Inspect asset ${shortAddr} on Boing — token, NFT, or contract account (32-byte AccountId).`;
  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { title, description },
    alternates: { canonical: `${SITE_URL}/asset/${address}` },
  };
}

export default async function AssetLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ address: string }>;
}) {
  const { address } = await params;
  const shortAddr = address.length > 16 ? `${address.slice(0, 16)}...` : address;
  const breadcrumb = buildBreadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: `Asset ${shortAddr}`, url: `${SITE_URL}/asset/${address}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toSafeJsonScript(breadcrumb) }}
      />
      {children}
    </>
  );
}
