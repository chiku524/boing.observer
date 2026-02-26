import type { Metadata } from "next";

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
      canonical: `https://boing.observer/block/${height}`,
    },
  };
}

export default function BlockLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
