"use client";

import Image from "next/image";
import Link from "next/link";
import type { Listing } from "@/lib/listings";

export default function ListCard({
  listing,
  badge,
}: {
  listing: Listing;
  badge?: string;
}) {
  const tag = badge ?? (listing.featured ? "Featured" : "Other");

  return (
    <Link href={`/listing/${listing.id}`} className="flex flex-col">
      <div className="relative aspect-square overflow-hidden rounded-[1.35rem] bg-[#f3f3f3]">
        <Image
          src={listing.image}
          alt={listing.title}
          fill
          sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover"
        />
        <span className="absolute top-3 right-3 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-800 shadow-sm">
          {tag}
        </span>
      </div>

      <div className="flex flex-1 flex-col pt-3.5">
        <h3 className="line-clamp-2 min-h-10 text-[15px] leading-snug font-bold text-slate-900">
          {listing.title}
        </h3>

        <p className="mt-2.5 text-[15px] font-extrabold text-slate-900">
          {listing.price}
        </p>
      </div>
    </Link>
  );
}
