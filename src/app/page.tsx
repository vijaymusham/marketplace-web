"use client";
import CategoryTabs from "@/components/layout/CategoryTabs";
import CityExplorer from "@/components/home-ui/CityExplorer";
import FreshRecommendations from "@/components/home-ui/FreshRecommendations";
import HorizontalList from "@/components/home-ui/HorizontalList";
import BannerSection from "@/components/home-ui/BannerSection";
import TestimonialsSection from "@/components/home-ui/TestimonialsSection";
import { useQuery } from "@tanstack/react-query";
import { getAdsBySection } from "@/components/api/apis";
import type { ApiAd, ApiAdsBySectionAd, ApiAdsSection } from "@/components/types/AllTypes";
import TrustedBrands from "@/components/home-ui/TrustedBrands";
import { useUserLocation } from "@/hooks/useUserLocation";

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

const SECTION_BG: Record<string, string> = {
    "bg-sky-50": "bg-sky-50",
    "bg-white": "bg-white",
    "bg-violet-50": "bg-violet-50",
    "bg-amber-50": "bg-amber-50",
    "bg-emerald-50": "bg-emerald-50",
    "bg-rose-50": "bg-rose-50",
    "bg-orange-50": "bg-orange-50",
    "bg-slate-50": "bg-slate-50",
};

const SECTION_PLACEHOLDERS = [
    { title: "Popular near you", bgClass: "bg-sky-50" },
    { title: "Trending now", bgClass: "bg-violet-50" },
];

export default function Home() {
    const { latitude, longitude } = useUserLocation();

    const { data, isLoading } = useQuery({
        queryKey: ["adsBySection", latitude, longitude],
        queryFn: () => getAdsBySection({ latitude, longitude }),
    });

    return (
        <>
            <CategoryTabs />
            <main className="flex-1 bg-white relative">
                <CityExplorer />
                <FreshRecommendations />
                <TrustedBrands />
                {isLoading
                    ? SECTION_PLACEHOLDERS.map((item) => (
                        <HorizontalList
                            key={item.title}
                            className={`${SECTION_BG[item.bgClass] ?? "bg-slate-50"} my-8`}
                            title={item.title}
                            data={[]}
                            loading
                        />
                    ))
                    : data &&
                    Object.values(data).map((item: ApiAdsSection) => {
                        if (!item.ads?.length) return null;
                        const bg = SECTION_BG[item.bgClass] ?? "bg-slate-50";
                        return (
                            <HorizontalList
                                key={item.title}
                                className={`${bg} my-8`}
                                title={item.title}
                                description={item.subtitle}
                                data={item.ads.map(toListing)}
                            />
                        );
                    })}
                <BannerSection />
                <TestimonialsSection />
            </main>
        </>
    );
}
