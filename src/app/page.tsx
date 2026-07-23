"use client";

import CategoryTabs from "@/components/layout/CategoryTabs";
import CityExplorer from "@/components/home-ui/CityExplorer";
import FreshRecommendations from "@/components/home-ui/FreshRecommendations";
import type { Listing } from "@/lib/listings";
import HorizontalList from "@/components/home-ui/HorizontalList";
import BannerSection from "@/components/home-ui/BannerSection";
import { useQuery } from "@tanstack/react-query";
import { getAdsBySection } from "@/components/api/apis";
import type { ApiAdsBySectionAd, ApiAdsSection } from "@/components/types/AllTypes";

function formatPrice(price: number, currency?: string) {
    const amount = Number.isFinite(price) ? price.toLocaleString("en-IN") : "0";
    if (!currency || currency === "INR" || currency === "₹") return `₹${amount}`;
    return `${currency} ${amount}`;
}

function toListing(ad: ApiAdsBySectionAd): Listing {
    return {
        id: ad.id,
        title: ad.title,
        price: formatPrice(ad.price, ad.currency),
        location: ad.location,
        date: ad.postedAtLabel || ad.postedAt,
        isFavorite: ad.isFavorite,
        image: ad.imageUrl,
    };
}

export default function Home() {
    const { data } = useQuery({
        queryKey: ["adsBySection"],
        queryFn: () => getAdsBySection({ latitude: 19.2183, longitude: 72.9781 }),
    });

    return (
        <>
            <CategoryTabs />
            <main className="flex-1 bg-white relative">
                <CityExplorer />
                <FreshRecommendations />
                <BannerSection />
                {
                    data && Object.values(data).map((item: ApiAdsSection) => {
                        if (!item.ads?.length) return null;
                        return (
                            <HorizontalList
                                key={item?.title}
                                className={`${item?.bgClass} my-8 `}
                                title={item?.title}
                                description={item?.subtitle}
                                data={item?.ads?.map(toListing)}
                            />
                        )
                    })
                }
            </main>
        </>
    );
}
