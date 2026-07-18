import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ListingDetail from "./ListingDetail";
import { getListingById, listings } from "@/lib/listings";

export function generateStaticParams() {
  return listings.map((l) => ({ id: String(l.id) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const listing = getListingById(Number(id));
  if (!listing) return { title: "Listing not found" };
  return {
    title: `${listing.title} | DealMarket`,
    description: `${listing.price} · ${listing.title}`,
  };
}

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = getListingById(Number(id));
  if (!listing) notFound();

  return (
    <main className="flex-1 bg-white">
      <ListingDetail listing={listing} />
    </main>
  );
}
