import type { Metadata } from "next";

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
      canonical: `https://boing.observer/account/${address}`,
    },
  };
}

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
