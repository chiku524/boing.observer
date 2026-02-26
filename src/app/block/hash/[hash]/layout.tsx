import type { Metadata } from "next";

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
      canonical: `https://boing.observer/block/hash/${hash}`,
    },
  };
}

export default function BlockHashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
