"use client";

import { Stagger, StaggerItem } from "@/components/animations/Motion";
import { useQuery } from "@tanstack/react-query";
import { getFreshAds } from "../api/apis";
import ListingCard from "../sections/ListingCard";
import {
    HOME_LISTINGS_GRID,
    WithSkeleton,
} from "@/components/ui/Skeleton";
import type { ApiAd, ApiFreshRecommendation } from "../types/AllTypes";
import SectionHeader from "./SectionHeader";
import { useUserLocation } from "@/hooks/useUserLocation";
import { DEFAULT_INDIA_LOCATION } from "@/lib/geo";

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

export default function FreshRecommendations({
    initialAds = [],
}: {
    initialAds?: ApiFreshRecommendation[];
}) {
    const { latitude, longitude } = useUserLocation();
    const usingDefaultLocation =
        latitude === DEFAULT_INDIA_LOCATION.latitude &&
        longitude === DEFAULT_INDIA_LOCATION.longitude;

    const { data, isLoading } = useQuery({
        queryKey: ["freshRecommendations", latitude, longitude],
        queryFn: () => getFreshAds({ latitude, longitude }),
        initialData: usingDefaultLocation && initialAds.length ? initialAds : undefined,
        initialDataUpdatedAt: usingDefaultLocation ? Date.now() : undefined,
    });

    const ads = data ?? initialAds;
    const showSkeleton = isLoading && ads.length === 0;

    return (
        <section className="mx-auto px-4 pt-6 pb-10 sm:px-6 sm:pt-8 sm:pb-12 lg:px-12 lg:pt-9">
            <SectionHeader
                eyebrow="Just listed"
                title="Fresh recommendations"
                description="Handpicked deals near you. Updated daily"
                showDivider
            />

            <div className="mt-7 sm:mt-8">
                <WithSkeleton
                    loading={showSkeleton}
                    count={10}
                    variant="listing"
                    gridClassName={HOME_LISTINGS_GRID}
                >
                    <Stagger className={HOME_LISTINGS_GRID} stagger={0.08}>
                        {ads.map((listing, index) => (
                            <StaggerItem key={listing.id} y={40}>
                                <ListingCard
                                    listing={toListingCard(listing)}
                                    priority={index < 2}
                                />
                            </StaggerItem>
                        ))}
                    </Stagger>
                </WithSkeleton>
            </div>
        </section>
    );
}
