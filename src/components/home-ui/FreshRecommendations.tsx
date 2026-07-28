"use client";

import { Enter, Stagger, StaggerItem } from "@/components/animations/Motion";
import { useQuery } from "@tanstack/react-query";
import { getFreshAds } from "../api/apis";
import ListingCard from "../sections/ListingCard";
import type { ApiAd, ApiFreshRecommendation } from "../types/AllTypes";

function toListingCard(listing: ApiFreshRecommendation): ApiAd {
    return {
        id: listing.id,
        title: listing.title,
        imageUrl: listing.imageUrl,
        isFavorite: listing.isFavorite,
        price: listing.price,
        currency: listing.currency,
        location: listing.location,
        metadata: listing.metadata || listing.category?.name || "",
        postedAt: listing.postedAt,
        postedAtLabel: listing.postedAtLabel || listing.postedAt,
    };
}

export default function FreshRecommendations() {
    const { data = [] } = useQuery({
        queryKey: ["freshRecommendations"],
        queryFn: () => getFreshAds({ latitude: 19.2183, longitude: 72.9781 }),
    });

    return (
        <section className="mx-auto max-w-7xl px-4 pt-5 pb-8 sm:px-6 sm:pt-6 lg:px-8 lg:pt-7">
            <Enter>
                <h2 className="font-heading text-xl font-extrabold text-slate-900 sm:text-2xl">
                    Fresh recommendations
                </h2>
                <p className="mt-1 text-sm text-slate-600 sm:text-[15px]">
                    Handpicked deals near you. Updated daily
                </p>
            </Enter>

            <Stagger
                className="mt-6 grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-8 lg:grid-cols-4 xl:grid-cols-5"
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
