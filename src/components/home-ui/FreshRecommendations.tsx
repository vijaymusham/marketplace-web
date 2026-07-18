"use client";

import { listings } from "@/lib/listings";
import ListingCard from "../sections/ListingCard";
import { useWishlist } from "@/hooks/useWishlist";

const INITIAL_COUNT = 10;

export default function FreshRecommendations() {
    const { isLiked, toggle } = useWishlist();

    return (
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h2 className="font-heading text-xl font-extrabold text-slate-900 sm:text-2xl">
                Fresh recommendations
            </h2>
            <p className="mt-1 text-sm text-slate-600 sm:text-[15px]">
                Handpicked deals near you. Updated daily
            </p>

            <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-5!">
                {listings.slice(0, INITIAL_COUNT).map((listing) => (
                    <ListingCard
                        key={listing.id}
                        listing={listing}
                        liked={isLiked(listing.id)}
                        onToggleLike={() => toggle(listing.id)}
                    />
                ))}
            </div>
        </section>
    );
}
