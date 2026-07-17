"use client";;
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { listings } from "@/lib/listings";
import ListingCard from "../sections/ListingCard";

const cityTabs = ["All", "Maharashtra", "Hinganghat", "Noida", "Hyderabad"];

const INITIAL_COUNT = 10;
const PROMO_SLOT = 5;


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
