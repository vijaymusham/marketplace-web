import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Ads",
  description: "Manage your DealPokket listings.",
  robots: { index: false, follow: false },
};

export default function MyAdsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
