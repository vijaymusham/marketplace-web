"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, Heart, MapPin } from "lucide-react";
import { listings, type Listing } from "@/lib/listings";

const cityTabs = ["All", "Maharashtra", "Hinganghat", "Noida", "Hyderabad"];

const INITIAL_COUNT = 11;
const PROMO_SLOT = 5;

function ListingCard({
    listing,
    liked,
    onToggleLike,
}: {
    listing: Listing;
    liked: boolean;
    onToggleLike: () => void;
}) {
    return (
        <div className="group flex flex-col">
            <div className="relative aspect-12/11 w-full overflow-hidden rounded-2xl bg-slate-100">
                <Image
                    src={listing.image}
                    alt={listing.title}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {listing.featured && (
                    <span className="absolute top-3 left-3 rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-primary shadow-sm">
                        Featured
                    </span>
                )}

                <button
                    onClick={onToggleLike}
                    aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
                    className={`absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm transition-colors ${liked ? "bg-white" : "bg-slate-900/25 hover:bg-slate-900/40"
                        }`}
                >
                    <Heart
                        className={`h-4 w-4 ${liked ? "fill-rose-500 text-rose-500" : "text-white"}`}
                        strokeWidth={2}
                    />
                </button>

                <span className="absolute inset-x-0 bottom-2.5 flex items-center justify-center gap-1">
                    {[0, 1, 2, 3, 4].map((dot) => (
                        <span
                            key={dot}
                            className={`h-1.5 w-1.5 rounded-full ${dot === 0 ? "bg-white" : "bg-white/50"}`}
                        />
                    ))}
                </span>
            </div>

            <div className="flex flex-1 flex-col pt-3">
                <p className="min-h-4 text-xs text-slate-500">{listing.meta}</p>
                <h3 className="mt-1 truncate text-[15px] font-bold text-slate-900">
                    {listing.title}
                </h3>
                <p className="mt-1.5 flex items-center gap-1 text-xs text-slate-500">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span className="truncate">{listing.location}</span>
                </p>

                <div className="mt-3 flex items-center justify-between">
                    <p className="text-[15px] font-extrabold text-slate-900">
                        {listing.price}
                    </p>
                    <p className="text-xs text-slate-500">{listing.date}</p>
                </div>
            </div>
        </div>
    );
}


export default function FreshRecommendations() {
    const [activeCity, setActiveCity] = useState(0);
    const [likedIds, setLikedIds] = useState<Set<number>>(new Set());
    const [showAll, setShowAll] = useState(false);

    const toggleLike = (id: number) => {
        setLikedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const city = cityTabs[activeCity];
    const filtered =
        city === "All"
            ? listings
            : listings.filter((l) => l.location.includes(city));
    const visible = showAll ? filtered : filtered.slice(0, INITIAL_COUNT);

    const cards: React.ReactNode[] = visible.map((listing) => (
        <ListingCard
            key={listing.id}
            listing={listing}
            liked={likedIds.has(listing.id)}
            onToggleLike={() => toggleLike(listing.id)}
        />
    ));
    cards.splice(Math.min(PROMO_SLOT, cards.length), 0);

    return (
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h2 className="font-heading text-xl font-extrabold text-slate-900 sm:text-2xl">
                Fresh recommendations
            </h2>
            <p className="mt-1 text-sm text-slate-600 sm:text-[15px]">
                Handpicked deals near you. Updated daily
            </p>

            <div className="mt-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                    {cityTabs.map((tab, index) => {
                        const isActive = index === activeCity;
                        return (
                            <button
                                key={tab}
                                onClick={() => {
                                    setActiveCity(index);
                                    setShowAll(false);
                                }}
                                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors ${isActive
                                    ? "bg-slate-900 text-white"
                                    : "text-slate-700 hover:bg-slate-100"
                                    }`}
                            >
                                {tab}
                            </button>
                        );
                    })}
                </div>

                <button
                    onClick={() => setShowAll(true)}
                    className="hidden shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition-colors hover:border-slate-300 sm:flex"
                >
                    View all
                    <ArrowRight className="h-4 w-4" />
                </button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4">
                {cards}
            </div>

            {!showAll && filtered.length > INITIAL_COUNT && (
                <div className="mt-9 flex justify-center">
                    <button
                        onClick={() => setShowAll(true)}
                        className="flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
                    >
                        Show me more
                        <ArrowRight className="h-4 w-4" />
                    </button>
                </div>
            )}
        </section>
    );
}
