"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import type { Listing } from "@/lib/listings";

function formatReviews(id: number) {
  const n = 200 + ((id * 37) % 1800);
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

function ratingFor(id: number) {
  return (4.2 + ((id * 13) % 9) / 10).toFixed(1);
}

export default function ListCard({
  listing,
  badge,
}: {
  listing: Listing;
  badge?: string;
}) {
  const rating = ratingFor(listing.id);
  const reviews = formatReviews(listing.id);
  const tag = badge ?? (listing.featured ? "Featured" : "Other");

  return (
    <article className="flex flex-col">
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

        <div className="mt-2.5 flex items-center justify-between gap-2">
          <p className="flex items-center gap-1 text-xs font-medium text-slate-500">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-slate-800">{rating}</span>
            <span>({reviews} Reviews)</span>
          </p>
          <p className="shrink-0 text-[15px] font-extrabold text-slate-900">
            {listing.price}
          </p>
        </div>

        <div className="mt-3.5 grid grid-cols-2 gap-2">
          <button
            type="button"
            className="rounded-full border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-900 transition-colors hover:border-slate-400"
          >
            Add to Cart
          </button>
          <button
            type="button"
            className="rounded-full bg-slate-950 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-slate-800"
          >
            Buy Now
          </button>
        </div>
      </div>
    </article>
  );
}
