"use client";

import { Enter, Stagger, StaggerItem } from "@/components/animations/Motion";
import { useQuery } from "@tanstack/react-query";
import { getFreshAds } from "../api/apis";
import ListingCard from "../sections/ListingCard";
import type { ApiFreshRecommendation } from "../types/AllTypes";

function formatPrice(price: number, currency?: string) {
    const amount = Number.isFinite(price) ? price.toLocaleString("en-IN") : "0";
    if (!currency || currency === "INR" || currency === "₹") return `₹${amount}`;
    return `${currency} ${amount}`;
}

function toListingCard(listing: ApiFreshRecommendation) {
    return {
        id: listing.id,
        title: listing.title,
        price: formatPrice(listing.price, listing.currency),
        meta: listing.metadata || listing.category?.name,
        location: listing.location,
        date: listing.postedAtLabel || listing.postedAt,
        featured: listing.isFeatured,
        isFavorite: listing.isFavorite,
        image: listing.imageUrl,
    };
}

export default function FreshRecommendations() {
    const { data = [] } = useQuery({
        queryKey: ["freshRecommendations"],
        queryFn: () => getFreshAds({ latitude: 19.2183, longitude: 72.9781 }),
    });

    return (
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <Enter>
                <h2 className="font-heading text-xl font-extrabold text-slate-900 sm:text-2xl">
                    Fresh recommendations
                </h2>
                <p className="mt-1 text-sm text-slate-600 sm:text-[15px]">
                    Handpicked deals near you. Updated daily
                </p>
            </Enter>

            <Stagger
                className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-5!"
                stagger={0.08}
            >
                {data.map((listing) => (
                    <StaggerItem key={listing.id} y={40}>
                        <ListingCard listing={toListingCard(listing)} />
                    </StaggerItem>
                ))}
            </Stagger>
        </section>
    );
}
