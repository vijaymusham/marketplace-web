"use client";;
import { useState } from "react";
import { listings } from "@/lib/listings";
import ListingCard from "../sections/ListingCard";

const INITIAL_COUNT = 10;


export default function FreshRecommendations() {
    const [likedIds, setLikedIds] = useState<Set<number>>(new Set());

    const toggleLike = (id: number) => {
        setLikedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const cards: React.ReactNode[] = listings.slice(0, INITIAL_COUNT).map((listing) => (
        <ListingCard
            key={listing.id}
            listing={listing}
            liked={likedIds.has(listing.id)}
            onToggleLike={() => toggleLike(listing.id)}
        />
    ));

    return (
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h2 className="font-heading text-xl font-extrabold text-slate-900 sm:text-2xl">
                Fresh recommendations
            </h2>
            <p className="mt-1 text-sm text-slate-600 sm:text-[15px]">
                Handpicked deals near you. Updated daily
            </p>

            <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-5!">
                {cards}
            </div>

            {/* {!showAll && filtered.length > INITIAL_COUNT && (
                <div className="mt-9 flex justify-center">
                    <button
                        onClick={() => setShowAll(true)}
                        className="flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
                    >
                        Show me more
                        <ArrowRight className="h-4 w-4" />
                    </button>
                </div>
            )} */}
        </section>
    );
}
