"use client";

import CategoryTabs from "@/components/layout/CategoryTabs";
import CityExplorer from "@/components/home-ui/CityExplorer";
import FreshRecommendations from "@/components/home-ui/FreshRecommendations";
import HorizontalList from "@/components/home-ui/HorizontalList";
import BannerSection from "@/components/home-ui/BannerSection";
import { useQuery } from "@tanstack/react-query";
import { getAdsBySection } from "@/components/api/apis";
import type { ApiAd, ApiAdsBySectionAd, ApiAdsSection } from "@/components/types/AllTypes";

function toListing(ad: ApiAdsBySectionAd): ApiAd {
    return {
        id: ad.id,
        title: ad.title,
        imageUrl: ad.imageUrl,
        isFavorite: ad.isFavorite,
        price: ad.price,
        currency: ad.currency,
        location: ad.location,
        metadata: "",
        postedAt: ad.postedAt,
        postedAtLabel: ad.postedAtLabel || ad.postedAt,
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
